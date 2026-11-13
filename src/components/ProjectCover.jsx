import { useState } from 'react'
import { FaBrain, FaGlobe, FaLayerGroup, FaMobileScreenButton } from 'react-icons/fa6'
import { initialsOf } from '../utils/initials'
import './ProjectCover.css'

const categoryIcons = { fullstack: FaLayerGroup, ai: FaBrain, web: FaGlobe, mobile: FaMobileScreenButton }

// The project's picture in a fixed 16:10 frame (object-fit: cover). `src` is the cover image URL from
// projectImages.js. With no `src` (or a file that fails to load) it draws a generated cover instead: a gradient
// in the project's accentColor, a big faint icon of its main category and its initials. Never throws.
//   <ProjectCover project={project} src={images.cover} />
export default function ProjectCover({ project, src, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)

  if (src && failedSrc !== src) {
    return (
      <div className={`project-cover ${className}`.trim()}>
        <img
          className="project-cover-img"
          src={src}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      </div>
    )
  }

  const Icon = categoryIcons[project.categories?.[0]] ?? FaLayerGroup

  return (
    <div
      className={`project-cover project-cover--art ${className}`.trim()}
      style={{ '--project-color': project.accentColor }}
      aria-hidden="true"
    >
      <Icon className="project-cover-icon" />
      <span className="project-cover-initials">{project.initials || initialsOf(project.title)}</span>
    </div>
  )
}
