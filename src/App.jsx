import { useState } from 'react'
import './App.css'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const MODES = [
  { name: 'Ionian (Major)', intervals: [2, 2, 1, 2, 2, 2, 1], qualities: ['M', 'm', 'm', 'M', 'M', 'm', 'dim'] },
  { name: 'Dorian',        intervals: [2, 1, 2, 2, 2, 1, 2], qualities: ['m', 'dim', 'M', 'M', 'm', 'm', 'M'] },
  { name: 'Phrygian',      intervals: [1, 2, 2, 2, 1, 2, 2], qualities: ['dim', 'M', 'm', 'm', 'm', 'M', 'M'] },
  { name: 'Lydian',        intervals: [2, 2, 2, 1, 2, 2, 1], qualities: ['M', 'M', 'm', 'dim', 'M', 'm', 'm'] },
  { name: 'Mixolydian',    intervals: [2, 2, 1, 2, 2, 1, 2], qualities: ['M', 'm', 'dim', 'M', 'm', 'm', 'M'] },
  { name: 'Aeolian (Minor)', intervals: [2, 1, 2, 2, 1, 2, 2], qualities: ['m', 'dim', 'M', 'm', 'm', 'M', 'M'] },
  { name: 'Locrian',       intervals: [1, 2, 2, 1, 2, 2, 2], qualities: ['dim', 'M', 'm', 'm', 'M', 'M', 'm'] },
  { name: 'Harmonic Minor', intervals: [2, 1, 2, 2, 1, 3, 1], qualities: ['m', 'dim', 'aug', 'm', 'M', 'M', 'dim'] },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

const QUALITY_SUFFIX = { M: '', m: 'm', dim: 'dim', aug: 'aug' }
const QUALITY_SYMBOL = { M: 'maj', m: 'm', dim: 'dim', aug: 'aug' }

function getScaleNotes(rootNote, mode) {
  const intervals = MODES[mode].intervals
  const notes = [rootNote]
  let current = rootNote
  for (let i = 0; i < 6; i++) {
    current = (current + intervals[i]) % 12
    notes.push(current)
  }
  return notes
}

const LETTER_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const LETTER_NATURAL = [0, 2, 4, 5, 7, 9, 11]
const CHROMATIC_TO_LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]

function spellNote(chromaticIndex, letterIndex) {
  const letter = LETTER_NAMES[letterIndex]
  const natural = LETTER_NATURAL[letterIndex]
  const diff = (chromaticIndex - natural + 12) % 12
  if (diff === 1) return letter + '#'
  if (diff === 11) return letter + 'b'
  return letter
}

function spellScale(rootNote, mode) {
  const rootLetter = CHROMATIC_TO_LETTER[rootNote]
  const scaleNotes = getScaleNotes(rootNote, mode)
  return scaleNotes.map((note, i) => spellNote(note, (rootLetter + i) % 7))
}

function getTriads(rootNote, mode) {
  const qualities = MODES[mode].qualities
  const scaleNotes = getScaleNotes(rootNote, mode)
  const spelled = spellScale(rootNote, mode)

  return scaleNotes.map((note, i) => {
    const third = (i + 2) % 7
    const fifth = (i + 4) % 7
    const quality = qualities[i]
    const roman = quality === 'M' || quality === 'dim' || quality === 'aug'
      ? ROMAN[i]
      : ROMAN[i].toLowerCase()

    const seventh = (i + 6) % 7

    return {
      numeral: quality === 'dim' ? roman + '\u00B0' : quality === 'aug' ? roman + '+' : roman,
      root: spelled[i],
      name: spelled[i] + QUALITY_SUFFIX[quality],
      notes: [spelled[i], spelled[third], spelled[fifth]],
      seventh: spelled[seventh],
      quality,
      qualityLabel: QUALITY_SYMBOL[quality],
    }
  })
}

