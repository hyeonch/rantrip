import stationsData from '../data/stations.json';

// stations.json의 lines 구조에서 파생 — stationName: { lineId: index }
const stationsIndex = {};
Object.entries(stationsData.lines).forEach(([lineId, lineData]) => {
  lineData.stations.forEach((station, idx) => {
    if (station.order % 1 !== 0) return; // 지선 역 제외
    if (!stationsIndex[station.name]) stationsIndex[station.name] = {};
    stationsIndex[station.name][lineId] = idx;
  });
});

export function getLinesByStation(stationName) {
  return Object.keys(stationsIndex[stationName] ?? {});
}

export function pickRandomLine() {
  const lineIds = Object.keys(stationsData.lines);
  return lineIds[Math.floor(Math.random() * lineIds.length)];
}

// 출발역이 해당 호선에 없을 때, 환승 가능한 가장 가까운 역 반환 (정거장 수 기준)
export function findNearestStation(stationName, lineId) {
  const stationInfo = stationsIndex[stationName];
  const lineStations = stationsData.lines[lineId].stations;

  if (stationInfo?.[lineId] !== undefined) {
    return { name: stationName, matched: true };
  }

  if (!stationInfo) {
    return { name: lineStations[0].name, matched: false };
  }

  let nearest = null;
  let minDist = Infinity;

  Object.entries(stationsIndex).forEach(([name, lines]) => {
    if (lines[lineId] === undefined) return;
    Object.entries(stationInfo).forEach(([depLineId, depIdx]) => {
      if (lines[depLineId] === undefined) return;
      const dist = Math.abs(lines[depLineId] - depIdx);
      if (dist < minDist) {
        minDist = dist;
        nearest = name;
      }
    });
  });

  if (nearest) return { name: nearest, matched: false };

  // 직접 환승역 없는 경우 정규화 위치 fallback
  const [depLineId, depIdx] = Object.entries(stationInfo)[0];
  const position = depIdx / Math.max(stationsData.lines[depLineId].stations.length - 1, 1);
  const targetIdx = Math.round(position * (lineStations.length - 1));
  return { name: lineStations[targetIdx].name, matched: false };
}

export function pickRandomDirection() {
  return Math.random() < 0.5 ? 'up' : 'down';
}

export function getDirectionStats(lineId, boardingStationName) {
  const stations = stationsData.lines[lineId].stations;
  const boardingIdx = stations.findIndex((s) => s.name === boardingStationName);
  return {
    upCount: boardingIdx,
    downCount: stations.length - boardingIdx - 1,
  };
}

export function pickDestination(lineId, boardingStationName, direction, maxStops) {
  const stations = stationsData.lines[lineId].stations;
  const boardingIdx = stations.findIndex((s) => s.name === boardingStationName);

  let candidates = direction === 'up'
    ? stations.slice(0, boardingIdx)
    : stations.slice(boardingIdx + 1);

  if (candidates.length === 0) {
    candidates = direction === 'up'
      ? stations.slice(boardingIdx + 1)
      : stations.slice(0, boardingIdx);
  }

  if (maxStops && maxStops > 0 && maxStops < candidates.length) {
    // up: 탑승역에 가까운 쪽(slice 끝)에서 N개, down: 탑승역에 가까운 쪽(slice 앞)에서 N개
    candidates = direction === 'up'
      ? candidates.slice(-maxStops)
      : candidates.slice(0, maxStops);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getLineInfo(lineId) {
  return stationsData.lines[lineId];
}

export function getAllStationNames() {
  return Object.keys(stationsIndex).sort();
}
