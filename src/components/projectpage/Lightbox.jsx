import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6'
import './Lightbox.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const focusablesIn = (root) => [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0)

// A fullscreen picture viewer over a dark blurred backdrop.
//   <Lightbox slides={[{ src, alt, caption }]} index={2} onChange={setIndex} onClose={...} restoreFocus={...} />
// - role="dialog" aria-modal; everything behind is `inert` (Tab can't leave, screen readers skip it) and Tab wraps inside
//   as a fallback; the page can't scroll
// - Escape and a click outside the picture close it; Left / Right arrows, the arrow buttons and a swipe move through
//   the slides (with one slide there are no arrows); the caption and a "3 / 8" counter are shown
// - when it goes away, restoreFocus() puts focus back on whatever opened it
export default function Lightbox({ slides, index, onChange, onClose, restoreFocus, label = 'Image viewer', style }) {
  const count = slides.length
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const swipeStart = useRef(null)
  const slide = slides[index]

  const go = useCallback((step) => onChange((index + step + count) % count), [index, count, onChange])

  useEffect(() => {
    const root = document.getElementById('root')
    const html = document.documentElement
    const wasInert = root ? root.inert : false
    const previousOverflow = html.style.overflow
    if (root) root.inert = true
    html.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      if (root) root.inert = wasInert
      html.style.overflow = previousOverflow
      restoreFocus?.()
    }
  }, [restoreFocus])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight' && count > 1) {
        event.preventDefault()
        go(1)
      } else if (event.key === 'ArrowLeft' && count > 1) {
        event.preventDefault()
        go(-1)
      } else if (event.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const items = focusablesIn(dialog)
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (!dialog.contains(active)) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [count, go, onClose])

  const onPointerDown = (event) => {
    swipeStart.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start || count < 2) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div ref={dialogRef} className="lb" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} style={style}>
      <div className="lb-backdrop" aria-hidden="true" onClick={onClose} />

      <button ref={closeRef} type="button" className="lb-btn lb-close" aria-label="Close" onClick={onClose}>
        <FaXmark aria-hidden="true" />
      </button>

      {count > 1 && (
        <>
          <button type="button" className="lb-btn lb-arrow lb-arrow--prev" aria-label="Previous image" onClick={() => go(-1)}>
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="lb-btn lb-arrow lb-arrow--next" aria-label="Next image" onClick={() => go(1)}>
            <FaChevronRight aria-hidden="true" />
          </button>
        </>
      )}

      <figure className="lb-figure" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeStart.current = null)}>
        <img key={slide.src} className="lb-img" src={slide.src} alt={slide.alt} draggable={false} />
        <figcaption className="lb-caption" aria-live="polite">
          {slide.caption && <span>{slide.caption}</span>}
          {count > 1 && (
            <span className="lb-count">
              {index + 1} / {count}
            </span>
          )}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}
