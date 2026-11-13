import { useEffect } from 'react'
import { FaAnglesDown, FaChevronRight, FaDownload } from 'react-icons/fa6'
import { useTheme } from '../context/ThemeContext'
import { heroGreeting, heroNameAccent, heroStats, heroTagline, roles } from '../data/about'
import { heroBackgrounds as BACKGROUNDS, heroPhoto } from '../data/heroArt'
import { site } from '../data/site'
import useCountUp from '../hooks/useCountUp'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useReveal from '../hooks/useReveal'
import useSiteLoaded from '../hooks/useSiteLoaded'
import useTypewriter from '../hooks/useTypewriter'
import preloadImages from '../utils/preloadImages'
import SocialLinks from './SocialLinks'
import CtaButton from './ui/CtaButton'
import DotGrid from './ui/DotGrid'
import GlassButton from './ui/GlassButton'
import GlassCard from './ui/GlassCard'
import Swoosh from './ui/Swoosh'
import './Hero.css'

// Staggers the entrance animation: each piece starts a little after the previous one.
const step = (n) => ({ '--delay': `${n * 0.12}s` })

// One stat card: gold icon, big number, muted label. The number counts up from 0 once the card is on
// screen and the preloader has gone.
function Stat({ icon: Icon, value, label, ready }) {
  const [ref, , seen] = useReveal({ threshold: 0.5, rootMargin: '0px' })
  const shown = useCountUp(value, seen && ready)

  return (
    <GlassCard as="li" ref={ref} className="hero-stat">
      <span className="hero-stat-icon">
        <Icon aria-hidden="true" />
      </span>
      <span className="hero-stat-body">
        <span className="hero-stat-value" aria-hidden="true">
          {shown}
        </span>
        <span className="visually-hidden">{value}</span>
        <span className="hero-stat-label">{label}</span>
      </span>
    </GlassCard>
  )
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const loaded = useSiteLoaded()
  const typed = useTypewriter(roles, { enabled: !reducedMotion && loaded })
  const { resolvedMode } = useTheme()

  // Both backgrounds are decoded up front (the Preloader does it too and shares the cache), so the
  // first switch of mode crossfades smoothly instead of hitching while the other image is decoded.
  useEffect(() => {
    preloadImages(Object.values(BACKGROUNDS).filter(Boolean))
  }, [])

  // "Nuwarinda Albert": the accent word gets the accent colour.
  const accentAt = site.name.indexOf(heroNameAccent)

  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      {/* Both backgrounds stay mounted; the one for the current mode fades in over the other. */}
      <div className="hero-bg" aria-hidden="true">
        {['dark', 'light'].map(
          (mode) =>
            BACKGROUNDS[mode] && (
              <span
                key={mode}
                className={`hero-bg-img hero-bg-img--${mode}${resolvedMode === mode ? ' is-on' : ''}`}
                style={{ backgroundImage: `url("${BACKGROUNDS[mode]}")` }}
              />
            ),
        )}
        <span className="hero-bg-shade" />
      </div>

      {/* Decoration: dot grids and gold swooshes in the corners (CSS/SVG only, behind everything) */}
      <div className="hero-decor" aria-hidden="true">
        <DotGrid className="hero-dots hero-dots--top" />
        <DotGrid className="hero-dots hero-dots--middle" />
        <Swoosh side="left" className="hero-swoosh" />
        <Swoosh side="right" className="hero-swoosh" />
      </div>

      {/* The cutout photo with a slowly rotating gold ring and a navy glow behind it. No photo file: nothing here. */}
      {heroPhoto && (
        <div className="hero-photo hero-in" style={step(2)}>
          <span className="hero-glow" aria-hidden="true" />
          <span className="hero-ring" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <circle cx="50" cy="50" r="48" pathLength="100" />
            </svg>
          </span>
          <img className="hero-photo-img" src={heroPhoto} alt={`Portrait of ${site.name}`} />
        </div>
      )}

      <div className="hero-main">
        <div className="hero-text">
          <p className="hero-greeting hero-in" style={step(0)}>
            {heroGreeting}
          </p>

          <h1 id="hero-name" className="hero-name hero-in" style={step(1)}>
            {accentAt > 0 ? (
              <>
                {site.name.slice(0, accentAt).trim()} <span className="accent">{heroNameAccent}</span>
                {site.name.slice(accentAt + heroNameAccent.length)}
              </>
            ) : (
              site.name
            )}
          </h1>

          <p className={`hero-roles hero-in${reducedMotion ? ' hero-roles--static' : ''}`} style={step(2)}>
            <span className="hero-slash" aria-hidden="true" />
            {reducedMotion ? (
              roles.join(' • ')
            ) : (
              <>
                <span className="visually-hidden">{roles.join(', ')}</span>
                <span aria-hidden="true">
                  {typed}
                  <span className="hero-cursor" />
                </span>
              </>
            )}
          </p>

          <p className="hero-tagline hero-in" style={step(3)}>
            {heroTagline}
          </p>

          <div className="hero-actions hero-in" style={step(4)}>
            <CtaButton href="#projects" label="View My Projects" tone="gold" endIcon={FaChevronRight} />
            <GlassButton href={site.cvFile} download icon={FaDownload}>
              Download CV
            </GlassButton>
          </div>

          <SocialLinks size="lg" order={['github', 'email', 'linkedin']} className="hero-socials hero-in" style={step(5)} />
        </div>
      </div>

      <ul className="hero-stats hero-in" style={step(6)}>
        {heroStats.map(({ icon, value, label }) => (
          <Stat key={label} icon={icon} value={value} label={label} ready={loaded} />
        ))}
      </ul>

      {/* Scroll cue: mouse, "Scroll Down", a double chevron, and long thin gold lines fading outwards */}
      <a className="hero-scroll hero-in" href="#about" aria-label="Scroll down to the About section" style={step(7)}>
        <span className="hero-scroll-line hero-scroll-line--left" aria-hidden="true" />
        <span className="hero-scroll-cue">
          <span className="hero-scroll-row">
            <span className="hero-scroll-mouse" aria-hidden="true">
              <span className="hero-scroll-dot" />
            </span>
            <span className="hero-scroll-text">Scroll Down</span>
          </span>
          <FaAnglesDown className="hero-scroll-chevrons" aria-hidden="true" />
        </span>
        <span className="hero-scroll-line hero-scroll-line--right" aria-hidden="true" />
      </a>
    </section>
  )
}
