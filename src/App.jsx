import { useState } from 'react';
import StationInput from './components/StationInput';
import ResultSteps from './components/ResultSteps';
import {
  pickRandomLine,
  pickRandomDirection,
  findNearestStation,
  pickDestination,
  getDirectionStats,
  getLineInfo,
} from './utils/subway';
import './App.css';

export default function App() {
  const [departure, setDeparture] = useState('');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [maxStops, setMaxStops] = useState('');

  function handleStart(stationName) {
    const dep = stationName ?? departure;
    if (!dep.trim()) return;

    if (stationName) setDeparture(stationName);

    const lineId = pickRandomLine();
    const lineInfo = getLineInfo(lineId);
    const boarding = findNearestStation(dep, lineId);
    const direction = pickRandomDirection();
    const directionStats = getDirectionStats(lineId, boarding.name);

    setResult({
      lineId,
      lineName: lineInfo.name,
      lineColor: lineInfo.color,
      boarding,
      direction,
      directionStats,
      destination: null,
    });
    setCurrentStep(0);
    setIsRunning(true);
    setMaxStops('');
  }

  function handleNextStep() {
    if (currentStep === 1) {
      const dest = pickDestination(
        result.lineId,
        result.boarding.name,
        result.direction,
        maxStops ? parseInt(maxStops, 10) : null,
      );
      setResult((r) => ({ ...r, destination: dest }));
      setCurrentStep(2);
      setIsRunning(false);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleReset() {
    setResult(null);
    setCurrentStep(-1);
    setIsRunning(false);
    setDeparture('');
    setMaxStops('');
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-label">RANDOM SUBWAY TRIP</span>
        <h1 className="app-title">어디로<br />떠날까</h1>
      </header>
      <main className="app-main">
        {currentStep === -1 ? (
          <StationInput
            value={departure}
            onChange={setDeparture}
            onStart={handleStart}
          />
        ) : (
          <ResultSteps
            result={result}
            departure={departure}
            currentStep={currentStep}
            isRunning={isRunning}
            maxStops={maxStops}
            onMaxStopsChange={setMaxStops}
            onNext={handleNextStep}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
