// Site-wide content. Edit here; components read from this file.
import {
  FaBriefcase,
  FaCode,
  FaCommentDots,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaHouse,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTrophy,
  FaUser,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

const email = 'nuwarindaalbertgrande@gmail.com'
// WhatsApp: the number as people read it, and the wa.me link (country code, no + and no leading 0: 0763085855 -> 256763085855).
const whatsapp = { display: '+256 763 085 855', url: 'https://wa.me/256763085855' }

export const site = {
  name: 'Nuwarinda Albert',
  // Placeholder initials for the profile photo (the first letter is plain, the rest highlighted).
  initials: 'NA',
  // Text logo, shown only when no logo image is found in src/assets/brand (see Logo.jsx).
  logoText: 'NAG',
  title: 'Computer Scientist • Software Developer',
  location: 'Kampala, Uganda',
  email,
  whatsapp,
  tagline: 'Building dependable software, one thoughtful detail at a time.',
  // A short professional statement, shown under the name in the footer.
  statement:
    'I design and build dependable web, mobile and AI-powered software, from the first idea to a product people can use.',

  // `id` must match a <section id="..."> on the page. `icon` is a react-icons component.
  // Education is shown inside the Experience section, so it has no link of its own.
  navLinks: [
    { id: 'home', label: 'Home', icon: FaHouse },
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'projects', label: 'Projects', icon: FaBriefcase },
    { id: 'experience', label: 'Experience', icon: FaTrophy },
    { id: 'contact', label: 'Contact', icon: FaEnvelope },
  ],

  // The "Let's Talk" button (navbar, mobile menu and footer).
  cta: { label: "Let's Talk", href: '#contact' },

  // The call-to-action block in the footer.
  footerCta: {
    title: "Let's build something",
    text: 'Have a project or an idea in mind? I would love to hear about it.',
  },

  // Social profiles. `icon` is a react-icons component, `color` the brand colour (used by the round buttons in the
  // Contact section's "Follow Me" bar). An entry with an EMPTY url is hidden everywhere (Contact cards, Follow Me,
  // Hero, Footer): never a dead "#" link. TODO: fill in the empty URLs below and they appear on their own.
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/Alberto-G1', icon: FaGithub, color: '#181717' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/albert-nuwarinda-129841351/', icon: FaLinkedinIn, color: '#0A66C2' },
    { id: 'instagram', label: 'Instagram', url: '', icon: FaInstagram, color: '#E4405F' }, // TODO: add the profile link
    { id: 'tiktok', label: 'TikTok', url: '', icon: FaTiktok, color: '#000000' }, // TODO: add the profile link
    { id: 'facebook', label: 'Facebook', url: '', icon: FaFacebookF, color: '#1877F2' }, // TODO: add the profile link
    { id: 'whatsapp', label: 'WhatsApp', url: whatsapp.url, icon: FaWhatsapp, color: '#25D366' },
    { id: 'youtube', label: 'YouTube', url: '', icon: FaYoutube, color: '#FF0000' },
    { id: 'x', label: 'X', url: '', icon: FaXTwitter, color: '#000000' },
    { id: 'email', label: 'Email', url: `mailto:${email}`, icon: FaEnvelope },
  ],

  // The PDF lives in /public with this exact name.
  cvFile: '/Nuwarinda_Albert_CV.pdf',
}

// A social with no real URL ('' or the old '#' placeholder) is not shown anywhere.
export const hasUrl = (social) => Boolean(social.url) && social.url !== '#'

// The socials that do have a URL: use this (or <SocialLinks />), never site.socials directly, when drawing links.
export const visibleSocials = site.socials.filter(hasUrl)

// ---------- Contact section ----------
export const contactIntro =
  "I'm always open to discussing new opportunities, collaborations, and innovative ideas. Feel free to reach out!"

export const contactHeading = {
  label: 'Get In Touch',
  icon: FaCommentDots,
  title: 'Contact Me',
  accent: 'Me',
  subtitle: "Let's Build Something Amazing Together.",
  subtitleAccent: 'Together.',
}

// Copy for the form card and the "Follow Me" bar. `accent` is the part of the title drawn in the accent colour.
export const contactForm = {
  title: 'Send a Message',
  accent: 'Message',
  subtitle: 'Have a project in mind, a question, or just want to say hi?',
}

export const followMe = { title: 'Follow Me', text: "Let's connect on social media!" }

// Colours used only by the Contact section: the blue half of its neon borders (the gold half is the theme accent),
// and the success / error colours of the form.
export const contactColors = { blue: '#3B82F6', ok: '#22C55E', error: '#EF4444' }
