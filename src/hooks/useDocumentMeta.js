import { useEffect } from 'react'
import { SITE_URL } from '../data/siteUrl'

// Finds (or makes) one tag in <head>, sets one attribute on it, and returns a function that puts it back as it was.
function setTag(selector, make, attribute, value) {
  let tag = document.head.querySelector(selector)
  const created = !tag
  if (!tag) {
    tag = make()
    document.head.append(tag)
  }
  const before = tag.getAttribute(attribute)
  tag.setAttribute(attribute, value)
  return () => {
    if (created) tag.remove()
    else if (before === null) tag.removeAttribute(attribute)
    else tag.setAttribute(attribute, before)
  }
}

// <meta name="description" content="..."> / <meta property="og:title" content="...">
const meta = (attribute, key, value) =>
  setTag(
    `meta[${attribute}="${key}"]`,
    () => {
      const tag = document.createElement('meta')
      tag.setAttribute(attribute, key)
      return tag
    },
    'content',
    value,
  )

const canonical = (href) =>
  setTag(
    'link[rel="canonical"]',
    () => {
      const tag = document.createElement('link')
      tag.rel = 'canonical'
      return tag
    },
    'href',
    href,
  )

// Sets the tab title and the page's search / share tags while a page is shown, and puts everything back when it goes away
// (index.html holds the defaults for the home page):
//   <title>, description, the Open Graph and X (Twitter) title + description, the canonical link and og:url (this page's
//   address on SITE_URL), and, with `noindex`, a robots tag that asks search engines to leave the page out.
//   useDocumentMeta({ title: 'RedHope AI | Nuwarinda Albert', description: 'A donor-retention platform...' })
// `title` and `description` may be left out. The share image stays the site's (public/og-image.jpg).
export default function useDocumentMeta({ title, description, noindex = false }) {
  useEffect(() => {
    const undo = []
    const previousTitle = document.title
    const path = window.location.pathname.replace(/\/+$/, '')
    const url = `${SITE_URL}${path || '/'}`

    if (title) {
      document.title = title
      undo.push(meta('property', 'og:title', title), meta('name', 'twitter:title', title))
    }
    if (description) {
      undo.push(
        meta('name', 'description', description),
        meta('property', 'og:description', description),
        meta('name', 'twitter:description', description),
      )
    }
    undo.push(canonical(url), meta('property', 'og:url', url))
    if (noindex) undo.push(meta('name', 'robots', 'noindex, follow'))

    return () => {
      document.title = previousTitle
      for (const restore of undo) restore()
    }
  }, [title, description, noindex])
}
