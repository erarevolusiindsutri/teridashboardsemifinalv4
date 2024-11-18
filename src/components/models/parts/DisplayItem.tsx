interface DisplayItemProps {
  position: [number, number, number];
}

export function DisplayItem({ position }: DisplayItemProps) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshPhysicalMaterial 
        color="#ffaa44" 
        metalness={0.4} 
        roughness={0.6}
        emissive="#ff8844"
        emissiveIntensity={0.2}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}