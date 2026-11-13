// Content for the Experience section (which also holds Education). `icon` values are react-icons components.
//
// An experience entry is:
//   id, role, organisation, type ('Work' | 'Internship' | 'Volunteer'), start, end ('Present' is fine),
//   summary       one line shown on the card
//   achievements  the list revealed by "Show details"
//   logo          file name in src/assets/logos/ (see logos.js: the extension, case and a trailing "Logo" are ignored).
//                 Leave it '' (or point at a file that isn't there) and the card draws `icon` plus the
//                 organisation's initials instead.
//   logoBg        'dark' (default: a navy panel, for logos with white lettering) or 'light' (a white chip behind
//                 logos with dark lettering, which would vanish on the dark panel)
//   icon          the fallback icon (briefcase for work, atom for STEM); defaults to a briefcase
// Newest first. Education entries are { id, award, institution, start, end, note, current?, logo, logoBg }: the same
// `logo` / `logoBg` as above (a school crest in src/assets/logos/; with no file the graduation cap is drawn).
import {
  FaAtom,
  FaBriefcase,
  FaCode,
  FaHeadset,
  FaStar,
  FaUsers,
} from 'react-icons/fa6'

export const experienceHeading = {
  label: 'My Experience',
  icon: FaBriefcase,
  title: 'My Experience',
  accent: 'Experience',
  subtitle: 'Building Skills. Creating Impact.',
  subtitleAccent: 'Impact.',
}

export const experienceIntro =
  'A journey through academic excellence, professional growth, and community service in technology.'

// The segmented switch above the timeline.
export const experienceTabs = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
]

export const experience = [
  {
    id: 'multichoice',
    role: 'Customer Service Representative',
    organisation: 'MultiChoice Uganda – Exquisite Solutions Ltd.',
    type: 'Work',
    start: 'Aug 2026',
    end: 'Present',
    logo: 'multichoice.png',
    logoBg: 'dark', // white lettering: needs the dark panel
    icon: FaBriefcase,
    summary: 'Managed customer inquiries, provided technical support, and ensured customer satisfaction.',
    achievements: [
      'Handled inbound and outbound calls on inquiries, complaints and account issues',
      'Assisted with subscription activations, billing and service upgrades',
      'Provided technical support and troubleshooting for digital TV and streaming services',
      'Maintained accurate records of interactions in CRM software',
    ],
  },
  {
    id: 'pahappa',
    role: 'Software Development Intern',
    organisation: 'Pahappa Ltd',
    type: 'Internship',
    start: 'Jun 2025',
    end: 'Aug 2025',
    logo: 'pahappa.png',
    logoBg: 'light', // dark blue lettering: needs the white chip
    icon: FaBriefcase,
    summary: 'Developed the MedCare Hospital Management System and contributed to the PGB KPI tracking platform.',
    achievements: [
      'Built MedCare, a Hospital Management System, during the internship',
      'Contributed to the Pahappa Goals Bucket (PGB) KPI and performance management system in a short extension',
      'Worked with Java, Spring Boot, Hibernate, JSF (PrimeFaces) and MySQL',
      'Implemented authentication, role-based access, dashboards and performance review features',
      'Collaborated in an Agile team using GitHub',
    ],
  },
  {
    id: 'stem-trainer',
    role: 'Volunteer Trainer',
    organisation: 'STEM Program – School Outreach',
    type: 'Volunteer',
    start: 'Sep 2025',
    end: 'May 2026',
    logo: '', // no logo: the atom icon + initials are drawn instead
    icon: FaAtom,
    summary: 'Trained high school students in robotics and Computer Science through school visits and bootcamps.',
    achievements: [
      'Taught robotics and Computer Science topics in schools',
      'Ran sessions at STEM bootcamps',
      'Explained technical concepts in a simple, practical way',
    ],
  },
]

export const education = [
  {
    id: 'makerere',
    award: 'Bachelor of Science in Computer Science',
    institution: 'Makerere University',
    start: 'Aug 2023',
    end: 'Jun 2027',
    note: 'Final-year project: RedHope AI.',
    current: true, // shows the small "Current" badge
    logo: 'makerere.png',
    logoBg: 'light', // dark lettering: the white chip
  },
  {
    id: 'uace',
    award: 'Uganda Advanced Certificate of Education (UACE)',
    institution: 'Gombe Secondary School',
    start: '2020',
    end: '2022',
    note: '',
    logo: 'gombe.png',
    logoBg: 'light',
  },
  {
    id: 'uce',
    award: 'Uganda Certificate of Education (UCE)',
    institution: 'Wits College Namulanda',
    start: '2016',
    end: '2019',
    note: '',
    logo: 'wits.png',
    logoBg: 'light',
  },
]

export const keySkills = [
  'Software Development & System Design',
  'Customer Service & Communication',
  'Teaching & Mentoring',
  'Teamwork & Leadership',
  'Problem Solving',
  'Innovation & Creativity',
]

// The row at the bottom. `icon` picks from statIcons below. TODO: fill in the real numbers (for example
// '12+'). A stat with an empty value is hidden, and the whole row is hidden while all of them are empty, so
// no made-up figures are ever shown. Numbers count up when they scroll into view.
export const stats = [
  { icon: 'code', value: '', label: 'Projects Delivered' },
  { icon: 'users', value: '', label: 'Students Trained' },
  { icon: 'headset', value: '', label: 'Customers Served' },
]

export const statIcons = { code: FaCode, users: FaUsers, headset: FaHeadset }
export const fallbackStatIcon = FaStar

export const experienceCta = { label: "Let's Work Together", href: '#contact' }

// The soft blue half of the glow behind the scene's platform (the gold half is the theme accent).
export const sceneGlowBlue = '#3B82F6'
