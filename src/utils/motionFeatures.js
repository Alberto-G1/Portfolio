// Framer Motion's layout animations (the filter and "Explore All" transitions) live in its larger "domMax"
// feature set. Projects.jsx loads this file on demand through <LazyMotion>, so it is a separate chunk and
// the rest of the site doesn't pay for it.
import { domMax } from 'framer-motion'

export default domMax
