// Fetches and decodes images ahead of time. The returned promise resolves when every image is ready,
// or has failed: a missing or broken image must never hold the page up. Results are cached per URL,
// so the Preloader and the Hero share the work and nothing is fetched twice.
const cache = new Map()

export default function preloadImages(urls) {
  return Promise.all(
    urls.map((src) => {
      if (!cache.has(src)) {
        const image = new Image()
        image.src = src
        cache.set(src, image.decode().catch(() => {}))
      }
      return cache.get(src)
    }),
  )
}
