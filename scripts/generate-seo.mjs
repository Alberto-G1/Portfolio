// Runs by itself before every build (the "prebuild" script in package.json) and writes, from the site's own data:
//   public/sitemap.xml          the home page + every project page
//   public/robots.txt           allow everything, and where the sitemap is
//   scripts/static-content.html a plain-HTML copy of the portfolio's text (about, projects with real links, skills,
//                               experience, education, contact). vite.config.js puts it inside <noscript> in index.html,
//                               so crawlers, link unfurlers and AI tools that do NOT run JavaScript still read the
//                               content and can follow the project links. People with JavaScript never see it.
// The output only changes when the data or the address change, so all three files are committed.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

// The data files are written for Vite (extension-less imports, react-icons), so they are loaded through Vite too.
const vite = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})
const load = (path) => vite.ssrLoadModule(path)
const { SITE_URL } = await load('/src/data/siteUrl.js')
const { site, hasUrl } = await load('/src/data/site.js')
const { projects } = await load('/src/data/projects.js')
const { aboutParagraphs, heroTagline, roles } = await load('/src/data/about.js')
const { categories } = await load('/src/data/skills.js')
const { education, experience } = await load('/src/data/experience.js')
await vite.close()

// ---------- sitemap + robots
const urls = [`${SITE_URL}/`, ...projects.map((project) => `${SITE_URL}/projects/${project.id}`)]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

// ---------- the text version of the page
const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const link = (href, label) => `<a href="${esc(href)}">${esc(label)}</a>`
const period = (item) => [item.start, item.end].filter(Boolean).join(' - ')

const projectItems = projects.map((project) => {
  const subtitle = project.subtitle ? `, ${esc(project.subtitle)}` : ''
  const tech = project.tech?.length ? ` Built with ${esc(project.tech.join(', '))}.` : ''
  return `<li>${link(`${SITE_URL}/projects/${project.id}`, project.title)}${subtitle}. ${esc(project.description)}${tech}</li>`
})

const skillBlocks = categories.map((category) => `<h3>${esc(category.title)}</h3>\n<p>${esc(category.items.map((item) => item.name).join(', '))}</p>`)

const jobBlocks = experience.map(
  (job) => `<h3>${esc(job.role)}, ${esc(job.organisation)} (${esc(period(job))})</h3>
<p>${esc(job.summary)}</p>
<ul>
${job.achievements.map((line) => `  <li>${esc(line)}</li>`).join('\n')}
</ul>`,
)

const schoolItems = education.map(
  (item) => `<li>${esc(item.award)}, ${esc(item.institution)} (${esc(period(item))}).${item.note ? ` ${esc(item.note)}` : ''}</li>`,
)

const contactItems = [
  `<li>Email: ${link(`mailto:${site.email}`, site.email)}</li>`,
  ...site.socials.filter((s) => s.id !== 'email' && hasUrl(s)).map((s) => `<li>${esc(s.label)}: ${link(s.url, s.url)}</li>`),
  site.whatsapp ? `<li>WhatsApp: ${esc(site.whatsapp.display)}</li>` : '',
  `<li>Location: ${esc(site.location)}</li>`,
].filter(Boolean)

const staticContent = `<main style="max-width: 46rem; margin: 0 auto; padding: 1.5rem; font-family: system-ui, sans-serif; line-height: 1.6">
<h1>${esc(site.name)}: Computer Scientist and Software Developer in ${esc(site.location)}</h1>
<p>${esc(heroTagline)}</p>
<p>${esc(roles.join(', '))}. This portfolio is an interactive web app, so it needs JavaScript to look the way it is meant to; this is a plain-text copy of what it contains.</p>

<h2>About</h2>
${aboutParagraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}

<h2>Projects</h2>
<ul>
${projectItems.map((item) => `  ${item}`).join('\n')}
</ul>

<h2>Skills</h2>
${skillBlocks.join('\n')}

<h2>Experience</h2>
${jobBlocks.join('\n')}

<h2>Education</h2>
<ul>
${schoolItems.map((item) => `  ${item}`).join('\n')}
</ul>

<h2>Contact</h2>
<ul>
${contactItems.map((item) => `  ${item}`).join('\n')}
</ul>
</main>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemap)
writeFileSync(new URL('../public/robots.txt', import.meta.url), robots)
writeFileSync(new URL('./static-content.html', import.meta.url), staticContent)
console.log(`SEO files written for ${SITE_URL}: sitemap.xml (${urls.length} URLs), robots.txt, static-content.html (${staticContent.length} characters)`)
