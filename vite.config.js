import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { SITE_URL } from './src/data/siteUrl.js'

// The plain-HTML copy of the portfolio that scripts/generate-seo.mjs writes (see index.html). Without it (a fresh
// clone that has not run the script yet) a short sentence takes its place.
const FALLBACK = '<p>Nuwarinda Albert is a computer scientist and software developer in Kampala, Uganda. This portfolio needs JavaScript to run.</p>'
const staticContentFile = fileURLToPath(new URL('./scripts/static-content.html', import.meta.url))
const staticContent = () => (existsSync(staticContentFile) ? readFileSync(staticContentFile, 'utf8') : FALLBACK)

// Fills two things into index.html: the site's address wherever it says %SITE_URL% (canonical link, share-preview
// tags, structured data; the address lives in src/data/siteUrl.js) and the <!--STATIC_CONTENT--> marker.
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL).replace('<!--STATIC_CONTENT-->', staticContent),
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
})
