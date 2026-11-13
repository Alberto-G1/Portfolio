// Organisation logos for the Experience section: drop a file into src/assets/logos/ and point an entry's
// `logo` at it by file name (`logo: 'multichoice.png'` in experience.js). Found with import.meta.glob, so a
// missing file never breaks the build: getLogo() just returns undefined and the card draws its fallback icon.
//
// The match is forgiving, so the file does not have to be named exactly as in the data:
//   - the extension is ignored (multichoice.png finds multichoice.webp too),
//   - case, spaces and punctuation are ignored, and a trailing "logo" is dropped,
//     so `multichoice`, `MultiChoiceLogo.png` and `Multi Choice Logo.webp` are all the same logo.
// If several files match, the PNG wins over WebP, AVIF, SVG, JPG (same rule as the photos in heroArt.js).
//
// Every file in src/assets/logos is bundled (a glob can't know which ones are used), so keep them small:
// they are shown about 100px wide. The shipped multichoice.webp / pahappa.webp are cropped, cleaned versions
// of the originals, which are kept in src/assets/originals/logos/.
const files = import.meta.glob('../assets/logos/*.{png,webp,avif,svg,jpg,jpeg,PNG,WEBP,AVIF,SVG,JPG,JPEG}', {
  eager: true,
  import: 'default',
})

const ORDER = ['png', 'webp', 'avif', 'svg', 'jpg', 'jpeg']

const stemOf = (name) => name.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '')
const extOf = (name) => (name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase()

export function logoKey(name) {
  const plain = stemOf(name).toLowerCase().replace(/[^a-z0-9]/g, '')
  const trimmed = plain.replace(/logo$/, '')
  return trimmed || plain // a file literally called "logo" keeps its name
}

const byKey = new Map()
for (const [path, url] of Object.entries(files)) {
  const key = logoKey(path)
  byKey.set(key, [...(byKey.get(key) ?? []), { ext: extOf(path), url }])
}

export function getLogo(name) {
  if (!name) return undefined
  const matches = byKey.get(logoKey(name))
  if (!matches) return undefined
  for (const ext of ORDER) {
    const hit = matches.find((m) => m.ext === ext)
    if (hit) return hit.url
  }
  return matches[0].url
}
