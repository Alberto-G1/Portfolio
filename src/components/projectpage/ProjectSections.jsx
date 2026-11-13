import { useId, useState } from 'react'
import {
  FaArrowRight,
  FaBolt,
  FaBookOpen,
  FaBrain,
  FaChevronDown,
  FaCircleCheck,
  FaDatabase,
  FaDiagramProject,
  FaDisplay,
  FaImages,
  FaLayerGroup,
  FaLightbulb,
  FaPuzzlePiece,
  FaScrewdriverWrench,
  FaServer,
  FaStar,
  FaTriangleExclamation,
  FaUserTie,
} from 'react-icons/fa6'
import GlassCard from '../ui/GlassCard'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import TechChips from '../ui/TechChips'
import './ProjectSections.css'

// The heading of each section of a project page: a gold-outlined pill label with an icon, then a heavy serif title with
// one word in the accent colour. (The gallery and architecture sections use these too, via <ProjectSection id=...>.)
const HEADINGS = {
  overview: { label: 'Overview', icon: FaBookOpen, title: 'The Story Behind It', accent: 'It' },
  features: { label: 'Key Features', icon: FaStar, title: 'What It Does', accent: 'Does' },
  gallery: { label: 'Gallery', icon: FaImages, title: 'Inside the Project', accent: 'Project' },
  architecture: { label: 'Architecture', icon: FaDiagramProject, title: "How It's Built", accent: 'Built' },
  tech: { label: 'Tech Stack', icon: FaLayerGroup, title: 'Tools Behind It', accent: 'It' },
  role: { label: 'My Role', icon: FaUserTie, title: 'What I Contributed', accent: 'Contributed' },
  challenges: { label: 'Challenges', icon: FaPuzzlePiece, title: 'Problems I Solved', accent: 'Solved' },
}

// <section id="..."> with its heading. The id is also what the sticky section nav links to.
export function ProjectSection({ id, children }) {
  return (
    <section id={id} className="pd-section" aria-labelledby={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} {...HEADINGS[id]} />
      {children}
    </section>
  )
}

// ---------- Overview: "The Problem" -> "The Solution" ----------
function StoryCard({ tone, icon: Icon, title, text }) {
  return (
    <GlassCard as="article" className={`pd-story-card pd-story-card--${tone}`}>
      <span className="pd-story-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3 className="pd-story-title">{title}</h3>
      <p>{text}</p>
    </GlassCard>
  )
}

export function Overview({ project }) {
  const { problem, solution, details, highlights = [] } = project

  // No problem / solution written: the longer description (and the highlights) tell the story instead
  if (!problem && !solution) {
    return (
      <ProjectSection id="overview">
        <Reveal>
          <GlassCard as="article" className="pd-about">
            <h3 className="pd-story-title">About this project</h3>
            <p>{details}</p>
            {highlights.length > 0 && (
              <ul className="pd-checks">
                {highlights.map((highlight) => (
                  <li key={highlight}>
                    <FaCircleCheck aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </Reveal>
      </ProjectSection>
    )
  }

  const both = Boolean(problem && solution)
  return (
    <ProjectSection id="overview">
      <Reveal className={`pd-story${both ? '' : ' pd-story--single'}`}>
        {problem && <StoryCard tone="bad" icon={FaTriangleExclamation} title="The Problem" text={problem} />}
        {both && (
          <span className="pd-story-arrow" aria-hidden="true">
            <FaArrowRight />
          </span>
        )}
        {solution && <StoryCard tone="good" icon={FaLightbulb} title="The Solution" text={solution} />}
      </Reveal>
    </ProjectSection>
  )
}

// ---------- Key Features ----------
export function Features({ features }) {
  return (
    <ProjectSection id="features">
      <ul className="pd-features">
        {features.map(({ icon: Icon = FaStar, title, text }, index) => (
          <Reveal as="li" key={title} delay={(index % 3) * 0.08} className="pd-feature-item">
            <GlassCard as="article" hover className="pd-feature">
              <span className="pd-feature-icon" aria-hidden="true">
                <Icon />
              </span>
              <h3 className="pd-feature-title">{title}</h3>
              <p>{text}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </ProjectSection>
  )
}

// ---------- Tech Stack ----------
const GROUP_ICONS = {
  Frontend: FaDisplay,
  Backend: FaServer,
  Database: FaDatabase,
  'AI / ML': FaBrain,
  'DevOps & Tools': FaScrewdriverWrench,
}

export function TechStack({ groups, tech }) {
  // without groups: one card with the flat list
  const cards = groups?.length ? groups : [{ group: 'Technologies', items: tech }]

  return (
    <ProjectSection id="tech">
      <ul className="pd-tech">
        {cards.map(({ group, items }, index) => {
          const Icon = GROUP_ICONS[group] ?? FaLayerGroup
          return (
            <Reveal as="li" key={group} delay={(index % 2) * 0.08} className="pd-tech-item">
              <GlassCard as="article" className="pd-tech-card">
                <header className="pd-tech-head">
                  <span className="pd-tech-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className="pd-tech-title">{group}</h3>
                </header>
                <TechChips names={items} size="lg" aria-label={`${group} technologies`} />
              </GlassCard>
            </Reveal>
          )
        })}
      </ul>
    </ProjectSection>
  )
}

// ---------- My Role: what I did (left), what I learned (right) ----------
export function Role({ contributions = [], learnings = [] }) {
  const both = contributions.length > 0 && learnings.length > 0

  return (
    <ProjectSection id="role">
      <div className={`pd-role${both ? '' : ' pd-role--single'}`}>
        {contributions.length > 0 && (
          <Reveal>
            <ul className="pd-contrib" aria-label="What I contributed">
              {contributions.map((item) => (
                <li key={item} className="pd-contrib-row">
                  <FaCircleCheck aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {learnings.length > 0 && (
          <Reveal delay={0.1}>
            <GlassCard as="aside" className="pd-learned" aria-labelledby="pd-learned-title">
              <h3 id="pd-learned-title" className="pd-learned-title">
                <FaBolt aria-hidden="true" />
                What I Learned
              </h3>
              <ul className="pd-checks">
                {learnings.map((item) => (
                  <li key={item}>
                    <FaCircleCheck aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        )}
      </div>
    </ProjectSection>
  )
}

// ---------- Challenges: an accordion ----------
function ChallengeItem({ number, title, text, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <GlassCard as="div" className={`pd-chal${open ? ' is-open' : ''}`}>
      <h3 className="pd-chal-head">
        <button type="button" className="pd-chal-btn" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen((value) => !value)}>
          <span className="pd-chal-num" aria-hidden="true">
            {String(number).padStart(2, '0')}
          </span>
          <span className="pd-chal-title">{title}</span>
          <FaChevronDown className="pd-chal-chevron" aria-hidden="true" />
        </button>
      </h3>
      {/* grid-rows 0fr -> 1fr animates the height; inert keeps the closed text out of Tab and screen readers */}
      <div id={`${id}-panel`} className="pd-chal-panel" role="region" aria-label={title} inert={!open}>
        <div className="pd-chal-inner">
          <p>{text}</p>
        </div>
      </div>
    </GlassCard>
  )
}

export function Challenges({ challenges }) {
  return (
    <ProjectSection id="challenges">
      <ul className="pd-chals">
        {challenges.map((challenge, index) => (
          <Reveal as="li" key={challenge.title} delay={index * 0.06}>
            <ChallengeItem number={index + 1} defaultOpen={index === 0} {...challenge} />
          </Reveal>
        ))}
      </ul>
    </ProjectSection>
  )
}
