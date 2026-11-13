import { useEffect, useState } from 'react'
import { aboutPhoto, heroBackgrounds, heroPhoto } from '../data/heroArt'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import preloadImages from '../utils/preloadImages'
import Loader from './ui/Loader'
import './Preloader.css'

const MIN_MS = 900 // never just flash: show the loader for at least this long...
const MIN_REDUCED_MS = 300 // ...or this long when the visitor asked for reduced motion
const MAX_MS = 5000 // ...but never keep the page hidden longer than this, whatever is still loading
const FADE_MS = 500 // keep in step with the opacity transition in Preloader.css

// Resolves when every <img> currently on the page has loaded or failed.
const pageImagesSettled = () =>
  Promise.all(
    [...document.images].map(
      (image) =>
        image.complete ||
        new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        }),
    ),
  )

/*
  Full-screen loader shown while the page loads. It leaves once the things the first screen is built
  from are ready (the logo, the photo and the hero artwork) and the minimum time has passed, or after
  MAX_MS at the latest. It deliberately does NOT wait for the window `load` event: that also waits for
  third-party requests such as the web-font stylesheet, and a slow font host must never hold the
  page behind a spinner (the fonts swap in when they arrive).

  `onLeave` is called as the fade starts (the hero entrance begins then); the overlay removes itself
  when the fade is over.
*/
export default function Preloader({ onLeave }) {
  const reducedMotion = usePrefersReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)))

    const ready = Promise.all([
      preloadImages([...new Set([...Object.values(heroBackgrounds), heroPhoto, aboutPhoto].filter(Boolean))]),
      pageImagesSettled(),
      wait(reducedMotion ? MIN_REDUCED_MS : MIN_MS),
    ])

    Promise.race([ready, wait(MAX_MS)]).then(() => {
      if (cancelled) return
      setLeaving(true)
      onLeave()
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reducedMotion, onLeave])

  useEffect(() => {
    if (!leaving) return undefined
    const timer = setTimeout(() => setGone(true), FADE_MS)
    return () => clearTimeout(timer)
  }, [leaving])

  if (gone) return null

  return (
    <div className={`preloader${leaving ? ' is-leaving' : ''}`}>
      <Loader />
    </div>
  )
}
