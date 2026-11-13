import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  LuCheck,
  LuGem,
  LuLayoutGrid,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuRotateCcw,
  LuSparkles,
  LuSun,
  LuX,
} from 'react-icons/lu'
import { useTheme } from '../context/ThemeContext'
import { contrastColor } from '../context/themeConfig'
import './ThemeCustomizer.css'

const MODE_OPTIONS = [
  { value: 'light', label: 'Light', Icon: LuSun },
  { value: 'dark', label: 'Dark', Icon: LuMoon },
  { value: 'system', label: 'System', Icon: LuMonitor },
]

const COLOR_FIELDS = [
  { name: 'accent', label: 'Highlighted Words' },
  { name: 'heading', label: 'Headings' },
  { name: 'hover', label: 'Hover Effects' },
]

// A live sample of the colour next to its picker. The accent and heading samples read the page's own colour
// variables (they are the picked colours, and the accent text is the legible version of a bright accent); the hover
// sample is a filled chip, so its lettering is chosen for contrast.
function ColorPreview({ name, color }) {
  if (name === 'hover') {
    return (
      <span className="tc-preview tc-preview--hover" style={{ background: color, color: contrastColor(color) }}>
        Hover
      </span>
    )
  }
  return <span className={`tc-preview tc-preview--${name}`}>{name === 'heading' ? 'Heading' : 'Highlighted'}</span>
}

export default function ThemeCustomizer() {
  const {
    mode,
    setMode,
    resolvedMode,
    colors,
    setColor,
    presets,
    activePreset,
    applyPreset,
    resetColors,
  } = useTheme()

  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
  const wasOpen = useRef(false)
  const panelId = useId()

  const closePanel = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  // Focus moves into the panel on open. After an outside click the browser
  // moves focus itself (to the clicked control, or to <body>), so wait a tick
  // and only reclaim focus for the button if nothing took it.
  useEffect(() => {
    let timer
    if (open) {
      panelRef.current?.focus()
    } else if (wasOpen.current) {
      timer = setTimeout(() => {
        const active = document.activeElement
        if (!active || active === document.body) buttonRef.current?.focus()
      }, 0)
    }
    wasOpen.current = open
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const { target } = event
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePanel()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, closePanel])

  const label = open ? 'Close theme customizer' : 'Open theme customizer'
  const modeName = resolvedMode === 'dark' ? 'Dark Mode' : 'Light Mode'

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="tc-fab"
        onClick={() => (open ? closePanel() : setOpen(true))}
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        <LuPalette aria-hidden="true" />
      </button>

      {open && (
        <div ref={panelRef} id={panelId} className="tc-panel" role="dialog" aria-label="Theme customizer" tabIndex={-1}>
          <div className="tc-header">
            <span className="tc-header-icon" aria-hidden="true">
              <LuPalette />
            </span>
            <span className="tc-header-divider" aria-hidden="true" />
            <div className="tc-header-text">
              <h2 className="tc-title">Customize Theme</h2>
              <p className="tc-subtitle">Make it yours&hellip;</p>
            </div>
            <button type="button" className="tc-close" onClick={closePanel} aria-label="Close theme customizer">
              <LuX aria-hidden="true" />
            </button>
            <span className="tc-wave" aria-hidden="true" />
          </div>

          <div className="tc-body">
            <fieldset className="tc-group">
              <legend className="tc-label">
                <LuSun aria-hidden="true" />
                Mode
              </legend>
              <div className="tc-segmented">
                {MODE_OPTIONS.map(({ value, label: optionLabel, Icon }) => (
                  <button key={value} type="button" onClick={() => setMode(value)} aria-pressed={mode === value}>
                    <Icon aria-hidden="true" />
                    {optionLabel}
                  </button>
                ))}
              </div>
              {mode === 'system' && <p className="tc-hint">Following your device ({resolvedMode}).</p>}
            </fieldset>

            <fieldset className="tc-group">
              <legend className="tc-label">
                <LuLayoutGrid aria-hidden="true" />
                Presets
              </legend>
              <div className="tc-swatches">
                {presets.map((preset) => {
                  const c = preset[resolvedMode]
                  const active = activePreset === preset.name
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      className="tc-swatch"
                      style={{ '--sw-accent': c.accent, '--sw-hover': c.hover }}
                      onClick={() => applyPreset(preset.name)}
                      aria-pressed={active}
                      aria-label={preset.name}
                      title={preset.name}
                    >
                      {active && <LuCheck className="tc-swatch-check" aria-hidden="true" />}
                      {active && (
                        <span className="tc-badge" aria-hidden="true">
                          <LuCheck />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="tc-preset-name" aria-live="polite">
                <LuGem aria-hidden="true" />
                {activePreset ?? 'Custom'}
              </p>
            </fieldset>

            <hr className="tc-divider" />

            <fieldset className="tc-group">
              <legend className="tc-label">
                <LuPalette aria-hidden="true" />
                Colors <span className="tc-label-sub">({modeName})</span>
              </legend>
              {COLOR_FIELDS.map(({ name, label: fieldLabel }) => {
                const id = `${panelId}-${name}`
                return (
                  <div className="tc-color" key={name}>
                    <input
                      id={id}
                      type="color"
                      className="tc-color-input"
                      value={colors[name]}
                      onChange={(event) => setColor(name, event.target.value)}
                    />
                    <label htmlFor={id} className="tc-color-label">
                      <span>{fieldLabel}</span>
                      <code>{colors[name].toUpperCase()}</code>
                    </label>
                    <ColorPreview name={name} color={colors[name]} />
                  </div>
                )
              })}
            </fieldset>

            <button type="button" className="tc-reset" onClick={resetColors}>
              <LuRotateCcw aria-hidden="true" />
              Reset to Default
            </button>
          </div>

          <p className="tc-foot">
            <LuSparkles aria-hidden="true" />
            Beautiful. Modern. Yours.
          </p>
        </div>
      )}
    </>
  )
}
