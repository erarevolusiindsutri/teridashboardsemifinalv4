import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group, Vector3, Frustum, Matrix4 } from 'three';

export function FogRing() {
  const groupRef = useRef<Group>();
  const { camera } = useThree();
  const tempVector = new Vector3();
  const frustum = new Frustum();
  const projScreenMatrix = new Matrix4();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      
      // Update frustum
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(projScreenMatrix);
      
      // Only update visible fog clouds
      groupRef.current.children.forEach((cloud) => {
        tempVector.setFromMatrixPosition(cloud.matrixWorld);
        const distance = tempVector.distanceTo(camera.position);
        const inFrustum = frustum.containsPoint(tempVector);
        
        cloud.visible = inFrustum && distance < 40;
        
        if (cloud.visible) {
          // Fade out distant clouds
          const opacity = Math.max(0, 1 - (distance - 15) / 25);
          const material = (cloud as any).material;
          if (material) {
            material.opacity = opacity * 0.25;
          }
        }
      });
    }
  });

  const createFogCloud = (angle: number, radius: number) => {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const scale = 0.8 + Math.random() * 0.4;
    
    return (
      <Cloud
        key={`fog-${angle}-${radius}`}
        position={[x, 0.3, z]}
        opacity={0.25}
        speed={0.1}
        width={15}
        depth={5}
        segments={8}
        color="#b4c4e0"
        depthWrite={false}
        transparent
        renderOrder={-2}
        frustumCulled={true}
      />
    );
  };

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        return createFogCloud(angle, 25 + Math.random() * 5);
      })}
    </group>
  );
}