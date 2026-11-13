# Deploying to Vercel

This portfolio is a **static site**: Vite compiles it into plain files in `dist/`, and Vercel serves them from its CDN.
There is no server to run. Every push to GitHub deploys it.

**Live address:** <https://nuwarindaalbertgrandeportfolio.vercel.app>. If you move to another address (a custom domain), change `SITE_URL` in `src/data/siteUrl.js`, commit and push. Link previews, the canonical link, the sitemap and robots.txt all read it.

**Repository:** `https://github.com/Alberto-G1/Portfolio` (the app is at the top level, so Vercel's **Root Directory** stays empty).

## What is already configured in the code

You do not need to set these in the Vercel dashboard. They live in the repo and win over the dashboard:

| Setting | Where | Value |
| --- | --- | --- |
| Framework | `vercel.json` | `vite` |
| Install command | `vercel.json` | `npm ci` (exact versions from `package-lock.json`) |
| Build command | `vercel.json` | `npm run build` (this first runs `prebuild`, which refreshes the sitemap, robots.txt and static content) |
| Output directory | `vercel.json` | `dist` |
| Node version | `package.json` `engines.node` | `22.x` (Vite 8 needs Node 20.19+ or 22.12+) |
| SPA fallback | `vercel.json` `rewrites` | every path except `/assets/*` serves `index.html`, so `/projects/redhope` works on refresh |
| Old-site redirects | `vercel.json` `redirects` | `/pages/*.html`, `/old.html` and `/my-resume/my-CV.pdf` (see below) |
| Caching | `vercel.json` `headers` | `/assets/*` is cached for a year (the file names are hashed); `index.html` is always revalidated |

Static files in `public/` (the CV, icons, `og-image.jpg`, `sitemap.xml`, `robots.txt`) are served as they are: Vercel checks for a real file before it applies the rewrite.

## The one thing to set in the dashboard

**`VITE_WEB3FORMS_KEY`** (the Contact form's access key). Your local `.env` is git-ignored, so it is **not** deployed.

1. Vercel dashboard, open the project, **Settings**, **Environment Variables**.
2. **Key:** `VITE_WEB3FORMS_KEY`, **Value:** your key from <https://web3forms.com>, tick **Production** and **Preview**, then **Save**.
3. **Deployments**, open the latest one, **...**, **Redeploy**. Vite bakes the key into the JavaScript **at build time**, so an existing deployment does not see a new variable until it is rebuilt.

Without the key the site still works: the form opens the visitor's email app instead of sending directly. (The key ends up in the public JavaScript. That is how Web3Forms is designed; it only lets people send mail to your inbox.)

Also worth a look, once, in **Settings**, **General**:

- **Framework Preset** should say **Vite** (it is overridden by `vercel.json` anyway; it was probably "Other" for the old HTML site).
- **Root Directory** is empty.
- **Settings**, **Git**, **Production Branch** is `main`.

## Before you push

From the project folder:

```bash
npm ci
npm run lint
npm run build
npm run preview     # open http://localhost:4173 and click around
```

## Releasing

- **Preview first (recommended):** push a branch. Vercel builds it at a temporary preview address (shown on the GitHub commit/PR, and under **Deployments**). Check it, then merge into `main`.
- **Production:** a push or merge to `main` deploys to the live address, usually in about a minute.
- **A deploy broke something:** **Deployments**, find an earlier good one, **...**, **Promote to Production** (or **Instant Rollback**). No git change needed.
- **Back to the old HTML portfolio:** the last commit of that site is tagged `html-portfolio-final` (`git checkout html-portfolio-final`).

## After it is live: check these

Open <https://nuwarindaalbertgrandeportfolio.vercel.app> and confirm:

- [ ] Home page loads, theme toggle and the palette button (customizer) work.
- [ ] Click a project, then **refresh the page** on `/projects/<name>`. It must still show the project (proves the rewrite works).
- [ ] Open a made-up address such as `/nothing-here`. You should see the site's own "not found" page.
- [ ] **Download CV** downloads the PDF.
- [ ] Old links still land somewhere sensible: `/pages/veloce.html` goes to `/projects/veloce`, `/my-resume/my-CV.pdf` gives the CV.
- [ ] Send a test message from the Contact form (check spam the first time).
- [ ] The browser tab shows your portrait favicon.
- [ ] `/sitemap.xml` and `/robots.txt` show the `vercel.app` address, and `/og-image.jpg` loads.
- [ ] Footer links (GitHub, LinkedIn, WhatsApp) open the right places.

You can also check the headers from a terminal:

```bash
curl -I https://nuwarindaalbertgrandeportfolio.vercel.app/projects/redhope     # 200
curl -I https://nuwarindaalbertgrandeportfolio.vercel.app/pages/veloce.html    # 308 to /projects/veloce
```

## Old URLs from the HTML portfolio

The old site's pages no longer exist, so `vercel.json` sends them (permanent redirect, 308) to their new homes:

| Old address | Goes to |
| --- | --- |
| `/pages/cornershop.html` | `/projects/ecommerce-prototype` |
| `/pages/glamazon.html` | `/projects/glamazon` |
| `/pages/jobquest.html` | `/projects/jobquest` |
| `/pages/veloce.html` | `/projects/veloce` |
| `/pages/coming-soon.html`, `/old.html` | `/` |
| `/my-resume/my-CV.pdf` | `/Nuwarinda_Albert_CV.pdf` |

Section links with a `#` (for example `/#portfolio`) cannot be redirected by a server; the sections are now `#about`, `#skills`, `#projects`, `#experience` and `#contact`. If you rename a project's `id` or the CV file, add a matching entry here.

## Link previews and search (SEO)

The site ships with a share image (`public/og-image.jpg`), Open Graph and X (Twitter) tags, a canonical link, structured data, `sitemap.xml` and `robots.txt`. The sitemap and robots file are rebuilt on every deploy. After the first deploy of this version:

1. **Refresh cached previews.** WhatsApp, Facebook and LinkedIn remember what they saw the first time a link was shared, so an old link may keep showing the old card until you refresh it:
   - Facebook and WhatsApp: <https://developers.facebook.com/tools/debug/>, paste your address, **Scrape Again**.
   - LinkedIn: <https://www.linkedin.com/post-inspector/>, paste your address, **Inspect**.
2. **Tell Google** (free): add your address at <https://search.google.com/search-console>, verify ownership, open **Sitemaps**, submit `sitemap.xml`, then use **URL Inspection** on the home page and **Request indexing**. Because the address did not change, Google already knows the site and will re-read it; listing the new project pages can still take days to weeks.
3. **When you add a project** in `src/data/projects.js`, nothing else is needed: the next build adds it to the sitemap.

A shared link to a single project (`/projects/<name>`) shows the home page's card in WhatsApp, Facebook and LinkedIn, because those crawlers do not run JavaScript. Google does run it, so search results show each project's own title and description. The page also carries a plain-HTML copy of your portfolio inside `<noscript>`, rebuilt from your data files on every build, so tools that do not run JavaScript can still read it.

## Custom domain (optional)

1. Vercel project, **Settings**, **Domains**, **Add**, and enter your domain.
2. Add the DNS records Vercel shows at your domain registrar. HTTPS is issued automatically.
3. Change `SITE_URL` in `src/data/siteUrl.js` to the new address, commit and push, so previews and the sitemap use it. Keep the `.vercel.app` address as a redirect to the new domain (Vercel offers this when you add the domain).

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| Build fails with a Node version message (for example `Vite requires Node.js 20.19+`) | The project's **Node.js Version** setting is old. `package.json` asks for `22.x`; if the log shows another version, set **Settings**, **General**, **Node.js Version** to 22.x. |
| Build fails with `Cannot find module '@rolldown/binding-linux-x64-gnu'` or similar | The lockfile lost its Linux entries. Delete `node_modules` and `package-lock.json`, run `npm install`, commit the new lockfile. |
| Deploy "succeeds" but shows the old HTML page or a directory listing | **Framework Preset** or **Output Directory** in the dashboard is overriding the build. Check the build log says `vite build`, and that **Output Directory** is empty or `dist`. |
| Home page works but `/projects/...` gives a 404 on refresh | `vercel.json` is missing from the deployed commit, or its `rewrites` entry was edited. It must serve `index.html` for everything except `/assets/`. |
| Blank white page | Open the browser console (F12). A failing request to `/assets/...` usually means a stale cached page; hard-refresh (`Ctrl+Shift+R`). |
| Contact form opens an email app instead of sending | `VITE_WEB3FORMS_KEY` is missing in Vercel, or was added after the last build. Add it, then **Redeploy**. |
| Image or file "not found" only on Vercel | Vercel builds on Linux, where file names are case-sensitive (`Logo.PNG` is not `logo.png`). Windows hides this. Make the import match the real file name exactly. |
| Old version still showing | Hard-refresh (`Ctrl+Shift+R`). Confirm **Deployments** shows the latest commit as **Ready** and **Current**. |

## Good to know

- **Free tier:** Hobby plans have monthly bandwidth and build-minute limits. Check Vercel's pricing page for the current numbers; a portfolio is far below them.
- **Repo size:** `src/assets/originals/` (full-size source images) and the `.mp4` demo videos under `src/assets/projects/` are **not** part of the built site; they only make the repository bigger.
- **`public/NAG Futuristic Navbar Theme Showcase.png`** (about 1.5 MB) is copied into every build as-is. It is not used by the site, so you can delete it to shrink the download.
