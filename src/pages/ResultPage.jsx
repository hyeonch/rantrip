import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultSteps from '../components/ResultSteps';
import DestinationScreen from '../components/DestinationScreen';
import { pickDestination } from '../utils/subway';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(state?.result ?? null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [maxStops, setMaxStops] = useState('');

  if (!state) {
    navigate('/');
    return null;
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
    navigate('/');
  }

  return (
    <>
      <ResultSteps
        result={result}
        departure={state.departure}
        currentStep={currentStep}
        isRunning={isRunning}
        maxStops={maxStops}
        onMaxStopsChange={setMaxStops}
        onNext={handleNextStep}
        onReset={handleReset}
      />
      {result?.destination && !isRunning && (
        <DestinationScreen
          destination={result.destination}
          result={result}
          onReset={handleReset}
        />
      )}
    </>
  );
}
