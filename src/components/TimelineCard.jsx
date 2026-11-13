import { useId, useState } from 'react'
import { FaBriefcase, FaCalendarDays, FaChevronDown, FaCircleCheck, FaGraduationCap } from 'react-icons/fa6'
import { getLogo } from '../data/logos'
import { initialsOf } from '../utils/initials'
import GlassCard from './ui/GlassCard'
import './TimelineCard.css'

// The square panel on the card's left. A work entry shows its organisation's logo, contained and centred:
//   logoBg 'dark' (default)  navy panel, for logos with white lettering
//   logoBg 'light'           the logo sits on a white chip, for logos with dark lettering
// With no logo file (or one that fails to load) it draws the entry's icon in the accent colour plus the
// organisation's initials; an education entry with no crest gets a graduation-cap icon. The panel is decoration:
// the organisation's name is right beside it in the text.
function LogoPanel({ item, kind }) {
  const [failedSrc, setFailedSrc] = useState(null)

  const src = getLogo(item.logo)
  if (src && failedSrc !== src) {
    return (
      <div className={`exp-logo exp-logo--${item.logoBg === 'light' ? 'light' : 'dark'}`} aria-hidden="true">
        <span className="exp-logo-chip">
          <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
        </span>
      </div>
    )
  }

  if (kind === 'education') {
    return (
      <div className="exp-logo exp-logo--dark exp-logo--icon" aria-hidden="true">
        <FaGraduationCap />
      </div>
    )
  }

  const Icon = item.icon ?? FaBriefcase
  return (
    <div className="exp-logo exp-logo--dark exp-logo--icon" aria-hidden="true">
      <Icon />
      <span className="exp-logo-initials">{initialsOf(item.organisation)}</span>
    </div>
  )
}

// One card of the timeline, for an experience entry (kind="work": role, organisation, type badge, summary and a
// "Show details" button that opens the achievements) or an education entry (kind="education": award,
// institution, note, an optional "Current" badge). Reveals on scroll through a wrapper (the card itself moves on hover).
//   <TimelineCard item={entry} kind="work" />
export default function TimelineCard({ item, kind = 'work' }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const isWork = kind === 'work'

  const title = isWork ? item.role : item.award
  const subtitle = isWork ? item.organisation : item.institution
  const summary = isWork ? item.summary : item.note
  const achievements = isWork ? (item.achievements ?? []) : []
  const badge = isWork ? item.type : item.current ? 'Current' : null

  return (
    <GlassCard as="article" hover className="exp-card" aria-labelledby={`${id}-title`}>
      <LogoPanel item={item} kind={kind} />

      <div className="exp-titles">
        <div className="exp-role-row">
          <h3 id={`${id}-title`} className="exp-role">
            {title}
          </h3>
          {badge && <span className={`exp-badge${isWork ? '' : ' exp-badge--current'}`}>{badge}</span>}
        </div>
        <p className="exp-org">{subtitle}</p>
      </div>

      <p className="exp-date">
        <FaCalendarDays aria-hidden="true" />
        <span className="exp-date-text">
          <span>{item.start} –</span>
          <span>{item.end}</span>
        </span>
      </p>

      {summary && <p className="exp-summary">{summary}</p>}

      {achievements.length > 0 && (
        <>
          <button
            type="button"
            className="exp-toggle"
            aria-expanded={open}
            aria-controls={`${id}-details`}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? 'Hide details' : 'Show details'}</span>
            <FaChevronDown aria-hidden="true" />
          </button>

          {/* grid-rows 0fr -> 1fr animates the height; inert keeps the closed list out of Tab and screen readers */}
          <div id={`${id}-details`} className={`exp-details${open ? ' is-open' : ''}`} inert={!open}>
            <div className="exp-details-inner">
              <ul className="exp-achievements">
                {achievements.map((achievement) => (
                  <li key={achievement}>
                    <FaCircleCheck aria-hidden="true" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </GlassCard>
  )
}
