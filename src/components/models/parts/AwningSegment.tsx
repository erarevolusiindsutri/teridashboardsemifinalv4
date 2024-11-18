import { Shape } from 'three';

interface AwningSegmentProps {
  position: [number, number, number];
}

export function AwningSegment({ position }: AwningSegmentProps) {
  const awningShape = new Shape();
  awningShape.moveTo(-0.9, 0);
  awningShape.lineTo(0.9, 0);
  awningShape.lineTo(0.8, 0.3);
  awningShape.lineTo(-0.8, 0.3);
  
  const extrudeSettings = {
    steps: 1,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  };

  return (
    <mesh position={position} rotation={[Math.PI / 6, 0, 0]} castShadow>
      <extrudeGeometry args={[awningShape, extrudeSettings]} />
      <meshPhysicalMaterial 
        color="#ff4444" 
        metalness={0.2} 
        roughness={0.8}
        clearcoat={0.1}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}