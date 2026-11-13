import { Link, useLocation } from 'react-router-dom'

// A link to a section of the home page ("about", "contact", ...) that works from any page.
//   <SectionLink id="about" className="navbar-link">About</SectionLink>
// On the home page it is a plain anchor (#about), so the browser scrolls there itself; anywhere else (a project page) it
// is a router link to /#about, and ScrollManager does the scrolling once the home page has appeared.
// `state` is passed to the router link (e.g. { focusContact: true } to focus the Name field on arrival).
export default function SectionLink({ id, state, children, ...props }) {
  const onHome = useLocation().pathname === '/'

  if (onHome) {
    return (
      <a href={`#${id}`} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link to={{ pathname: '/', hash: `#${id}` }} state={state} {...props}>
      {children}
    </Link>
  )
}
