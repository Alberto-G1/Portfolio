// Maps a technology name (as written in a project's `tech` array) to its icon and brand colour.
// `icon` is a react-icons component, `color` the brand colour (the chip corrects it for legibility in
// light / dark mode, see ui/TechChips.css), `adaptive: true` is for logos that are black in real life
// and should simply follow the text colour. A name that is not listed here still works: it gets a
// generic code icon, so a typo or a new technology never breaks the page (see techInfo below).
import { FaBrain, FaCode, FaJava } from 'react-icons/fa6'
import {
  SiCss,
  SiDjango,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiHibernate,
  SiHtml5,
  SiJavascript,
  SiLeaflet,
  SiMinio,
  SiMysql,
  SiNeo4J,
  SiOpencv,
  SiPostgresql,
  SiPrimefaces,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSpringboot,
  SiSupabase,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

export const techIcons = {
  React: { icon: SiReact, color: '#61DAFB' },
  'React.js': { icon: SiReact, color: '#61DAFB' },
  RAG: { icon: FaBrain, color: '#A855F7' },
  Django: { icon: SiDjango, color: '#44B78B' },
  'Django REST Framework': { icon: SiDjango, color: '#A30000' },
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  Neo4j: { icon: SiNeo4J, color: '#4581C3' },
  'scikit-learn': { icon: SiScikitlearn, color: '#F7931E' },
  Leaflet: { icon: SiLeaflet, color: '#199900' },
  'Spring Boot': { icon: SiSpringboot, color: '#6DB33F' },
  MinIO: { icon: SiMinio, color: '#C72E49' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  'REST APIs': { icon: TbApi },
  Java: { icon: FaJava, color: '#E76F00' },
  'JSF (PrimeFaces)': { icon: SiPrimefaces, color: '#0F9DDC' },
  Hibernate: { icon: SiHibernate, color: '#59666C' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  Flutter: { icon: SiFlutter, color: '#54C5F8' },
  Supabase: { icon: SiSupabase, color: '#3FCF8E' },
  Python: { icon: SiPython, color: '#3776AB' },
  PyTorch: { icon: SiPytorch, color: '#EE4C2C' },
  OpenCV: { icon: SiOpencv, color: '#5C3EE8' },
  Firebase: { icon: SiFirebase, color: '#FFCA28' },
  HTML: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#1572B6' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
}

// Always returns something drawable: the entry, or a generic code icon in the theme colour.
export const techInfo = (name) => techIcons[name] ?? { icon: FaCode }
