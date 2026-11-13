import useReveal from '../../hooks/useReveal'
import './SectionHeading.css'

// Wraps the first occurrence of `accent` inside `text` in the accent colour.
function withAccent(text, accent) {
  const start = accent ? text.indexOf(accent) : -1
  if (start === -1) return text
  return (
    <>
      {text.slice(0, start)}
      <span className="accent">{accent}</span>
      {text.slice(start + accent.length)}
    </>
  )
}

// The heading pattern used by every section: a gold-outlined pill label with an icon and a thin gold
// line beside it, then a very large heavy-serif title with part of it highlighted, and optionally a
// smaller serif subtitle underneath. `accent` / `subtitleAccent` are the parts to highlight; `icon` is a
// react-icons component.
//
//   <SectionHeading id="about-heading" label="About Me" icon={FaUser} title="Who I Am" accent="Am" />
//   <SectionHeading ... title="My Skills" accent="Skills" subtitle="Technologies I Work With" subtitleAccent="Work With" />
//
// Reveals on scroll. Pass align="center" to centre it (the line then appears on both sides).
export default function SectionHeading({
  id,
  label,
  icon: Icon,
  title,
  accent,
  subtitle,
  subtitleAccent,
  align = 'left',
}) {
  const [ref, reveal] = useReveal()

  return (
    <div ref={ref} className={`section-heading section-heading--${align} ${reveal}`}>
      <div className="section-heading-row">
        {align === 'center' && <span className="section-heading-line section-heading-line--before" aria-hidden="true" />}
        <p className="section-heading-label">
          {Icon && <Icon aria-hidden="true" />}
          {label}
        </p>
        <span className="section-heading-line" aria-hidden="true" />
      </div>
      <h2 id={id} className="section-heading-title">
        {withAccent(title, accent)}
      </h2>
      {subtitle && <p className="section-heading-subtitle">{withAccent(subtitle, subtitleAccent)}</p>}
    </div>
  )
}
