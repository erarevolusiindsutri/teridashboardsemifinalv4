import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { Units } from './Units';
import { PostProcessing } from './effects/PostProcessing';
import { Suspense, lazy } from 'react';
import * as THREE from 'three';

// Lazy load effects
const CloudRing = lazy(() => import('./effects/CloudRing').then(m => ({ default: m.CloudRing })));
const FogRing = lazy(() => import('./effects/FogRing').then(m => ({ default: m.FogRing })));
const DriftingClouds = lazy(() => import('./effects/DriftingClouds').then(m => ({ default: m.DriftingClouds })));

function SceneContent() {
  return (
    <>
      <fog attach="fog" args={['#000000', 30, 60]} />
      
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#050505"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-15, 25, -15]}
        intensity={0.4}
        color="#b4c4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      <hemisphereLight
        intensity={0.2}
        color="#b4c4e0"
        groundColor="#000033"
      />
      
      <Units />
      <PostProcessing />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
        maxDistance={35}
        minDistance={35}
      />
      
      <Suspense fallback={null}>
        <CloudRing />
        <FogRing />
        <DriftingClouds />
      </Suspense>

      <Grid
        position={[0, 0.1, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.7}
        cellColor="#111111"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#222222"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      <Environment preset="night" />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      style={{ background: '#050505' }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        sortObjects: true
      }}
      shadows="soft"
      camera={{ position: [0, 20, 25], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}