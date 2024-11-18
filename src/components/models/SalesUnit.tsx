import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function SalesUnit({ color, isSelected }: { color: string; isSelected: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = isSelected ? 1.2 : 1;
      groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });

  const glowIntensity = isSelected ? 1.5 : 0.8;
  const glowColor = "#ff9966";

  return (
    <group ref={groupRef}>
      {/* Base Platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.1, 2.4]} />
        <meshStandardMaterial 
          color="#cccccc"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Main Building Structure */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#e8e8e8"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.2, 2.2]} />
        <meshStandardMaterial 
          color="#d0d0d0"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Shop Sign */}
      <mesh position={[0, 1.8, 1.1]} castShadow>
        <boxGeometry args={[1.6, 0.4, 0.1]} />
        <meshStandardMaterial
          color="#ff4422"
          emissive="#ff4422"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Storefront Windows */}
      <mesh position={[0, 0.8, 1.01]} castShadow>
        <boxGeometry args={[1.4, 1.2, 0.05]} />
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
      {[-1.01, 1.01].map((x) => (
        <mesh key={`side-${x}`} position={[x, 1, 0]} castShadow>
          <boxGeometry args={[0.05, 1, 1.2]} />
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

      {/* Striped Awning */}
      <group position={[0, 1.7, 1.3]}>
        {[...Array(5)].map((_, i) => (
          <mesh key={`awning-${i}`} position={[-0.8 + i * 0.4, 0, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 0.4, 0.05]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#ff4422" : "#ffffff"}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Door */}
      <mesh position={[0.7, 0.6, 1.01]} castShadow>
        <boxGeometry args={[0.4, 1.2, 0.05]} />
        <meshPhysicalMaterial
          color="#bebebe"
          metalness={0.1}
          roughness={0.1}
          transmission={0.8}
          thickness={0.5}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>

      {/* AC Unit on Roof */}
      <mesh position={[0.6, 2.3, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial
          color="#999999"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}