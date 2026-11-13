import { useRef, useState } from 'react'
import { site } from '../data/site'

// Everything the Contact form does besides drawing itself: the field values, validation, the submit, and the
// status the button and the screen-reader announcements follow.
//
//   const form = useContactForm()
//   <form onSubmit={form.submit} noValidate>
//     <input {...form.field('name')} />            // id, name, value, ref, onChange, onBlur, aria-invalid, aria-describedby
//     <button disabled={form.status === 'sending'}>
//
// SENDING: a JSON POST to Web3Forms (https://api.web3forms.com/submit) with the access key from
// VITE_WEB3FORMS_KEY (see .env.example). With NO key it does not break: after validation the submit opens a mailto:
// link to site.email with the subject and message filled in (`usesMailto` is true, `notice` says what happened).
// SPAM: a hidden honeypot field, `botcheck`. A real visitor never sees or tabs to it; a submission with it filled in
// is rejected (nothing is sent, the form shows its error state).
// VALIDATION: on blur and on submit. A failed submit puts focus on the first invalid field. A field that already shows
// an error is re-checked as you type, so the message disappears the moment it is fixed.
// STATUS: 'idle' | 'sending' | 'success' | 'error'. Double submits are ignored while one is in flight.

const ENDPOINT = 'https://api.web3forms.com/submit'
const FIELDS = ['name', 'email', 'subject', 'message']
export const LIMITS = { nameMin: 2, messageMin: 10, messageMax: 2000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TIMEOUT_MS = 20000

const initial = { name: '', email: '', subject: '', message: '', botcheck: '' }

// -> an error message, or '' when the value is fine
export function validateField(name, raw) {
  const value = raw.trim()
  if (name === 'name') {
    if (!value) return 'Please enter your name.'
    if (value.length < LIMITS.nameMin) return `Your name needs at least ${LIMITS.nameMin} characters.`
  }
  if (name === 'email') {
    if (!value) return 'Please enter your email address.'
    if (!EMAIL.test(value)) return "That email address doesn't look right."
  }
  if (name === 'message') {
    if (!value) return 'Please write a message.'
    if (value.length < LIMITS.messageMin) return `Your message needs at least ${LIMITS.messageMin} characters.`
    if (raw.length > LIMITS.messageMax) return `Please keep your message under ${LIMITS.messageMax} characters.`
  }
  return ''
}

export default function useContactForm() {
  const key = import.meta.env.VITE_WEB3FORMS_KEY
  const usesMailto = !key

  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [sentName, setSentName] = useState('')
  const [notice, setNotice] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const fieldRefs = useRef({})
  const sending = useRef(false)

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
    if (status === 'error') setStatus('idle')
  }

  // Props for one input / textarea. `describedBy` adds ids (a hint, the character counter) to aria-describedby.
  const field = (name, describedBy = []) => {
    const ids = [...describedBy, errors[name] ? `contact-${name}-error` : null].filter(Boolean)
    return {
      id: `contact-${name}`,
      name,
      value: values[name],
      ref: (element) => {
        fieldRefs.current[name] = element
      },
      onChange: (event) => setValue(name, event.target.value),
      onBlur: () => setErrors((current) => ({ ...current, [name]: validateField(name, values[name]) })),
      'aria-invalid': errors[name] ? 'true' : undefined,
      'aria-describedby': ids.length ? ids.join(' ') : undefined,
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (sending.current || status === 'sending') return // no double submits

    const found = {}
    for (const name of FIELDS) {
      const message = validateField(name, values[name])
      if (message) found[name] = message
    }
    setErrors(found)
    const first = FIELDS.find((name) => found[name])
    if (first) {
      setNotice('')
      const count = Object.keys(found).length
      setAnnouncement(`${count} ${count === 1 ? 'field needs' : 'fields need'} attention. ${found[first]}`)
      fieldRefs.current[first]?.focus()
      return
    }

    // The honeypot: a human never fills it in
    if (values.botcheck) {
      setStatus('error')
      setAnnouncement('Your message could not be sent.')
      return
    }

    const name = values.name.trim()
    const email = values.email.trim()
    const subject = values.subject.trim()
    const message = values.message.trim()

    // No Web3Forms key: hand the message to the visitor's email app instead of failing
    if (usesMailto) {
      const mailSubject = subject || `New portfolio message from ${name}`
      const body = `${message}\n\n${name} <${email}>`
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`
      setNotice('Your email app should open with your message ready to send. If it does not, write to me directly.')
      setAnnouncement('Opening your email app with your message ready to send.')
      return
    }

    sending.current = true
    setStatus('sending')
    setNotice('')
    setAnnouncement('Sending your message.')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `New portfolio message from ${name}`,
          from_name: 'Portfolio Website',
          name,
          email,
          message,
          ...(subject && { message_subject: subject }),
          botcheck: '',
        }),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) throw new Error(data.message || 'Send failed')
      setSentName(name)
      setValues(initial)
      setErrors({})
      setStatus('success')
      setAnnouncement(`Message sent. Thanks, ${name}! I'll get back to you soon.`)
    } catch {
      setStatus('error')
      setAnnouncement('Something went wrong. Please try again or email me directly.')
    } finally {
      clearTimeout(timer)
      sending.current = false
    }
  }

  // "Send another": back to a clean form
  const reset = () => {
    setValues(initial)
    setErrors({})
    setStatus('idle')
    setNotice('')
    setAnnouncement('')
  }

  return { values, errors, status, sentName, notice, announcement, usesMailto, field, submit, reset }
}
