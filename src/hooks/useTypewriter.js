import { useEffect, useState } from 'react'

// Types each word out, holds it, deletes it, then moves to the next (looping).
// Returns the text to show right now. `words` must be a stable array (e.g. from src/data).
// Pass `enabled: false` to stop (the hook then does nothing and returns its last text).
export default function useTypewriter(
  words,
  { typeMs = 90, deleteMs = 45, holdMs = 1600, gapMs = 350, enabled = true } = {},
) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!enabled || words.length === 0) return undefined

    const word = words[wordIndex]
    const complete = text === word
    const empty = text === ''

    let delay = deleting ? deleteMs : typeMs
    if (!deleting && complete) delay = holdMs
    else if (deleting && empty) delay = gapMs

    const timer = setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true)
      } else if (deleting && empty) {
        setDeleting(false)
        setWordIndex((index) => (index + 1) % words.length)
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [text, wordIndex, deleting, words, enabled, typeMs, deleteMs, holdMs, gapMs])

  return text
}
