import { useLayoutEffect } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

// Drives a vertical timeline's gold line. Give it the ref of the timeline element; it must contain the nodes
// (elements with the class `timeline-node`, the first and last mark the ends of the line). It writes CSS
// variables on that element and toggles a class, with no React state, so scrolling never re-renders:
//   --line-top / --line-height   where the line starts and how long it is (px, from the first to the last node)
//   --line-progress              0..1, how much of it is filled: the line fills from top to bottom as the
//                                timeline scrolls up past a "reading line" 70% of the way down the screen
//   .is-dim on a node            it has not been reached by the line yet
// Under prefers-reduced-motion the line is simply full and no node is dim. `watch` is any value that changes
// when the nodes do (e.g. the active tab) so they are measured again.
export default function useTimelineProgress(ref, watch) {
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const timeline = ref.current
    if (!timeline) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const nodes = [...timeline.querySelectorAll('.timeline-node')]
      if (nodes.length === 0) return

      const box = timeline.getBoundingClientRect()
      const centre = (node) => {
        const r = node.getBoundingClientRect()
        return r.top + r.height / 2
      }
      const top = centre(nodes[0]) - box.top
      const length = Math.max(1, centre(nodes[nodes.length - 1]) - centre(nodes[0]))
      const reading = window.innerHeight * 0.7
      const progress = reducedMotion ? 1 : Math.min(1, Math.max(0, (reading - centre(nodes[0])) / length))

      timeline.style.setProperty('--line-top', `${top}px`)
      timeline.style.setProperty('--line-height', `${length}px`)
      timeline.style.setProperty('--line-progress', progress.toFixed(4))
      for (const node of nodes) node.classList.toggle('is-dim', !reducedMotion && centre(node) > reading)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const resizes = new ResizeObserver(schedule) // cards expand and collapse
    resizes.observe(timeline)
    const swaps = new MutationObserver(schedule) // the nodes themselves change (the tab swaps)
    swaps.observe(timeline, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resizes.disconnect()
      swaps.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, reducedMotion, watch])
}
