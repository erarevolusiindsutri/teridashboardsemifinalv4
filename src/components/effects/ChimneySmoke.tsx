import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group, Vector3 } from 'three';

interface ChimneySmokeProps {
  position: [number, number, number];
}

export function ChimneySmoke({ position }: ChimneySmokeProps) {
  const smokeRef = useRef<Group>(null);
  const worldPosition = useRef(new Vector3(...position));
  const initialY = position[1];

  useFrame(() => {
    if (smokeRef.current) {
      // Use absolute world position instead of relative
      smokeRef.current.position.y = worldPosition.current.y;
      worldPosition.current.y += 0.001;
      
      if (worldPosition.current.y > initialY + 0.25) {
        worldPosition.current.y = initialY;
      }
    }
  });

  return (
    <group ref={smokeRef} position={position} matrixAutoUpdate={false}>
      <Cloud
        opacity={0.08}
        speed={0.1}
        width={0.16}
        depth={0.16}
        segments={2}
        color="#999999"
        matrixAutoUpdate={false}
      />
    </group>
  );
}