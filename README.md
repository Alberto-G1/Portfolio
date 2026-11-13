# Nuwarinda Albert | Portfolio

Personal portfolio of Nuwarinda Albert, a computer scientist and software developer in Kampala, Uganda.
Built with **Vite + React** (plain JavaScript) and deployed on **Vercel**.

**Live:** <https://nuwarindaalbertgrandeportfolio.vercel.app>

## Features

- One-page home (Hero, About, Skills, Projects, Experience & Education, Contact) plus a dedicated page for every project (`/projects/<id>`)
- Light / dark mode and a live colour customizer with presets
- Project filters, galleries with a lightbox, and per-project detail pages
- Contact form (Web3Forms) with validation and a mailto fallback
- Downloadable CV, accessible by keyboard, respects `prefers-reduced-motion`
- SEO: Open Graph / X cards, JSON-LD, sitemap, robots.txt and a plain-HTML copy of the content for crawlers

## Tech

React 19, React Router 7, Framer Motion (lazy-loaded), react-icons, plain CSS (one file per component, theme variables), Vite 8, ESLint.

## Getting started

Requires Node.js 22 (see `engines` in `package.json`).

```bash
npm install
cp .env.example .env     # optional: add your Web3Forms key (see below)
npm run dev              # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run lint` | ESLint (must be clean) |
| `npm run build` | Production build into `dist/` (first refreshes the sitemap, robots.txt and static content) |
| `npm run preview` | Serves the production build locally |

### Contact form key

The form sends through [Web3Forms](https://web3forms.com). Put your access key in `.env` as `VITE_WEB3FORMS_KEY=...` (the file is git-ignored). Without a key the form still works by opening the visitor's email app.

## Project structure

```
index.html              Vite entry (meta tags, theme bootstrap, SEO placeholders)
vercel.json             Vercel build settings, SPA rewrite, redirects, headers
public/                 CV, icons, og-image, sitemap.xml, robots.txt
scripts/                generate-seo.mjs (runs before every build) + static-content.html
src/
  data/                 All the content: site, about, skills, projects, experience, logos
  components/           Sections, UI primitives (ui/), project page parts (projectpage/)
  pages/                Home, ProjectDetails, NotFound
  hooks/  utils/        Reusable behaviour
  styles/               theme.css (variables), global.css, neon.css
  assets/               Images that are bundled (originals/ is not bundled)
```

To change wording, links or projects, edit the files in `src/data/`. More detail on the conventions is in [CLAUDE.md](CLAUDE.md).

## Deployment

Pushing to `main` deploys to Vercel. Everything the host needs is in `vercel.json` and `package.json`. See [DEPLOYMENT.md](DEPLOYMENT.md) for the dashboard setting that is still manual (the Web3Forms key), the post-deploy checklist and troubleshooting.

The previous plain-HTML version of this portfolio is preserved in git history at the tag `html-portfolio-final`.

## Links

- GitHub: [Alberto-G1](https://github.com/Alberto-G1)
- LinkedIn: [Albert Nuwarinda](https://www.linkedin.com/in/albert-nuwarinda-129841351/)
