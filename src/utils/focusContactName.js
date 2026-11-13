// After a click on a link that goes to #contact ("Let's Talk", "Let's Work Together"), wait until the page has
// finished scrolling there and put the cursor in the Name field, so the visitor can start typing straight away.
// The scroll itself is the link's normal smooth scroll (instant under reduced motion); this only adds the focus.
// If the section is already in place it focuses at once; otherwise it waits for `scrollend`, with a timeout as a
// fallback for browsers without that event.
export default function focusContactName() {
  const section = document.getElementById('contact')
  if (!section) return

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    window.removeEventListener('scrollend', finish)
    document.getElementById('contact-name')?.focus({ preventScroll: true })
  }

  // two frames: by then an instant (reduced motion) jump has already happened
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const wanted = parseFloat(getComputedStyle(section).scrollMarginTop) || 0
      if (Math.abs(section.getBoundingClientRect().top - wanted) < 4) {
        finish()
        return
      }
      window.addEventListener('scrollend', finish, { once: true })
      setTimeout(finish, 1300)
    }),
  )
}
