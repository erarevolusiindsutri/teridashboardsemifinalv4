export interface UnitData {
  type: 'product' | 'sales' | 'finance';
  value: number;
  trend: number;
  lastUpdated: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface UnitProps {
  position: [number, number, number];
  color: string;
  type: UnitData['type'];
  data: UnitData;
  onClick: () => void;
}