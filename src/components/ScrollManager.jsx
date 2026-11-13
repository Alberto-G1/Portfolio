import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useSiteLoaded from '../hooks/useSiteLoaded'
import focusContactName from '../utils/focusContactName'

// Page scrolling for the router (it renders nothing). The browser can't do this itself because the sections only exist
// once React has drawn them, and a single-page app never reloads.
//   - Opening any page other than the home page (a project, the 404 page): scroll to the top, at once.
//   - Landing on "/" with a hash (/#contact): after the preloader, scroll smoothly to that section.
//   - Going back to "/" from a project page: jump to the Projects section, where the visitor came from
//     (the browser's Back button, the "Back to Projects" pill, and any other link to a section).
//   - A link made with state { focusContact: true } (the "Let's Talk" buttons) also focuses the Name field on arrival.
// Under prefers-reduced-motion every scroll is instant.
export default function ScrollManager() {
  const { pathname, hash, key, state } = useLocation()
  const navigationType = useNavigationType()
  const loaded = useSiteLoaded()
  const reducedMotion = usePrefersReducedMotion()
  const previousPath = useRef(null)

  // We restore positions ourselves; the browser's own restoring would fight us
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (!loaded) return undefined // not while the preloader is up
    const from = previousPath.current
    const cameFromAProject = Boolean(from) && from !== '/'

    const frame = requestAnimationFrame(() => {
      if (pathname !== '/') {
        // a project page opened on a section link (/projects/redhope#gallery): go to that section, else to the top
        const wanted = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
        if (wanted) wanted.scrollIntoView({ behavior: reducedMotion || from === pathname ? 'auto' : 'instant', block: 'start' })
        else if (from !== pathname) window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }
      const id = decodeURIComponent(hash.slice(1))
      const target = id ? document.getElementById(id) : null
      if (target) {
        target.scrollIntoView({ behavior: cameFromAProject || reducedMotion ? 'instant' : 'smooth', block: 'start' })
        if (id === 'contact' && state?.focusContact) focusContactName()
      } else if (!hash && cameFromAProject && navigationType === 'POP') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'instant', block: 'start' })
      } else if (!hash && from !== pathname) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, loaded, navigationType, reducedMotion, state])

  // Remember where we were, for the next navigation (declared after the effect above, so that one sees the old value)
  useEffect(() => {
    previousPath.current = pathname
  }, [pathname])

  return null
}
