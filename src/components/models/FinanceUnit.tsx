import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Shape } from 'three';

// Separate column component for reuse
const Column = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Column Base */}
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.4, 0.15, 0.4]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
    
    {/* Column Shaft */}
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.18, 1.6, 8]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
    
    {/* Column Capital */}
    <mesh position={[0, 1.6, 0]} castShadow>
      <boxGeometry args={[0.4, 0.15, 0.4]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  </group>
);

export function FinanceUnit({ color, isSelected }: { color: string; isSelected: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = isSelected ? 1.2 : 1;
      groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });

  const glowIntensity = isSelected ? 1.5 : 0.8;
  const glowColor = "#44ffaa";

  // Create triangular roof shape
  const createRoofShape = () => {
    const shape = new Shape();
    shape.moveTo(-1.2, 0);
    shape.lineTo(1.2, 0);
    shape.lineTo(0, 0.8);
    shape.lineTo(-1.2, 0);

    return (
      <mesh position={[0, 2, 1.2]} rotation={[0, Math.PI / 1, 0]} castShadow>
        <extrudeGeometry 
          args={[shape, {
            depth: 2.4,
            bevelEnabled: false
          }]}
        />
        <meshStandardMaterial color="#4477dd" />
      </mesh>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Base Platform with Steps */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.3, 3.2]} />
        <meshStandardMaterial 
          color="#e8e8e8"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Steps */}
      {[0.3, 0.2, 0.1].map((height, i) => (
        <mesh 
          key={`step-${i}`}
          position={[0, height, 1.2 - i * 0.2]} 
          receiveShadow
        >
          <boxGeometry args={[2.2, 0.1, 0.4]} />
          <meshStandardMaterial color="#d8d8d8" />
        </mesh>
      ))}

      {/* Main Building Structure */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.8, 1.9]} />
        <meshStandardMaterial 
          color="#e8e8e8"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Columns */}
      {[
        [-1.0, 0.3, 1.0],
        [1.0, 0.3, 1.0],
        [-1.0, 0.3, -1.0],
        [1.0, 0.3, -1.0]
      ].map((pos, i) => (
        <Column key={`column-${i}`} position={pos as [number, number, number]} />
      ))}

      {/* Roof */}
      {createRoofShape()}

      {/* Front Door */}
      <mesh position={[0, 1, 1]} castShadow>
        <boxGeometry args={[0.9, 1.6, 0.05]} />
        <meshPhysicalMaterial
          color="#885533"
          metalness={0.5}
          roughness={0.3}
          emissive={glowColor}
          emissiveIntensity={glowIntensity * 0.3}
        />
      </mesh>

      {/* Windows */}
      {[-0.7, 0.7].map((x) => (
        <group key={`windows-${x}`}>
          {/* Front Windows */}
          <mesh position={[x, 1.2, 0.9]} castShadow>
            <boxGeometry args={[0.5, 0.8, 0.05]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0.1}
              transmission={0.8}
              thickness={0.5}
              emissive={glowColor}
              emissiveIntensity={glowIntensity}
            />
          </mesh>

          {/* Side Windows */}
          {[-0.5, 0, 0.5].map((z) => (
            <mesh key={`side-window-${x}-${z}`} position={[x * 1.11, 1.2, z]} castShadow>
              <boxGeometry args={[0.05, 0.8, 0.5]} />
              <meshPhysicalMaterial
                color="#ffffff"
                metalness={0.1}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
                emissive={glowColor}
                emissiveIntensity={glowIntensity}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Window Lights */}
      {[-0.7, 0.7].map((x) => (
        <group key={`lights-${x}`}>
          <pointLight
            position={[x, 1.2, 1.0]}
            color={glowColor}
            intensity={isSelected ? 0.4 : 0.2}
            distance={2}
            decay={2}
          />
          {[-0.5, 0, 0.5].map((z) => (
            <pointLight
              key={`side-light-${x}-${z}`}
              position={[x * 1.1, 1.2, z]}
              color={glowColor}
              intensity={isSelected ? 0.3 : 0.15}
              distance={2}
              decay={2}
            />
          ))}
        </group>
      ))}

      {/* Entrance Light */}
      <spotLight
        position={[0, 2, 1.5]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={isSelected ? 0.3 : 0.15}
        color={glowColor}
        castShadow
        distance={3}
        decay={2}
      />

      {/* Ground Reflection Light */}
      <pointLight
        position={[0, 0.1, 0]}
        color={glowColor}
        intensity={isSelected ? 0.2 : 0.1}
        distance={3}
        decay={2}
      />
    </group>
  );
}