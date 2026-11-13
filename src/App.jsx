import { lazy, Suspense, useCallback, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Preloader from './components/Preloader'
import ScrollManager from './components/ScrollManager'
import ThemeCustomizer from './components/ThemeCustomizer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The project page (and its gallery, lightbox, ...) is a separate chunk, fetched when a project is opened
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
import { markSiteLoaded } from './hooks/useSiteLoaded'

// Routes: "/" is the one-page home, "/projects/:id" a project's own page, anything else the 404 page.
// The navbar, footer, back-to-top button and theme customizer are shared by all of them.
export default function App() {
  const [loading, setLoading] = useState(true)

  // The preloader calls this as it starts to fade: the hero entrance, typing and count-up begin.
  const handleLeave = useCallback(() => {
    markSiteLoaded()
    setLoading(false)
  }, [])

  return (
    <>
      {/* inert: while the preloader covers the page, nothing behind it can be tabbed to or read out */}
      <div className="app" inert={loading}>
        <ScrollManager />
        <Navbar />

        <main id="main" tabIndex={-1}>
          <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <BackToTop />
        <ThemeCustomizer />
      </div>

      <Preloader onLeave={handleLeave} />
    </>
  )
}
