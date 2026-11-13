import { Link } from 'react-router-dom'
import { FaHouse } from 'react-icons/fa6'
import { horseWatermark } from '../data/heroArt'
import useDocumentMeta from '../hooks/useDocumentMeta'
import DotGrid from '../components/ui/DotGrid'
import GlassCard from '../components/ui/GlassCard'
import Swoosh from '../components/ui/Swoosh'
import './NotFound.css'

// Shown for any address that isn't a page (and for /projects/<id> with an id that doesn't exist).
export default function NotFound() {
  useDocumentMeta({ title: 'Page not found | Nuwarinda Albert', description: 'This page does not exist.', noindex: true })

  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="nf-decor" aria-hidden="true">
        {horseWatermark && <img className="nf-watermark" src={horseWatermark} alt="" />}
        <DotGrid className="nf-dots nf-dots--top" />
        <DotGrid className="nf-dots nf-dots--bottom" />
        <Swoosh side="left" className="nf-swoosh" />
        <Swoosh side="right" className="nf-swoosh" />
      </div>

      <GlassCard className="nf-card">
        <p className="nf-pill">404</p>
        <h1 id="nf-title" className="nf-title">
          Page <span className="accent">not found</span>
        </h1>
        <p className="nf-text">The page you are looking for does not exist, or it has moved.</p>
        <Link className="nf-btn" to="/">
          <FaHouse aria-hidden="true" />
          Back home
        </Link>
      </GlassCard>
    </section>
  )
}
