import './ProjectTitle.css'

// A project's title with the optional `titleAccent` part drawn in the project colour ("Hope" in RedHope AI).
// Needs --project-color from an ancestor (the card / modal sets it); without it the theme accent is used.
export default function ProjectTitle({ title, accent }) {
  const start = accent ? title.indexOf(accent) : -1
  if (start === -1) return title

  return (
    <>
      {title.slice(0, start)}
      <span className="project-title-accent">{accent}</span>
      {title.slice(start + accent.length)}
    </>
  )
}
