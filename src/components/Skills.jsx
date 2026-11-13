import { useRef } from 'react'
import { horseWatermark, skillsImage, skillsImageSize } from '../data/heroArt'
import { categories, proficiency, skillsHeading, skillsIntro } from '../data/skills'
import useCountUp from '../hooks/useCountUp'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useReveal from '../hooks/useReveal'
import useTilt from '../hooks/useTilt'
import DotGrid from './ui/DotGrid'
import GlassCard from './ui/GlassCard'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Swoosh from './ui/Swoosh'
import './Skills.css'

// One proficiency row: label, a rounded track whose gold fill grows from 0 to `value` the first time the row
// scrolls into view, and the percentage counting up alongside it. Under reduced motion the final value shows at
// once. The track is the progressbar; the counting number is hidden from screen readers (they get the final value).
function ProficiencyBar({ label, value }) {
  const reducedMotion = usePrefersReducedMotion()
  const [ref, , seen] = useReveal({ threshold: 0.5, rootMargin: '0px' })
  const shown = useCountUp(`${value}%`, seen)
  const filled = seen || reducedMotion

  return (
    <li ref={ref} className="skill-bar">
      <span className="skill-bar-label">{label}</span>
      <span
        className="skill-bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${value}%`}
      >
        <span className="skill-bar-fill" style={{ width: filled ? `${value}%` : '0%' }} />
      </span>
      <span className="skill-bar-value" aria-hidden="true">
        {shown}
      </span>
    </li>
  )
}

// The laptop picture: purely decorative (the skills are listed in the cards), so alt="" and aria-hidden.
// A soft accent glow pulses behind it, it floats up and down, and on a desktop with a mouse it tilts a little
// towards the pointer (useTilt; off for touch and reduced motion).
function Workstation() {
  const [ref, reveal] = useReveal()
  const tiltRef = useRef(null)
  useTilt(tiltRef, { max: 6 })

  return (
    <div ref={ref} className={`skills-visual-wrap ${reveal}`}>
      <div ref={tiltRef} className="skills-visual">
        <span className="skills-glow" aria-hidden="true" />
        <div className="skills-tilt">
          <img
            className="skills-image"
            src={skillsImage}
            alt=""
            aria-hidden="true"
            width={skillsImageSize.width}
            height={skillsImageSize.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ category: { id, title, color, icon: Icon, items }, index }) {
  // The subtitle comes from the data: the first four item names.
  const subtitle = items
    .slice(0, 4)
    .map((item) => item.name)
    .join(', ')

  return (
    <Reveal as="li" className="skills-card-item" delay={index * 0.1}>
      <GlassCard as="article" hover className="skill-card" style={{ '--card-color': color }} aria-labelledby={`skills-${id}-title`}>
        <span className="skill-card-icon">
          <Icon aria-hidden="true" />
        </span>
        <h3 id={`skills-${id}-title`} className="skill-card-title">
          {title}
        </h3>
        <p className="skill-card-sub">{subtitle}</p>

        <ul className="skill-icons" aria-label={`${title}: all items`}>
          {items.map(({ name, icon: ItemIcon, color: brand, adaptive }) => (
            <li key={name}>
              {/* focusable so the tooltip works from the keyboard; role="img" + aria-label names it */}
              <span
                className={`skill-icon${adaptive ? ' skill-icon--adaptive' : ''}`}
                tabIndex={0}
                role="img"
                aria-label={name}
                data-tip={name}
                style={brand ? { '--icon-color': brand } : undefined}
              >
                <ItemIcon aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </Reveal>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-labelledby="skills-heading">
      {/* Decoration, all behind the content: faint horse watermark (optional file), dot grids, gold swooshes */}
      <div className="skills-decor" aria-hidden="true">
        {horseWatermark && <img className="skills-watermark" src={horseWatermark} alt="" />}
        <DotGrid className="skills-dots skills-dots--top" />
        <DotGrid className="skills-dots skills-dots--middle" />
        <Swoosh side="left" className="skills-swoosh" />
        <Swoosh side="right" className="skills-swoosh" />
      </div>

      <div className="skills-container">
        {/* No picture file: the text simply takes the full width */}
        <div className={`skills-top${skillsImage ? '' : ' skills-top--solo'}`}>
          <div className="skills-text">
            <SectionHeading id="skills-heading" {...skillsHeading} />

            <Reveal delay={0.05}>
              <p className="skills-intro">{skillsIntro}</p>
            </Reveal>

            <Reveal as="ul" className="skills-bars" aria-label="Skill proficiency" delay={0.1}>
              {proficiency.map(({ label, value }) => (
                <ProficiencyBar key={label} label={label} value={value} />
              ))}
            </Reveal>
          </div>

          {skillsImage && <Workstation />}
        </div>

        <ul className="skills-cards">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
