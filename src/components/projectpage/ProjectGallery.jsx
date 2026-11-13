import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa6'
import Lightbox from './Lightbox'
import './ProjectGallery.css'

// A picture that shows a shimmering skeleton until it has loaded (and is lazy: it only loads near the screen).
function LazyPicture({ src, alt, className = '', onSize }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <span className="pg-skeleton" aria-hidden="true" />}
      <img
        className={`${className}${loaded ? ' is-loaded' : ''}`.trim()}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={(event) => {
          setLoaded(true)
          onSize?.(event.currentTarget)
        }}
      />
    </>
  )
}

// Opens a Lightbox for the picture button that was clicked, and puts focus back on that button when it closes.
function useLightbox() {
  const [open, setOpen] = useState(false)
  const opener = useRef(null)
  const show = useCallback((event) => {
    opener.current = event.currentTarget
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const restoreFocus = useCallback(() => opener.current?.focus({ preventScroll: true }), [])
  return { open, show, close, restoreFocus }
}

// The gallery: a large viewer in a glass frame with the project's colour glowing round it, previous / next buttons
// at the sides, the caption and a "3 / 8" counter under it, and a row of thumbnails (the active one has a gold border;
// the row scrolls sideways). Swipe on touch; Left / Right arrows when the viewer is focused; clicking the picture opens
// it fullscreen in a Lightbox.
//   <ProjectGallery title="RedHope AI" slides={[{ src, alt, caption }]} color="#E11D48" />
export default function ProjectGallery({ title, slides, color }) {
  const [index, setIndex] = useState(0)
  const [portrait, setPortrait] = useState(false) // the shown picture is taller than wide (a phone screenshot)
  const lightbox = useLightbox()
  const stripRef = useRef(null)
  const thumbRefs = useRef([])
  const swipeStart = useRef(null)
  const count = slides.length
  const slide = slides[index]

  const go = useCallback((step) => setIndex((i) => (i + step + count) % count), [count])

  // keep the active thumbnail in view inside its row (the row scrolls, the page doesn't)
  useEffect(() => {
    const strip = stripRef.current
    const thumb = thumbRefs.current[index]
    if (strip && thumb) strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2 })
  }, [index])

  // fetch the neighbours so the next slide is instant
  useEffect(() => {
    if (count < 2) return
    for (const step of [1, -1]) {
      const image = new Image()
      image.src = slides[(index + step + count) % count].src
    }
  }, [index, count, slides])

  const onKeyDown = (event) => {
    if (count < 2) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
  }
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

  return (
    <div className="pg" role="group" aria-roledescription="carousel" aria-label={`${title} gallery`}>
      <div
        className="pg-viewer"
        tabIndex={0}
        aria-label="Gallery. Use the left and right arrow keys to change image."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        <button
          type="button"
          className={`pg-open${portrait ? ' pg-open--portrait' : ''}`}
          onClick={lightbox.show}
          aria-label={`Open full screen: ${slide.caption || slide.alt}`}
        >
          <LazyPicture
            key={slide.src}
            className="pg-img"
            src={slide.src}
            alt={slide.alt}
            onSize={(img) => setPortrait(img.naturalHeight > img.naturalWidth)}
          />
          <span className="pg-zoom" aria-hidden="true">
            <FaExpand />
          </span>
        </button>

        {count > 1 && (
          <>
            <button type="button" className="pg-arrow pg-arrow--prev" aria-label="Previous image" onClick={() => go(-1)}>
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="pg-arrow pg-arrow--next" aria-label="Next image" onClick={() => go(1)}>
              <FaChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="pg-meta">
        <p className="pg-caption" aria-live="polite">
          {slide.caption}
        </p>
        {count > 1 && (
          <p className="pg-count">
            {index + 1} / {count}
          </p>
        )}
      </div>

      {count > 1 && (
        <ul ref={stripRef} className="pg-thumbs" aria-label="Choose an image">
          {slides.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                ref={(element) => {
                  thumbRefs.current[i] = element
                }}
                className="pg-thumb"
                aria-label={`Show image ${i + 1} of ${count}${item.caption ? `: ${item.caption}` : ''}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <LazyPicture src={item.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox.open && (
        <Lightbox
          slides={slides}
          index={index}
          onChange={setIndex}
          onClose={lightbox.close}
          restoreFocus={lightbox.restoreFocus}
          label={`${title} gallery`}
          style={{ '--project-color': color }}
        />
      )}
    </div>
  )
}

// The architecture diagram in a glass frame; clicking it opens it in the Lightbox.
export function ArchitectureFigure({ title, src, color }) {
  const lightbox = useLightbox()
  const slides = [{ src, alt: `Architecture diagram of ${title}`, caption: 'Architecture' }]

  return (
    <figure className="pg-arch">
      <button type="button" className="pg-open pg-open--arch" onClick={lightbox.show} aria-label="Open the architecture diagram full screen">
        <LazyPicture className="pg-arch-img" src={src} alt={slides[0].alt} />
        <span className="pg-zoom" aria-hidden="true">
          <FaExpand />
        </span>
      </button>
      {lightbox.open && (
        <Lightbox
          slides={slides}
          index={0}
          onChange={() => {}}
          onClose={lightbox.close}
          restoreFocus={lightbox.restoreFocus}
          label="Architecture diagram"
          style={{ '--project-color': color }}
        />
      )}
    </figure>
  )
}
