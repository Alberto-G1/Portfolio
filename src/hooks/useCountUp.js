import { useEffect, useMemo, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

// "98.3%" -> { prefix: '', number: 98.3, decimals: 1, suffix: '%' }; "7+" -> { number: 7, suffix: '+' }
function parseStat(text) {
  const match = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/.exec(text)
  if (!match) return null
  return { prefix: match[1], number: parseFloat(match[2]), decimals: (match[2].split('.')[1] ?? '').length, suffix: match[3] }
}

// Counts a stat such as "7+" or "98.3%" up from 0 once `active` is true, easing out.
// Returns the text to show right now. Under prefers-reduced-motion (and for text with no
// number in it) it returns the final text straight away.
export default function useCountUp(text, active, duration = 1600) {
  const reducedMotion = usePrefersReducedMotion()
  const parsed = useMemo(() => parseStat(text), [text])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active || reducedMotion || !parsed) return undefined
    let frame
    const start = performance.now()
    const tick = (now) => {
      // the frame's timestamp can be a hair earlier than `start`, so clamp at 0 (never a negative number)
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setProgress(1 - (1 - t) ** 3)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reducedMotion, parsed, duration])

  if (!parsed || reducedMotion) return text
  return `${parsed.prefix}${(parsed.number * progress).toFixed(parsed.decimals)}${parsed.suffix}`
}
