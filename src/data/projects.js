// Content for the Projects section. `icon` values are react-icons components.
//
// Images are NOT listed here: drop them into src/assets/projects/<id>/ (see projectImages.js).
//   cover.webp|png|jpg   the card image
//   anything else        gallery screenshots in the modal, in filename order (01.webp, 02.webp ...)
// With no cover a generated one (accent gradient, big faint icon, initials) is drawn.
//
// A project is:
//   id            slug; also the name of its image folder
//   title         shown big; `titleAccent` (optional) is the part of it drawn in the project colour
//   subtitle      one line under the title (falls back to the main category if left out)
//   description   1-2 sentences for the card
//   details       a longer paragraph for the modal
//   highlights    key features / results, a list in the modal
//   tech          names, mapped to icons in techIcons.js (an unknown name still works)
//   categories    any of 'fullstack' | 'ai' | 'web' | 'mobile' (the first one is the "main" category)
//   featured      true = the big card at the top (the first featured project that matches the filter)
//   accentColor   the project colour (cover fallback, title accent, featured card border + glow)
//   liveUrl / codeUrl   optional; an empty one hides its button
//   codePrivate   true = shows a muted "Private Code" pill instead of View Code
//   status        optional: 'Live' | 'In development' | 'Internship' | 'Academic' (a badge on the card
//                 unless it is 'Live'; always shown in the modal)
// Optional extras: `initials` (override the generated cover initials), `imageFolder` (use another folder
// name under src/assets/projects/), `motif: 'heartbeat'` (draws the heartbeat line over the featured cover).
//
// THE PROJECT PAGE (/projects/<id>) adds more optional fields. Every section of the page is drawn only if its data
// exists, so a project with just a title, subtitle and tech still gets a clean page:
//   role, timeline, team, client      the meta strip under the hero (only the filled ones show)
//   metrics      [{ value, label, icon }]       the stats row; numbers count up ('98.3%', '12+'), other values fade in
//   problem, solution                           the two "Story Behind It" cards (a paragraph each)
//   features     [{ icon, title, text }]        "What It Does"
//   techGroups   [{ group, items: [...] }]      "Tools Behind It", groups: Frontend | Backend | Database | AI / ML |
//                                               DevOps & Tools (without it the flat `tech` list is used)
//   contributions [strings]                     "What I Contributed" (what you personally did)
//   learnings     [strings]                     "What I Learned"
//   challenges   [{ title, text }]              "Problems I Solved" (an accordion)
//   captions     { '01.webp': 'Donor dashboard' }   gallery captions by file name
// `icon` values are react-icons components. The gallery and the optional architecture diagram come from the image folder
// (see projectImages.js). Without `problem` / `solution` but with a longer `details`, the Overview shows `details`.
import {
  FaBrain,
  FaBullseye,
  FaChartLine,
  FaClipboardCheck,
  FaCode,
  FaCommentDots,
  FaGlobe,
  FaLayerGroup,
  FaMapLocationDot,
  FaMobileScreenButton,
  FaShieldHalved,
  FaTableCellsLarge,
  FaTrophy,
} from 'react-icons/fa6'

export const projectsHeading = {
  label: 'My Projects',
  icon: FaCode,
  title: 'My Projects',
  accent: 'Projects',
  subtitle: 'Turning Ideas Into Reality.',
  subtitleAccent: 'Reality.',
}

export const projectsIntro =
  'A collection of innovative solutions, from web platforms to AI-powered systems, built with passion and purpose.'

// The filter tabs. `id` matches a project's `categories` ('all' shows everything).
export const projectFilters = [
  { id: 'all', label: 'All', icon: FaTableCellsLarge },
  { id: 'fullstack', label: 'Full-Stack', icon: FaLayerGroup },
  { id: 'ai', label: 'AI & Machine Learning', icon: FaBrain },
  { id: 'web', label: 'Web Applications', icon: FaGlobe },
  { id: 'mobile', label: 'Mobile', icon: FaMobileScreenButton },
]

// "web" -> "Web Applications" (used when a project has no subtitle)
export const categoryLabel = (id) => projectFilters.find((filter) => filter.id === id)?.label ?? ''

