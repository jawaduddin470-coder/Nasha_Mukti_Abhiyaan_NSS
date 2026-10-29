import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { CINEMATIC_BEATS } from '../../types/cinematic';
import { ArchitecturalSanctuary } from './ArchitecturalSanctuary';

interface CinematicRigProps {
  elapsedTime: number;
  theme: 'light' | 'dark';
}

function smoothStep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const CinematicRig: React.FC<CinematicRigProps> = ({ elapsedTime, theme }) => {
  const { camera } = useThree();
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  const isDark = theme === 'dark';

  // Determine current beat and interpolation factor
  const { currentBeat, nextBeat, blendFactor } = useMemo(() => {
    let currIdx = 0;
    for (let i = 0; i < CINEMATIC_BEATS.length; i++) {
      if (elapsedTime >= CINEMATIC_BEATS[i].startTime) {
        currIdx = i;
      }
    }
    const curr = CINEMATIC_BEATS[currIdx];
    const nxt = CINEMATIC_BEATS[Math.min(currIdx + 1, CINEMATIC_BEATS.length - 1)];

    const beatLocalTime = elapsedTime - curr.startTime;
    const rawAlpha = Math.min(1, beatLocalTime / curr.duration);
    const smoothedAlpha = smoothStep(0, 1, rawAlpha);

    return {
      currentBeat: curr,
      nextBeat: nxt,
      blendFactor: smoothedAlpha,
    };
  }, [elapsedTime]);

  // Frame update for camera position and lookAt target interpolation
  useFrame(() => {
    const cPos = new THREE.Vector3(...(currentBeat.cameraPos || [0, 1, 5]));
    const nPos = new THREE.Vector3(...(nextBeat.cameraPos || [0, 1, 5]));
    const targetCameraPos = cPos.lerp(nPos, blendFactor);

    const cTgt = new THREE.Vector3(...(currentBeat.targetPos || [0, 0, 0]));
    const nTgt = new THREE.Vector3(...(nextBeat.targetPos || [0, 0, 0]));
    const targetLookAt = cTgt.lerp(nTgt, blendFactor);

    // Smooth camera damping to prevent jitters
    camera.position.lerp(targetCameraPos, 0.14);
    camera.lookAt(targetLookAt);

    // Directional light adjustment
    if (dirLightRef.current) {
      const cColor = new THREE.Color(currentBeat.lightColor || '#FFFFFF');
      const nColor = new THREE.Color(nextBeat.lightColor || '#FFFFFF');
      dirLightRef.current.color.copy(cColor.lerp(nColor, blendFactor));
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        currentBeat.lightIntensity || 1,
        nextBeat.lightIntensity || 1,
        blendFactor
      );
    }
  });

  // Subtle atmospheric sunbeam dust motes (only 24 delicate particles, warm golden)
  const atmosphericMotes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 24; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 8,
          Math.random() * 3.5 + 0.2,
          (Math.random() - 0.5) * 7,
        ] as [number, number, number],
        scale: Math.random() * 0.025 + 0.015,
        speed: Math.random() * 0.4 + 0.2,
      });
    }
    return items;
  }, []);

  return (
    <>
      {/* Soft atmospheric depth fog */}
      <fog attach="fog" args={[isDark ? '#0D1117' : '#FAF6EE', 4.5, 18]} />

      {/* Dynamic Lighting Setup */}
      <ambientLight
        ref={ambientLightRef}
        intensity={isDark ? 0.4 : 0.8}
        color={isDark ? '#94A3B8' : '#FFFFFF'}
      />
      <directionalLight
        ref={dirLightRef}
        position={[6, 9, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <hemisphereLight
        args={[
          isDark ? '#1E293B' : '#FFFFFF',
          isDark ? '#0B0F17' : '#EFE7DA',
          isDark ? 0.35 : 0.55,
        ]}
      />

      {/* Rebuilt Architectural Sanctuary Environment */}
      <ArchitecturalSanctuary
        theme={theme}
        divergenceActive={currentBeat.id === 'uncertainty'}
      />

      {/* Subtle Warm Atmospheric Dust Motes in Sunbeams */}
      {atmosphericMotes.map((mote, i) => (
        <Float key={i} speed={mote.speed} floatIntensity={0.25} rotationIntensity={0.1}>
          <mesh position={mote.position}>
            <sphereGeometry args={[mote.scale, 8, 8]} />
            <meshBasicMaterial
              color="#D97706"
              transparent
              opacity={isDark ? 0.35 : 0.25}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};
