// The image files the Hero and About are built from. Found with import.meta.glob (rather than plain
// imports) so a missing file can never break the build. Hero.jsx and About.jsx draw them;
// Preloader.jsx waits for them.

// Photos: transparent-background cutouts of the person (nothing else in the picture).
//   src/assets/profile-hero.*   used in the Hero
//   src/assets/profile-about.*  used in the About section
// .png wins over .webp, which wins over .avif, so dropping your own PNG in always takes over. If only
// one of the two exists it is used in both places; with neither, no photo is drawn and the layout
// stays intact. Only these two names are globbed, so nothing else in src/assets is bundled.
const photoFiles = import.meta.glob('../assets/profile-{hero,about}.{png,webp,avif}', {
  eager: true,
  import: 'default',
})

// First match for `stem` in the order png, webp, avif (so a PNG you drop in always wins).
function pick(files, stem) {
  for (const ext of ['png', 'webp', 'avif']) {
    const match = Object.entries(files).find(([path]) => path.endsWith(`/${stem}.${ext}`))
    if (match) return match[1]
  }
  return undefined
}

const hero = pick(photoFiles, 'profile-hero')
const about = pick(photoFiles, 'profile-about')
export const heroPhoto = hero ?? about
export const aboutPhoto = about ?? hero

// Background art: src/assets/hero/hero-dark.* and hero-light.*. Only these two names are globbed, so
// other files in that folder (e.g. the large originals) are not bundled. A missing file just means
// the hero has no background image for that mode.
const heroFiles = import.meta.glob('../assets/hero/hero-{dark,light}.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})
const heroImage = (mode) =>
  Object.entries(heroFiles).find(([path]) => new RegExp(`/hero-${mode}\\.[a-z]+$`).test(path))?.[1]

export const heroBackgrounds = { dark: heroImage('dark'), light: heroImage('light') }

// Optional faint horse watermark for the About section: src/assets/brand/horse-watermark.png (or .svg,
// .webp). Skipped when the file isn't there.
const watermarkFiles = import.meta.glob('../assets/brand/horse-watermark.{png,webp,svg}', {
  eager: true,
  import: 'default',
})
export const horseWatermark = Object.values(watermarkFiles)[0]

// The Skills section's workstation picture (a laptop with floating tech badges): src/assets/skills-workstation.*
// (same png > webp > avif order). The shipped file is an optimized, cropped WebP; the 1.8 MB original is in
// src/assets/originals/ and is not bundled. With no file the Skills text simply takes the full width.
const skillsFiles = import.meta.glob('../assets/skills-workstation.{png,webp,avif}', {
  eager: true,
  import: 'default',
})
export const skillsImage = pick(skillsFiles, 'skills-workstation')

// The picture's real size, used for the width/height attributes (they reserve its space so nothing jumps
// when it loads). If you replace the file with a different shape, update these two numbers.
export const skillsImageSize = { width: 1358, height: 896 }

// The Experience section's scene (graduation cap, laptop, trophy, briefcase and books on a glowing platform):
// src/assets/experience-scene.* (same png > webp > avif order). The shipped file is a cleaned, cropped WebP;
// the original PNG is in src/assets/originals/ and is not bundled. With no file the timeline takes the full width.
const experienceFiles = import.meta.glob('../assets/experience-scene.{png,webp,avif}', {
  eager: true,
  import: 'default',
})
export const experienceScene = pick(experienceFiles, 'experience-scene')

// Its real size, for the width/height attributes (they reserve the space so nothing jumps when it loads).
// If you replace the file with a different shape, update these two numbers.
export const experienceSceneSize = { width: 1300, height: 908 }

// The Contact section's scene (an open envelope with an "@" letter, chat / phone / location icons and orbit rings):
// src/assets/contact-scene.* (png > webp > avif). The shipped file is a cleaned WebP; the original PNG is in
// src/assets/originals/ and is not bundled. With no file nothing is drawn in its place.
const contactFiles = import.meta.glob('../assets/contact-scene.{png,webp,avif}', {
  eager: true,
  import: 'default',
})
export const contactScene = pick(contactFiles, 'contact-scene')

// Its real size, for the width/height attributes. If you replace the file with a different shape, update these.
export const contactSceneSize = { width: 1300, height: 630 }
