import React, { useState, useEffect, useCallback } from 'react';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { galleryService } from '../../services/galleryService';
import { homepageService } from '../../services/homepageService';
import { GalleryItem } from '../../types/gallery';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

export const GalleryPreview: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const sectionRef = React.useRef<HTMLElement>(null);

  const fetchGallery = useCallback(async () => {
    try {
      // First query Homepage Content Manager published selections
      const hpData = await homepageService.getPublicHomepage();
      if (hpData && Array.isArray(hpData.featuredGallery) && hpData.featuredGallery.length > 0) {
        setGalleryItems(hpData.featuredGallery.slice(0, 4));
        return;
      }

      // Intentional Fallback: Fetch published gallery photographs from MongoDB
      const items = await galleryService.getGalleryItems();
      // Take top 3 published photos (or 3-4 depending on layout)
      setGalleryItems(items.slice(0, 3));
    } catch (err) {
      console.error('Failed to load gallery preview:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();

    const handleCmsUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (!custom.detail || custom.detail.type === 'gallery' || custom.detail.type === 'homepage') {
        fetchGallery();
      }
    };

    window.addEventListener('nmba_cms_updated', handleCmsUpdate);
    window.addEventListener('focus', fetchGallery);

    return () => {
      window.removeEventListener('nmba_cms_updated', handleCmsUpdate);
      window.removeEventListener('focus', fetchGallery);
    };
  }, [fetchGallery]);

  // Sequential Staggered Card Transitions
  useEffect(() => {
    if (loading || galleryItems.length === 0) return;

    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setRevealedCards(new Array(galleryItems.length).fill(true));
        return;
      }
    }

    setRevealedCards(new Array(galleryItems.length).fill(false));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          galleryItems.forEach((_, idx) => {
            setTimeout(() => {
              setRevealedCards((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 300);
          });
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, galleryItems]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 border-t border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200"
      aria-labelledby="gallery-preview-heading"
    >
      <AtmosphericBackground variant="page-header" showRibbons />
      <Container size="wide" className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            kicker="Visual Documentation"
            kickerVariant="teal"
            kickerIcon={<Camera className="w-3.5 h-3.5" aria-hidden="true" />}
            title="Moments of Campus Solidarity"
            subtitle="Documenting student pledges, youth rallies, and dialogue circles across the MJCET campus and Banjara Hills community."
            className="mb-0"
          />

          <Button
            to="/gallery"
            variant="outline"
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            className="self-start md:self-auto shrink-0 bg-[#EAF5FB]/90 dark:bg-[#14243D] dark:text-white border-[#CFE3F0] dark:border-[#243A5E]"
          >
            View Full Image Gallery
          </Button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl overflow-hidden bg-[#EAF5FB]/60 dark:bg-[#14243D]/60 border border-[#CFE3F0] dark:border-[#243A5E] animate-pulse h-80 flex flex-col justify-between p-5"
              >
                <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic CMS-Driven Gallery Cards */}
        {!loading && galleryItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => {
              const isRevealed = revealedCards[idx] ?? true;
              const imgSrc = resolveMediaUrl(item.imageUrl);

              return (
                <div
                  key={item.id || idx}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isRevealed
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                >
                  <Link
                    to="/gallery"
                    data-cursor="VIEW"
                    className="group block rounded-2xl overflow-hidden bg-gradient-to-b from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated h-full flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-b from-[#E2F0F9] to-[#F0EDE3] dark:from-[#172B48] dark:to-[#112036] overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => handleMediaError(e, item.title, item.category)}
                      />

                      <div className="absolute top-3.5 left-3.5 z-10">
                        <Badge variant="teal" size="sm">
                          {(item.category || 'Solidarity').replace(/[-_]/g, ' ')}
                        </Badge>
                      </div>

                      <div className="absolute inset-0 bg-[#0B1524]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2.5 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] text-[#183153] dark:text-white shadow-md">
                          <Eye className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
                        </span>
                      </div>
                    </div>

                    <div className="p-5 text-left flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        {item.caption && (
                          <p className="mt-1 text-xs text-[#334C73] dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {item.caption}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{item.date || 'Campus Drive'}</span>
                        <span className="font-medium text-[#183153] dark:text-slate-200">
                          {item.location || 'MJCET Campus'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!loading && galleryItems.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-[#EAF5FB]/80 dark:bg-[#14243D]/80 border border-[#CFE3F0] dark:border-[#243A5E]">
            <p className="text-sm font-medium text-[#183153] dark:text-slate-300">
              Photographic documentation will be uploaded following upcoming drives.
            </p>
            <Button to="/gallery" variant="secondary" size="sm" className="mt-4">
              Explore Gallery Space
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};
