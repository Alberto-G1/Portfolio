// Content for the Skills section. `icon` values are react-icons components.
import {
  FaArrowsRotate,
  FaBrain,
  FaCode,
  FaCubes,
  FaDatabase,
  FaDiagramProject,
  FaJava,
  FaLayerGroup,
  FaStar,
} from 'react-icons/fa6'
import {
  SiCplusplus,
  SiDart,
  SiDjango,
  SiDocker,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiGit,
  SiGo,
  SiHibernate,
  SiJavascript,
  SiMinio,
  SiMysql,
  SiNeo4J,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiSpringboot,
  SiSqlite,
} from 'react-icons/si'
import { TbApi, TbSql } from 'react-icons/tb'

// `accent` is the part of `title` that gets the accent colour, `subtitleAccent` the same for the subtitle.
export const skillsHeading = {
  label: 'My Skills',
  icon: FaCode,
  title: 'My Skills',
  accent: 'Skills',
  subtitle: 'Technologies I Work With',
  subtitleAccent: 'Work With',
}

export const skillsIntro =
  "I have a strong foundation in modern technologies and frameworks, and I'm always eager to learn more."

// The bars fill (and the numbers count up) from 0 to `value` percent.
export const proficiency = [
  { label: 'Backend Development', value: 95 },
  { label: 'Frontend Development', value: 92 },
  { label: 'Database Management', value: 90 },
  { label: 'AI & Machine Learning', value: 85 },
]

/*
  The four cards. Each card's subtitle is built from the first 4 item names, so this list is the only
  place to edit.

  card:  color  the card's colour (the first uses the theme accent so it follows the customizer; the
                other three are fixed on purpose)
  item:  name   shown in the tooltip and read out by screen readers
         icon   a react-icons component
         color  the brand colour of the icon (optional: without it the icon takes the card's colour).
                In dark mode a colour that would be hard to see on navy is lightened automatically, and in
                light mode every colour is darkened a little so it reads on white.
         adaptive  true for black logos: they use the normal text colour instead (white on dark, navy on light)
*/
export const categories = [
  {
    id: 'languages',
    title: 'Programming Languages',
    color: 'var(--accent)',
    icon: FaCode,
    items: [
      { name: 'Java', icon: FaJava, color: '#E76F00' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'Dart', icon: SiDart, color: '#0175C2' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Go', icon: SiGo, color: '#00ADD8' },
      { name: 'C++', icon: SiCplusplus, color: '#00599C' },
      { name: 'SQL', icon: TbSql, color: '#E38C00' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Libraries',
    color: '#22C55E',
    icon: FaLayerGroup,
    items: [
      { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' },
      { name: 'Django', icon: SiDjango, color: '#44B78B' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Flutter', icon: SiFlutter, color: '#54C5F8' },
      { name: 'Flask', icon: SiFlask, adaptive: true },
      { name: 'Hibernate', icon: SiHibernate, color: '#59666C' },
      { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
      { name: 'OpenCV', icon: SiOpencv, color: '#5C3EE8' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & Tools',
    color: '#A855F7',
    icon: FaDatabase,
    items: [
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'Neo4j', icon: SiNeo4J, color: '#4581C3' },
      { name: 'SQLite', icon: SiSqlite, color: '#0F80CC' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
      { name: 'MinIO', icon: SiMinio, color: '#C72E49' },
    ],
  },
  {
    id: 'other',
    title: 'Other Skills',
    color: '#EF4444',
    icon: FaStar,
    // (edit this list as you like)
    items: [
      { name: 'REST APIs', icon: TbApi },
      { name: 'System Design', icon: FaDiagramProject },
      { name: 'Agile', icon: FaArrowsRotate },
      { name: 'OOP', icon: FaCubes },
      { name: 'AI/ML', icon: FaBrain },
    ],
  },
]
