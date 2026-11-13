import { useTheme } from '../context/ThemeContext'
import { site } from '../data/site'
import './Logo.css'

/*
  Logo images live in src/assets/brand:
    logo-dark.*   shown in dark mode  (light letters)
    logo-light.*  shown in light mode (dark letters)
  If only one of the pair is there, or just a single NAG-Logo.*, that file is used for
  the missing mode. With no logo file at all, a styled text logo is drawn instead.
  (A glob rather than a plain import, so a missing file can never break the build.)
*/
const files = import.meta.glob('../assets/brand/*.{png,jpg,jpeg,webp,svg}', { eager: true, import: 'default' })

function find(name) {
  const match = new RegExp(`/${name}\\.[a-z]+$`, 'i')
  return Object.entries(files).find(([path]) => match.test(path))?.[1]
}

const shared = find('NAG-Logo')
const LOGOS = { dark: find('logo-dark') ?? shared, light: find('logo-light') ?? shared }

// Size it from the parent with the --logo-height variable.
export default function Logo({ className = '', alt = '' }) {
  const { resolvedMode } = useTheme()
  const src = LOGOS[resolvedMode]
  const classes = `logo ${className}`.trim()

  if (src) {
    return <img className={`${classes} logo-img`} src={src} alt={alt} draggable="false" />
  }

  return (
    <span className={`${classes} logo-text`} aria-label={alt || undefined}>
      <span className="logo-word">{site.logoText}</span>
      <span className="logo-swoosh" aria-hidden="true" />
    </span>
  )
}
