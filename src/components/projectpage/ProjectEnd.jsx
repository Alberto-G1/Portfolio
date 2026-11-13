import { Link } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaPaperPlane } from 'react-icons/fa6'
import { categoryLabel, projects } from '../../data/projects'
import { getProjectImages } from '../../data/projectImages'
import { contactColors } from '../../data/site'
import GlassCard from '../ui/GlassCard'
import Reveal from '../ui/Reveal'
import Swoosh from '../ui/Swoosh'
import ProjectCover from '../ProjectCover'
import ProjectTitle from '../ProjectTitle'
import SectionLink from '../SectionLink'
import './ProjectEnd.css'

// One of the two big cards at the bottom: the neighbouring project's cover as a dimmed background (it brightens and zooms a
// little on hover), the label with an arrow that slides, and the project's title (its accent word in its own colour)
// and subtitle.
function NeighbourCard({ project, direction }) {
  const { id, title, titleAccent, subtitle, categories, accentColor } = project
  const { cover } = getProjectImages(project)
  const previous = direction === 'previous'

  return (
    <Link className={`pd-nb pd-nb--${direction}`} to={`/projects/${id}`} style={{ '--project-color': accentColor }}>
      <span className="pd-nb-bg" aria-hidden="true">
        <ProjectCover project={project} src={cover} />
      </span>
      <span className="pd-nb-shade" aria-hidden="true" />
      <span className="pd-nb-body">
        <span className="pd-nb-label">
          {previous && <FaArrowLeft aria-hidden="true" />}
          {previous ? 'Previous Project' : 'Next Project'}
          {!previous && <FaArrowRight aria-hidden="true" />}
        </span>
        <span className="pd-nb-title">
          <ProjectTitle title={title} accent={titleAccent} />
        </span>
        <span className="pd-nb-sub">{subtitle || categoryLabel(categories[0])}</span>
      </span>
    </Link>
  )
}

// "Previous Project" and "Next Project": the neighbours in the project list. It wraps round: the last project's Next is
// the first, and the first project's Previous is the last.
export function NextPrevious({ project }) {
  const count = projects.length
  if (count < 2) return null
  const index = projects.findIndex((item) => item.id === project.id)
  const previous = projects[(index - 1 + count) % count]
  const next = projects[(index + 1) % count]

  return (
    <nav className="pd-nbs" aria-label="More projects">
      <Reveal>
        <NeighbourCard project={previous} direction="previous" />
      </Reveal>
      <Reveal delay={0.1}>
        <NeighbourCard project={next} direction="next" />
      </Reveal>
    </nav>
  )
}

// A wide glass banner with the animated blue/gold neon border of the contact form, and gold swooshes in its corners.
// "Let's Talk" goes to the contact form on the home page and puts the cursor in its Name field.
export function CtaBanner() {
  return (
    <Reveal className="pd-cta" style={{ '--contact-blue': contactColors.blue }}>
      <span className="neon-glow pd-cta-halo" aria-hidden="true" />
      <GlassCard as="section" className="pd-cta-card neon neon--spin" aria-labelledby="pd-cta-title">
        <Swoosh side="left" className="pd-cta-swoosh" />
        <Swoosh side="right" className="pd-cta-swoosh" />
        <h2 id="pd-cta-title" className="pd-cta-title">
          Have a similar <span className="accent">project</span> in mind?
        </h2>
        <p className="pd-cta-text">Let&apos;s discuss how I can help bring your idea to life.</p>
        <SectionLink id="contact" state={{ focusContact: true }} className="pd-cta-btn">
          <FaPaperPlane aria-hidden="true" />
          Let&apos;s Talk
        </SectionLink>
      </GlassCard>
    </Reveal>
  )
}
