import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa6'
import { getProjectImages } from '../data/projectImages'
import useReveal from '../hooks/useReveal'
import GlassCard from './ui/GlassCard'
import TechChips from './ui/TechChips'
import ProjectCover from './ProjectCover'
import ProjectLinks from './ProjectLinks'
import ProjectTitle from './ProjectTitle'
import './FeaturedProject.css'

// A faint ECG line across the cover (for a project with `motif: 'heartbeat'`). It is drawn left to right
// once, the first time the cover scrolls into view; under reduced motion it is simply there.
function Heartbeat() {
  return (
    <svg className="featured-heartbeat" viewBox="0 0 480 140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        pathLength="1"
        d="M0 76 H120 L140 76 L158 34 L182 118 L206 54 L224 76 H300 L318 76 L334 48 L352 94 L368 76 H480"
      />
    </svg>
  )
}

// The wide card at the top: a border and outer glow in the project's accentColor, the text on the left and
// the cover on the right, blended into the card with a fade from its left edge.
//   <FeaturedProject project={project} />
export default function FeaturedProject({ project }) {
  const { id, title, titleAccent, subtitle, description, tech, accentColor, motif } = project
  const { cover } = getProjectImages(project)
  const [mediaRef, , drawn] = useReveal({ threshold: 0.3 })

  return (
    <GlassCard
      as="article"
      className="featured"
      style={{ '--project-color': accentColor }}
      aria-labelledby={`featured-${id}-title`}
    >
      <div className="featured-body">
        <p className="featured-pill">
          <FaStar aria-hidden="true" />
          Featured Project
        </p>

        <h3 className="featured-title" id={`featured-${id}-title`}>
          <Link className="featured-open" to={`/projects/${id}`}>
            <ProjectTitle title={title} accent={titleAccent} />
          </Link>
        </h3>
        <p className="featured-sub">{subtitle}</p>
        <p className="featured-desc">{description}</p>

        <TechChips names={tech} aria-label="Technologies" />

        <ProjectLinks project={project} variant="featured" />
      </div>

      <div ref={mediaRef} className={`featured-media${drawn ? ' is-drawn' : ''}`}>
        <ProjectCover project={project} src={cover} />
        {motif === 'heartbeat' && <Heartbeat />}
      </div>
    </GlassCard>
  )
}
