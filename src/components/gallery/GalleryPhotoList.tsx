import React from 'react';
import {
  MapPin,
  Calendar,
  Maximize2,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import { GalleryItem } from '../../types/gallery';
import { Badge } from '../common/Badge';

interface GalleryPhotoListProps {
  photos: GalleryItem[];
  onOpenLightbox: (photo: GalleryItem) => void;
  selectedCategory: string;
  searchQuery: string;
}

export const GalleryPhotoList: React.FC<GalleryPhotoListProps> = ({
  photos,
  onOpenLightbox,
  selectedCategory,
  searchQuery,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* List Header & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ivory-200/80 dark:border-darkSurface-border">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-white">
            Campaign Photo Collection
          </h2>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
            {selectedCategory === 'all'
              ? 'Complete documented photographic archive'
              : `Filtered view: ${selectedCategory.replace('_', ' ')}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        <span className="text-xs font-semibold text-[#183153] dark:text-charcoal-400 bg-[#EAF5FB] dark:bg-darkSurface-card px-3 py-1.5 rounded-lg border border-[#CFE3F0] dark:border-darkSurface-border shadow-2xs self-start sm:self-auto">
          Showing {photos.length} {photos.length === 1 ? 'photograph' : 'photographs'}
        </span>
      </div>

      {/* Responsive Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onOpenLightbox(photo)}
            className="group rounded-2xl overflow-hidden bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 shadow-soft-card hover:shadow-elevated transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image Preview with Hover Zoom */}
              <div className="relative aspect-[4/3] bg-charcoal-950 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover filter brightness-[0.94] group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-transparent to-transparent pointer-events-none" />

                {/* Category Pill Overlay */}
                <div className="absolute top-3 left-3">
                  <Badge variant="saffron" size="sm">
                    {photo.category.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Expand Lightbox Action Icon */}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-charcoal-950/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Bar on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] pointer-events-none drop-shadow">
                  <span className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3 text-saffron-400 shrink-0" />
                    <span>{photo.location}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-ivory-200 shrink-0" />
                    <span>{photo.date}</span>
                  </span>
                </div>
              </div>

              {/* Photo Metadata & Caption */}
              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-900 dark:text-white group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-2 leading-snug">
                  {photo.title}
                </h3>

                <p className="mt-2 text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>

                {/* Tags */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-charcoal-400 shrink-0" />
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-charcoal-500 dark:text-charcoal-400 bg-ivory-100 dark:bg-darkSurface-elevated px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Card Action Footer */}
            <div className="px-4 sm:px-5 py-3 border-t border-ivory-100 dark:border-darkSurface-border/80 flex items-center justify-between bg-ivory-50/50 dark:bg-darkSurface-base/40">
              <span className="text-[11px] font-mono uppercase text-charcoal-400 dark:text-charcoal-500">
                NSS MJCET Archive
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-royalBlue-600 dark:text-royalBlue-400 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                <span>View High-Res</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
