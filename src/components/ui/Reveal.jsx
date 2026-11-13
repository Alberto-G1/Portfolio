import useReveal from '../../hooks/useReveal'

// A block that fades up when it scrolls into view (useReveal), optionally after a delay in seconds so
// siblings can stagger. `as` picks the element ("li", "p", ...); other props go straight to it.
//   <Reveal as="li" delay={index * 0.1} className="card">...</Reveal>
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, reveal] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`${className} ${reveal}`.trim()}
      style={{ '--reveal-delay': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
