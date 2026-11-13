import { useId, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, m } from 'framer-motion'
import { FaChevronDown, FaFolderOpen } from 'react-icons/fa6'
import { horseWatermark } from '../data/heroArt'
import { projectFilters, projects, projectsHeading, projectsIntro } from '../data/projects'
import useGridColumns from '../hooks/useGridColumns'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import loadMotionFeatures from '../utils/loadMotionFeatures'
import DotGrid from './ui/DotGrid'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Swoosh from './ui/Swoosh'
import FeaturedProject from './FeaturedProject'
import ProjectCard from './ProjectCard'
import './Projects.css'

const INITIAL_COUNT = 4 // cards shown before "Explore All Projects" (3 where the grid has 3 columns: a full row, no orphan)

const matchesFilter = (project, filter) => filter === 'all' || project.categories.includes(filter)

// The grid cards fade and scale in (when scrolled into view, and whenever a filter brings them back) and
// out, and slide to their new place when the others change (layout). The index staggers a row. For
// prefers-reduced-motion nothing is hidden waiting to be scrolled to: cards just fade (opacity only) at once.
const cardMotion = (index, reduceMotion) =>
  reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.94, transition: { duration: 0.22 } },
        viewport: { once: true, margin: '0px 0px -6% 0px' },
        transition: {
          default: { duration: 0.5, delay: (index % 4) * 0.07 },
          layout: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        },
      }

// Layout animations (cards sliding to their new place) are switched off for reduced motion with the `layout`
// prop below: Framer Motion's own `reducedMotion="user"` only covers transform animations, not these.

// The featured card, the same idea.
const featuredMotion = (reduceMotion) =>
  reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12, transition: { duration: 0.22 } },
        viewport: { once: true, margin: '0px 0px -6% 0px' },
        transition: { duration: 0.6, delay: 0.1 },
      }

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const columns = useGridColumns()
  const reduceMotion = usePrefersReducedMotion()
  const gridId = useId()
  const gridRef = useRef(null)

  // The first featured project that matches the filter goes in the big card; the rest go in the grid.
  const featured = projects.find((project) => project.featured && matchesFilter(project, filter))
  const rest = projects.filter((project) => project !== featured && matchesFilter(project, filter))
  const initialCount = columns === 3 ? 3 : INITIAL_COUNT
  const canExpand = rest.length > initialCount
  const visible = expanded ? rest : rest.slice(0, initialCount)
  const total = rest.length + (featured ? 1 : 0)
  const filterLabel = projectFilters.find((item) => item.id === filter)?.label

  const toggleExpanded = () => {
    // Collapsing from far down the page: bring the top of the grid back into view instead of leaving the
    // visitor stranded below the (now shorter) page.
    if (expanded && gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY
      if (window.scrollY > top - 140) window.scrollTo({ top: Math.max(0, top - 180) })
    }
    setExpanded((value) => !value)
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures}>
        <section id="projects" className="projects" aria-labelledby="projects-heading">
          {/* Decoration, all behind the content: faint horse watermark (optional file), dot grids, gold swooshes */}
          <div className="projects-decor" aria-hidden="true">
            {horseWatermark && <img className="projects-watermark" src={horseWatermark} alt="" />}
            <DotGrid className="projects-dots projects-dots--top" />
            <DotGrid className="projects-dots projects-dots--middle" />
            <Swoosh side="left" className="projects-swoosh" />
            <Swoosh side="right" className="projects-swoosh" />
          </div>

          <div className="projects-container">
            <LayoutGroup>
              <div className="projects-top">
                <div className="projects-heading-col">
                  <SectionHeading id="projects-heading" {...projectsHeading} />
                  <Reveal delay={0.05}>
                    <p className="projects-intro">{projectsIntro}</p>
                  </Reveal>
                </div>

                <div className="projects-feature-col">
                  <Reveal delay={0.1}>
                    <div className="projects-filters" role="group" aria-label="Filter projects by category">
                      {projectFilters.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          className={`projects-filter${filter === id ? ' is-active' : ''}`}
                          aria-pressed={filter === id}
                          onClick={() => setFilter(id)}
                        >
                          <Icon aria-hidden="true" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </Reveal>

                  <AnimatePresence>
                    {featured && (
                      <m.div key={featured.id} className="projects-featured" {...featuredMotion(reduceMotion)}>
                        <FeaturedProject project={featured} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Read out when the filter changes */}
              <p className="visually-hidden" role="status">
                {total === 0
                  ? `No projects in ${filterLabel}.`
                  : `Showing ${total} ${total === 1 ? 'project' : 'projects'}${filter === 'all' ? '' : ` in ${filterLabel}`}.`}
              </p>

              <div className="projects-results">
                {total === 0 && (
                  <m.div
                    className="projects-empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FaFolderOpen aria-hidden="true" />
                    <h3>Nothing here yet</h3>
                    <p>There are no {filterLabel} projects to show right now, but there is plenty in the other categories.</p>
                    <button type="button" className="projects-empty-btn" onClick={() => setFilter('all')}>
                      Show all projects
                    </button>
                  </m.div>
                )}

                {rest.length > 0 && (
                  <ul id={gridId} ref={gridRef} className="projects-grid" aria-label="Projects">
                    <AnimatePresence mode="popLayout">
                      {visible.map((project, index) => (
                        <m.li key={project.id} className="projects-grid-item" layout={!reduceMotion} {...cardMotion(index, reduceMotion)}>
                          <ProjectCard project={project} />
                        </m.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}

                {canExpand && (
                  <m.div className="projects-more" layout={reduceMotion ? false : 'position'}>
                    <button
                      type="button"
                      className="projects-more-btn"
                      aria-expanded={expanded}
                      aria-controls={gridId}
                      onClick={toggleExpanded}
                    >
                      <span>{expanded ? 'Show Less' : 'Explore All Projects'}</span>
                      <FaChevronDown aria-hidden="true" />
                    </button>
                  </m.div>
                )}
              </div>
            </LayoutGroup>
          </div>

        </section>
      </LazyMotion>
    </MotionConfig>
  )
}