function App() {
  const [rootNote, setRootNote] = useState(0)
  const [mode, setMode] = useState(0)
  const [show7th, setShow7th] = useState(false)

  const triads = getTriads(rootNote, mode)
  const spelled = spellScale(rootNote, mode)

  return (
    <>
      <nav className="navbar bg-body-tertiary mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img src="/robotLionsGuitar.jpg" alt="Robot Lions" style={{ height: '40px' }} className="rounded" />
            <span className="navbar-brand mb-0" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#333333' }}>Scale-O-Matic 3000</span>
          </div>
          <a href="https://robotlions.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">robotlions.com</a>
        </div>
      </nav>

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="settingsOffcanvas" aria-labelledby="settingsOffcanvasLabel">
        <div className="offcanvas-header">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-4">
            <h6 className="text-uppercase fw-semibold text-muted mb-3">Root Note</h6>
            <div className="d-flex flex-wrap gap-2">
              {NOTES.map((note, i) => (
                <button
                  key={note}
                  className={`btn btn-outline-secondary rounded-circle note-btn ${i === rootNote ? ' active' : ''}`}
                  onClick={() => setRootNote(i)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase fw-semibold text-muted mb-3">Mode</h6>
            <div className="d-flex flex-wrap gap-2">
              {MODES.map((m, i) => (
                <button
                  key={m.name}
                  className={`btn btn-outline-secondary rounded-pill mode-btn${i === mode ? ' active' : ''}`}
                  onClick={() => setMode(i)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
          <button
            style={{ fontSize: 'small' }}
              className="btn btn-outline-secondary key-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#settingsOffcanvas"
            >
              <i className="bi bi-list"></i>&nbsp;Change Key
            </button>
        <h2 className="fw-bold text-secondary text-center mb-2">{NOTES[rootNote]} {MODES[mode].name}</h2>

        <div className="mb-5">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {spelled.map((note, i) => (
              <span style={{ fontWeight: 'bold' }} key={i} className="fs-4 px-3 py-2">{note}</span>
            ))}
          </div>
        </div>

        <div className="mb-5">
        
          <div className="d-flex justify-content-center align-items-center mb-3">
            <h2 className="h6 text-uppercase fw-semibold text-muted mb-0">Triads in {NOTES[rootNote]} {MODES[mode].name}</h2>
            <div className="form-check form-switch mb-0 mx-5">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="show7thToggle"
                checked={show7th}
                onChange={(e) => setShow7th(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="show7thToggle">Show 7th</label>
            </div>
          </div>
          <div className="triads-grid">
            {triads.map((triad) => (
                <div key={triad.numeral} className={`card h-100 text-center triad-card ${triad.quality}`}>
                  <div className="card-body">
                    <h6 className="card-title mb-1 triad-numeral">{triad.numeral}</h6>
                    <p className="card-text fw-medium mb-1 triad-name">{triad.name}</p>
                    <p className="card-text small text-muted mb-0 triad-notes">{triad.notes.join(' - ')}{show7th && <span className="triad-seventh"> - {triad.seventh}</span>}</p>
                  </div>
                </div>
            ))}
          </div>
        
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
            <span className="triad-key"><span className="triad-key-swatch M"></span>Major</span>
            <span className="triad-key"><span className="triad-key-swatch m"></span>Minor</span>
            <span className="triad-key"><span className="triad-key-swatch dim"></span>Diminished</span>
            <span className="triad-key"><span className="triad-key-swatch aug"></span>Augmented</span>
          </div>
        </div>
      <div className="text-center py-4 text-muted small">
         <button
              className="btn btn-outline-secondary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#settingsOffcanvas"
            >
              <i className="bi bi-list"></i>&nbsp;Change Key
            </button>
      </div>
      <div className="text-center py-4 text-muted small">
        &copy; {new Date().getFullYear()} by <a href="https://chadmusick.com" className="text-decoration-none text-primary">Chad Musick</a>
      </div>
    </>
  )
}

export default App
