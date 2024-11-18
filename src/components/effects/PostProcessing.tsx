import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
      />
      <Vignette
        darkness={0.5}
        offset={0.1}
      />
    </EffectComposer>
  );
}