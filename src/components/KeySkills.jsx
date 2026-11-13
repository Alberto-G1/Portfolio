import { useId } from 'react'
import { FaChartSimple, FaSquareCheck } from 'react-icons/fa6'
import './KeySkills.css'

// "Key Skills Gained": a card with a clipped top-left corner (clip-path), a gold bar-chart icon and title, and
// the skills in two columns, each with a gold checkbox tick. It is drawn as a gold outer shape with the card
// inside it, both clipped, because clip-path would cut a normal border and shadow off at the corner.
//   <KeySkills skills={keySkills} />
export default function KeySkills({ skills }) {
  const id = useId()

  return (
    <section className="exp-skills" aria-labelledby={id}>
      <div className="exp-skills-edge">
        <div className="exp-skills-card">
          <h3 id={id} className="exp-skills-title">
            <FaChartSimple aria-hidden="true" />
            Key Skills Gained
          </h3>
          <ul className="exp-skills-list">
            {skills.map((skill) => (
              <li key={skill}>
                <FaSquareCheck aria-hidden="true" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
