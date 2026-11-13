import { techInfo } from '../../data/techIcons'
import './TechChips.css'

// A row of small rounded chips, each a brand icon plus the technology's name (icons from data/techIcons.js).
//   <TechChips names={project.tech} />                 every chip
//   <TechChips names={project.tech} max={3} />         the first 3, then a "+N" chip (its title and screen-reader
//                                                      text list the ones left out)
//   <TechChips names={...} size="lg" />                 larger chips (the project page's tech cards)
// Renders nothing for an empty list.
export default function TechChips({ names = [], max, size, className = '', ...rest }) {
  if (names.length === 0) return null

  const shown = max ? names.slice(0, max) : names
  const hidden = max ? names.slice(max) : []

  return (
    <ul className={`tech-chips${size === 'lg' ? ' tech-chips--lg' : ''} ${className}`.trim()} {...rest}>
      {shown.map((name) => {
        const { icon: Icon, color, adaptive } = techInfo(name)
        return (
          <li
            key={name}
            className={`tech-chip${adaptive ? ' tech-chip--adaptive' : ''}`}
            style={color ? { '--chip-color': color } : undefined}
          >
            <Icon aria-hidden="true" />
            <span>{name}</span>
          </li>
        )
      })}
      {hidden.length > 0 && (
        <li className="tech-chip tech-chip--more" title={hidden.join(', ')}>
          +{hidden.length}
          <span className="visually-hidden"> more: {hidden.join(', ')}</span>
        </li>
      )}
    </ul>
  )
}
