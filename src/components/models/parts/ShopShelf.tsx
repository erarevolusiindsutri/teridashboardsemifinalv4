import { Shape } from 'three';

interface ShopShelfProps {
  position: [number, number, number];
}

export function ShopShelf({ position }: ShopShelfProps) {
  const shelfShape = new Shape();
  shelfShape.moveTo(-0.15, 0);
  shelfShape.lineTo(0.15, 0);
  shelfShape.lineTo(0.15, 0.05);
  shelfShape.lineTo(-0.15, 0.05);
  
  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  };

  return (
    <mesh position={position} castShadow>
      <extrudeGeometry args={[shelfShape, extrudeSettings]} />
      <meshPhysicalMaterial 
        color="#ff4444" 
        metalness={0.3} 
        roughness={0.7}
        clearcoat={0.1}
        clearcoatRoughness={0.4}
      />
    </mesh>
  );
}