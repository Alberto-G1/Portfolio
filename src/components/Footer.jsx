import { FaArrowUp, FaEnvelope, FaHandshake, FaLocationDot, FaWhatsapp } from 'react-icons/fa6'
import { site } from '../data/site'
import scrollToTop from '../utils/scrollToTop'
import Logo from './Logo'
import SectionLink from './SectionLink'
import SocialLinks from './SocialLinks'
import CtaButton from './ui/CtaButton'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const [emailName, emailHost] = site.email.split('@')

  return (
    <footer className="footer">
      {/* Decoration: glowing top edge and faint diagonal streaks (CSS only) */}
      <span className="footer-glow" aria-hidden="true" />
      <span className="footer-streak footer-streak--left" aria-hidden="true" />
      <span className="footer-streak footer-streak--right" aria-hidden="true" />

      <div className="footer-inner footer-main">
        {/* Who this is: logo, name, title, a short statement and the social links */}
        <div className="footer-brand">
          <div className="footer-id">
            <Logo className="footer-logo" alt="" />
            <div className="footer-id-text">
              <p className="footer-name">{site.name}</p>
              <p className="footer-role">{site.title}</p>
            </div>
          </div>
          <p className="footer-statement">{site.statement}</p>
          <SocialLinks className="footer-socials" />
        </div>

        <nav aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className="footer-title">
            Quick Links
          </h2>
          <ul className="footer-links">
            {site.navLinks.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <SectionLink className="footer-link" id={id}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Get In Touch</h2>
          <ul className="footer-contact">
            <li>
              <a className="footer-link" href={`mailto:${site.email}`}>
                <FaEnvelope aria-hidden="true" />
                <span>
                  {emailName}
                  <wbr />@{emailHost}
                </span>
              </a>
            </li>
            {site.whatsapp && (
              <li>
                <a className="footer-link" href={site.whatsapp.url} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden="true" />
                  <span>
                    {site.whatsapp.display}
                    <span className="visually-hidden"> on WhatsApp</span>
                  </span>
                </a>
              </li>
            )}
            <li className="footer-location">
              <FaLocationDot aria-hidden="true" />
              <span>{site.location}</span>
            </li>
          </ul>
        </div>

        <div className="footer-cta">
          <span className="footer-cta-badge" aria-hidden="true">
            <FaHandshake />
          </span>
          <h2 className="footer-cta-title">{site.footerCta.title}</h2>
          <p className="footer-cta-text">{site.footerCta.text}</p>
          <CtaButton />
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <button type="button" className="footer-top" onClick={scrollToTop}>
            Back to top
            <span className="footer-top-icon">
              <FaArrowUp aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
