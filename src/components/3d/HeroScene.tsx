import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { WorldOfChoices } from './WorldOfChoices';
import { WebGLFallback } from './WebGLFallback';
import {
  Compass,
  RotateCw,
  Eye,
  Film,
  ArrowRight,
  X,
  RotateCcw,
  Brain,
  Calendar,
  Users,
  PhoneCall,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CAMPAIGN_LANDMARKS } from '../../data/landmarksData';

interface HeroSceneProps {
  className?: string;
  onReplayIntro?: () => void;
}

// Camera transition controller
const CameraController: React.FC<{
  activeLandmark: string | null;
  controlsRef: React.RefObject<any>;
}> = ({ activeLandmark, controlsRef }) => {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(0, 2.0, 6.4), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);

  useEffect(() => {
    if (!activeLandmark) {
      targetPos.set(0, 2.0, 6.4);
      targetLook.set(0, 0.2, 0);
    } else {
      const landmark = CAMPAIGN_LANDMARKS.find((l) => l.id === activeLandmark);
      if (landmark) {
        targetPos.set(...landmark.cameraPos);
        targetLook.set(...landmark.cameraTarget);
      }
    }
  }, [activeLandmark, targetPos, targetLook]);

  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 3.2, 0.12);
    camera.position.lerp(targetPos, lerpFactor);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook, lerpFactor);
      controlsRef.current.update();
    }
  });

  return null;
};

