import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group, Vector3 } from 'three';

export function DriftingClouds() {
  const groupRef = useRef<Group>();
  const cloudsRef = useRef<Vector3[]>([]);

  // Initialize cloud positions and velocities
  if (cloudsRef.current.length === 0) {
    cloudsRef.current = Array(6).fill(null).map(() => {
      const radius = 60 + Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      return new Vector3(
        Math.cos(angle) * radius,
        12 + Math.random() * 6, // Lowered height range
        Math.sin(angle) * radius
      );
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((cloud, i) => {
        // Very slow inward spiral movement
        const pos = cloudsRef.current[i];
        const angle = Math.atan2(pos.z, pos.x);
        const radius = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        const newRadius = radius - 0.01;
        const newAngle = angle + 0.0001;

        if (newRadius < 20) {
          // Reset cloud to outer radius when it gets too close
          const resetRadius = 60 + Math.random() * 20;
          const resetAngle = Math.random() * Math.PI * 2;
          pos.set(
            Math.cos(resetAngle) * resetRadius,
            12 + Math.random() * 6, // Maintain consistent height range
            Math.sin(resetAngle) * resetRadius
          );
        } else {
          pos.set(
            Math.cos(newAngle) * newRadius,
            pos.y + Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.002,
            Math.sin(newAngle) * newRadius
          );
        }

        cloud.position.copy(pos);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cloudsRef.current.map((pos, i) => (
        <Cloud
          key={`drifting-${i}`}
          position={[pos.x, pos.y, pos.z]}
          opacity={0.15} // Slightly reduced opacity
          speed={0.1}
          width={20}
          depth={4}
          segments={6}
          color="#b4c4e0"
          depthWrite={false}
          transparent
          renderOrder={-1}
        />
      ))}
    </group>
  );
}