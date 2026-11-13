import { useSyncExternalStore } from 'react'

// "The preloader has finished." Things that should only start once the visitor can actually see
// the page (the hero entrance, typing, count-up) wait for this. App calls markSiteLoaded().
const EVENT = 'site-loaded'

function subscribe(onChange) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

const getSnapshot = () => document.documentElement.dataset.loaded === 'true'

export function markSiteLoaded() {
  document.documentElement.dataset.loaded = 'true' // also lets CSS wait: html:not([data-loaded]) ...
  window.dispatchEvent(new Event(EVENT))
}

export default function useSiteLoaded() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
