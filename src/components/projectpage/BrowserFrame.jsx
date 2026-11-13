import { FaLock } from 'react-icons/fa6'
import ProjectCover from '../ProjectCover'
import './BrowserFrame.css'

// The project page's hero picture: the cover inside a browser window built from CSS (a glass title bar with three dots
// and a fake address pill), tilted a little in 3D (it straightens on hover; no tilt under reduced motion, on touch or on a
// narrow screen), standing on a glowing oval platform with rings in gold and the project colour, with a big soft glow of
// the project colour behind it all. With no cover image it shows the generated cover instead.
//   <BrowserFrame project={project} cover={url | undefined} address="redhope" />
export default function BrowserFrame({ project, cover, address }) {
  return (
    <div className="bf pd-in" style={{ '--i': 4 }}>
      <span className="bf-glow" aria-hidden="true" />

      <div className="bf-float">
        <div className="bf-tilt">
          <figure className="bf-frame">
            <div className="bf-bar" aria-hidden="true">
              <span className="bf-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="bf-address">
                <FaLock />
                {address}
              </span>
            </div>
            <div className="bf-screen">
              <ProjectCover project={project} src={cover} />
            </div>
          </figure>
        </div>
      </div>

      <div className="bf-platform" aria-hidden="true">
        <span className="bf-ring bf-ring--outer" />
        <span className="bf-ring bf-ring--gold" />
        <span className="bf-ring bf-ring--project" />
        <span className="bf-disc" />
      </div>
    </div>
  )
}
