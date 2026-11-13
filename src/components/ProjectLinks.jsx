import { Link } from 'react-router-dom'
import { FaArrowRight, FaArrowUpRightFromSquare, FaGithub, FaLock } from 'react-icons/fa6'
import './ProjectLinks.css'

// The action buttons of a project, following the same rules everywhere (card, featured card, modal):
//   no liveUrl                    -> no "Live Demo"
//   codePrivate                   -> a muted, non-clickable "Private Code" pill with a lock (instead of View Code)
//   no codeUrl and not private    -> no "View Code"
//   external links open in a new tab with rel="noopener noreferrer"
//
// variant="card"      with no buttons at all it shows a plain "View Details" hint (the whole card is clickable),
//                     so a card without links still looks finished
// variant="featured"  always adds a "View Details" link to the project's page
// variant="page"      the project page's hero: only the buttons above (a little larger); nothing if there are none
export default function ProjectLinks({ project, variant = 'card' }) {
  const { id, title, liveUrl, codeUrl, codePrivate } = project
  const hasActions = Boolean(liveUrl || codePrivate || codeUrl)

  if (variant === 'page' && !hasActions) return null

  return (
    <div className={`project-links project-links--${variant}`}>
      {liveUrl && (
        <a
          className="project-btn project-btn--solid"
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title}: Live Demo (opens in a new tab)`}
        >
          <FaArrowUpRightFromSquare aria-hidden="true" />
          Live Demo
        </a>
      )}

      {codePrivate ? (
        <span className="project-btn project-btn--muted">
          <FaLock aria-hidden="true" />
          Private Code
        </span>
      ) : (
        codeUrl && (
          <a
            className="project-btn project-btn--outline"
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title}: View Code (opens in a new tab)`}
          >
            <FaGithub aria-hidden="true" />
            View Code
          </a>
        )
      )}

      {variant === 'featured' && (
        <Link className="project-btn project-btn--ghost" to={`/projects/${id}`}>
          View Details
          <FaArrowRight aria-hidden="true" />
        </Link>
      )}

      {variant === 'card' && !hasActions && (
        <span className="project-hint" aria-hidden="true">
          View Details
          <FaArrowRight />
        </span>
      )}
    </div>
  )
}
