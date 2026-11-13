import { FaLink } from 'react-icons/fa6'
import { hasUrl, site } from '../data/site'
import './SocialLinks.css'

// Round buttons for the social profiles in site.socials (each entry brings its own `icon`). An entry with no URL is
// not drawn at all (no dead "#" links), and if none is left the whole list is skipped.
// size="lg": the larger outlined variant used in the Hero (52px, gold border + icon + glow on hover).
// `order`: show the entries in this order of `id`s (default: the order in site.socials).
export default function SocialLinks({ className = '', style, size, order }) {
  const entries = order ? order.map((id) => site.socials.find((s) => s.id === id)).filter(Boolean) : site.socials
  const items = entries.filter(hasUrl)
  if (items.length === 0) return null

  return (
    <ul className={`social-links${size === 'lg' ? ' social-links--lg' : ''} ${className}`.trim()} style={style}>
      {items.map(({ id, label, url, icon: Icon = FaLink }) => {
        const external = /^https?:/.test(url)
        return (
          <li key={id}>
            <a
              className="social-link"
              href={url}
              aria-label={label}
              title={label}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
