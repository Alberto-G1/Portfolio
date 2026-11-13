import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaBuilding, FaCalendarDays, FaChartLine, FaUserTie, FaUsers } from 'react-icons/fa6'
import { horseWatermark } from '../data/heroArt'
import { categoryLabel, projects } from '../data/projects'
import { getProjectImages } from '../data/projectImages'
import { contactColors, site } from '../data/site'
import useCountUp from '../hooks/useCountUp'
import useDocumentMeta from '../hooks/useDocumentMeta'
import useReveal from '../hooks/useReveal'
import DotGrid from '../components/ui/DotGrid'
import GlassCard from '../components/ui/GlassCard'
import Swoosh from '../components/ui/Swoosh'
import TechChips from '../components/ui/TechChips'
import ProjectLinks from '../components/ProjectLinks'
import ProjectTitle from '../components/ProjectTitle'
import BrowserFrame from '../components/projectpage/BrowserFrame'
import { CtaBanner, NextPrevious } from '../components/projectpage/ProjectEnd'
import ProjectGallery, { ArchitectureFigure } from '../components/projectpage/ProjectGallery'
import { Challenges, Features, Overview, ProjectSection, Role, TechStack } from '../components/projectpage/ProjectSections'
import SectionNav from '../components/projectpage/SectionNav'
import NotFound from './NotFound'
import './ProjectDetails.css'

// One figure of the metrics row: an icon in the project colour, a large value that counts up the first time it
// scrolls into view (a value with no number just fades in with the card), and a muted label.
function Metric({ value, label, icon: Icon = FaChartLine }) {
  const [ref, reveal, seen] = useReveal({ threshold: 0.4, rootMargin: '0px' })
  const shown = useCountUp(String(value), seen)

  return (
    <GlassCard as="li" ref={ref} className={`pd-metric ${reveal}`}>
      <span className="pd-metric-icon" aria-hidden="true">
        <Icon />
      </span>
      <div>
        <p className="pd-metric-value">
          <span aria-hidden="true">{shown}</span>
          <span className="visually-hidden">{value}</span>
        </p>
        <p className="pd-metric-label">{label}</p>
      </div>
    </GlassCard>
  )
}

