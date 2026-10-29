import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ArchitecturalSanctuaryProps {
  theme: 'light' | 'dark';
  divergenceActive?: boolean;
  highlightedLandmark?: string | null;
}

export const ArchitecturalSanctuary: React.FC<ArchitecturalSanctuaryProps> = ({
  theme,
  divergenceActive = false,
  highlightedLandmark,
}) => {
  const isDark = theme === 'dark';

  // Architectural Sanctuary Material Palette (Zero-Plain-White Atmospheric System)
  const travertineLight = isDark ? '#1E2D44' : '#E8F2F8'; // Pale mist travertine
  const travertineMid = isDark ? '#15243B' : '#D5E6F2';   // Sky-slate terrace
  const travertineDeep = isDark ? '#0F1A2D' : '#BFD8EB';  // Sculpted foundation
  const pathSurface = isDark ? '#263852' : '#EFF6FB';     // Smooth promenade
  const pathCurb = isDark ? '#1B2C45' : '#CADFF0';        // Beveled path curb
  const basaltShadow = isDark ? '#0A101C' : '#334863';    // Divergent basalt path
  const poolWater = isDark ? '#0F263D' : '#C8E6F7';       // Reflecting pool
  const poolRim = isDark ? '#1A3350' : '#A8CCE6';         // Pool stone coping

  // Accent Tones
  const saffronEmissive = '#F97316';
  const amberEmissive = '#D97706';
  const emeraldEmissive = '#10B981';
  const skyEmissive = '#0EA5E9';
  const tealGuide = '#159E9A';

  // 1. Curved Sanctuary Promenade: Awareness -> Choices -> Community -> Support
  const mainPromenadeCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-3.8, 0.05, -1.8),
      new THREE.Vector3(-2.8, 0.22, -0.8),
      new THREE.Vector3(-1.4, 0.32, 0.0),
      new THREE.Vector3(-0.1, 0.35, 0.35),
      new THREE.Vector3(1.1, 0.32, 0.2),
      new THREE.Vector3(2.0, 0.28, 0.0),
      new THREE.Vector3(2.8, 0.32, -0.8),
      new THREE.Vector3(3.3, 0.35, -1.6),
      new THREE.Vector3(4.2, 0.1, -2.4),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // 2. Divergent Reflection Path: Branching off into contemplative pergola
  const divergentPathCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.1, 0.35, 0.35),
      new THREE.Vector3(-0.9, 0.18, 1.1),
      new THREE.Vector3(-1.8, -0.05, 1.7),
      new THREE.Vector3(-2.7, -0.3, 2.2),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group position={[0, -0.35, 0]}>
      {/* =====================================================================
          BASE 1: Terraced Sanctuary Plaza (Gracefully Layered, No Flat Monolith)
          ===================================================================== */}
      {/* Foundation Stepped Tier 1 (Lowest Base) */}
      <mesh position={[0, -0.8, -0.5]} receiveShadow>
        <cylinderGeometry args={[5.8, 6.2, 0.25, 64]} />
        <meshStandardMaterial
          color={travertineDeep}
          roughness={0.82}
          metalness={0.06}
        />
      </mesh>

      {/* Terraced Tier 2 (Middle Plaza) */}
      <mesh position={[0, -0.58, -0.5]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.5, 0.22, 64]} />
        <meshStandardMaterial
          color={travertineMid}
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Terraced Tier 3 (Main Sanctuary Plateau) */}
      <mesh position={[0, -0.38, -0.5]} receiveShadow>
        <cylinderGeometry args={[4.6, 4.8, 0.2, 64]} />
        <meshStandardMaterial
          color={travertineLight}
          roughness={0.7}
          metalness={0.04}
        />
      </mesh>

      {/* Concentric Architectural Inlay Rings */}
      <mesh position={[0, -0.27, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.26, 64]} />
        <meshStandardMaterial
          color={isDark ? '#2E476B' : '#B8D8EC'}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.27, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.3, 4.35, 64]} />
        <meshStandardMaterial
          color={tealGuide}
          roughness={0.4}
          transparent
          opacity={isDark ? 0.45 : 0.35}
        />
      </mesh>

      {/* =====================================================================
          TRANQUIL REFLECTING POOL (Central Courtyard Water Feature)
          ===================================================================== */}
      <group position={[-0.7, -0.26, -0.6]}>
        {/* Pool Coping Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 1.82, 48]} />
          <meshStandardMaterial
            color={poolRim}
            roughness={0.65}
            metalness={0.1}
          />
        </mesh>
        {/* Shimmering Shallow Pool Surface */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.65, 48]} />
          <meshStandardMaterial
            color={poolWater}
            roughness={0.12}
            metalness={0.45}
            transparent
            opacity={isDark ? 0.55 : 0.75}
          />
        </mesh>
        {/* Submerged Central Fountain Basin */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.3, 0.36, 0.08, 24]} />
          <meshStandardMaterial color={travertineLight} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={tealGuide}
            emissive={tealGuide}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* =====================================================================
          SCULPTED SANCTUARY PROMENADE (Connected Highway of Growth)
          ===================================================================== */}
      {/* Promenade Walking Surface */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <tubeGeometry args={[mainPromenadeCurve, 64, 0.24, 12, false]} />
        <meshStandardMaterial
          color={pathSurface}
          roughness={0.38}
          metalness={0.06}
        />
      </mesh>

      {/* Promenade Curb / Border Chamfer */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <tubeGeometry args={[mainPromenadeCurve, 64, 0.28, 8, false]} />
        <meshStandardMaterial
          color={pathCurb}
          roughness={0.7}
          metalness={0.04}
        />
      </mesh>

      {/* Subtle Luminous Guide Ribbon along Promenade Edge */}
      <mesh position={[0, 0.04, 0]}>
        <tubeGeometry args={[mainPromenadeCurve, 64, 0.022, 6, false]} />
        <meshStandardMaterial
          color={tealGuide}
          emissive={tealGuide}
          emissiveIntensity={isDark ? 0.8 : 0.5}
          roughness={0.2}
          transparent
          opacity={isDark ? 0.7 : 0.5}
        />
      </mesh>

      {/* Contemplative Divergent Branch (Pergola Covered Arbor) */}
      <group>
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <tubeGeometry args={[divergentPathCurve, 32, 0.18, 10, false]} />
          <meshStandardMaterial
            color={divergenceActive ? '#111827' : basaltShadow}
            roughness={0.85}
            metalness={0.12}
          />
        </mesh>

        {/* Pergola Arbors Casting Soft Architectural Shadows */}
        {[-0.6, -1.2, -1.8, -2.4].map((xVal, idx) => (
          <group key={idx} position={[xVal, 0.18 - idx * 0.14, 0.8 + idx * 0.45]}>
            <mesh position={[-0.2, 0.28, 0]} castShadow>
              <boxGeometry args={[0.05, 0.58, 0.05]} />
              <meshStandardMaterial color={travertineMid} roughness={0.75} />
            </mesh>
            <mesh position={[0.2, 0.28, 0]} castShadow>
              <boxGeometry args={[0.05, 0.58, 0.05]} />
              <meshStandardMaterial color={travertineMid} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.58, 0]} castShadow>
              <boxGeometry args={[0.48, 0.04, 0.06]} />
              <meshStandardMaterial color={travertineLight} roughness={0.65} />
            </mesh>
          </group>
        ))}
      </group>

      {/* =====================================================================
          LANDMARK 1: The Rotunda of Understanding (Awareness Hub)
          Coordinates: [-2.8, 0.25, -0.8]
          ===================================================================== */}
      <group position={[-2.8, 0.25, -0.8]}>
        {/* Tiered Pavilion Plinth */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <cylinderGeometry args={[0.78, 0.85, 0.08, 32]} />
          <meshStandardMaterial color={travertineMid} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.09, 0]} receiveShadow>
          <cylinderGeometry args={[0.68, 0.72, 0.06, 32]} />
          <meshStandardMaterial color={travertineLight} roughness={0.6} />
        </mesh>

        {/* 6 Elegant Fluted Ionic Columns */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI * 2) / 6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.46, 0.48, Math.sin(angle) * 0.46]}
              castShadow
            >
              <cylinderGeometry args={[0.032, 0.038, 0.78, 16]} />
              <meshStandardMaterial color={travertineLight} roughness={0.55} />
            </mesh>
          );
        })}

        {/* Sculpted Entablature Ring & Oculus Canopy */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <cylinderGeometry args={[0.66, 0.66, 0.06, 32]} />
          <meshStandardMaterial color={travertineLight} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.94, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.62, 0.06, 32]} />
          <meshStandardMaterial color={travertineMid} roughness={0.6} />
        </mesh>

        {/* Floating Inlaid Amber-Saffron Truth Octahedron */}
        <mesh
          position={[0, 0.45, 0]}
          scale={highlightedLandmark === 'awareness' ? [1.25, 1.25, 1.25] : [1, 1, 1]}
          castShadow
        >
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={saffronEmissive}
            roughness={0.15}
            metalness={0.3}
            emissive={saffronEmissive}
            emissiveIntensity={highlightedLandmark === 'awareness' ? 0.9 : 0.4}
          />
        </mesh>

        {/* Delicate Golden Oculus Skylight Beam */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.015, 0.16, 0.6, 16]} />
          <meshBasicMaterial
            color={saffronEmissive}
            transparent
            opacity={isDark ? 0.28 : 0.16}
          />
        </mesh>
      </group>

      {/* =====================================================================
          LANDMARK 2: Crossroads Gateway of Choices (Campus Action & Activities)
          Coordinates: [-0.1, 0.35, 0.35]
          ===================================================================== */}
      <group position={[-0.1, 0.35, 0.35]}>
        {/* Gateway Foundation Plinth */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[1.05, 0.07, 0.6]} />
          <meshStandardMaterial color={travertineMid} roughness={0.7} />
        </mesh>

        {/* Left Stone Pylon */}
        <mesh position={[-0.24, 0.42, 0]} castShadow>
          <boxGeometry args={[0.11, 0.72, 0.14]} />
          <meshStandardMaterial color={travertineLight} roughness={0.6} metalness={0.08} />
        </mesh>

        {/* Right Stone Pylon */}
        <mesh position={[0.24, 0.42, 0]} castShadow>
          <boxGeometry args={[0.11, 0.72, 0.14]} />
          <meshStandardMaterial color={travertineLight} roughness={0.6} metalness={0.08} />
        </mesh>

        {/* Architectural Gateway Arch Lintel */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.74, 0.09, 0.16]} />
          <meshStandardMaterial color={travertineMid} roughness={0.6} />
        </mesh>

        {/* Suspended Golden Spherical Orb of Decision */}
        <mesh
          position={[0, 0.44, 0]}
          scale={highlightedLandmark === 'events' ? [1.3, 1.3, 1.3] : [1, 1, 1]}
        >
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={amberEmissive}
            roughness={0.18}
            metalness={0.55}
            emissive={amberEmissive}
            emissiveIntensity={highlightedLandmark === 'events' ? 0.85 : 0.45}
          />
        </mesh>
      </group>

      {/* =====================================================================
          LANDMARK 3: The Civic Agora of Solidarity (Community & Peer Circles)
          Coordinates: [2.0, 0.3, 0.0]
          ===================================================================== */}
      <group position={[2.0, 0.3, 0.0]}>
        {/* Tier 1 Amphitheater Seating Ring */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[0.82, 0.9, 0.1, 32]} />
          <meshStandardMaterial color={travertineMid} roughness={0.7} />
        </mesh>

        {/* Tier 2 Amphitheater Seating Ring */}
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <cylinderGeometry args={[0.62, 0.7, 0.12, 32]} />
          <meshStandardMaterial color={travertineLight} roughness={0.65} />
        </mesh>

        {/* Sunken Community Court (Emerald Lawn Texture) */}
        <mesh position={[0, 0.23, 0]} receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
          <meshStandardMaterial
            color={isDark ? '#0D261C' : '#D6F2E2'}
            roughness={0.55}
          />
        </mesh>

        {/* Interlocking Emerald Solidarity Arches */}
        <group
          position={[0, 0.45, 0]}
          scale={highlightedLandmark === 'community' ? [1.25, 1.25, 1.25] : [1, 1, 1]}
        >
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rot, i) => (
            <mesh key={i} rotation={[0, rot, 0]} castShadow>
              <torusGeometry args={[0.19, 0.032, 16, 24, Math.PI]} />
              <meshStandardMaterial
                color={emeraldEmissive}
                roughness={0.2}
                metalness={0.4}
                emissive={emeraldEmissive}
                emissiveIntensity={highlightedLandmark === 'community' ? 0.75 : 0.35}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* =====================================================================
          LANDMARK 4: The Beacon of Hope & Care (Emergency & Clinical Support)
          Coordinates: [3.3, 0.35, -1.6]
          ===================================================================== */}
      <group position={[3.3, 0.35, -1.6]}>
        {/* Stepped Granite Base */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[0.6, 0.68, 0.1, 32]} />
          <meshStandardMaterial color={travertineDeep} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[0.48, 0.54, 0.1, 32]} />
          <meshStandardMaterial color={travertineMid} roughness={0.7} />
        </mesh>

        {/* Tapered Beacon Pillar Shaft */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 0.88, 20]} />
          <meshStandardMaterial color={travertineLight} roughness={0.55} />
        </mesh>

        {/* Illuminated Lantern Room */}
        <group position={[0, 1.12, 0]}>
          <mesh scale={highlightedLandmark === 'support' ? [1.3, 1.3, 1.3] : [1, 1, 1]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial
              color={skyEmissive}
              roughness={0.1}
              metalness={0.1}
              emissive={skyEmissive}
              emissiveIntensity={highlightedLandmark === 'support' ? 0.95 : 0.6}
            />
          </mesh>

          {/* Beacon Cone Roof */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <coneGeometry args={[0.27, 0.15, 20]} />
            <meshStandardMaterial color={travertineMid} roughness={0.6} />
          </mesh>

          {/* Luminous Care Halo */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.34, 32]} />
            <meshBasicMaterial
              color={skyEmissive}
              transparent
              opacity={isDark ? 0.55 : 0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Warm Embedded Sanctuary Courtyard Inset Lighting */}
      {[-3.2, -1.8, 0.3, 1.7, 2.7].map((xVal, i) => (
        <mesh key={i} position={[xVal, -0.14, -0.7 + i * 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial
            color={tealGuide}
            transparent
            opacity={isDark ? 0.65 : 0.45}
          />
        </mesh>
      ))}
    </group>
  );
};
