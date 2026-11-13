import { useSyncExternalStore } from 'react'

// How many columns the project grid currently has. The breakpoints mirror Projects.css
// (4 from 1200px, 3 from 1024px, 2 from 640px, otherwise 1), so the JS and the CSS agree.
const STEPS = [
  ['(min-width: 1200px)', 4],
  ['(min-width: 1024px)', 3],
  ['(min-width: 640px)', 2],
]

function subscribe(onChange) {
  const lists = STEPS.map(([query]) => window.matchMedia(query))
  lists.forEach((list) => list.addEventListener('change', onChange))
  return () => lists.forEach((list) => list.removeEventListener('change', onChange))
}

function getSnapshot() {
  for (const [query, columns] of STEPS) if (window.matchMedia(query).matches) return columns
  return 1
}

export default function useGridColumns() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 4)
}
