// Source: Uiverse.io round "back to top" button, pasted by the user (the exact URL was not included).
// Converted from styled-components to a plain React component + CSS file, with the hard-coded colours
// replaced by theme variables. It is a real <button>; the "Back to Top" words that slide in on hover are
// decoration (the accessible name is the aria-label), and keyboard focus expands it just like hover.
import './BackToTopButton.css'

export default function BackToTopButton({ onClick }) {
  return (
    <button type="button" className="btt" onClick={onClick} aria-label="Back to top" title="Back to top">
      <svg viewBox="0 0 384 512" className="btt-icon" aria-hidden="true">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
      </svg>
    </button>
  )
}
