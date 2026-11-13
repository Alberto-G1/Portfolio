import { useEffect } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

// A subtle 3D tilt that follows the mouse. Attach the ref to the element that should react to the pointer;
// the hook writes --tilt-x and --tilt-y (in degrees, at most `max`) onto it, and the CSS decides what to
// rotate (transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y))). It writes straight to the element, so
// moving the mouse never re-renders React. Does nothing under prefers-reduced-motion or on touch devices
// (anything without a hovering, precise pointer).
export default function useTilt(ref, { max = 6 } = {}) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      const box = element.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - 0.5 // -0.5 .. 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      element.style.setProperty('--tilt-y', `${(x * max * 2).toFixed(2)}deg`)
      element.style.setProperty('--tilt-x', `${(-y * max * 2).toFixed(2)}deg`)
    }
    const onLeave = () => {
      element.style.setProperty('--tilt-x', '0deg')
      element.style.setProperty('--tilt-y', '0deg')
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [ref, reducedMotion, max])
}
