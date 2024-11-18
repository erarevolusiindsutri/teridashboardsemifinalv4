import { create } from 'zustand';
import { UnitData } from '../types';

interface DashboardState {
  selectedUnit: UnitData['type'] | null;
  unitData: Record<UnitData['type'], UnitData>;
  setSelectedUnit: (unit: UnitData['type'] | null) => void;
  updateUnitData: (type: UnitData['type'], data: Partial<UnitData>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedUnit: null,
  unitData: {
    product: {
      type: 'product',
      value: 85,
      trend: 0.12,
      lastUpdated: new Date().toISOString(),
    },
    sales: {
      type: 'sales',
      value: 92,
      trend: 0.15,
      lastUpdated: new Date().toISOString(),
    },
    finance: {
      type: 'finance',
      value: 78,
      trend: -0.05,
      lastUpdated: new Date().toISOString(),
    },
  },
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
  updateUnitData: (type, data) =>
    set((state) => ({
      unitData: {
        ...state.unitData,
        [type]: { ...state.unitData[type], ...data },
      },
    })),
}));