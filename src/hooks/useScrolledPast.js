import { useSyncExternalStore } from 'react'

function subscribe(onChange) {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

// True once the page is scrolled further than `threshold` px. `threshold` can be
// a function (e.g. () => window.innerHeight) for values that change on resize.
// Only re-renders when the answer flips, not on every scroll event.
export default function useScrolledPast(threshold) {
  const getSnapshot = () => window.scrollY > (typeof threshold === 'function' ? threshold() : threshold)
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
