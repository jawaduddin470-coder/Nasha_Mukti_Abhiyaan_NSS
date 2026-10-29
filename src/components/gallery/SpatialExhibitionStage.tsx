import React, { useState, useRef } from 'react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Calendar,
  Camera,
} from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { Badge } from '../common/Badge';
import { useTheme } from '../../context/ThemeContext';

interface SpatialExhibitionStageProps {
  items: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
}

export const SpatialExhibitionStage: React.FC<SpatialExhibitionStageProps> = ({
  items,
  onOpenLightbox,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // We highlight the top curated items for spatial exhibition
  const stageItems = items.slice(0, 6);
  const currentItem = stageItems[activeIndex] || items[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle restrained parallax (max 12px shift, 3deg rotation)
    setParallaxOffset({
      x: x * 15,
      y: y * 10,
    });
  };

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stageItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + stageItems.length) % stageItems.length);
  };

  const prevIndex = (activeIndex - 1 + stageItems.length) % stageItems.length;
  const nextIndex = (activeIndex + 1) % stageItems.length;

  const prevItem = stageItems[prevIndex];
  const nextItem = stageItems[nextIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-300 border shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col justify-between select-none ${
        isDark
          ? 'bg-gradient-to-b from-[#0B1120] via-[#070B19] to-[#030712] border-royalBlue-900/40 text-white shadow-royalBlue-950/40'
          : 'bg-gradient-to-b from-[#FDFBF7] via-[#F7F3EC] to-[#EFE9DF] border-ivory-300 text-charcoal-900 shadow-ivory-300/60'
      }`}
      style={{ minHeight: '620px' }}
    >
      {/* Subtle Atmospheric Back-Glow (Saffron + Royal Blue) */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-80 rounded-full blur-3xl pointer-events-none -z-0 opacity-40 transition-opacity ${
          isDark ? 'bg-royalBlue-600/20' : 'bg-saffron-500/10'
        }`}
        aria-hidden="true"
      />

      {/* Top Header Controls Strip */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200/60 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-colors shadow-xs ${
              isDark
                ? 'bg-royalBlue-500/20 border border-royalBlue-400/30 text-saffron-400'
                : 'bg-[#EAF5FB] border border-[#CFE3F0] text-[#159E9A] shadow-soft-card'
            }`}
          >
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-saffron-600 dark:text-saffron-400 font-sans">
                Spatial Exhibition Stage
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300">
                Live Parallax
              </span>
            </div>
            <p className="text-xs text-charcoal-500 dark:text-white/60 mt-0.5">
              Photographs dominate the composition &bull; Drag or click adjacent memories to navigate
            </p>
          </div>
        </div>

        {/* Milestone Node Jump Tracker (Constellation Ribbon) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ivory-200/70 dark:bg-charcoal-900/80 backdrop-blur-md border border-ivory-300/80 dark:border-white/10">
            {stageItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to ${item.title}`}
                className={`relative px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                  activeIndex === idx
                    ? 'bg-saffron-500 text-white shadow-xs scale-105'
                    : 'text-charcoal-600 dark:text-white/60 hover:text-charcoal-950 dark:hover:text-white'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photograph"
              className={`p-2 rounded-xl transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                isDark
                  ? 'bg-charcoal-900/80 hover:bg-charcoal-800 text-white border-white/10'
                  : 'bg-[#EAF5FB] hover:bg-[#DDF3F0] text-[#183153] border-[#CFE3F0] shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photograph"
              className={`p-2 rounded-xl transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                isDark
                  ? 'bg-charcoal-900/80 hover:bg-charcoal-800 text-white border-white/10'
                  : 'bg-[#EAF5FB] hover:bg-[#DDF3F0] text-[#183153] border-[#CFE3F0] shadow-xs'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Perspective Stage Area */}
      <div className="relative z-10 flex-1 my-6 sm:my-8 flex items-center justify-center perspective-[1200px] overflow-hidden min-h-[380px] sm:min-h-[460px]">
        {/* Left Peeking Card (Flanking Perspective) */}
        {prevItem && (
          <div
            onClick={handlePrev}
            style={{
              transform: `translateX(-65%) translateZ(-90px) rotateY(22deg) translateY(${parallaxOffset.y * -0.5}px)`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            }}
            className="hidden md:block absolute left-1/4 w-[280px] lg:w-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl opacity-40 hover:opacity-75 cursor-pointer filter blur-[0.5px] hover:blur-none border-2 border-white/20 dark:border-white/10 will-change-transform z-10"
          >
            <img
              src={prevItem.imageUrl}
              alt={prevItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal-950/50" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-serif font-bold truncate">
              {prevItem.title}
            </div>
          </div>
        )}

        {/* Center Prominent Featured Photograph (Dominates Composition) */}
        {currentItem && (
          <div
            onClick={() => onOpenLightbox(currentItem)}
            style={{
              transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 40px) rotateY(${parallaxOffset.x * 0.15}deg) rotateX(${parallaxOffset.y * -0.15}deg)`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
            }}
            className="group relative w-full max-w-2xl sm:max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 cursor-pointer will-change-transform z-20 flex flex-col justify-between"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenLightbox(currentItem);
              }
            }}
            aria-label={`Inspect ${currentItem.title}`}
          >
            {/* The Master Image (Crisp, High-Resolution, Large Scale) */}
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.96] group-hover:scale-104 transition-transform duration-700 ease-out"
            />

            {/* Cinematic Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-charcoal-950/30 group-hover:from-charcoal-950/95 transition-all" />

            {/* Top Bar on Center Card */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="saffron" size="sm">
                  {currentItem.category.replace('_', ' ')}
                </Badge>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-charcoal-950/70 text-white backdrop-blur-md uppercase tracking-wider">
                  Photo 0{activeIndex + 1}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-950/80 hover:bg-saffron-500 text-white text-xs font-semibold backdrop-blur-md transition-colors shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </span>
            </div>

            {/* Bottom Content Narrative on Center Card */}
            <div className="relative z-10 p-5 sm:p-8 text-white">
              <div className="flex items-center gap-3 text-xs text-white/80 font-mono mb-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-saffron-400" />
                  {currentItem.date}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-nssGreen-400" />
                  {currentItem.location}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-saffron-300 transition-colors">
                {currentItem.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2 max-w-2xl">
                {currentItem.caption}
              </p>
            </div>
          </div>
        )}

        {/* Right Peeking Card (Flanking Perspective) */}
        {nextItem && (
          <div
            onClick={handleNext}
            style={{
              transform: `translateX(65%) translateZ(-90px) rotateY(-22deg) translateY(${parallaxOffset.y * -0.5}px)`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            }}
            className="hidden md:block absolute right-1/4 w-[280px] lg:w-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl opacity-40 hover:opacity-75 cursor-pointer filter blur-[0.5px] hover:blur-none border-2 border-white/20 dark:border-white/10 will-change-transform z-10"
          >
            <img
              src={nextItem.imageUrl}
              alt={nextItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal-950/50" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-serif font-bold truncate">
              {nextItem.title}
            </div>
          </div>
        )}
      </div>

      {/* Stage Bottom Footer Strip */}
      <div className="relative z-20 pt-4 border-t border-ivory-200/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-charcoal-500 dark:text-white/60">
          <span>
            Curated Showcase: <strong>{stageItems.length}</strong> Key Milestones
          </span>
          {currentItem?.photographerCredit && (
            <span className="flex items-center gap-1.5 font-medium">
              <Camera className="w-3.5 h-3.5 text-royalBlue-500 dark:text-royalBlue-400" />
              <span>Credit: {currentItem.photographerCredit}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenLightbox(currentItem)}
          className="inline-flex items-center gap-1.5 font-semibold text-saffron-600 dark:text-saffron-400 hover:text-saffron-700 dark:hover:text-saffron-300 self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded"
        >
          <span>Open High-Resolution Inspection Lightbox</span>
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
