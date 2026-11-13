import { useId } from 'react'
import './Swoosh.css'

// A flowing gold "swoosh" for the bottom corners of a section: an SVG path filled with a gold gradient
// (the theme accent, so the customizer recolours it) plus a thin highlight line. Decoration: aria-hidden,
// low opacity, behind the content. Anchor it with `side` (it hugs that bottom corner); size it with CSS.
//   <Swoosh side="left" />   <Swoosh side="right" />
export default function Swoosh({ side = 'left', className = '' }) {
  const id = useId()

  return (
    <svg
      className={`swoosh swoosh--${side} ${className}`.trim()}
      viewBox="0 0 640 260"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.95 }} />
          <stop offset="0.55" style={{ stopColor: 'var(--hover)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d="M0 70 C130 80 280 150 410 215 C470 244 550 258 640 260 L0 260 Z" fill={`url(#${id})`} />
      <path
        className="swoosh-line"
        d="M0 38 C140 46 300 125 436 198 C500 232 570 250 640 254"
        fill="none"
        style={{ stroke: 'var(--accent)' }}
      />
    </svg>
  )
}
