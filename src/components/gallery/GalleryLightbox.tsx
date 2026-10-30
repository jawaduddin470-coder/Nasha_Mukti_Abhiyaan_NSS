import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Maximize2,
  Minimize2,
  Share2,
  Check,
} from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { Badge } from '../common/Badge';
import { resolveMediaUrl } from '../../utils/mediaHelper';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        onNavigate(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        onNavigate(prevIndex);
      }
    };

    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, currentIndex, items.length, onClose, onNavigate]);

  if (!item) return null;

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe threshold 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> Next
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        onNavigate(next);
      } else {
        // Swiped right -> Previous
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        onNavigate(prev);
      }
    }
    touchStartX.current = null;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.caption,
          url,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      await navigator.clipboard.writeText(`${item.title} - ${url}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-charcoal-950/90 backdrop-blur-xl transition-all duration-300 select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${item.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-6 z-30 flex items-center justify-between text-white pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-charcoal-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
          <span className="font-mono text-saffron-400 font-bold">{currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/70">{items.length}</span>
          <span className="text-white/20 mx-1">&bull;</span>
          <span className="hidden sm:inline uppercase text-[10px] tracking-wider font-semibold text-white/80">
            {item.category.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share photo"
            className="p-2 sm:p-2.5 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white backdrop-blur-md border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
          >
            {isCopied ? <Check className="w-4 h-4 text-nssGreen-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            className="hidden sm:inline-flex p-2.5 rounded-full bg-charcoal-900/80 hover:bg-charcoal-800 text-white backdrop-blur-md border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="p-2 sm:p-2.5 rounded-full bg-charcoal-900/80 hover:bg-saffron-600 text-white backdrop-blur-md border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav Previous Button */}
      <button
        type="button"
        onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : items.length - 1)}
        aria-label="Previous photo (Left arrow key)"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-charcoal-900/70 hover:bg-charcoal-800 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Nav Next Button */}
      <button
        type="button"
        onClick={() => onNavigate(currentIndex < items.length - 1 ? currentIndex + 1 : 0)}
        aria-label="Next photo (Right arrow key)"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-charcoal-900/70 hover:bg-charcoal-800 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Lightbox Presentation Card */}
      <div className="relative max-w-5xl w-full max-h-[88vh] rounded-3xl overflow-hidden bg-[#0E1E33] border border-[#243A5E] shadow-2xl flex flex-col md:flex-row text-left">
        {/* Photographic Display Half */}
        <div className="relative flex-1 bg-[#09121F] flex items-center justify-center min-h-[260px] sm:min-h-[380px] md:min-h-[500px] overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#159E9A] border-t-transparent animate-spin" />
            </div>
          )}

          {imageError ? (
            <div className="p-8 text-center text-white/70 space-y-2">
              <Camera className="w-12 h-12 mx-auto text-[#159E9A] opacity-60" />
              <p className="text-sm font-medium">Image preview temporarily unavailable</p>
              <p className="text-xs text-white/40">Documented in NSS MJCET Campaign Archives</p>
            </div>
          ) : (
            <img
              src={resolveMediaUrl(item.imageUrl)}
              alt={item.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`max-w-full max-h-[70vh] md:max-h-[85vh] object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Subtly Floating Ashoka Watermark */}
          <div className="absolute bottom-3 left-3 pointer-events-none opacity-30">
            <img src="/assets/branding/nss-logo.png" alt="NSS Seal" className="w-6 h-6 object-contain" />
          </div>
        </div>

        {/* Narrative & Metadata Side Drawer */}
        <div className="w-full md:w-80 lg:w-96 p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#10243D] to-[#0B1524] text-white border-t md:border-t-0 md:border-l border-[#243A5E] max-h-[38vh] md:max-h-[85vh]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="teal" size="sm">
                {item.category.replace('_', ' ')}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">
                {item.date}
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.caption}
            </p>

            {item.extendedStory && (
              <div className="p-3.5 rounded-xl bg-[#142A45]/80 border border-[#243A5E] text-xs text-slate-300 leading-relaxed">
                <p className="font-bold text-white mb-1">Context &amp; Impact:</p>
                {item.extendedStory}
              </div>
            )}

            {/* Metadata Tags and Location */}
            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-[#243A5E]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#239B70] shrink-0" />
                <span className="font-medium text-slate-200">{item.location}</span>
              </div>
              {item.photographerCredit && (
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#4F8FE8] shrink-0" />
                  <span>Photo Credit: {item.photographerCredit}</span>
                </div>
              )}
            </div>

            {/* Tag Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#142A45] text-slate-300 border border-[#243A5E]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-6 pt-4 border-t border-[#243A5E] flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] italic hidden sm:inline">
              Swipe or use &larr; &rarr; keys
            </span>
            <span className="text-[11px] font-semibold text-[#5EEAD4]">
              NSS MJCET Documentation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
