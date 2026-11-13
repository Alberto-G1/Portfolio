import { FaBolt, FaChevronRight } from 'react-icons/fa6'
import {
  aboutHeading,
  aboutParagraphs,
  focusAreas,
  focusAreasTitle,
  quickFacts,
  quickFactsTitle,
} from '../data/about'
import { aboutPhoto, horseWatermark } from '../data/heroArt'
import { site } from '../data/site'
import useReveal from '../hooks/useReveal'
import DotGrid from './ui/DotGrid'
import GlassCard from './ui/GlassCard'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Swoosh from './ui/Swoosh'
import './About.css'

const [lead, ...otherParagraphs] = aboutParagraphs

function FocusArea({ area: { icon: Icon, title, text, color, onColor, href, ariaLabel }, index }) {
  const [ref, reveal] = useReveal()

  // The <li> does the reveal; the card inside handles hover, so their transforms never clash.
  return (
    <li ref={ref} className={`about-focus-item ${reveal}`} style={{ '--reveal-delay': `${index * 0.1}s` }}>
      <GlassCard as="article" hover className="focus-card" style={{ '--card-color': color, '--card-on': onColor }}>
        <span className="focus-card-icon">
          <Icon aria-hidden="true" />
        </span>
        <div className="focus-card-body">
          <h3 className="focus-card-title">{title}</h3>
          <p className="focus-card-text">{text}</p>
        </div>
        <a className="focus-card-go" href={href} aria-label={ariaLabel}>
          <FaChevronRight aria-hidden="true" />
        </a>
      </GlassCard>
    </li>
  )
}

export default function About() {
  const [photoRef, photoReveal] = useReveal()

  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      {/* Decoration, all behind the content: faint horse watermark (optional file), dot grids, gold swooshes */}
      <div className="about-decor" aria-hidden="true">
        {horseWatermark && <img className="about-watermark" src={horseWatermark} alt="" />}
        <DotGrid className="about-dots about-dots--top" />
        <DotGrid className="about-dots about-dots--middle" />
        <Swoosh side="left" className="about-swoosh" />
        <Swoosh side="right" className="about-swoosh" />
      </div>

      <div className="about-container">
        <div className="about-grid">
          <div className="about-heading-block">
            <SectionHeading id="about-heading" {...aboutHeading} />
          </div>

          <div className="about-body">
            <Reveal className="about-lead-block" delay={0.05}>
              <p className="about-lead">{lead}</p>
              <span className="about-lead-bar" aria-hidden="true" />
            </Reveal>

            <div className="about-paragraphs">
              {otherParagraphs.map((paragraph, index) => (
                <Reveal as="p" key={paragraph} className="about-paragraph" delay={0.1 + index * 0.1}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>

          {/* The person stands in front of a tilted gold slab (nothing is drawn when there is no photo file) */}
          <div ref={photoRef} className={`about-photo ${photoReveal}`}>
            <span className="about-slab" aria-hidden="true" />
            <DotGrid className="about-photo-dots about-photo-dots--left" />
            <DotGrid className="about-photo-dots about-photo-dots--right" />
            {aboutPhoto && <img className="about-photo-img" src={aboutPhoto} alt={`Portrait of ${site.name}`} />}
          </div>

          <Reveal className="about-facts-wrap" delay={0.15}>
            <GlassCard className="about-facts" role="group" aria-labelledby="about-facts-title">
              <div className="about-facts-head">
                <FaBolt aria-hidden="true" />
                <h3 id="about-facts-title" className="about-facts-title">
                  {quickFactsTitle}
                </h3>
              </div>
              <ul className="about-facts-list">
                {quickFacts.map(({ icon: Icon, label, value, primary, secondary }, index) => (
                  <Reveal as="li" key={label} className="about-fact" delay={0.2 + index * 0.08}>
                    <span className="about-fact-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="about-fact-body">
                      {/* the label stays available to screen readers when the muted line shows something else */}
                      {secondary && <span className="visually-hidden">{label}: </span>}
                      <span className="about-fact-value">{primary ?? value}</span>
                      <span className="about-fact-label">{secondary ?? label}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>

        <div className="about-focus-area">
          <Reveal className="about-focus-head">
            <span className="about-focus-line about-focus-line--left" aria-hidden="true" />
            <h3 className="about-focus-title">{focusAreasTitle}</h3>
            <span className="about-focus-line about-focus-line--right" aria-hidden="true" />
          </Reveal>

          <ul className="about-focus">
            {focusAreas.map((area, index) => (
              <FocusArea key={area.title} area={area} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