// The page of one project, /projects/<id>. Every section is drawn only if the project has the data for it (see the
// comment at the top of data/projects.js), so a project with just a title, a subtitle and its tech still gets a clean page.
function ProjectPage({ project }) {
  const {
    title,
    titleAccent,
    subtitle,
    description,
    categories,
    status,
    tech = [],
    accentColor,
    liveUrl,
    role,
    timeline,
    team,
    client,
    metrics = [],
    problem,
    solution,
    details,
    features = [],
    techGroups = [],
    contributions = [],
    challenges = [],
    learnings = [],
    captions = {},
  } = project
  const images = getProjectImages(project)

  useDocumentMeta({ title: `${title} | ${site.name}`, description })

  // The gallery: the cover first (if there is one), then the screenshots in filename order
  const slides = useMemo(() => {
    const list = []
    if (images.cover) list.push({ src: images.cover, alt: `Screenshot of ${title}`, caption: captions.cover ?? title })
    images.gallery.forEach(({ src, caption, file }, i) => {
      const text = captions[file] ?? caption
      list.push({ src, alt: text ? `Screenshot of ${title}: ${text}` : `Screenshot ${i + 1} of ${title}`, caption: text })
    })
    return list
  }, [images, captions, title])

  const has = {
    overview: Boolean(problem || solution || (details && details !== description)),
    features: features.length > 0,
    gallery: images.gallery.length > 0,
    architecture: Boolean(images.architecture),
    tech: techGroups.length > 0 || tech.length > 0,
    role: contributions.length > 0 || learnings.length > 0,
    challenges: challenges.length > 0,
  }
  const sections = [
    ['overview', 'Overview'],
    ['features', 'Features'],
    ['gallery', 'Gallery'],
    ['architecture', 'Architecture'],
    ['tech', 'Tech Stack'],
    ['role', 'My Role'],
    ['challenges', 'Challenges'],
  ]
    .filter(([id]) => has[id])
    .map(([id, label]) => ({ id, label }))

  const meta = [
    { label: 'Role', value: role, icon: FaUserTie },
    { label: 'Timeline', value: timeline, icon: FaCalendarDays },
    { label: 'Team', value: team, icon: FaUsers },
    { label: 'Client', value: client, icon: FaBuilding },
  ].filter((item) => item.value)

  // the fake address pill: the live site's domain, or the project's id
  let address = project.id
  try {
    if (liveUrl) address = new URL(liveUrl).hostname.replace(/^www\./, '')
  } catch {
    // not a valid URL: keep the id
  }

  return (
    <div
      className="pd"
      style={{ '--project-color': accentColor, '--pd-good': contactColors.ok, '--pd-bad': contactColors.error }}
    >
      <div className="pd-decor" aria-hidden="true">
        {horseWatermark && <img className="pd-watermark" src={horseWatermark} alt="" />}
        <DotGrid className="pd-dots pd-dots--top" />
        <DotGrid className="pd-dots pd-dots--middle" />
        <Swoosh side="left" className="pd-swoosh" />
        <Swoosh side="right" className="pd-swoosh" />
      </div>

      <div className="pd-container">
        {/* A. top bar */}
        <div className="pd-topbar">
          <nav aria-label="Breadcrumb">
            <ol className="pd-crumbs">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#projects' }}>Projects</Link>
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <Link className="pd-back" to={{ pathname: '/', hash: '#projects' }}>
            <FaArrowLeft aria-hidden="true" />
            Back to Projects
          </Link>
        </div>

        {/* B. hero */}
        <header className="pd-hero">
          <div className="pd-hero-text">
            <ul className="pd-pills pd-in" style={{ '--i': 0 }}>
              {categories.map((id) => (
                <li key={id} className="pd-pill">
                  {categoryLabel(id)}
                </li>
              ))}
              {status && (
                <li className={`pd-status${status === 'Live' ? ' pd-status--live' : ''}`}>
                  <span className="pd-status-dot" aria-hidden="true" />
                  {status}
                </li>
              )}
            </ul>

            <h1 className="pd-title pd-in" style={{ '--i': 1 }}>
              <ProjectTitle title={title} accent={titleAccent} />
            </h1>
            {subtitle && (
              <p className="pd-subtitle pd-in" style={{ '--i': 2 }}>
                {subtitle}
              </p>
            )}
            {description && (
              <p className="pd-intro pd-in" style={{ '--i': 3 }}>
                {description}
              </p>
            )}

            {tech.length > 0 && (
              <div className="pd-in" style={{ '--i': 4 }}>
                <TechChips names={tech} aria-label="Technologies" />
              </div>
            )}

            <div className="pd-in" style={{ '--i': 5 }}>
              <ProjectLinks project={project} variant="page" />
            </div>

            {meta.length > 0 && (
              <dl className="pd-meta pd-in" style={{ '--i': 6 }}>
                {meta.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="pd-meta-item">
                    <Icon aria-hidden="true" />
                    <div>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <BrowserFrame project={project} cover={images.cover} address={address} />
        </header>

        {/* C. metrics */}
        {metrics.length > 0 && (
          <ul className="pd-metrics" style={{ '--n': Math.min(metrics.length, 4) }} aria-label="Key figures">
            {metrics.map((metric) => (
              <Metric key={metric.label} {...metric} />
            ))}
          </ul>
        )}
      </div>

      {/* D. sticky section nav (only when there is something to jump between) */}
      {sections.length > 1 && <SectionNav sections={sections} />}

      <div className="pd-container pd-body">
        {has.overview && <Overview project={project} />}
        {has.features && <Features features={features} />}
        {has.gallery && (
          <ProjectSection id="gallery">
            <ProjectGallery title={title} slides={slides} color={accentColor} />
          </ProjectSection>
        )}
        {has.architecture && (
          <ProjectSection id="architecture">
            <ArchitectureFigure title={title} src={images.architecture} color={accentColor} />
          </ProjectSection>
        )}
        {has.tech && <TechStack groups={techGroups} tech={tech} />}
        {has.role && <Role contributions={contributions} learnings={learnings} />}
        {has.challenges && <Challenges challenges={challenges} />}

        {/* L. previous / next, M. call to action */}
        <NextPrevious project={project} />
        <CtaBanner />
      </div>
    </div>
  )
}

export default function ProjectDetails() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)
  // an id that doesn't exist is a 404
  if (!project) return <NotFound />
  return <ProjectPage key={project.id} project={project} />
}
