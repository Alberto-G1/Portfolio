import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaCopy, FaEnvelope, FaLocationDot } from 'react-icons/fa6'
import { contactScene, contactSceneSize, horseWatermark } from '../data/heroArt'
import { contactColors, contactHeading, contactIntro, followMe, hasUrl, site } from '../data/site'
import copyText from '../utils/copyText'
import DotGrid from './ui/DotGrid'
import GlassCard from './ui/GlassCard'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Swoosh from './ui/Swoosh'
import ContactForm from './ContactForm'
import './Contact.css'

// "https://github.com/Alberto-G1" -> "github.com/Alberto-G1"
// An email address may wrap, but at the @ rather than in the middle of a word.
const breakable = (value) => {
  const at = value.indexOf('@')
  return at > 0 ? (
    <>
      {value.slice(0, at)}
      <wbr />
      {value.slice(at)}
    </>
  ) : (
    value
  )
}
const displayUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

// The info cards. Email and Location always; GitHub / LinkedIn only while their URL is filled in (site.socials), so the
// grid simply reflows when one is missing. `tone` picks the round badge: gold, blue, or the social's own brand colour.
function buildCards() {
  const social = (id) => site.socials.find((item) => item.id === id)
  const cards = [
    { id: 'email', label: 'Email', value: site.email, href: `mailto:${site.email}`, icon: FaEnvelope, tone: 'gold', copy: true },
    { id: 'location', label: 'Location', value: site.location, icon: FaLocationDot, tone: 'blue' },
  ]
  for (const id of ['github', 'linkedin']) {
    const item = social(id)
    if (item && hasUrl(item)) {
      cards.push({ id, label: item.label, value: displayUrl(item.url), href: item.url, icon: item.icon, tone: 'brand', color: item.color })
    }
  }
  return cards
}

// One glass card with a glowing blue-and-gold border, a round icon badge, a bold label and the value under it. A value
// with an `href` is a link; the email card also has a copy button with a "Copied!" tooltip.
function InfoCard({ card }) {
  const { label, value, href, icon: Icon, tone, color, copy } = card
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const onCopy = async () => {
    if (!(await copyText(value))) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }
  const external = href && /^https?:/.test(href)

  return (
    <GlassCard as="div" className="ci-card neon">
      <span className={`ci-badge ci-badge--${tone}`} style={color ? { '--brand': color } : undefined} aria-hidden="true">
        <Icon />
      </span>
      <div className="ci-text">
        <p className="ci-label">{label}</p>
        {href ? (
          <a className="ci-value" href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
            {breakable(value)}
          </a>
        ) : (
          <p className="ci-value">{value}</p>
        )}
      </div>
      {copy && (
        <div className="ci-copy-wrap">
          <button type="button" className="ci-copy" onClick={onCopy} aria-label={`Copy ${label.toLowerCase()} address`}>
            {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
          </button>
          {copied && (
            <span className="ci-tooltip" aria-hidden="true">
              Copied!
            </span>
          )}
          <span className="visually-hidden" role="status">
            {copied ? `${label} address copied` : ''}
          </span>
        </div>
      )}
    </GlassCard>
  )
}

// A glass pill: "Follow Me" in gold, a divider, then a round button in brand colours for each social that has a URL.
// With none, the bar isn't drawn at all.
function FollowBar() {
  const networks = site.socials.filter((item) => item.id !== 'email' && hasUrl(item))
  if (networks.length === 0) return null

  return (
    <Reveal className="fb neon neon--pill" delay={0.15}>
      <div className="fb-text">
        <p className="fb-title">{followMe.title}</p>
        <p className="fb-sub">{followMe.text}</p>
      </div>
      <span className="fb-divider" aria-hidden="true" />
      <ul className="fb-list">
        {networks.map(({ id, label, url, icon: Icon, color }) => (
          <li key={id}>
            <a
              className="fb-btn"
              href={url}
              aria-label={label}
              title={label}
              style={{ '--brand': color }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export default function Contact() {
  const cards = buildCards()

  return (
    <section
      id="contact"
      className="contact"
      aria-labelledby="contact-heading"
      style={{ '--contact-blue': contactColors.blue, '--contact-ok': contactColors.ok, '--contact-error': contactColors.error }}
    >
      {/* Decoration, all behind the content: faint horse watermark (optional file), dot grids, gold swooshes */}
      <div className="contact-decor" aria-hidden="true">
        {horseWatermark && <img className="contact-watermark" src={horseWatermark} alt="" />}
        <DotGrid className="contact-dots contact-dots--top" />
        <DotGrid className="contact-dots contact-dots--middle" />
        <Swoosh side="left" className="contact-swoosh" />
        <Swoosh side="right" className="contact-swoosh" />
      </div>

      <div className="contact-container">
        {/* Under 1024px the two columns dissolve (display: contents) and the pieces follow their `order`:
            heading, info cards, form, Follow Me bar, then the scene */}
        <div className="contact-layout">
          <div className="contact-left">
            <div className="contact-head">
              <SectionHeading id="contact-heading" {...contactHeading} />
              <Reveal delay={0.05}>
                <p className="contact-intro">{contactIntro}</p>
              </Reveal>
            </div>

            <ul className="ci-grid" aria-label="Contact details">
              {cards.map((card, index) => (
                <Reveal as="li" key={card.id} delay={0.08 * index} className="ci-item">
                  <InfoCard card={card} />
                </Reveal>
              ))}
            </ul>

            {contactScene && (
              <Reveal className="contact-scene" delay={0.1}>
                <div className="contact-scene-inner">
                  <span className="contact-glow" aria-hidden="true" />
                  <img
                    className="contact-scene-img"
                    src={contactScene}
                    alt=""
                    aria-hidden="true"
                    width={contactSceneSize.width}
                    height={contactSceneSize.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <div className="contact-right">
            <Reveal className="contact-form-wrap" delay={0.1}>
              {/* a blurred copy of the card's turning blue/gold border, behind it: the outer glow */}
              <span className="neon-glow" aria-hidden="true" />
              <ContactForm />
            </Reveal>
            <FollowBar />
          </div>
        </div>
      </div>
    </section>
  )
}
