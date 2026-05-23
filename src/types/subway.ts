export type Direction = 'up' | 'down';

export type Station = {
  name: string;
  code: string;
  order: number;
};

export type Line = {
  name: string;
  color: string;
  stations: Station[];
};

export type LineId = string;

export type StationsData = {
  lines: Record<LineId, Line>;
};

export type BoardingStation = {
  name: string;
  matched: boolean;
};

export type DirectionStats = {
  upCount: number;
  downCount: number;
};

export type TripResult = {
  lineId: LineId;
  lineName: string;
  lineColor: string;
  boarding: BoardingStation;
  direction: Direction;
  directionStats: DirectionStats;
  destination: Station | null;
};
