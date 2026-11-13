// What <LazyMotion features={...}> needs: loads Framer Motion's layout/animation features on demand, as a
// separate chunk (see motionFeatures.js), so the rest of the site doesn't pay for them. Used by the Projects
// and Experience sections; the chunk is fetched once.
export default () => import('./motionFeatures').then((module) => module.default)
