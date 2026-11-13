import './GlassButton.css'

// A pill-shaped glass link with a gold border. Renders an <a> (pass href, and `download` for files).
//   <GlassButton href="/cv.pdf" download icon={FaDownload}>Download CV</GlassButton>
export default function GlassButton({ icon: Icon, className = '', children, ...rest }) {
  return (
    <a className={`glass-btn ${className}`.trim()} {...rest}>
      {Icon && <Icon aria-hidden="true" />}
      <span>{children}</span>
    </a>
  )
}
