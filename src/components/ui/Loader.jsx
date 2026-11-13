// Source: Uiverse.io semicircle loader, pasted by the user (the exact URL was not included).
// Converted from styled-components to a plain React component + CSS file (the project doesn't use
// CSS-in-JS), and its hard-coded black ring colour now comes from the theme (--accent).
import './Loader.css'

// Eight rings nested inside one another. Each one rotates inside its parent, so they spin at
// different rates and make the pattern.
function Ring({ depth }) {
  return <div>{depth > 0 && <Ring depth={depth - 1} />}</div>
}

export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" role="status">
      <span className="visually-hidden">{label}</span>
      <div className="loader-rings" aria-hidden="true">
        <Ring depth={7} />
      </div>
    </div>
  )
}
