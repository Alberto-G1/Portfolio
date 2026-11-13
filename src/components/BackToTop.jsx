import useScrolledPast from '../hooks/useScrolledPast'
import scrollToTop from '../utils/scrollToTop'
import BackToTopButton from './ui/BackToTopButton'
import './BackToTop.css'

// Appears after scrolling down one screen.
const pastOneScreen = () => window.innerHeight

export default function BackToTop() {
  const visible = useScrolledPast(pastOneScreen)

  return (
    <div className={`back-to-top${visible ? ' is-visible' : ''}`}>
      <BackToTopButton onClick={scrollToTop} />
    </div>
  )
}
