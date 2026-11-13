import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './SectionNav.css'

// A band 25-35% down the screen: the section crossing it is the "current" one (same idea as the main navbar)
const SPY_MARGIN = '-25% 0px -65% 0px'

// The glass bar under the hero that lists the page's sections (only the ones that exist) and sticks just under the
// floating navbar while the page scrolls. The current section gets a gold pill that slides to it, like the main navbar's;
// on a narrow screen the bar scrolls sideways (no visible scrollbar) and keeps the current link in view.
//   <SectionNav sections={[{ id: 'overview', label: 'Overview' }, ...]} />
export default function SectionNav({ sections }) {
  const [activeId, setActiveId] = useState(null)
  const trackRef = useRef(null)
  const indicatorRef = useRef(null)
  const linkRefs = useRef({})
  const placedOnce = useRef(false)
  const idsKey = sections.map((section) => section.id).join('|')

  // Scrollspy
  useEffect(() => {
    const ids = idsKey.split('|')
    const crossing = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id)
          else crossing.delete(entry.target.id)
        }
        // sections touch, so two can cross at a boundary: the later one wins; none (e.g. between sections) keeps the last
        setActiveId((previous) => [...ids].reverse().find((id) => crossing.has(id)) ?? previous)
      },
      { rootMargin: SPY_MARGIN },
    )
    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [idsKey])

  // The sliding pill: positioned by writing CSS variables straight onto it (no React state), the CSS transition does
  // the sliding, and the first placement is not animated.
  const place = useCallback(() => {
    const indicator = indicatorRef.current
    const link = linkRefs.current[activeId]
    if (!indicator) return
    if (!link) {
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

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const observer = new ResizeObserver(place)
    observer.observe(track)
    document.fonts?.ready.then(place)
    return () => observer.disconnect()
  }, [place])

  // keep the current link visible when the bar scrolls sideways
  useEffect(() => {
    const track = trackRef.current
    const link = linkRefs.current[activeId]
    if (track && link && track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: link.offsetLeft - (track.clientWidth - link.offsetWidth) / 2 })
    }
  }, [activeId])

  return (
    <div className="psn">
      <nav className="psn-bar" aria-label="Project sections">
        <div ref={trackRef} className="psn-track">
          <span ref={indicatorRef} className="psn-indicator" aria-hidden="true" />
          <ul className="psn-list">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  ref={(element) => {
                    linkRefs.current[id] = element
                  }}
                  className={`psn-link${activeId === id ? ' is-active' : ''}`}
                  href={`#${id}`}
                  aria-current={activeId === id ? 'location' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