export const projects = [
  {
    id: 'redhope',
    title: 'RedHope AI',
    titleAccent: 'Hope',
    subtitle: 'An Intelligent Blood Donor Retention Platform',
    description:
      'A donor-retention platform built for the Uganda Blood Transfusion Service. It checks eligibility against WHO/UBTS rules, predicts when donors are available and matches them to nearby donation camps.',
    details:
      'RedHope AI is my final-year project at Makerere University (Group CS26-30), built for the Uganda Blood Transfusion Service (UBTS). It combines a rule-based eligibility engine, a donor-availability prediction model and a retrieval-augmented chatbot with geospatial camp matching and gamified retention, to help the service keep donors coming back.',
    highlights: [
      'Rule-based WHO/UBTS eligibility engine: 98.3% accuracy with zero false positives',
      'Donor-availability prediction with Logistic Regression: 83% recall',
      'RAG chatbot: 90% top-one retrieval accuracy',
      'Geospatial donor-camp matching',
      'Gamified donor retention',
    ],
    tech: ['React', 'Django REST Framework', 'PostgreSQL', 'Neo4j', 'scikit-learn', 'Leaflet'],
    categories: ['ai', 'fullstack', 'web'],
    featured: true,
    accentColor: '#E11D48',
    motif: 'heartbeat',
    liveUrl: '', // TODO: add the live demo link when it is deployed
    codeUrl: '', // TODO: add the repository link (or set codePrivate: true)
    codePrivate: false,
    status: 'Academic', // final-year project; TODO: change to 'Live' once deployed

    // ---- project page ----
    client: 'Uganda Blood Transfusion Service',
    team: 'Makerere University Group CS26-30',
    // TODO: role: 'Your role on the team', (shown in the meta strip)
    // TODO: timeline: 'e.g. 2025 – 2026',
    metrics: [
      { value: '98.3%', label: 'Eligibility engine accuracy', icon: FaBullseye },
      { value: '83%', label: 'Availability prediction recall', icon: FaChartLine },
      { value: '90%', label: 'Chatbot top-one retrieval accuracy', icon: FaCommentDots },
      { value: '0', label: 'False positives in eligibility checks', icon: FaShieldHalved },
    ],
    problem:
      'Donor management at the Uganda Blood Transfusion Service is reactive, which makes it hard to retain donors and to plan blood drives.',
    solution: 'An AI-driven platform that shifts donor management from reactive to proactive.',
    features: [
      { icon: FaClipboardCheck, title: 'WHO/UBTS eligibility engine', text: 'A rule-based engine that checks donor eligibility against WHO and UBTS rules.' },
      { icon: FaChartLine, title: 'Donor-availability prediction', text: 'A machine-learning model (Logistic Regression) that predicts when donors are available.' },
      { icon: FaCommentDots, title: 'RAG chatbot for donor support', text: 'A retrieval-augmented chatbot that supports donors with answers to their questions.' },
      { icon: FaMapLocationDot, title: 'Geospatial donor-camp matching', text: 'Matches donors with donation camps near them on a Leaflet map.' },
      { icon: FaBullseye, title: 'Personalised campaign targeting', text: 'Campaigns are aimed at the donors they are most relevant to.' },
      { icon: FaTrophy, title: 'Gamified retention', text: 'Game mechanics that keep donors engaged and coming back.' },
    ],
    techGroups: [
      { group: 'Frontend', items: ['React.js', 'Leaflet'] },
      { group: 'Backend', items: ['Django REST Framework'] },
      { group: 'Database', items: ['PostgreSQL', 'Neo4j'] },
      { group: 'AI / ML', items: ['scikit-learn', 'RAG'] },
    ],
    // TODO: contributions: ['What you personally built or decided', ...],
    // TODO: challenges: [{ title: 'A problem you hit', text: 'How you solved it' }, ...],
    // TODO: learnings: ['What this project taught you', ...],
    // TODO: captions: { '01.webp': 'Donor dashboard' } once screenshots are in src/assets/projects/redhope/
  },
  {
    id: 'nexus-hms',
    title: 'Nexus HMS',
    subtitle: 'Hotel Management System',
    description:
      'A hotel management system with a guest portal and a role-based staff portal, covering rooms, bookings, restaurant, spa, events and billing.',
    details:
      'Nexus HMS runs a hotel from one system. Guests get their own portal, and staff get a role-based portal where each person sees the tools for their job: rooms and bookings, the restaurant and bar, the spa, events, billing, inventory, staff management and analytics.',
    highlights: [
      'Guest portal and role-based staff portal',
      'Rooms and bookings',
      'Restaurant & bar, spa and events',
      'Billing and inventory',
      'Staff management and analytics',
    ],
    tech: ['React'], // TODO: add the backend technologies
    categories: ['fullstack', 'web'],
    featured: false,
    accentColor: '#6366F1',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'bamikahub',
    title: 'BamikaHub',
    subtitle: 'Engineering Operations & Inventory Management',
    description:
      'Multi-site inventory with audit trails, material request and approval workflows, project and budget tracking in UGX, IT support ticketing and reporting dashboards.',
    details:
      'BamikaHub keeps an engineering company’s operations in one place: stock across several sites with a full audit trail, material requests that go through approval, project and budget tracking in UGX, an IT support ticketing desk, and dashboards for reporting.',
    highlights: [
      'Multi-site inventory with audit trails',
      'Material request and approval workflows',
      'Project and budget tracking in UGX',
      'IT support ticketing',
      'Reporting dashboards',
    ],
    tech: [], // TODO: list the technologies used
    categories: ['fullstack', 'web'],
    featured: false,
    accentColor: '#F59E0B',
    liveUrl: '', // TODO
    codeUrl: '',
    codePrivate: true,
  },
  {
    id: 'edgevault',
    title: 'EdgeVault',
    subtitle: 'Enterprise Document Management System',
    description:
      'An enterprise document management system built with Spring Boot and MinIO object storage, with its features exposed through REST APIs.',
    details:
      'EdgeVault stores and manages an organisation’s documents. It is built on Spring Boot with MinIO for object storage and Docker, and exposes its features through REST APIs.',
    highlights: ['Spring Boot backend', 'MinIO object storage', 'Docker', 'REST APIs'],
    tech: ['Spring Boot', 'MinIO', 'Docker', 'REST APIs'],
    categories: ['fullstack'],
    featured: false,
    accentColor: '#14B8A6',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'uniteam',
    title: 'UniTeam',
    subtitle: 'University Group Project Management System',
    description: 'A system for managing university group projects.', // TODO: say a little more about what it does
    details: 'UniTeam is a project management system for university group work.', // TODO: write the longer description
    highlights: [], // TODO: key features
    tech: [], // TODO: list the technologies used
    categories: ['fullstack', 'web'],
    featured: false,
    accentColor: '#3B82F6',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'medcare',
    title: 'MedCare HMS',
    subtitle: 'Hospital Management System',
    description:
      'A hospital management system built during an internship with Java, JSF (PrimeFaces), Hibernate and MySQL, and also reimplemented in Django.',
    details:
      'MedCare HMS is a hospital management system I built during an internship using Java, JSF (PrimeFaces), Hibernate and MySQL. I later reimplemented it in Django.',
    highlights: ['Built with Java, JSF (PrimeFaces), Hibernate and MySQL', 'Also reimplemented in Django'],
    tech: ['Java', 'JSF (PrimeFaces)', 'Hibernate', 'MySQL'],
    categories: ['fullstack'],
    featured: false,
    accentColor: '#0EA5E9',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
    status: 'Internship',
  },
  {
    id: 'ifind',
    title: 'iFind',
    subtitle: 'Uganda Business Discovery Platform',
    description: 'A mobile app for discovering businesses in Uganda, built with Flutter, Supabase and PostgreSQL.', // TODO: confirm details
    details: 'iFind helps people discover businesses across Uganda. It is a Flutter app backed by Supabase and PostgreSQL.', // TODO: confirm details
    highlights: [], // TODO: key features
    tech: ['Flutter', 'Supabase', 'PostgreSQL'],
    categories: ['mobile'],
    featured: false,
    accentColor: '#22C55E',
    initials: 'iF',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'legacy-chillout',
    title: 'Legacy Chillout',
    subtitle: 'Website & Foundation',
    description: 'The website for Legacy Chillout and its foundation.', // TODO: say what the site is for
    details: 'The public website for Legacy Chillout and its foundation.', // TODO: write the longer description
    highlights: [], // TODO: key features
    tech: [], // TODO: list the technologies used
    categories: ['web'],
    featured: false,
    accentColor: '#A855F7',
    liveUrl: 'https://legacychillout.com/',
    codeUrl: '', // TODO
    codePrivate: false,
    status: 'Live',
  },
  {
    id: 'bamika-website',
    title: 'Bamika Engineering Website',
    subtitle: 'Company Website',
    description: 'The company website for Bamika Engineering.', // TODO: say a little more
    details: 'The public company website for Bamika Engineering.', // TODO: write the longer description
    highlights: [], // TODO: key features
    tech: [], // TODO: list the technologies used
    categories: ['web'],
    featured: false,
    accentColor: '#F97316',
    liveUrl: 'https://bamikaeng.org/',
    codeUrl: '', // TODO
    codePrivate: false,
    status: 'Live',
  },
  {
    id: 'coffee-quality-ai',
    title: 'Coffee Bean Quality Estimation',
    subtitle: '', // TODO: a short subtitle (until then the card shows the category)
    description:
      'Estimates coffee bean quality from images using Vision Transformers and CNNs, with knowledge distillation.',
    details:
      'This project estimates the quality of coffee beans from images. It uses Vision Transformers and convolutional neural networks (CNNs), with knowledge distillation to carry what the larger models learn into a smaller one.',
    highlights: ['Vision Transformers and CNNs', 'Knowledge distillation'],
    tech: ['Python', 'PyTorch', 'OpenCV'],
    categories: ['ai'],
    featured: false,
    accentColor: '#A16207',
    initials: 'CB',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'glamazon',
    title: 'Glamazon',
    subtitle: 'Salon Booking App',
    description: 'A salon booking mobile app built with Flutter and Firebase.', // TODO: say a little more
    details: 'Glamazon is a mobile app for booking salon appointments, built with Flutter and Firebase.', // TODO: write the longer description
    highlights: [], // TODO: key features
    tech: ['Flutter', 'Firebase'],
    categories: ['mobile'],
    featured: false,
    accentColor: '#EC4899',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  // TODO: JobQuest and Veloce were added from their screenshots (src/assets/projects/jobquest-app and veloce(bike-app)).
  // The descriptions below only say what the screens show: please check them, add the real tech, links and status.
  {
    id: 'jobquest',
    title: 'JobQuest',
    subtitle: 'Job Search & Hiring App',
    description: 'A mobile app that connects job seekers and employers: search jobs, save listings and manage your profile.', // TODO: confirm
    details:
      'JobQuest is a mobile app for finding and posting jobs. Job seekers can browse featured jobs, search by category, save listings and manage their profile, while employers get their own dashboard for appointments and newly uploaded jobs.', // TODO: confirm
    highlights: [
      'Separate job seeker and employer accounts',
      'Search by category, with recent and popular searches',
      'Saved jobs and a profile with edit screen',
      'OTP verification, password reset and notifications',
    ], // TODO: confirm
    tech: ['Flutter'], // TODO: confirm, and add the backend
    categories: ['mobile'],
    featured: false,
    accentColor: '#14B8A6',
    imageFolder: 'jobquest-app',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'veloce',
    title: 'Veloce',
    subtitle: 'Bike Rental App',
    description: 'A bike-rental mobile app: pick a bike, scan its QR code to unlock it and keep track of your rides.', // TODO: confirm
    details:
      'Veloce is a mobile app for renting bikes around the city. Riders browse bike models, scan the QR code on a bike (or type its number) to unlock it, and follow their ride history, wallet and profile from the app.', // TODO: confirm
    highlights: [
      'Browse bike models and new arrivals',
      'Scan a QR code or enter the bike number to unlock a bike',
      'Ride history, wallet and rider profile',
      'Notifications and settings',
    ], // TODO: confirm
    tech: ['Flutter'], // TODO: confirm, and add the backend
    categories: ['mobile'],
    featured: false,
    accentColor: '#FF6B57',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
  {
    id: 'pgb',
    title: 'Pahappa Goals Bucket',
    subtitle: 'KPI Tracking & Performance Management',
    description:
      'A KPI tracking and performance management system built during an internship with Java, Spring Boot, Hibernate, JSF (PrimeFaces) and MySQL.',
    details:
      'Pahappa Goals Bucket tracks KPIs and manages performance. I built it during an internship using Java, Spring Boot, Hibernate, JSF (PrimeFaces) and MySQL.',
    highlights: ['KPI tracking', 'Performance management'],
    tech: ['Java', 'Spring Boot', 'Hibernate', 'JSF (PrimeFaces)', 'MySQL'],
    categories: ['fullstack'],
    featured: false,
    accentColor: '#8B5CF6',
    initials: 'PG',
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
    status: 'Internship',
  },
  {
    id: 'ecommerce-prototype',
    title: 'E-commerce Prototype',
    subtitle: '', // TODO: a short subtitle (until then the card shows the category)
    description: 'An e-commerce prototype built with HTML, CSS, JavaScript and Django.',
    details: 'A prototype online shop built with HTML, CSS and JavaScript on the front end and Django on the back end.',
    highlights: [], // TODO: key features
    tech: ['HTML', 'CSS', 'JavaScript', 'Django'],
    categories: ['web'],
    featured: false,
    accentColor: '#06B6D4',
    imageFolder: 'CornerShop', // the screenshots in src/assets/projects/CornerShop (TODO: confirm this is the same project)
    liveUrl: '', // TODO
    codeUrl: '', // TODO
    codePrivate: false,
  },
]
