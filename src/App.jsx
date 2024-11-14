import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { keyArray } from "./Data/ScaleObjects";
import { intToKey } from "./Data/ScaleObjects";
import { intToScale } from "./Data/ScaleObjects";
import { scaleArray } from "./Data/ScaleObjects";
import { intervalSteps } from "./Data/ScaleObjects";
import { minorSteps } from "./Data/ScaleObjects";
import bannerImage from "./assets/images/robotLionsGuitar.jpg";



function App() {
  const [currentKey, setCurrentKey] = useState(1);
  const [active, setActive] = useState(1);
  const [activeScale, setActiveScale] = useState(1);
  const [scaleDegree, setScaleDegree] = useState(1);
  let currentScaleArray = [];

 


  function convertKey(interval) {
    let x = currentKey + interval;
    if (x > 12) {
      x = x - 12;
    }
    return x;
  }

  function convertScaleIntervals(interval) {
    let x = scaleDegree + interval;
    if (x > 7) {
      x = x - 7;
    }
    return x;
  }

  function applyIntervalSteps(numOfDegrees) {
    let x = 0;
    for (let i = 0; i < numOfDegrees; i++) {
      let sdi = scaleDegree + i;
      if (sdi > 7) {
        sdi = sdi - 7;
      }
      x = x + intervalSteps[sdi];
    }
    return x;
  }

  function pushToCurrentScaleArray(degree){
    currentScaleArray.push(String(intToKey[convertKey(applyIntervalSteps(degree))]))

  }


  const KeyButton = ({ id, keyName, isActive, value }) => {
    return (
      <button
        id={id}
        value={value}
        type="button"
        className={
          isActive
            ? "keyButton btn btn-secondary buttonActive rounded-0"
            : "keyButton btn btn-secondary rounded-0"
        }
        onClick={(e) => {
          setCurrentKey(Number(e.target.value));
          setActive(Number(e.target.value));
          currentScaleArray=[];
        }}
      >
        {keyName}
      </button>
    );
  };

  const ScaleButton = ({
    id,
    scaleName,
    isActiveScale,
    value,
    scaleDegree,
  }) => {
    return (
      <button
        id={id}
        value={value}
        type="button"
        className={
          isActiveScale
            ? "scaleButton btn btn-secondary buttonActive rounded-0"
            : "scaleButton btn btn-secondary rounded-0"
        }
        onClick={(e) => {
          // setCurrentScale(Number(e.target.value));
          setActiveScale(Number(e.target.value));
          setScaleDegree(scaleDegree);
          currentScaleArray = [];
        }}
      >
        {scaleName}
      </button>
    );
  };

  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  return (
    <div className="container App raleway-body">
      <div style={{ display: "none" }}>
        <h1>
          Convert and find chords for scales and modes for guitar. Chord
          converter. Chord finder. Scale converter. Scale finder. Mode
          converter. Mode finder. Online music theory chord scale mode finder
          converter tool for guitar.
        </h1>
      </div>
      <div style={{ display: "none" }}>
        <h2>
          Tonic root key scale degree chord mode finder converter tool. Find and
          convert mode scale key.
        </h2>
      </div>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-brand">
            <a href="https://robotlions.com">
            <img
              src={bannerImage}
              height="100"
              width="100"
              className="img-fluid"
              alt="robot lion"
            /></a>
          </div>
            <div className="navbar-nav me-auto">
              <a className="nav-link" aria-current="page" href="https://robotlions.com">
                robotlions.com
              </a>
            </div>
        </div>
      </nav>

      <div className="row" style={{marginTop:50}}>
        <h2 className="raleway-headline">Scale-O-Matic 3000</h2>
        <h5 className="raleway-headline" style={{marginBottom:50}}>Chord Finder and Conversion Tool for Scales, Keys and Modes</h5>
        <br/>
      <h4 className="raleway-headline">Tonic</h4>

        <div className="col">
          {keyArray.map((item) => (
            <KeyButton
              isActive={active === item.idNo}
              keyName={item.keyName}
              value={item.idNo}
              key={item.idNo}
            />
          ))}
        </div>
      </div>
      <br />
      <br />
      <div className="row"><h4 className="raleway-headline">Mode</h4></div>

      <div className="row">
        <div className="col">
          {scaleArray.map((item) => (
            <ScaleButton
              isActiveScale={activeScale === item.idNo}
              scaleName={item.scaleName}
              value={item.idNo}
              scaleDegree={item.scaleDegree}
              key={item.idNo}
            />
          ))}
        </div>
      </div>
      
     
      <br />
      <br />
      <div className="row"><h4 className="raleway-headline">Chords in {intToKey[currentKey]} {intToScale[activeScale]}</h4></div>
      <div className="row justify-content-center">
        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">1</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
              {intToKey[currentKey]} {"\n"}
              {minorSteps[convertScaleIntervals(0)]}
              {pushToCurrentScaleArray(0)}
            </p>
          </div>
        </div>

        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">2</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(1))]}{"\n"}
              {minorSteps[convertScaleIntervals(1)]}
              {pushToCurrentScaleArray(1)}
            </p>
          </div>
        </div>

        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">3</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(2))]}{"\n"}
              {minorSteps[convertScaleIntervals(2)]}
              {pushToCurrentScaleArray(2)}            </p>
          </div>
        </div>

        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">4</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(3))]}{"\n"}
              {minorSteps[convertScaleIntervals(3)]}
              {pushToCurrentScaleArray(3)}
            </p>
          </div>
        </div>
        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">5</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(4))]}{"\n"}
              {minorSteps[convertScaleIntervals(4)]}
              {pushToCurrentScaleArray(4)}
            </p>
          </div>
        </div>
        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">6</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(5))]}{"\n"}
              {minorSteps[convertScaleIntervals(5)]}
              {pushToCurrentScaleArray(5)}
            </p>
          </div>
        </div>
        <div className="col-3 col-lg-1 panelWrapper">
          <div className="intervalHeader">
            <p className="intervalHeaderText">7</p>
          </div>
          <div className="intervalBody d-flex align-items-center justify-content-center">
            {currentScaleArray[5] ? 
            <p className="intervalBodyText">
            {intToKey[convertKey(applyIntervalSteps(6))]}{"\n"}
              {minorSteps[convertScaleIntervals(6)]}
              {pushToCurrentScaleArray(6)} 
            </p> : null
}
          </div>
        </div>
        <div className="row" style={{marginTop:30}}>
        <div className="col">
          <h4 className="raleway-headline">Notes in {intToKey[currentKey]} {intToScale[activeScale]} Scale</h4>
          {intToKey[currentKey]} - {intToKey[convertKey(applyIntervalSteps(1))]} - {intToKey[convertKey(applyIntervalSteps(2))]} - {intToKey[convertKey(applyIntervalSteps(3))]} - {intToKey[convertKey(applyIntervalSteps(4))]} - {intToKey[convertKey(applyIntervalSteps(5))]} - {intToKey[convertKey(applyIntervalSteps(6))]}
        </div>
      </div>
    
      <div className="row" style={{marginTop:30}}>
        <div className="col">
          <h4 className="raleway-headline">Notes in {intToKey[currentKey]} Triad in {intToScale[activeScale]}</h4>
          {intToKey[currentKey]} - {intToKey[convertKey(applyIntervalSteps(2))]} - {intToKey[convertKey(applyIntervalSteps(4))]}
        </div>
      </div>
      </div>
      <p style={{marginTop:30}}>Are you learning the guitar and need to memorize the fretboard? Try our <a href="https://guitartrainer.robotlions.com"> fretboard training app</a>.</p>
      <p style={{marginTop:50}}>© {currentYear} by <a href="https://chadmusick.com/">Chad Musick</a></p>
{console.log(currentScaleArray)}
    </div>
  );
}

export default App;
