import { useRef, useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, m } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa6'
import { experienceScene, experienceSceneSize, horseWatermark } from '../data/heroArt'
import {
  education,
  experience,
  experienceCta,
  experienceHeading,
  experienceIntro,
  experienceTabs,
  fallbackStatIcon,
  keySkills,
  sceneGlowBlue,
  statIcons,
  stats,
} from '../data/experience'
import useCountUp from '../hooks/useCountUp'
import useReveal from '../hooks/useReveal'
import useTimelineProgress from '../hooks/useTimelineProgress'
import focusContactName from '../utils/focusContactName'
import loadMotionFeatures from '../utils/loadMotionFeatures'
import DotGrid from './ui/DotGrid'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Swoosh from './ui/Swoosh'
import KeySkills from './KeySkills'
import TimelineCard from './TimelineCard'
import './Experience.css'

// One figure of the bottom row: a gold icon, the value (it counts up the first time it scrolls into view) and a
// small label. The animated number is hidden from screen readers, which get the final value.
function Stat({ icon, value, label }) {
  const [ref, , seen] = useReveal({ threshold: 0.6, rootMargin: '0px' })
  const shown = useCountUp(value, seen)
  const Icon = statIcons[icon] ?? fallbackStatIcon

  return (
    <li ref={ref} className="exp-stat">
      <Icon aria-hidden="true" />
      <div>
        <p className="exp-stat-value">
          <span aria-hidden="true">{shown}</span>
          <span className="visually-hidden">{value}</span>
        </p>
        <p className="exp-stat-label">{label}</p>
      </div>
    </li>
  )
}

export default function Experience() {
  const [tab, setTab] = useState(experienceTabs[0].id)
  const tabRefs = useRef([])
  const timelineRef = useRef(null)
  useTimelineProgress(timelineRef, tab)

  // A stat with no value is hidden, and so is the whole row while all of them are empty: no made-up numbers.
  const shownStats = stats.filter((stat) => String(stat.value).trim() !== '')

  // Arrow keys move between the tabs (and select them); Home / End jump to the ends. Only the selected tab is in
  // the Tab order.
  const onTabKeyDown = (event) => {
    const count = experienceTabs.length
    const index = experienceTabs.findIndex((item) => item.id === tab)
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    let next
    if (step) next = (index + step + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    else return
    event.preventDefault()
    setTab(experienceTabs[next].id)
    tabRefs.current[next]?.focus()
  }

  const items = tab === 'experience' ? experience : education

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures}>
        <section id="experience" className="experience" aria-labelledby="experience-heading">
          {/* Decoration, all behind the content: faint horse watermark (optional file), dot grids, gold swooshes */}
          <div className="experience-decor" aria-hidden="true">
            {horseWatermark && <img className="experience-watermark" src={horseWatermark} alt="" />}
            <DotGrid className="experience-dots experience-dots--top" />
            <DotGrid className="experience-dots experience-dots--middle" />
            <Swoosh side="left" className="experience-swoosh" />
            <Swoosh side="right" className="experience-swoosh" />
          </div>

          <div className="experience-container">
            {/* No scene picture: the heading sits above and the timeline takes the full width */}
            <div className={`experience-layout${experienceScene ? '' : ' experience-layout--solo'}`}>
              <div className="experience-left">
                <SectionHeading id="experience-heading" {...experienceHeading} />
                <Reveal delay={0.05}>
                  <p className="experience-intro">{experienceIntro}</p>
                </Reveal>

                {experienceScene && (
                  <Reveal className="experience-visual" delay={0.1}>
                    <div className="experience-scene" style={{ '--scene-blue': sceneGlowBlue }}>
                      <span className="experience-glow" aria-hidden="true" />
                      <img
                        className="experience-scene-img"
                        src={experienceScene}
                        alt=""
                        aria-hidden="true"
                        width={experienceSceneSize.width}
                        height={experienceSceneSize.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </Reveal>
                )}
              </div>

              <div className="experience-right">
                {/* Segmented switch: a real tablist, arrow keys move between the tabs */}
                <div
                  className="exp-tabs"
                  role="tablist"
                  aria-label="Experience or education"
                  data-tab={tab}
                  onKeyDown={onTabKeyDown}
                >
                  <span className="exp-tabs-thumb" aria-hidden="true" />
                  {experienceTabs.map(({ id, label }, index) => (
                    <button
                      key={id}
                      ref={(element) => {
                        tabRefs.current[index] = element
                      }}
                      type="button"
                      role="tab"
                      id={`experience-tab-${id}`}
                      className="exp-tab"
                      aria-selected={tab === id}
                      aria-controls="experience-panel"
                      tabIndex={tab === id ? 0 : -1}
                      onClick={() => setTab(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div id="experience-panel" role="tabpanel" aria-labelledby={`experience-tab-${tab}`}>
                  {/* The timeline element stays put (it holds the line); only the list inside it crossfades */}
                  <div ref={timelineRef} className="exp-timeline">
                    <span className="exp-line" aria-hidden="true">
                      <span className="exp-line-fill" />
                    </span>

                    <AnimatePresence mode="wait" initial={false}>
                      <m.ol
                        key={tab}
                        className="exp-list"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        {items.map((item, index) => (
                          <li key={item.id} className="exp-item">
                            <span className="exp-node timeline-node" aria-hidden="true" />
                            <Reveal delay={index * 0.08}>
                              <TimelineCard item={item} kind={tab === 'experience' ? 'work' : 'education'} />
                            </Reveal>
                          </li>
                        ))}

                        {tab === 'experience' && (
                          <li className="exp-item exp-item--end">
                            <span className="exp-node timeline-node" aria-hidden="true" />
                            <Reveal delay={items.length * 0.08}>
                              <KeySkills skills={keySkills} />
                            </Reveal>
                          </li>
                        )}
                      </m.ol>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: the stats (only the ones with a value), a gold line, and the call to action */}
            <div className="exp-bottom">
              {shownStats.length > 0 && (
                <ul className="exp-stats">
                  {shownStats.map((stat) => (
                    <Stat key={stat.label} {...stat} />
                  ))}
                </ul>
              )}
              <span className="exp-bottom-line" aria-hidden="true" />
              <a
                className="exp-cta"
                href={experienceCta.href}
                onClick={experienceCta.href === '#contact' ? focusContactName : undefined}
              >
                <span>{experienceCta.label}</span>
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  )
}