export const HeroScene: React.FC<HeroSceneProps> = ({ className = '', onReplayIntro }) => {
  const { theme } = useTheme();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [forceFallback, setForceFallback] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeLandmarkId, setActiveLandmarkId] = useState<string | null>(null);
  const orbitControlsRef = useRef<any>(null);

  const isDark = theme === 'dark';

  const activeLandmark = useMemo(
    () => CAMPAIGN_LANDMARKS.find((l) => l.id === activeLandmarkId) || null,
    [activeLandmarkId]
  );

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const getLandmarkIcon = (id: string) => {
    switch (id) {
      case 'awareness':
        return <Brain className="w-3.5 h-3.5" />;
      case 'events':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'community':
        return <Users className="w-3.5 h-3.5" />;
      case 'support':
        return <PhoneCall className="w-3.5 h-3.5" />;
      default:
        return <Brain className="w-3.5 h-3.5" />;
    }
  };

  if (!hasWebGL || forceFallback) {
    return (
      <div className={className}>
        <WebGLFallback />
        <div className="mt-3 flex items-center justify-between">
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="text-xs text-[#159E9A] hover:text-[#0F8380] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] rounded px-2 py-1"
            >
              <Film className="w-3.5 h-3.5" aria-hidden="true" />
              Replay Cinematic Journey
            </button>
          )}
          {hasWebGL && (
            <button
              type="button"
              onClick={() => setForceFallback(false)}
              className="text-xs text-[#159E9A] hover:text-[#0F8380] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] rounded px-2 py-1 ml-auto"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Switch back to interactive 3D scene
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 3D Canvas Box */}
      <div
        className={`relative w-full h-[430px] sm:h-[480px] lg:h-[510px] rounded-2xl border shadow-soft-card overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#0D1524] via-[#132038] to-[#0D1524] border-[#243A5E] shadow-dark-soft'
            : 'bg-gradient-to-b from-[#EBF6FC] via-[#F3F9FD] to-[#E5F2F9] border-[#B9DDF5] shadow-[0_12px_40px_rgba(24,49,83,0.08)]'
        }`}
        data-cursor="ROTATE"
      >
        {/* Top Contextual Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] text-[11px] font-semibold text-[#183153] dark:text-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#159E9A] animate-pulse" aria-hidden="true" />
            <span>Interactive 3D Sanctuary</span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              {activeLandmark ? `Inspecting: ${activeLandmark.shortName}` : '4 Connected Landmarks'}
            </span>
          </div>
        </div>

        {/* Floating Contextual Landmark Detail Drawer (Overlay) */}
        {activeLandmark && (
          <aside
            aria-label={`Details for ${activeLandmark.name}`}
            className="absolute top-12 right-3 left-3 sm:left-auto sm:w-84 z-30 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div
              className={`p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all ${
                isDark
                  ? 'bg-[#14243D]/98 border-[#243A5E] text-white'
                  : 'bg-[#EAF5FB]/98 border-[#CFE3F0] text-[#183153]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#CFE3F0] dark:border-[#243A5E]">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] border border-[#99F6E4]/60 dark:border-teal-800">
                  {getLandmarkIcon(activeLandmark.id)}
                  {activeLandmark.num} &bull; {activeLandmark.subtitle}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveLandmarkId(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-[#DCEBF5] dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close landmark details"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-serif font-bold text-sm sm:text-base leading-snug text-[#183153] dark:text-white">
                {activeLandmark.name}
              </h4>
              <p className="text-[11px] font-medium text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                {activeLandmark.tagline}
              </p>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-[#334C73]'
                }`}
              >
                {activeLandmark.description}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLandmarkId(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#183153] dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#159E9A]" />
                  <span>Reset View</span>
                </button>

                <Link
                  to={activeLandmark.route}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#159E9A] hover:bg-[#128885] text-white shadow-xs transition-colors"
                >
                  <span>Explore Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        )}

        {/* 3D Canvas */}
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-[#EAF6FC] dark:bg-[#0D1524]">
              <div className="w-8 h-8 rounded-full border-2 border-[#159E9A]/20 border-t-[#159E9A] animate-spin" />
              <p className="mt-3 text-xs font-medium tracking-wide">
                Rendering architectural sanctuary...
              </p>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 2.0, 6.4], fov: 44 }}
            dpr={[1, 1.8]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            {/* Subtle atmospheric depth fog */}
            <fog attach="fog" args={[isDark ? '#0D1524' : '#EAF6FC', 4.8, 16]} />

            {/* Natural Soft Lighting Setup adapting to theme */}
            <ambientLight
              intensity={isDark ? 0.45 : 0.85}
              color={isDark ? '#94A3B8' : '#F0F7FB'}
            />
            <directionalLight
              position={[5, 8, 4]}
              intensity={isDark ? 1.05 : 1.25}
              color={isDark ? '#E2E8F0' : '#FFF7ED'}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-4, 3, -2]}
              intensity={0.35}
              color={isDark ? '#38BDF8' : '#E0F2FE'}
            />
            <hemisphereLight
              args={[
                isDark ? '#1E293B' : '#EBF5FB',
                isDark ? '#0D1117' : '#EFE7DA',
                isDark ? 0.35 : 0.55,
              ]}
            />

            {/* Smooth Camera Controller */}
            <CameraController
              activeLandmark={activeLandmarkId}
              controlsRef={orbitControlsRef}
            />

            {/* Cohesive 3D World */}
            <WorldOfChoices
              selectedLandmark={activeLandmarkId}
              onSelectLandmark={(id) => setActiveLandmarkId(id)}
            />

            {/* Restrained OrbitControls */}
            <OrbitControls
              ref={orbitControlsRef}
              enableZoom={false}
              enablePan={false}
              autoRotate={autoRotate && !activeLandmarkId}
              autoRotateSpeed={0.65}
              minPolarAngle={Math.PI / 3.2}
              maxPolarAngle={Math.PI / 1.85}
              minAzimuthAngle={-Math.PI / 3}
              maxAzimuthAngle={Math.PI / 3}
              dampingFactor={0.06}
            />
          </Canvas>
        </Suspense>

        {/* Floating Spatial Controls Bar inside Canvas */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] shadow-2xs text-[11px] sm:text-xs text-[#183153] dark:text-slate-200 font-medium">
            <Compass className="w-3.5 h-3.5 text-[#159E9A] shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Drag to rotate &bull; Click landmarks to frame</span>
            <span className="sm:hidden">Drag scene &bull; Tap pins</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 hover:bg-[#DCEBF5] dark:hover:bg-slate-800 text-[11px] text-[#183153] dark:text-slate-200 border border-[#CFE3F0] dark:border-[#243A5E] transition-colors shadow-2xs hover:border-[#159E9A]"
                title="Replay the 12–15s Cinematic Opening Journey"
                aria-label="Replay Cinematic Journey"
              >
                <Film className="w-3.5 h-3.5 text-[#159E9A]" aria-hidden="true" />
                <span>Replay Journey</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-full border transition-colors shadow-2xs ${
                autoRotate
                  ? 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#159E9A] border-[#159E9A]'
                  : 'bg-[#EAF5FB]/80 dark:bg-[#14243D]/80 text-slate-500 border-[#CFE3F0] dark:border-[#243A5E] hover:text-[#183153]'
              }`}
              aria-label={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
              title={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
            >
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setForceFallback(true)}
              className="px-2.5 py-1.5 rounded-full bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 hover:bg-[#DCEBF5] dark:hover:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:text-[#183153] dark:hover:text-white border border-[#CFE3F0] dark:border-[#243A5E] transition-colors shadow-2xs"
              aria-label="Switch to 2D view"
            >
              2D View
            </button>
          </div>
        </div>
      </div>

      {/* Accessible HTML Landmark Quick-Select Bar beneath Canvas */}
      <nav
        aria-label="Sanctuary Landmarks Keyboard Quick Select"
        className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#E8F3FA]/95 dark:bg-[#112138]/90 text-xs shadow-2xs"
      >
        <div className="flex items-center gap-1.5 font-semibold text-[#183153] dark:text-slate-200 text-[11px] sm:text-xs">
          <Compass className="w-3.5 h-3.5 text-[#159E9A]" aria-hidden="true" />
          <span>Explore Landmarks:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CAMPAIGN_LANDMARKS.map((landmark) => {
            const isSelected = activeLandmarkId === landmark.id;
            return (
              <button
                key={landmark.id}
                type="button"
                onClick={() =>
                  setActiveLandmarkId(isSelected ? null : landmark.id)
                }
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  isSelected
                    ? 'bg-[#159E9A] text-white border-[#159E9A] shadow-xs font-semibold'
                    : isDark
                    ? 'bg-[#14243D] text-slate-300 border-[#243A5E] hover:border-[#159E9A] hover:text-white'
                    : 'bg-[#EAF5FB] text-[#183153] border-[#CFE3F0] hover:border-[#159E9A] hover:bg-[#DDF3F0]'
                }`}
              >
                <span
                  style={{
                    color: isSelected ? '#FFFFFF' : landmark.accentColor,
                  }}
                >
                  {getLandmarkIcon(landmark.id)}
                </span>
                <span>{landmark.shortName}</span>
                <span className="opacity-60 text-[10px]">({landmark.num})</span>
              </button>
            );
          })}

          {activeLandmarkId && (
            <button
              type="button"
              onClick={() => setActiveLandmarkId(null)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-[#DCEBF5] dark:hover:bg-slate-800 transition-colors ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
              title="Reset bird's-eye sanctuary view"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
