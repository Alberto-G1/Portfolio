import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  COLOR_NAMES,
  DEFAULT_COLORS,
  MODES,
  PRESETS,
  applyColorVars,
  isHex,
  readStoredTheme,
  writeStoredTheme,
} from './themeConfig'

const ThemeContext = createContext(null)

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystem(onChange) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getSystemDark = () => window.matchMedia(DARK_QUERY).matches

// Custom colours are stored per resolved mode, so a heading colour picked for
// light mode (say, near-black) is never carried over to dark mode.
export function ThemeProvider({ children }) {
  const [state, setState] = useState(readStoredTheme)
  const systemDark = useSyncExternalStore(subscribeToSystem, getSystemDark, () => false)

  const { mode, overrides } = state
  const resolvedMode = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useLayoutEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolvedMode)
    applyColorVars(root, overrides[resolvedMode])
  }, [resolvedMode, overrides])

  useEffect(() => {
    writeStoredTheme(state)
  }, [state])

  const setMode = useCallback((next) => {
    if (MODES.includes(next)) setState((s) => ({ ...s, mode: next }))
  }, [])

  const toggleMode = useCallback(() => {
    setState((s) => ({ ...s, mode: resolvedMode === 'dark' ? 'light' : 'dark' }))
  }, [resolvedMode])

  const setColor = useCallback(
    (name, value) => {
      if (!COLOR_NAMES.includes(name) || !isHex(value)) return
      setState((s) => ({
        ...s,
        overrides: {
          ...s.overrides,
          [resolvedMode]: { ...s.overrides[resolvedMode], [name]: value.toLowerCase() },
        },
      }))
    },
    [resolvedMode],
  )

  const applyPreset = useCallback((presetName) => {
    const preset = PRESETS.find((p) => p.name === presetName)
    if (!preset) return
    setState((s) => ({ ...s, overrides: { light: { ...preset.light }, dark: { ...preset.dark } } }))
  }, [])

  const resetColors = useCallback(() => {
    setState((s) => ({ ...s, overrides: { light: {}, dark: {} } }))
  }, [])

  const value = useMemo(() => {
    const effective = (m) => ({ ...DEFAULT_COLORS[m], ...overrides[m] })
    const activePreset =
      PRESETS.find((p) =>
        ['light', 'dark'].every((m) =>
          COLOR_NAMES.every((n) => effective(m)[n] === p[m][n]),
        ),
      )?.name ?? null

    return {
      mode,
      resolvedMode,
      setMode,
      toggleMode,
      colors: effective(resolvedMode),
      setColor,
      applyPreset,
      resetColors,
      presets: PRESETS,
      activePreset,
    }
  }, [mode, resolvedMode, overrides, setMode, toggleMode, setColor, applyPreset, resetColors])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
