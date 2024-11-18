import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group, Vector3, Frustum, Matrix4 } from 'three';

export function CloudRing() {
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
      
      // Only update visible clouds
      groupRef.current.children.forEach((cloud) => {
        tempVector.setFromMatrixPosition(cloud.matrixWorld);
        const distance = tempVector.distanceTo(camera.position);
        const inFrustum = frustum.containsPoint(tempVector);
        
        cloud.visible = inFrustum && distance < 50;
        
        if (cloud.visible) {
          // Fade out distant clouds
          const opacity = Math.max(0, 1 - (distance - 20) / 30);
          const material = (cloud as any).material;
          if (material) {
            material.opacity = opacity * 0.12;
          }
        }
      });
    }
  });

  const createCloud = (angle: number, radius: number = 25) => {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const randomHeight = 15 + Math.random() * 3;

    return (
      <Cloud
        key={angle}
        position={[x, randomHeight, z]}
        opacity={0.12}
        speed={0.02}
        width={12}
        depth={2}
        segments={12}
        color="#b4c4e0"
        depthWrite={false}
        transparent
        renderOrder={-1}
        frustumCulled={true}
      />
    );
  };

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return createCloud(angle, 35);
      })}
    </group>
  );
}