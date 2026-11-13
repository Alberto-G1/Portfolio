import './DotGrid.css'

// A grid of small dots made with a radial-gradient (CSS only), faded toward its edges. Decoration:
// aria-hidden, low opacity, never takes clicks. Place and size it from the parent with a class or style:
//   <DotGrid className="hero-dots hero-dots--left" />
export default function DotGrid({ className = '', style }) {
  return <span className={`dot-grid ${className}`.trim()} style={style} aria-hidden="true" />
}
