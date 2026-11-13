import { Link } from 'react-router-dom'
import { categoryLabel } from '../data/projects'
import { getProjectImages } from '../data/projectImages'
import GlassCard from './ui/GlassCard'
import TechChips from './ui/TechChips'
import ProjectCover from './ProjectCover'
import ProjectLinks from './ProjectLinks'
import ProjectTitle from './ProjectTitle'
import './ProjectCard.css'

// One card of the project grid: cover (fading into the card), title, subtitle, up to 3 tech chips + "+N",
// and the link buttons. The whole card goes to the project's page (/projects/<id>): the title is a real link whose
// ::after stretches over the card (so keyboard and screen-reader users get one proper control), and the link
// buttons sit above that layer.
//   <ProjectCard project={project} />
export default function ProjectCard({ project }) {
  const { id, title, titleAccent, subtitle, tech, status, accentColor, categories } = project
  const { cover } = getProjectImages(project)

  return (
    <GlassCard as="article" hover className="project-card" style={{ '--project-color': accentColor }}>
      <div className="project-card-media">
        <ProjectCover project={project} src={cover} />
        {status && status !== 'Live' && <span className="project-status">{status}</span>}
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">
          <Link className="project-card-open" to={`/projects/${id}`}>
            <ProjectTitle title={title} accent={titleAccent} />
          </Link>
        </h3>
        <p className="project-card-sub">{subtitle || categoryLabel(categories[0])}</p>

        <TechChips names={tech} max={3} className="project-card-tech" aria-label="Technologies" />

        <ProjectLinks project={project} variant="card" />
      </div>
    </GlassCard>
  )
}
