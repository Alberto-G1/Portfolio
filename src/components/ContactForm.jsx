import { useEffect, useRef, useState } from 'react'
import {
  FaChevronRight,
  FaCircleCheck,
  FaCircleExclamation,
  FaCommentDots,
  FaEnvelope,
  FaPaperPlane,
  FaTableCellsLarge,
  FaUser,
} from 'react-icons/fa6'
import { contactForm, site } from '../data/site'
import useContactForm, { LIMITS } from '../hooks/useContactForm'
import GlassCard from './ui/GlassCard'
import './ContactForm.css'

// One input: an icon on the left, a real <label> that floats (it sits where a placeholder would and moves up on focus or
// once there is text; the control keeps placeholder=" " so CSS can tell), and its error message underneath.
// The control comes first in the DOM so `:focus ~ label` works; aria-describedby / aria-invalid are on the control.
function Field({ icon: Icon, label, id, error, required, area, hint, children }) {
  return (
    <div className={`cf-field${area ? ' cf-field--area' : ''}${error ? ' has-error' : ''}`}>
      <div className="cf-control">
        <Icon className="cf-icon" aria-hidden="true" />
        {children}
        <label className="cf-label" htmlFor={id}>
          {label}
          {!required && <span className="visually-hidden"> (optional)</span>}
        </label>
        {hint}
      </div>
      {error && (
        <p className="cf-error" id={`${id}-error`}>
          <FaCircleExclamation aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

// The card with the form (name, email, subject, message), its status messages and the success panel.
// All the behaviour is in hooks/useContactForm.js.
export default function ContactForm() {
  const form = useContactForm()
  const { values, errors, status } = form
  const [panel, setPanel] = useState(false) // the "Thanks" panel, shown a moment after the button says "Message Sent!"
  const panelRef = useRef(null)
  const count = values.message.length

  // On success the button first shows "Message Sent!" (the form is already cleared), then the panel takes over.
  useEffect(() => {
    if (status !== 'success') return undefined
    const timer = setTimeout(() => setPanel(true), 1600)
    return () => clearTimeout(timer)
  }, [status])

  // Keyboard and screen-reader users land on the panel's heading instead of on nothing
  useEffect(() => {
    if (panel) panelRef.current?.focus()
  }, [panel])

  const sendAnother = () => {
    form.reset()
    setPanel(false)
    requestAnimationFrame(() => document.getElementById('contact-name')?.focus())
  }

  const busy = status === 'sending' || status === 'success'
  const label = { idle: 'Send Message', sending: 'Sending...', success: 'Message Sent!', error: 'Try Again' }[status]

  return (
    <GlassCard as="section" className="cf-card neon neon--spin" aria-labelledby="contact-form-title">
      <header className="cf-header">
        <span className="cf-header-icon" aria-hidden="true">
          <FaPaperPlane />
        </span>
        <div>
          <h3 id="contact-form-title" className="cf-title">
            {contactForm.title.replace(contactForm.accent, '')}
            <span className="accent">{contactForm.accent}</span>
          </h3>
          <p className="cf-subtitle">{contactForm.subtitle}</p>
          <span className="cf-bar" aria-hidden="true" />
        </div>
      </header>

      {panel ? (
        <div className="cf-success">
          <span className="cf-success-icon" aria-hidden="true">
            <FaCircleCheck />
          </span>
          <h4 ref={panelRef} tabIndex={-1} className="cf-success-title">
            Thanks, {form.sentName}!
          </h4>
          <p>I&apos;ll get back to you soon.</p>
          <button type="button" className="cf-again" onClick={sendAnother}>
            Send another
          </button>
        </div>
      ) : (
        <form className="cf-form" onSubmit={form.submit} noValidate aria-labelledby="contact-form-title">
          <div className="cf-row">
            <Field icon={FaUser} id="contact-name" label="Your Name" required error={errors.name}>
              <input type="text" className="cf-input" placeholder=" " autoComplete="name" aria-required="true" {...form.field('name')} />
            </Field>
            <Field icon={FaEnvelope} id="contact-email" label="Your Email" required error={errors.email}>
              <input
                type="email"
                inputMode="email"
                className="cf-input"
                placeholder=" "
                autoComplete="email"
                aria-required="true"
                {...form.field('email')}
              />
            </Field>
          </div>

          <Field icon={FaTableCellsLarge} id="contact-subject" label="Subject" error={errors.subject}>
            <input type="text" className="cf-input" placeholder=" " autoComplete="off" {...form.field('subject')} />
          </Field>

          <Field
            icon={FaCommentDots}
            id="contact-message"
            label="Your Message"
            required
            area
            error={errors.message}
            hint={
              <p className={`cf-count${count > LIMITS.messageMax ? ' is-over' : ''}`} id="contact-message-count">
                {count} / {LIMITS.messageMax}
                <span className="visually-hidden"> characters</span>
              </p>
            }
          >
            <textarea
              className="cf-input cf-textarea"
              rows={5}
              placeholder=" "
              autoComplete="off"
              aria-required="true"
              {...form.field('message', ['contact-message-count'])}
            />
          </Field>

          {/* Honeypot: invisible, unreachable by keyboard, ignored by screen readers. Anything typed here = a bot. */}
          <div className="cf-honeypot" aria-hidden="true">
            <label htmlFor="contact-botcheck">Leave this field empty</label>
            <input
              id="contact-botcheck"
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              value={values.botcheck}
              onChange={(event) => form.field('botcheck').onChange(event)}
            />
          </div>

          {status === 'error' && (
            <p className="cf-alert" role="alert">
              <FaCircleExclamation aria-hidden="true" />
              <span>
                Something went wrong. Please try again or email me directly:{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </span>
            </p>
          )}
          {form.notice && <p className="cf-notice">{form.notice}</p>}

          <div className="cf-actions">
            <button type="submit" className={`cf-send is-${status}`} disabled={busy} aria-disabled={busy}>
              {status === 'sending' && <span className="cf-spinner" aria-hidden="true" />}
              {status === 'success' && <FaCircleCheck className="cf-send-check" aria-hidden="true" />}
              {(status === 'idle' || status === 'error') && <FaPaperPlane className="cf-send-plane" aria-hidden="true" />}
              <span>{label}</span>
              {(status === 'idle' || status === 'error') && <FaChevronRight className="cf-send-chevron" aria-hidden="true" />}
            </button>
          </div>
        </form>
      )}

      {/* Status changes (validation, sending, sent, failed) are read out here */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {form.announcement}
      </p>
    </GlassCard>
  )
}
