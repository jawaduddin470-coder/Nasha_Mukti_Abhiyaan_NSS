import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Move,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

interface DraggableFloatingPhotoWallProps {
  items: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
}

interface CardPhysics {
  id: string;
  baseX: number; // percentage of stage width
  baseY: number; // percentage of stage height
  dragX: number; // user drag offset px
  dragY: number; // user drag offset px
  ampX: number;
  ampY: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  baseRot: number;
  baseScale: number;
  zIndex: number;
  isCenter: boolean;
}

// Fixed, carefully tuned animation speed constant (Speed controls removed per Phase 5.6 requirements)
const FIXED_ANIMATION_SPEED = 1.0;

export const DraggableFloatingPhotoWall: React.FC<DraggableFloatingPhotoWallProps> = ({
  items,
  onOpenLightbox,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Playback control state (speed controls permanently removed)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const isPlayingRef = useRef<boolean>(true);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Respect system prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    }
  }, []);

  // Display up to 7 curated photographs in the main spatial floating field
  const displayPhotos = items.slice(0, 7);

  // Curated spatial anchor layout: prominent center card + 6 spacious supporting cards
  const anchors = [
    // 0: Prominent Central Hero Photograph
    { x: 50, y: 48, rot: 0, scale: 1.15, z: 35, isCenter: true },
    // 1: Top-Left Wing
    { x: 22, y: 24, rot: -3, scale: 0.95, z: 25, isCenter: false },
    // 2: Top-Right Wing
    { x: 78, y: 22, rot: 2.5, scale: 0.96, z: 26, isCenter: false },
    // 3: Mid-Left Flank
    { x: 15, y: 68, rot: 3, scale: 0.90, z: 20, isCenter: false },
    // 4: Mid-Right Flank
    { x: 85, y: 66, rot: -2.5, scale: 0.92, z: 22, isCenter: false },
    // 5: Bottom Center-Left Anchor
    { x: 33, y: 78, rot: -2, scale: 0.96, z: 28, isCenter: false },
    // 6: Bottom Center-Right Anchor
    { x: 67, y: 76, rot: 2, scale: 0.94, z: 27, isCenter: false },
  ];

  // Physics states stored in ref to decouple 60fps transform painting from React render passes
  const physicsRef = useRef<Map<string, CardPhysics>>(new Map());

  // Initialize or update physics when photos change
  useEffect(() => {
    const nextMap = new Map<string, CardPhysics>();
    displayPhotos.forEach((photo, i) => {
      const existing = physicsRef.current.get(photo.id);
      if (existing) {
        nextMap.set(photo.id, existing);
      } else {
        const anchor = anchors[i % anchors.length];
        nextMap.set(photo.id, {
          id: photo.id,
          baseX: anchor.x,
          baseY: anchor.y,
          dragX: 0,
          dragY: 0,
          ampX: anchor.isCenter ? 8 : 12 + (i % 3) * 3,
          ampY: anchor.isCenter ? 7 : 10 + ((i + 1) % 3) * 3,
          freqX: 0.0008 + (i * 0.00016) % 0.0004,
          freqY: 0.0007 + ((i + 1) * 0.00016) % 0.0004,
          phaseX: i * 1.4,
          phaseY: i * 1.9 + 0.4,
          baseRot: anchor.rot,
          baseScale: anchor.scale,
          zIndex: anchor.z,
          isCenter: anchor.isCenter,
        });
      }
    });
    physicsRef.current = nextMap;
  }, [displayPhotos]);

  // Drag interaction tracking ref
  const activeDraggingIdRef = useRef<string | null>(null);
  const dragInfoRef = useRef<{
    activeCardId: string | null;
    startX: number;
    startY: number;
    initialDragX: number;
    initialDragY: number;
    hasMoved: boolean;
  }>({
    activeCardId: null,
    startX: 0,
    startY: 0,
    initialDragX: 0,
    initialDragY: 0,
    hasMoved: false,
  });

  // Performant Animation Loop via requestAnimationFrame (Zero React re-renders)
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    let active = true;

    const tick = (now: number) => {
      if (!active) return;

      const delta = Math.min(now - lastTimeRef.current, 100);
      lastTimeRef.current = now;

      if (isPlayingRef.current) {
        elapsedRef.current += delta * FIXED_ANIMATION_SPEED;
      }
      const t = elapsedRef.current;

      // Update DOM transform and positioning directly on card elements
      displayPhotos.forEach((photo) => {
        const el = cardRefs.current.get(photo.id);
        const p = physicsRef.current.get(photo.id);
        if (!el || !p) return;

        // Harmonic drift calculations (strictly continuous, zero jump boundaries)
        const dx = Math.sin(t * p.freqX + p.phaseX) * p.ampX;
        const dy = Math.cos(t * p.freqY + p.phaseY) * p.ampY;
        const drot = Math.sin(t * 0.0006 + p.phaseX) * 1.5;

        const isBeingDragged = activeDraggingIdRef.current === photo.id;
        const scale = isBeingDragged ? p.baseScale * 1.05 : p.baseScale;
        const finalRot = p.baseRot + drot;

        el.style.left = `calc(${p.baseX}% + ${p.dragX + dx}px)`;
        el.style.top = `calc(${p.baseY}% + ${p.dragY + dy}px)`;
        el.style.transform = `translate(-50%, -50%) rotate(${finalRot}deg) scale(${scale})`;
        el.style.zIndex = `${p.zIndex}`;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    // Immediately kick off smooth loop upon mount
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [displayPhotos]);

  // Reset dragged positions back to natural harmonic anchors
  const handleResetPositions = () => {
    physicsRef.current.forEach((p) => {
      p.dragX = 0;
      p.dragY = 0;
    });
  };

  // Pointer Drag Handlers with pointer capture and drag threshold
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    cardId: string
  ) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if synthetic or unsupported
    }

    const card = physicsRef.current.get(cardId);
    if (!card) return;

    dragInfoRef.current = {
      activeCardId: cardId,
      startX: e.clientX,
      startY: e.clientY,
      initialDragX: card.dragX,
      initialDragY: card.dragY,
      hasMoved: false,
    };

    activeDraggingIdRef.current = cardId;

    // Bring this card to foremost layer while dragging
    card.zIndex = 60;
    physicsRef.current.forEach((other) => {
      if (other.id !== cardId) {
        other.zIndex = Math.min(other.zIndex, 40);
      }
    });

    const el = cardRefs.current.get(cardId);
    if (el) {
      el.style.cursor = 'grabbing';
      el.classList.add('shadow-2xl', 'ring-2', 'ring-[#159E9A]');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const info = dragInfoRef.current;
    if (!info.activeCardId) return;

    const deltaX = e.clientX - info.startX;
    const deltaY = e.clientY - info.startY;

    if (Math.hypot(deltaX, deltaY) > 6) {
      info.hasMoved = true;
    }

    const card = physicsRef.current.get(info.activeCardId);
    if (card) {
      card.dragX = info.initialDragX + deltaX;
      card.dragY = info.initialDragY + deltaY;
    }
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    photo: GalleryItem
  ) => {
    const info = dragInfoRef.current;
    if (!info.activeCardId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const el = cardRefs.current.get(photo.id);
    if (el) {
      el.style.cursor = 'grab';
      el.classList.remove('shadow-2xl', 'ring-2', 'ring-[#159E9A]');
    }

    if (!info.hasMoved) {
      onOpenLightbox(photo);
    }

    dragInfoRef.current.activeCardId = null;
    activeDraggingIdRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none py-2 sm:py-4 transition-colors duration-200"
      aria-label="Interactive Free-Floating 3D Photo Wall"
    >
      {/* Subtle Atmospheric Light (Unboxed, free-floating ambience) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-96 bg-gradient-to-r from-[#B9DDF5]/20 via-[#159E9A]/10 to-[#4F8FE8]/15 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Lightweight Floating Control Bar (Speed controls permanently removed) */}
      <div className="relative z-40 flex items-center justify-between gap-3 mb-4 px-2 sm:px-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-[#183153] dark:text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-[#159E9A] animate-pulse" />
          <span className="font-semibold text-[#183153] dark:text-white">
            Spatial 3D Gallery
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">&bull;</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline text-[11px] flex items-center gap-1">
            <Move className="w-3 h-3 text-[#4F8FE8]" />
            Drag photos freely &bull; Click to enlarge
          </span>
        </div>

        {/* Clean Action Cluster: Drift Pause/Resume & Reset (No speed controls) */}
        <div className="flex items-center gap-2">
          {/* Drift Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D]/90 dark:to-[#0F1E33]/90 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] text-xs font-semibold hover:border-[#159E9A] dark:hover:border-teal-500 transition-all shadow-xs hover:-translate-y-0.5"
            aria-label={isPlaying ? 'Pause floating drift' : 'Play floating drift'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#159E9A]" />
                <span className="text-xs text-[#183153] dark:text-white">Drifting</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#4F8FE8]" />
                <span className="text-xs text-[#183153] dark:text-white">Paused</span>
              </>
            )}
          </button>

          {/* Reset Layout */}
          <button
            type="button"
            onClick={handleResetPositions}
            className="p-1.5 rounded-lg bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D]/90 dark:to-[#0F1E33]/90 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] text-slate-500 hover:text-[#183153] dark:hover:text-white hover:border-[#159E9A] dark:hover:border-teal-500 transition-all shadow-xs hover:-translate-y-0.5"
            title="Reset positions to default layout"
            aria-label="Reset positions to default layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Free-Floating Spatial Stage (Unboxed, spacious, genuine perspective with ambient gallery lighting) */}
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{ minHeight: '620px', perspective: '1200px' }}
      >
        {/* Soft Ambient Radial Spotlight in the floating stage background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(185, 221, 245, 0.45), rgba(21, 158, 154, 0.08) 50%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {displayPhotos.map((photo, i) => {
          const anchor = anchors[i % anchors.length];
          const initialRot = anchor.rot;
          const initialScale = anchor.scale;

          return (
            <div
              key={photo.id}
              ref={(el) => {
                if (el) cardRefs.current.set(photo.id, el);
                else cardRefs.current.delete(photo.id);
              }}
              onPointerDown={(e) => handlePointerDown(e, photo.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, photo)}
              onClick={() => {
                if (!dragInfoRef.current.hasMoved) {
                  onOpenLightbox(photo);
                }
              }}
              style={{
                left: `${anchor.x}%`,
                top: `${anchor.y}%`,
                transform: `translate(-50%, -50%) rotate(${initialRot}deg) scale(${initialScale})`,
                zIndex: anchor.z,
                touchAction: 'none',
                cursor: 'grab',
                willChange: 'transform, left, top',
              }}
              className="absolute w-56 sm:w-64 md:w-72 lg:w-80 group select-none transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.03]"
            >
              {/* Unboxed, Refined Floating Photographic Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0B1524] ring-1 ring-black/10 dark:ring-white/15 shadow-xl transition-all duration-300">
                {/* Photo Image */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#0A182B]">
                  <img
                    src={resolveMediaUrl(photo.imageUrl)}
                    alt={photo.title}
                    className="w-full h-full object-cover filter brightness-[0.93] transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => handleMediaError(e, photo.title, photo.category)}
                  />

                  {/* Gentle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/90 via-[#0B1524]/20 to-transparent pointer-events-none" />

                  {/* Discrete Category Chip (Always subtle in corner) */}
                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0B1524]/70 text-white/95 backdrop-blur-md uppercase tracking-wider">
                      {photo.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Expand Cue Icon (Top right, revealed on hover) */}
                  <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#0B1524]/70 text-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Unobtrusive Image Caption (reveals smoothly on hover/focus) */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left text-white bg-gradient-to-t from-[#0B1524]/95 via-[#0B1524]/70 to-transparent pointer-events-none transform transition-transform duration-300">
                    <h3 className="font-serif text-xs sm:text-sm font-bold line-clamp-1 leading-snug drop-shadow-sm text-white">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                      <span className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-2.5 h-2.5 text-[#159E9A] shrink-0" />
                        <span>{photo.location}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="shrink-0">{photo.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Subtle Status Line */}
      <div className="relative z-40 mt-3 pt-2 border-t border-[#D7E7F0]/60 dark:border-[#243A5E]/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Sparkles className="w-3 h-3 text-[#159E9A]" />
          <span>Continuous Kinematic Floating Field</span>
        </span>
        <span className="text-[11px]">
          Displaying {displayPhotos.length} floating campaign moments
        </span>
      </div>
    </div>
  );
};
