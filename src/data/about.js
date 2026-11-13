// Content for the Hero and About sections. `icon` values are react-icons components. The wording
// is the content; the icons, colours and links are presentation that the layout needs.
import {
  FaCode,
  FaGlobe,
  FaGraduationCap,
  FaLaptopCode,
  FaLayerGroup,
  FaLocationDot,
  FaMicrochip,
  FaStar,
  FaBullseye,
  FaUser,
  FaUsers,
} from 'react-icons/fa6'
import { site } from './site'

// ---- Hero ----
export const heroBadge = 'Available for opportunities' // not shown in the current Hero design
export const heroGreeting = "Hello, I'm"

// The part of site.name shown in the accent colour.
export const heroNameAccent = 'Albert'

// Cycled by the typing animation (shown as a static list under reduced motion).
export const roles = ['Software Developer', 'Full-Stack Engineer', 'System Designer', 'AI Enthusiast']

export const heroTagline =
  'I build user-focused software, from enterprise management systems to AI-driven platforms.'

// The numbers count up from 0 when they first scroll into view ("7+", "98.3%" are parsed).
export const heroStats = [
  { icon: FaCode, value: '7+', label: 'Major projects' },
  { icon: FaLayerGroup, value: '10+', label: 'Technologies' },
  { icon: FaBullseye, value: '98.3%', label: 'Eligibility engine accuracy (RedHope AI)' },
]

// ---- About ----
// `accent` is the part of `title` that gets the accent color.
export const aboutHeading = { label: 'About Me', icon: FaUser, title: 'Who I Am', accent: 'Am' }

// The first paragraph is the lead; the rest are drawn with a gold bar beside them.
export const aboutParagraphs = [
  "I'm a Computer Science student at Makerere University with hands-on experience in software development and system design. I enjoy building software that solves real problems for the people who use it.",
  'During my internship at Pahappa Ltd, I worked on enterprise systems with Java, Spring Boot, Hibernate and MySQL, building authentication, role-based access, dashboards and performance review features in an Agile team.',
  "Beyond code, I've taught robotics and Computer Science to high school students through a STEM outreach program, and I support customers at MultiChoice Uganda. Both have sharpened how I communicate, solve problems and work with people.",
  "I'm passionate about artificial intelligence, automation and continuous learning, and I want to contribute to innovative, impactful projects.",
]

export const quickFactsTitle = 'Quick Facts'

// Each row shows `primary` (bold) over `secondary` (muted); they default to `value` and `label`.
// Education splits its value into the degree and the university, as in the design.
export const quickFacts = [
  { icon: FaLocationDot, label: 'Location', value: site.location },
  {
    icon: FaGraduationCap,
    label: 'Education',
    value: 'BSc Computer Science, Makerere University',
    primary: 'BSc Computer Science',
    secondary: 'Makerere University',
  },
  { icon: FaGlobe, label: 'Languages', value: 'English, Luganda, Runyankore' },
  { icon: FaStar, label: 'Interests', value: 'AI, automation, singing, swimming' },
]

export const focusAreasTitle = 'My Focus Areas'

// Each card has its own colour (`color`) and the colour of the chevron on it (`onColor`). Full-Stack uses
// the theme accent so it follows the customizer; the other three are fixed on purpose.
// `href` is where the card's chevron button goes; `ariaLabel` names it.
export const focusAreas = [
  {
    icon: FaLaptopCode,
    title: 'Full-Stack Development',
    text: 'React, Django, Spring Boot',
    color: 'var(--accent)',
    onColor: 'var(--accent-contrast)',
    href: '#projects',
    ariaLabel: 'See my full-stack projects',
  },
  {
    icon: FaLayerGroup,
    title: 'System Design',
    text: 'Role-based access, modular architecture, REST APIs',
    color: '#3B82F6',
    onColor: '#FFFFFF',
    href: '#projects',
    ariaLabel: 'See my system design projects',
  },
  {
    icon: FaMicrochip,
    title: 'AI & Machine Learning',
    text: 'scikit-learn, PyTorch, OpenCV, RAG chatbots',
    color: '#22C55E',
    onColor: '#FFFFFF',
    href: '#projects',
    ariaLabel: 'See my AI and machine learning projects',
  },
  {
    icon: FaUsers,
    title: 'Mentoring & Teaching',
    text: 'STEM trainer, robotics bootcamps',
    color: '#EF4444',
    onColor: '#FFFFFF',
    href: '#experience',
    ariaLabel: 'See my mentoring and teaching experience',
  },
]
