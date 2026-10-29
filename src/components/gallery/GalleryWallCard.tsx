import React, { useState, useRef } from 'react';
import { Eye, Calendar, MapPin, Camera } from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { Badge } from '../common/Badge';

interface GalleryWallCardProps {
  photo: GalleryItem;
  index: number;
  onSelect: () => void;
  spatialMode?: boolean;
}

export const GalleryWallCard: React.FC<GalleryWallCardProps> = ({
  photo,
  index,
  onSelect,
  spatialMode = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spatialMode || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -4;
    const tiltY = ((x - centerX) / centerX) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Staggered depth for spatial floating wall
  const depthZ = spatialMode ? (index % 3 === 0 ? 12 : index % 3 === 1 ? -6 : 4) : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      data-cursor="VIEW"
      aria-label={`View photo: ${photo.title}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${depthZ}px)`,
        transition: 'transform 0.25s ease-out',
      }}
      className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 shadow-soft-card hover:shadow-elevated transition-all duration-300 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] will-change-transform flex flex-col justify-between"
    >
      {/* Photo Visual Frame */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-charcoal-900 to-charcoal-950 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory-100 dark:bg-darkSurface-elevated">
            <div className="w-6 h-6 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-charcoal-400 bg-ivory-100 dark:bg-darkSurface-elevated">
            <Camera className="w-8 h-8 mb-2 opacity-50 text-saffron-500" />
            <p className="text-xs font-semibold">Image Archive</p>
          </div>
        ) : (
          <img
            src={photo.thumbnailUrl || photo.imageUrl}
            alt={photo.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover filter brightness-[0.95] group-hover:scale-108 transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="saffron" size="sm">
            {photo.category.replace('_', ' ')}
          </Badge>
        </div>

        {/* Hover Center Reveal Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-charcoal-950/80 text-white backdrop-blur-md border border-white/20 text-xs font-semibold shadow-lg transform group-hover:scale-105 transition-transform">
            <Eye className="w-4 h-4 text-saffron-400" />
            <span>Inspect 3D</span>
          </span>
        </div>

        {/* Bottom Floating Location Pin */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 z-10">
          <span className="flex items-center gap-1 truncate max-w-[180px]">
            <MapPin className="w-3 h-3 text-nssGreen-400 shrink-0" />
            <span className="truncate">{photo.location}</span>
          </span>
          <span className="text-white/60 font-mono text-[10px] shrink-0">
            {photo.date}
          </span>
        </div>
      </div>

      {/* Metadata Caption Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-serif text-base font-bold text-charcoal-900 dark:text-white group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-1 leading-snug">
            {photo.title}
          </h3>

          <p className="mt-1.5 text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed line-clamp-2">
            {photo.caption}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-ivory-100 dark:border-darkSurface-border flex items-center justify-between text-[11px] text-charcoal-500 dark:text-charcoal-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-saffron-600 dark:text-saffron-400" />
            <span>{photo.date}</span>
          </div>
          <span className="text-saffron-600 dark:text-saffron-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
            View &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
