import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { UnitProps } from '../types';
import { useDashboardStore } from '../store';
import { SalesUnit } from './models/SalesUnit';
import { ProductUnit } from './models/ProductUnit';
import { FinanceUnit } from './models/FinanceUnit';

const DataLine = ({ start, end, active }: { start: number[], end: number[], active: boolean }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (active) {
      lineRef.current.material.dashOffset -= 0.01;
    }
  });

  const points = [
    new Vector3(...start),
    new Vector3(start[0], 0, start[2]),
    new Vector3(start[0], 0, end[2]),
    new Vector3(end[0], 0, end[2]),
    new Vector3(...end)
  ];

  return (
    <Line
      ref={lineRef}
      points={points}
      color={active ? "#4affff" : "#333333"}
      lineWidth={2}
      dashed={true}
      dashScale={20}
      dashSize={0.2}
      dashOffset={0}
    />
  );
};

const Unit = ({ position, color, type, data, onClick }: UnitProps) => {
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);
  const isSelected = selectedUnit === type;

  const getUnitModel = () => {
    switch(type) {
      case 'product': return <ProductUnit color={color} isSelected={isSelected} />;
      case 'sales': return <SalesUnit color={color} isSelected={isSelected} />;
      case 'finance': return <FinanceUnit color={color} isSelected={isSelected} />;
    }
  };

  return (
    <group position={position} onClick={onClick}>
      {getUnitModel()}
    </group>
  );
};

export function Units() {
  const { unitData, selectedUnit, setSelectedUnit } = useDashboardStore();

  const positions = {
    sales: [0, 0, -4],
    product: [-6, 0, 4],
    finance: [6, 0, 4]
  };

  const handleUnitClick = (type: UnitProps['type']) => {
    setSelectedUnit(selectedUnit === type ? null : type);
  };

  return (
    <group>
      {Object.entries(positions).map(([type, position]) => (
        <Unit
          key={type}
          position={position}
          color={type === 'product' ? "#666666" : type === 'sales' ? "#888888" : "#777777"}
          type={type as UnitProps['type']}
          data={unitData[type as UnitProps['type']]}
          onClick={() => handleUnitClick(type as UnitProps['type'])}
        />
      ))}
      
      <DataLine 
        start={positions.product} 
        end={positions.sales}
        active={selectedUnit === 'product' || selectedUnit === 'sales'} 
      />
      <DataLine 
        start={positions.sales} 
        end={positions.finance}
        active={selectedUnit === 'sales' || selectedUnit === 'finance'} 
      />
      <DataLine 
        start={positions.finance} 
        end={positions.product}
        active={selectedUnit === 'finance' || selectedUnit === 'product'} 
      />
    </group>
  );
}