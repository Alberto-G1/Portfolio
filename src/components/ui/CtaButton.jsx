import { FaPaperPlane } from 'react-icons/fa6'
import { site } from '../../data/site'
import focusContactName from '../../utils/focusContactName'
import SectionLink from '../SectionLink'
import './CtaButton.css'

// The pill-shaped call-to-action. With no props it is the "Let's Talk" button (site.cta), coloured by
// --cta-bg / --cta-text. Options:
//   tone="gold"      solid gold (--accent) with navy text and a gold glow in BOTH modes
//   icon             the icon before the label (default: paper plane, which takes off on hover)
//   iconAfter        put `icon` after the label instead; it then slides right on hover
//   endIcon          an extra icon at the end (e.g. a chevron) that slides right on hover
//
//   <CtaButton href="#projects" label="View My Projects" tone="gold" endIcon={FaChevronRight} />
export default function CtaButton({
  className = '',
  onClick,
  href = site.cta.href,
  label = site.cta.label,
  icon: Icon = FaPaperPlane,
  iconAfter = false,
  endIcon: EndIcon,
  tone = 'default',
}) {
  // A button that goes to the contact section also puts the cursor in the form's Name field once it has arrived
  const handleClick = (event) => {
    onClick?.(event)
    if (href === '#contact') focusContactName()
  }

  const classes = [
    'cta-btn',
    iconAfter && 'cta-btn--arrow',
    EndIcon && 'cta-btn--end',
    tone === 'gold' && 'cta-btn--gold',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {!iconAfter && <Icon aria-hidden="true" />}
      <span>{label}</span>
      {iconAfter && <Icon aria-hidden="true" />}
      {EndIcon && <EndIcon className="cta-btn-end" aria-hidden="true" />}
    </>
  )

  // A link to a section of the home page works from every page; from a project page it also asks for the Name field
  // to be focused on arrival when the target is the contact form.
  if (href.startsWith('#')) {
    return (
      <SectionLink
        className={classes}
        id={href.slice(1)}
        state={href === '#contact' ? { focusContact: true } : undefined}
        onClick={handleClick}
      >
        {content}
      </SectionLink>
    )
  }

  return (
    <a className={classes} href={href} onClick={handleClick}>
      {content}
    </a>
  )
}
