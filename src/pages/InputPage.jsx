import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationInput from '../components/StationInput';
import {
  pickRandomLine,
  getLineInfo,
  findNearestStation,
  pickRandomDirection,
  getDirectionStats,
} from '../utils/subway';

export default function InputPage() {
  const [departure, setDeparture] = useState('');
  const navigate = useNavigate();

  function handleStart(stationName) {
    const dep = stationName ?? departure;
    if (!dep.trim()) return;

    const lineId = pickRandomLine();
    const lineInfo = getLineInfo(lineId);
    const boarding = findNearestStation(dep, lineId);
    const direction = pickRandomDirection();
    const directionStats = getDirectionStats(lineId, boarding.name);

    navigate('/result', {
      state: {
        departure: stationName ?? dep,
        result: {
          lineId,
          lineName: lineInfo.name,
          lineColor: lineInfo.color,
          boarding,
          direction,
          directionStats,
          destination: null,
        },
      },
    });
  }

  return (
    <StationInput
      value={departure}
      onChange={setDeparture}
      onStart={handleStart}
    />
  );
}
