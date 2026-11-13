// Finds each project's pictures automatically: drop image files into src/assets/projects/<id>/ and they
// show up, no code changes.
//
//   src/assets/projects/redhope/cover.webp          the card image and the hero picture (cover.png / cover.jpg also work)
//   src/assets/projects/redhope/01.webp ...         gallery screenshots on the project page, in filename order
//                                                   (numbers sort naturally: 2 before 10; sub-folders count too)
//   src/assets/projects/redhope/architecture.svg    optional: the system diagram, shown in its own Architecture section
//                                                   instead of the gallery (.png / .webp / .svg / .avif / .jpg)
// Gallery captions: from the file name ("login-screen.jpg" -> "Login screen"), or set your own in the project's
// `captions` ({ '01.webp': 'Donor dashboard' }, keyed by the file name).
//
// Found with import.meta.glob, so a project with no folder or no files is fine: the build never breaks and
// the card draws a generated cover instead (ProjectCover.jsx).
//
// A folder belongs to a project when its name matches the project's id after tidying: lower-cased, anything
// in (brackets) dropped, other punctuation turned into "-". So `Medcare` is `medcare` and
// `glamazon(salon-app)` is `glamazon`. A project can point at a differently named folder with `imageFolder`.
// If a folder holds both cover.png and cover.webp the PNG wins (same rule as the photos, see heroArt.js).
//
// Every image under src/assets/projects is bundled (a glob can't know which projects exist), so big files
// there cost build size, and every screenshot a visitor opens is downloaded as is: save them as WebP.
const files = import.meta.glob('../assets/projects/**/*.{webp,png,jpg,jpeg,avif,svg,WEBP,PNG,JPG,JPEG,AVIF,SVG}', {
  eager: true,
  import: 'default',
})

const ROOT = '../assets/projects/'
const COVER_ORDER = ['png', 'webp', 'avif', 'jpg', 'jpeg']
const ARCHITECTURE_ORDER = ['png', 'webp', 'svg', 'avif', 'jpg', 'jpeg']
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export const folderKey = (name) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// "login-screen" -> "Login screen"; "01" -> "" (a pure number says nothing)
function captionFrom(stem) {
  const text = stem
    .replace(/^[\d\s._-]+/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

// folder key -> { covers: [{ ext, src }], diagrams: [{ ext, src }], shots: [{ rel, stem, file, src }] }
const folders = new Map()
for (const [path, src] of Object.entries(files)) {
  const parts = path.slice(ROOT.length).split('/')
  if (parts.length < 2) continue // a stray file straight in src/assets/projects
  const file = parts[parts.length - 1]
  const dot = file.lastIndexOf('.')
  const stem = file.slice(0, dot)
  const ext = file.slice(dot + 1).toLowerCase()
  const key = folderKey(parts[0])
  const entry = folders.get(key) ?? { covers: [], diagrams: [], shots: [] }
  folders.set(key, entry)
  if (parts.length === 2 && stem.toLowerCase() === 'cover') entry.covers.push({ ext, src })
  else if (parts.length === 2 && stem.toLowerCase() === 'architecture') entry.diagrams.push({ ext, src })
  else if (ext !== 'svg') entry.shots.push({ rel: parts.slice(1).join('/'), stem, file, src })
}

const cache = new Map()

// -> { cover: url | undefined, architecture: url | undefined, gallery: [{ src, caption, file }] }
// (gallery = every image except the cover and the architecture diagram; `file` is the file name, for `captions`)
export function getProjectImages(project) {
  const key = folderKey(project.imageFolder ?? project.id)
  if (cache.has(key)) return cache.get(key)

  const entry = folders.get(key)
  const cover = entry && COVER_ORDER.map((ext) => entry.covers.find((c) => c.ext === ext)).find(Boolean)?.src
  const architecture =
    entry && ARCHITECTURE_ORDER.map((ext) => entry.diagrams.find((d) => d.ext === ext)).find(Boolean)?.src
  const gallery = entry
    ? [...entry.shots]
        .sort((a, b) => collator.compare(a.rel, b.rel))
        .map(({ src, stem, file }) => ({ src, caption: captionFrom(stem), file }))
    : []

  const result = { cover, architecture, gallery }
  cache.set(key, result)
  return result
}
