import './GlassCard.css'

// A frosted card: --surface fill, backdrop blur, 1px --border, large radius.
//   <GlassCard>...</GlassCard>
//   <GlassCard as="article" hover>...</GlassCard>   hover: lifts 4px, border turns accent, adds the glow
//
// Don't put a `reveal` class on a `hover` card (both move it with transform): reveal a wrapper instead.
// Extra props (ref, role, aria-*, style, className) go straight to the element.
export default function GlassCard({ as: Tag = 'div', hover = false, className = '', children, ...rest }) {
  return (
    <Tag className={`glass-card${hover ? ' glass-card--hover' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
