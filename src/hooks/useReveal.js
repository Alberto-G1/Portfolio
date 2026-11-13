import { useEffect, useRef, useState } from 'react'

// Reveal-on-scroll. Attach the ref to an element and add the returned class:
//
//   const [ref, reveal] = useReveal()
//   <div ref={ref} className={`my-block ${reveal}`}>
//
// `reveal` is "reveal" until the element scrolls into view, then "reveal is-revealed"
// (styles in global.css). It fires once. Stagger siblings with an inline
// style={{ '--reveal-delay': '0.1s' }}. Under prefers-reduced-motion the CSS shows the
// element straight away, so nothing is ever hidden.
//
// The third value is the plain boolean (true once the element has been seen), for work that
// should start only when visible, e.g. `const [ref, , seen] = useReveal()` for a count-up.
export default function useReveal({ threshold = 0.12, rootMargin = '0px 0px -6% 0px' } = {}) {
  const ref = useRef(null)
  // Without IntersectionObserver there is nothing to wait for: show everything.
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || revealed) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed, threshold, rootMargin])

  return [ref, revealed ? 'reveal is-revealed' : 'reveal', revealed]
}
