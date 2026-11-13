// "RedHope AI" -> "RH", "BamikaHub" -> "BH", "E-commerce Prototype" -> "EP", "Glamazon" -> "GL".
// Words are split on spaces and on lower-to-upper case changes; the first two give the letters. Anything
// after an en/em dash ("MultiChoice Uganda – Exquisite Solutions Ltd.") is ignored, so the main name decides.
export function initialsOf(text) {
  const main = text.split(/\s[–—-]\s/)[0]
  const parts = main
    .split(/\s+/)
    .flatMap((word) => word.replace(/([a-z])([A-Z])/g, '$1 $2').split(' '))
    .filter(Boolean)
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
  return main.slice(0, 2).toUpperCase()
}
