// No `behavior` option on purpose: it follows `html { scroll-behavior }`, so the
// scroll is smooth normally and instant under prefers-reduced-motion.
export default function scrollToTop() {
  window.scrollTo({ top: 0 })
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}
