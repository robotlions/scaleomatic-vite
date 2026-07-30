import { useState, useEffect, useRef } from "react";
import { Tooltip } from "bootstrap";
import "./App.css";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const MODES = [
  {
    name: "Ionian (Major)",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    qualities: ["M", "m", "m", "M", "M", "m", "dim"],
  },
  {
    name: "Dorian",
    intervals: [2, 1, 2, 2, 2, 1, 2],
    qualities: ["m", "dim", "M", "M", "m", "m", "M"],
  },
  {
    name: "Phrygian",
    intervals: [1, 2, 2, 2, 1, 2, 2],
    qualities: ["dim", "M", "m", "m", "m", "M", "M"],
  },
  {
    name: "Lydian",
    intervals: [2, 2, 2, 1, 2, 2, 1],
    qualities: ["M", "M", "m", "dim", "M", "m", "m"],
  },
  {
    name: "Mixolydian",
    intervals: [2, 2, 1, 2, 2, 1, 2],
    qualities: ["M", "m", "dim", "M", "m", "m", "M"],
  },
  {
    name: "Aeolian (Minor)",
    intervals: [2, 1, 2, 2, 1, 2, 2],
    qualities: ["m", "dim", "M", "m", "m", "M", "M"],
  },
  {
    name: "Locrian",
    intervals: [1, 2, 2, 1, 2, 2, 2],
    qualities: ["dim", "M", "m", "m", "M", "M", "m"],
  },
  {
    name: "Harmonic Minor",
    intervals: [2, 1, 2, 2, 1, 3, 1],
    qualities: ["m", "dim", "aug", "m", "M", "M", "dim"],
  },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

const QUALITY_SUFFIX = { M: "", m: "m", dim: "dim", aug: "aug" };
const QUALITY_SUFFIX_7 = { M: "7", m: "m7", dim: "dim7", aug: "aug7" };
const QUALITY_SYMBOL = { M: "maj", m: "m", dim: "dim", aug: "aug" };

function getScaleNotes(rootNote, mode) {
  const intervals = MODES[mode].intervals;
  const notes = [rootNote];
  let current = rootNote;
  for (let i = 0; i < 6; i++) {
    current = (current + intervals[i]) % 12;
    notes.push(current);
  }
  return notes;
}

const LETTER_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_NATURAL = [0, 2, 4, 5, 7, 9, 11];
const CHROMATIC_TO_LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

function spellNote(chromaticIndex, letterIndex) {
  const letter = LETTER_NAMES[letterIndex];
  const natural = LETTER_NATURAL[letterIndex];
  const diff = (chromaticIndex - natural + 12) % 12;
  if (diff === 1) return letter + "#";
  if (diff === 11) return letter + "b";
  return letter;
}

function spellScale(rootNote, mode) {
  const rootLetter = CHROMATIC_TO_LETTER[rootNote];
  const scaleNotes = getScaleNotes(rootNote, mode);
  return scaleNotes.map((note, i) => spellNote(note, (rootLetter + i) % 7));
}

const LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function noteToChromatic(spelled) {
  const letter = spelled[0];
  const accidental = spelled.slice(1);
  let chrom = LETTER_NATURAL[LETTER_INDEX[letter]];
  if (accidental === "#") chrom = (chrom + 1) % 12;
  else if (accidental === "b") chrom = (chrom + 11) % 12;
  else if (accidental === "##" || accidental === "x") chrom = (chrom + 2) % 12;
  else if (accidental === "bb") chrom = (chrom + 10) % 12;
  return chrom;
}

const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const WHITE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_DEFS = [
  { afterWhite: 0, offset: 1 },
  { afterWhite: 1, offset: 3 },
  { afterWhite: 3, offset: 6 },
  { afterWhite: 4, offset: 8 },
  { afterWhite: 5, offset: 10 },
];

function PianoChord({ triad, show7th }) {
  const rootChrom = noteToChromatic(triad.root);
  const notes = triad.notes.map(noteToChromatic);
  const seventhChrom = noteToChromatic(triad.seventh);
  const offsets = notes.map((c) => (c - rootChrom + 12) % 12);
  const seventhOffset = (seventhChrom - rootChrom + 12) % 12;

  const startWhiteIdx = (() => {
    let idx = 0;
    for (let i = 0; i < WHITE_SEMITONES.length; i++) {
      if (WHITE_SEMITONES[i] <= rootChrom) idx = i;
    }
    return idx;
  })();
  const pressed = new Set([
    rootChrom,
    rootChrom + offsets[1],
    rootChrom + offsets[2],
  ]);
  if (show7th) pressed.add(rootChrom + seventhOffset);

  const labelBySemitone = {
    [rootChrom]: triad.root,
    [rootChrom + offsets[1]]: triad.notes[1],
    [rootChrom + offsets[2]]: triad.notes[2],
  };
  if (show7th) labelBySemitone[rootChrom + seventhOffset] = triad.seventh;

  const chordTones = show7th ? [...triad.notes, triad.seventh] : triad.notes;
  const useFlats = chordTones.some((n) => n.includes("b"));

  const KEY_W = 40;
  const KEY_H = 160;
  const BLACK_W = 24;
  const BLACK_H = 100;
  const WHITE_COUNT = 8;

  const whiteKeys = [];
  for (let k = 0; k < WHITE_COUNT; k++) {
    const oct = Math.floor((startWhiteIdx + k) / 7);
    const within = (startWhiteIdx + k) % 7;
    const semitone = oct * 12 + WHITE_SEMITONES[within];
    whiteKeys.push({
      x: k * KEY_W,
      semitone,
      letter: labelBySemitone[semitone] ?? WHITE_LETTERS[within],
      pressed: pressed.has(semitone),
    });
  }

  const blackKeys = [];
  for (let k = 0; k < WHITE_COUNT; k++) {
    const oct = Math.floor((startWhiteIdx + k) / 7);
    const within = (startWhiteIdx + k) % 7;
    const black = BLACK_DEFS.find((b) => b.afterWhite === within);
    if (!black) continue;
    const semitone = oct * 12 + WHITE_SEMITONES[within] + 1;
    blackKeys.push({
      x: (k + 1) * KEY_W - BLACK_W / 2,
      semitone,
      letter:
        labelBySemitone[semitone] ??
        (useFlats
          ? WHITE_LETTERS[(within + 1) % 7] + "b"
          : WHITE_LETTERS[within] + "#"),
      pressed: pressed.has(semitone),
    });
  }

  const totalWidth = WHITE_COUNT * KEY_W;
  const PRESSED = "#888888";

  return (
    <svg
      className="piano-chord"
      viewBox={`0 0 ${totalWidth} ${KEY_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Piano showing ${show7th ? triad.name7 : triad.name}`}
    >
      {whiteKeys.map((wk, i) => (
        <g key={`w${i}`}>
          <rect
            x={wk.x}
            y={0}
            width={KEY_W}
            height={KEY_H}
            rx={3}
            fill={wk.pressed ? PRESSED : "#ffffff"}
            stroke="#333"
            strokeWidth={1}
          />
          <text
            x={wk.x + KEY_W / 2}
            y={KEY_H - 10}
            textAnchor="middle"
            fontSize={13}
            fontFamily="var(--bs-font-monospace)"
            fill={wk.pressed ? "#ffffff" : "#000000"}
          >
            {wk.letter}
          </text>
        </g>
      ))}
      {blackKeys.map((bk, i) => (
        <g key={`b${i}`}>
          <rect
            x={bk.x}
            y={0}
            width={BLACK_W}
            height={BLACK_H}
            rx={2}
            fill={bk.pressed ? PRESSED : "#111111"}
            stroke="#000"
            strokeWidth={1}
          />
          <text
            x={bk.x + BLACK_W / 2}
            y={BLACK_H - 8}
            textAnchor="middle"
            fontSize={11}
            fontFamily="var(--bs-font-monospace)"
            fill="#ffffff"
          >
            {bk.letter}
          </text>
        </g>
      ))}
    </svg>
  );
}

function getTriads(rootNote, mode) {
  const qualities = MODES[mode].qualities;
  const scaleNotes = getScaleNotes(rootNote, mode);
  const spelled = spellScale(rootNote, mode);

  const rootLetter = CHROMATIC_TO_LETTER[rootNote];

  return scaleNotes.map((note, i) => {
    const third = (i + 2) % 7;
    const fifth = (i + 4) % 7;
    const quality = qualities[i];
    const roman =
      quality === "M" || quality === "dim" || quality === "aug"
        ? ROMAN[i]
        : ROMAN[i].toLowerCase();

    const seventhLetter = (rootLetter + i + 6) % 7;
    const seventhSemitone = quality === "dim" ? 9 : 10;
    const seventhChrom = (note + seventhSemitone) % 12;
    const seventh = spellNote(seventhChrom, seventhLetter);

    return {
      numeral:
        quality === "dim"
          ? roman + "\u00B0"
          : quality === "aug"
            ? roman + "+"
            : roman,
      root: spelled[i],
      name: spelled[i] + QUALITY_SUFFIX[quality],
      name7: spelled[i] + QUALITY_SUFFIX_7[quality],
      notes: [spelled[i], spelled[third], spelled[fifth]],
      seventh: seventh,
      quality,
      qualityLabel: QUALITY_SYMBOL[quality],
    };
  });
}

function App() {
  const [rootNote, setRootNote] = useState(0);
  const [mode, setMode] = useState(0);
  const [show7th, setShow7th] = useState(false);
  const [selectedTriad, setSelectedTriad] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;
    const onHide = () => setSelectedTriad(null);
    modalEl.addEventListener("hidden.bs.modal", onHide);
    return () => modalEl.removeEventListener("hidden.bs.modal", onHide);
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    const entries = [...tooltipTriggerList].map((el) => {
      const tooltip = new Tooltip(el);
      const onClick = (e) => {
        e.preventDefault();
        tooltip.show();
      };
      el.addEventListener("click", onClick);
      return { tooltip, el, onClick };
    });
    return () => {
      entries.forEach(({ tooltip, el, onClick }) => {
        el.removeEventListener("click", onClick);
        tooltip.dispose();
      });
    };
  });

  const triads = getTriads(rootNote, mode);
  const spelled = spellScale(rootNote, mode);

  return (
    <>
      <nav className="navbar bg-body-tertiary mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img
              src="/robotLionsGuitar.jpg"
              alt="Robot Lions"
              style={{ height: "40px" }}
              className="rounded"
            />
            <span
              className="navbar-brand mb-0"
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#333333" }}
            >
              Scale-O-Matic 3000
            </span>
          </div>
          <a
            href="https://robotlions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-muted"
          >
            robotlions.com
          </a>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="settingsOffcanvas"
        aria-labelledby="settingsOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-4">
            <h6 className="text-uppercase fw-semibold text-muted mb-3">
              Root Note
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {NOTES.map((note, i) => (
                <button
                  key={note}
                  className={`btn btn-outline-secondary rounded-circle note-btn ${i === rootNote ? " active" : ""}`}
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
                  className={`btn btn-outline-secondary rounded-pill mode-btn${i === mode ? " active" : ""}`}
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
        <h2 className="fw-bold text-primary text-center mb-1">
          {NOTES[rootNote]} {MODES[mode].name}
        </h2>
        <div className="text-center mb-1">
          <button
            style={{ fontSize: "small" }}
            className="btn btn-secondary key-btn mx-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#settingsOffcanvas"
          >
            Change Key
          </button>
        </div>

        <div className="row mb-1 mt-5">
            <div className="col text-center">
              <h2 className="h6 text-uppercase fw-semibold text-muted mb-0">
                Notes in {NOTES[rootNote]} {MODES[mode].name}
              </h2>
            </div>
          </div>
        <div className="mb-3">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {spelled.map((note, i) => (
              <span
                style={{ fontWeight: "bold" }}
                key={i}
                className="fs-4 px-3 py-2"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="row mb-3">
            <div className="col text-center">
              <h2 className="h6 text-uppercase fw-semibold text-muted mb-0">
                Triads in {NOTES[rootNote]} {MODES[mode].name}
              </h2>
            </div>
          </div>

          <div className="triads-grid">
            {triads.map((triad, i) => (
              <div
                key={triad.numeral}
                className={`card h-100 text-center triad-card ${triad.quality}${i === selectedTriad ? " selected" : ""}`}
                data-bs-toggle="modal"
                data-bs-target="#pianoModal"
                onClick={() => setSelectedTriad(i)}
              >
                <div className="card-body">
                  <h6 className="card-title mb-1 triad-numeral">
                    {triad.numeral}
                  </h6>
                  <p className="card-text fw-medium mb-1 triad-name">
                    {show7th ? triad.name7 : triad.name}
                  </p>
                  <p className="card-text small text-muted mb-0 triad-notes">
                    {triad.notes.join(" - ")}
                    {show7th && (
                      <span className="triad-seventh"> - {triad.seventh}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <br />
          <div className="row mb-3">
            <div className="col text-center">
              <div className="form-check form-switch d-inline-block">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="show7thToggle"
                  checked={show7th}
                  onChange={(e) => setShow7th(e.target.checked)}
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="show7thToggle"
                >
                  Show 7th
                </label>
                <i
                  className="bi bi-info-circle ms-2 text-muted"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="This app uses dominant sevenths rather than diatonic sevenths. For more information on sevenths, consult your local jazz musician."
                ></i>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
            <span className="triad-key">
              <span className="triad-key-swatch M"></span>Major
            </span>
            <span className="triad-key">
              <span className="triad-key-swatch m"></span>Minor
            </span>
            <span className="triad-key">
              <span className="triad-key-swatch dim"></span>Diminished
            </span>
            <span className="triad-key">
              <span className="triad-key-swatch aug"></span>Augmented
            </span>
          </div>
          <br />
          {selectedTriad !== null ? (
            <p className="text-center text-muted fst-italic mb-0">
              Showing piano for{" "}
              {show7th
                ? triads[selectedTriad].name7
                : triads[selectedTriad].name}
              .
            </p>
          ) : (
            <p className="text-center text-muted fst-italic mb-0">
              Click on a triad to see it on piano.
            </p>
          )}
        </div>

        <div
          className="modal fade"
          id="pianoModal"
          tabIndex="-1"
          ref={modalRef}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedTriad !== null && (
                    <>
                      {show7th
                        ? triads[selectedTriad].name7
                        : triads[selectedTriad].name}{" "}
                      &mdash; {triads[selectedTriad].notes.join(" - ")}
                      {show7th && (
                        <span className="piano-seventh">
                          {" "}
                          - {triads[selectedTriad].seventh}
                        </span>
                      )}
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedTriad !== null && (
                  <PianoChord triad={triads[selectedTriad]} show7th={show7th} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-muted small">
        &copy; {new Date().getFullYear()} by{" "}
        <a
          href="https://chadmusick.com"
          className="text-decoration-none text-primary"
        >
          Chad Musick
        </a>
      </div>
    </>
  );
}

export default App;
