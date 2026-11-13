import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import { site } from '../data/site'
import useScrolledPast from '../hooks/useScrolledPast'
import scrollToTop from '../utils/scrollToTop'
import Logo from './Logo'
import SectionLink from './SectionLink'
import ThemeToggle from './ThemeToggle'
import CtaButton from './ui/CtaButton'
import './Navbar.css'

const MENU_ID = 'primary-menu'
// Below this width the capsule becomes a compact card with a dropdown menu.
const DESKTOP_QUERY = '(min-width: 1024px)'
const SECTION_IDS = site.navLinks.map((link) => link.id)

// The "current" section is the one crossing a thin band 20-25% down the viewport.
const SPY_MARGIN = '-20% 0px -75% 0px'

function useActiveSection(ids, pathname) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const crossing = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id)
          else crossing.delete(entry.target.id)
        }
        // Sections touch, so two can cross the band at a boundary; the later one wins.
        // If none does (e.g. the band is over the footer), keep the last one.
        setActiveId((previous) => [...ids].reverse().find((id) => crossing.has(id)) ?? previous)
      },
      { rootMargin: SPY_MARGIN },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [ids, pathname])

  return activeId
}

/*
  One absolutely positioned pill that slides under the active link. It is moved by
  writing CSS variables straight onto the element (no React state, so no extra renders);
  the CSS transition does the sliding. The first placement is not animated, so it
  doesn't fly in from the corner.
*/
function useSlidingIndicator(activeId) {
  const trackRef = useRef(null)
  const indicatorRef = useRef(null)
  const linkRefs = useRef({})
  const placedOnce = useRef(false)

  const setLinkRef = (id) => (element) => {
    linkRefs.current[id] = element
  }

  const place = useCallback(() => {
    const indicator = indicatorRef.current
    if (!indicator) return
    const link = linkRefs.current[activeId]
    // offsetParent is null while the desktop nav is hidden (compact layout).
    if (!link || link.offsetParent === null) {
      indicator.removeAttribute('data-on')
      return
    }
    indicator.style.setProperty('--ind-x', `${link.offsetLeft}px`)
    indicator.style.setProperty('--ind-y', `${link.offsetTop}px`)
    indicator.style.setProperty('--ind-w', `${link.offsetWidth}px`)
    indicator.style.setProperty('--ind-h', `${link.offsetHeight}px`)
    indicator.setAttribute('data-on', '')
    if (!placedOnce.current) {
      placedOnce.current = true
      requestAnimationFrame(() => requestAnimationFrame(() => indicator.setAttribute('data-anim', '')))
    }
  }, [activeId])

  useLayoutEffect(() => {
    place()
  }, [place])

  // Re-measure when the links change size: a resize, or the web font arriving.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const observer = new ResizeObserver(place)
    observer.observe(track)
    document.fonts?.ready.then(place)
    return () => observer.disconnect()
  }, [place])

  return { trackRef, indicatorRef, setLinkRef }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolledPast(20)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // a real project's page (an unknown /projects/<id> is the 404 page, where no link is current)
  const projectMatch = useMatch('/projects/:id')
  const onProjectPage = projectMatch !== null && projects.some((project) => project.id === projectMatch.params.id)
  const spiedId = useActiveSection(SECTION_IDS, pathname)
  // On a project's own page there are no home sections to spy on: "Projects" is the current link
  const activeId = onProjectPage ? 'projects' : spiedId
  const { trackRef, indicatorRef, setLinkRef } = useSlidingIndicator(activeId)
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const burgerRef = useRef(null)

  const closeMenu = useCallback(() => setOpen(false), [])

  // Lock page scrolling while the mobile menu is open.
  useLayoutEffect(() => {
    if (!open) return undefined
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previous
    }
  }, [open])

  // Move focus into the menu when it opens so keyboard users land on the links.
  useEffect(() => {
    if (open) menuRef.current?.querySelector('a')?.focus()
  }, [open])

  // Escape and clicking outside close the menu.
  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // The menu is a dropdown only on the compact layout; don't leave it open (and the page locked) after a resize.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const onChange = (event) => {
      if (event.matches) setOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const className = ['navbar', scrolled && 'is-scrolled', open && 'is-open'].filter(Boolean).join(' ')

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header ref={headerRef} className={className}>
        <div className="navbar-shell">
          <div className="navbar-capsule">
            <a
              className="navbar-logo"
              href={pathname === '/' ? '#home' : '/'}
              aria-label={`${site.name}, ${pathname === '/' ? 'back to top' : 'home'}`}
              onClick={(event) => {
                event.preventDefault()
                closeMenu()
                if (pathname === '/') scrollToTop()
                else navigate('/')
              }}
            >
              <Logo />
            </a>

            <span className="navbar-divider" aria-hidden="true" />

            {/* Wide layout: links with a sliding highlight */}
            <nav className="navbar-nav" aria-label="Primary">
              <div ref={trackRef} className="navbar-track">
                <span ref={indicatorRef} className="navbar-indicator" aria-hidden="true" />
                <ul className="navbar-links">
                  {site.navLinks.map(({ id, label, icon: Icon }) => {
                    const active = activeId === id
                    return (
                      <li key={id}>
                        <SectionLink
                          ref={setLinkRef(id)}
                          id={id}
                          className={`navbar-link${active ? ' is-active' : ''}`}
                          aria-current={active ? (onProjectPage ? 'page' : 'location') : undefined}
                        >
                          <Icon aria-hidden="true" />
                          <span>{label}</span>
                        </SectionLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>

            <span className="navbar-divider" aria-hidden="true" />

            <div className="navbar-actions">
              <ThemeToggle />
              <CtaButton className="navbar-cta" />
            </div>

            {/* Compact layout: hamburger */}
            <button
              ref={burgerRef}
              type="button"
              className="navbar-burger"
              aria-label="Main menu"
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="navbar-burger-bar" />
              <span className="navbar-burger-bar" />
              <span className="navbar-burger-bar" />
            </button>
          </div>

          {/* Compact layout: dropdown card under the bar */}
          <div ref={menuRef} id={MENU_ID} className="navbar-menu">
            <div className="navbar-menu-body">
              <nav aria-label="Primary">
                <ul className="navbar-menu-links">
                  {site.navLinks.map(({ id, label, icon: Icon }) => {
                    const active = activeId === id
                    return (
                      <li key={id}>
                        <SectionLink
                          id={id}
                          className={`navbar-menu-link${active ? ' is-active' : ''}`}
                          aria-current={active ? (onProjectPage ? 'page' : 'location') : undefined}
                          onClick={closeMenu}
                        >
                          <Icon aria-hidden="true" />
                          <span>{label}</span>
                        </SectionLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="navbar-menu-footer">
                <ThemeToggle variant="switch" />
                <CtaButton onClick={closeMenu} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
