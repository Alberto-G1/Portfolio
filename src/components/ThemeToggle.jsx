import { FaMoon, FaSun } from 'react-icons/fa6'
import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

/*
  One button, two looks (same behaviour and accessible name):
    variant="pill"    sun + moon in a rounded pill; the active icon sits on a glowing gold circle (navbar)
    variant="switch"  sun, a toggle switch, moon (mobile menu)
*/
export default function ThemeToggle({ variant = 'pill' }) {
  const { resolvedMode, toggleMode } = useTheme()
  const target = resolvedMode === 'dark' ? 'light' : 'dark'
  const label = `Switch to ${target} mode`

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant}`}
      data-mode={resolvedMode}
      onClick={toggleMode}
      aria-label={label}
      title={label}
    >
      {variant === 'switch' ? (
        <>
          <FaSun className="tt-icon tt-icon--sun" aria-hidden="true" />
          <span className="tt-track" aria-hidden="true">
            <span className="tt-knob" />
          </span>
          <FaMoon className="tt-icon tt-icon--moon" aria-hidden="true" />
        </>
      ) : (
        <>
          <span className="tt-thumb" aria-hidden="true" />
          <FaSun className="tt-icon tt-icon--sun" aria-hidden="true" />
          <FaMoon className="tt-icon tt-icon--moon" aria-hidden="true" />
        </>
      )}
    </button>
  )
}
