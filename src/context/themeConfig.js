// Shared constants and helpers for the theme system. The inline script in
// index.html repeats the storage/colour logic so it can run before the bundle
// loads; keep the two in step.

export const STORAGE_KEY = 'portfolio-theme'
export const MODES = ['light', 'dark', 'system']
export const DEFAULT_MODE = 'system'
export const COLOR_NAMES = ['accent', 'heading', 'hover']

// Every preset sets accent, heading and hover for both modes. Accent and hover are
// used as text too, but theme.css darkens them for text in light mode
// (--accent-text / --hover-text), so any pick stays readable.
// The first preset is the site default; keep it in step with theme.css.
export const PRESETS = [
  {
    name: 'Navy & Gold',
    light: { accent: '#e09b00', heading: '#0f1a45', hover: '#ffb800' },
    dark: { accent: '#ffb800', heading: '#ffffff', hover: '#ffc93c' },
  },
  {
    name: 'Classic Blue',
    light: { accent: '#1e40af', heading: '#0f172a', hover: '#2563eb' },
    dark: { accent: '#60a5fa', heading: '#f1f5f9', hover: '#93c5fd' },
  },
  {
    name: 'Emerald',
    light: { accent: '#065f46', heading: '#0c1a16', hover: '#047857' },
    dark: { accent: '#34d399', heading: '#f0fdf9', hover: '#6ee7b7' },
  },
  {
    name: 'Teal',
    light: { accent: '#0f766e', heading: '#0a1f1e', hover: '#0d9488' },
    dark: { accent: '#2dd4bf', heading: '#f0fdfa', hover: '#5eead4' },
  },
  {
    name: 'Royal Purple',
    light: { accent: '#5b21b6', heading: '#16102b', hover: '#7c3aed' },
    dark: { accent: '#a78bfa', heading: '#f5f3ff', hover: '#c4b5fd' },
  },
  {
    name: 'Crimson',
    light: { accent: '#9f1239', heading: '#1c0f13', hover: '#be123c' },
    dark: { accent: '#fb7185', heading: '#fff1f2', hover: '#fda4af' },
  },
  {
    name: 'Amber/Gold',
    light: { accent: '#92400e', heading: '#1c1408', hover: '#b45309' },
    dark: { accent: '#fbbf24', heading: '#fffbeb', hover: '#fcd34d' },
  },
  {
    name: 'Slate',
    light: { accent: '#3f5f7f', heading: '#111827', hover: '#4f759b' },
    dark: { accent: '#8fa9c4', heading: '#f1f5f9', hover: '#b5c9de' },
  },
]

// Must match the fallback values in styles/theme.css (the "Navy & Gold" preset).
export const DEFAULT_COLORS = {
  light: PRESETS[0].light,
  dark: PRESETS[0].dark,
}

const HEX = /^#[0-9a-f]{6}$/i
export const isHex = (value) => typeof value === 'string' && HEX.test(value)

function channel(hex, start) {
  const c = parseInt(hex.slice(start, start + 2), 16) / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5)
}

const ON_LIGHT = '#ffffff'
const ON_DARK = '#0b1220'

// Text colour with the better contrast on top of the given background.
export function contrastColor(hex) {
  const bg = luminance(hex) + 0.05
  const withLight = 1.05 / bg
  const withDark = bg / (luminance(ON_DARK) + 0.05)
  return withDark >= withLight ? ON_DARK : ON_LIGHT
}

// Keep only well-formed values so a tampered or stale entry can't break styles.
function cleanColors(value) {
  const out = {}
  if (value && typeof value === 'object') {
    for (const name of COLOR_NAMES) {
      if (isHex(value[name])) out[name] = value[name].toLowerCase()
    }
  }
  return out
}

export function readStoredTheme() {
  const state = { mode: DEFAULT_MODE, overrides: { light: {}, dark: {} } }
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (saved && typeof saved === 'object') {
      if (MODES.includes(saved.mode)) state.mode = saved.mode
      state.overrides = {
        light: cleanColors(saved.overrides?.light),
        dark: cleanColors(saved.overrides?.dark),
      }
    }
  } catch {
    // Storage empty, blocked or corrupt: fall back to defaults.
  }
  return state
}

export function writeStoredTheme(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: the theme still works for this visit.
  }
}

// Writes the user's colours as inline variables on <html>; anything not
// overridden falls back to the stylesheet. --accent-contrast follows --accent.
export function applyColorVars(root, custom) {
  for (const name of COLOR_NAMES) {
    if (custom[name]) root.style.setProperty(`--${name}`, custom[name])
    else root.style.removeProperty(`--${name}`)
  }
  if (custom.accent) root.style.setProperty('--accent-contrast', contrastColor(custom.accent))
  else root.style.removeProperty('--accent-contrast')
}
