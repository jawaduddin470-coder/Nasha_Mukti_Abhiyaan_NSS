import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { Badge } from '../common/Badge';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

interface MemoryConstellation3DProps {
  items: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
}

// 3D Single Card Plane
const MemoryCardNode: React.FC<{
  item: GalleryItem;
  position: [number, number, number];
  isActive: boolean;
  onSelect: (item: GalleryItem) => void;
}> = ({ item, position, isActive, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate an internal canvas texture to reliably render card surface with text & styling
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Rounded Card Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 512, 384);

      // Gradient Header
      const grad = ctx.createLinearGradient(0, 0, 512, 384);
      grad.addColorStop(0, '#1E293B');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(8, 8, 496, 368);

      // Category Pill
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.roundRect(24, 24, 180, 36, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(item.category.replace('_', ' ').toUpperCase(), 36, 48);

      // Title
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 26px serif';
      const words = item.title.split(' ');
      let line1 = '';
      let line2 = '';
      words.forEach((w) => {
        if (line1.length + w.length < 24) line1 += w + ' ';
        else line2 += w + ' ';
      });
      ctx.fillText(line1, 24, 140);
      if (line2) ctx.fillText(line2, 24, 175);

      // Location & Date
      ctx.fillStyle = '#94A3B8';
      ctx.font = '18px sans-serif';
      ctx.fillText(`📍 ${item.location}`, 24, 310);
      ctx.fillText(`🗓️ ${item.date}`, 24, 340);

      // Gold Accent Edge
      ctx.strokeStyle = isActive ? '#EA580C' : hovered ? '#3B82F6' : '#334155';
      ctx.lineWidth = isActive ? 10 : 4;
      ctx.strokeRect(6, 6, 500, 372);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [item, isActive, hovered]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Gentle floating bob
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.08;

    // Smooth hover/active scale
    const targetScale = isActive ? 1.25 : hovered ? 1.12 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 6);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <planeGeometry args={[1.6, 1.2]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.25}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Constellation Line Filaments connecting nodes
const ConstellationLines: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const itemMap = new Map(items.map((i) => [i.id, i]));

    items.forEach((item) => {
      const posA = item.constellationPosition || [0, 0, 0];
      const vecA = new THREE.Vector3(...posA);

      if (item.constellationConnections) {
        item.constellationConnections.forEach((connId) => {
          const target = itemMap.get(connId);
          if (target && target.constellationPosition) {
            points.push(vecA);
            points.push(new THREE.Vector3(...target.constellationPosition));
          }
        });
      }
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [items]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#3B82F6" transparent opacity={0.35} linewidth={1} />
    </lineSegments>
  );
};

// Parallax & Orbit Camera Scene Rig
const SceneRig: React.FC<{
  activeItem: GalleryItem | null;
  isOrbiting: boolean;
  children: React.ReactNode;
}> = ({ activeItem, isOrbiting, children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();

  useFrame((_state, delta) => {
    if (groupRef.current && isOrbiting && !activeItem) {
      // Very gentle orbital drift (0.04 rad/sec)
      groupRef.current.rotation.y += delta * 0.05;
    }

    // Camera pointer parallax
    const targetX = pointer.x * 0.8;
    const targetY = pointer.y * 0.4;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3);
    camera.lookAt(0, 0, 0);
  });

  return <group ref={groupRef}>{children}</group>;
};

export const MemoryConstellation3D: React.FC<MemoryConstellation3DProps> = ({
  items,
  onOpenLightbox,
}) => {
  const constellationItems = useMemo(
    () => items.filter((i) => i.featuredIn3D && i.constellationPosition),
    [items]
  );

  const [activeItem, setActiveItem] = useState<GalleryItem | null>(
    constellationItems[0] || null
  );
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleNext = () => {
    if (!activeItem) return;
    const currentIndex = constellationItems.findIndex((i) => i.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % constellationItems.length;
    setActiveItem(constellationItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeItem) return;
    const currentIndex = constellationItems.findIndex((i) => i.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + constellationItems.length) % constellationItems.length;
    setActiveItem(constellationItems[prevIndex]);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-charcoal-950 via-[#070B19] to-charcoal-950 border border-royalBlue-900/40 shadow-2xl min-h-[480px] sm:min-h-[580px] text-white flex flex-col justify-between">
      {/* Background Ashoka Watermark */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full border border-royalBlue-400/20 bg-pattern-chakra animate-spin-very-slow" />
      </div>

      {/* Top HUD Controls Strip */}
      <div className="relative z-20 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-royalBlue-500/20 border border-royalBlue-400/30 text-saffron-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-400 font-sans leading-none">
              Spatial Orbit &bull; Memory Constellation
            </p>
            <p className="text-[11px] text-white/60 mt-0.5">
              Interactive 3D network of verified student action milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Play/Pause Orbit */}
          <button
            type="button"
            onClick={() => setIsOrbiting((prev) => !prev)}
            aria-label={isOrbiting ? 'Pause 3D orbit' : 'Resume 3D orbit'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900/80 hover:bg-charcoal-800 text-xs font-medium text-white/90 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
          >
            {isOrbiting ? (
              <>
                <Pause className="w-3.5 h-3.5 text-saffron-400" />
                <span className="hidden sm:inline">Pause Orbit</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-nssGreen-400" />
                <span className="hidden sm:inline">Resume Orbit</span>
              </>
            )}
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={() => {
              setActiveItem(constellationItems[0] || null);
              setIsOrbiting(true);
            }}
            aria-label="Reset 3D camera"
            className="p-2 rounded-xl bg-charcoal-900/80 hover:bg-charcoal-800 text-xs text-white/80 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            title="Reset perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas or Elegant 2D Fallback */}
      <div className="relative flex-1 w-full min-h-[320px] sm:min-h-[400px]">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 45 }}
            className="w-full h-full"
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <pointLight position={[-4, -2, -3]} color="#EA580C" intensity={1.5} />
            <pointLight position={[4, 2, -3]} color="#3B82F6" intensity={1.8} />

            <SceneRig activeItem={activeItem} isOrbiting={isOrbiting}>
              <ConstellationLines items={constellationItems} />

              {constellationItems.map((item) => (
                <MemoryCardNode
                  key={item.id}
                  item={item}
                  position={item.constellationPosition || [0, 0, 0]}
                  isActive={activeItem?.id === item.id}
                  onSelect={(selected) => setActiveItem(selected)}
                />
              ))}
            </SceneRig>
          </Canvas>
        ) : (
          /* Graceful CSS 3D Carousel Fallback */
          <div className="absolute inset-0 p-6 flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
              {constellationItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 rounded-2xl bg-charcoal-900 border transition-all cursor-pointer ${
                    activeItem?.id === item.id
                      ? 'border-saffron-500 shadow-elevated scale-105'
                      : 'border-royalBlue-900/60 opacity-80'
                  }`}
                >
                  <p className="text-xs uppercase font-bold text-saffron-400">{item.category.replace('_', ' ')}</p>
                  <h4 className="font-serif font-bold text-sm text-white mt-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-white/60 mt-1 line-clamp-2">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Active Memory HUD Card */}
      {activeItem && (
        <div className="relative z-20 p-4 sm:p-6 bg-charcoal-950/80 backdrop-blur-md border-t border-royalBlue-900/40">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Thumbnail Preview */}
              <div
                onClick={() => onOpenLightbox(activeItem)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-charcoal-900 shrink-0 border border-saffron-400/40 cursor-pointer group"
              >
                <img
                  src={resolveMediaUrl(activeItem.thumbnailUrl || activeItem.imageUrl)}
                  alt={activeItem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => handleMediaError(e, activeItem.title, activeItem.category)}
                />
                <div className="absolute inset-0 bg-charcoal-950/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Text Meta */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="saffron" size="sm">
                    {activeItem.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-white/50 font-mono">
                    {activeItem.date} &bull; {activeItem.location}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 line-clamp-1 max-w-xl">
                  {activeItem.caption}
                </p>
              </div>
            </div>

            {/* Actions: Prev / Next Node + Lightbox trigger */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous constellation memory"
                className="p-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next constellation memory"
                className="p-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenLightbox(activeItem)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open in Lightbox</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
