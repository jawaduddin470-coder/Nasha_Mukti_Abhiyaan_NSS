import React from 'react';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { GALLERY_ITEMS } from '../../data/galleryData';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

export const GalleryPreview: React.FC = () => {
  const previewItems = GALLERY_ITEMS.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 border-t border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200" aria-labelledby="gallery-preview-heading">
      <AtmosphericBackground variant="page-header" showRibbons />
      <Container size="wide" className="relative z-10">
        <ScrollReveal direction="up" delayMs={50}>
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
        </ScrollReveal>

        {/* Image Photographic Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewItems.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delayMs={100 + idx * 80}>
              <Link
                to="/gallery"
                data-cursor="VIEW"
                className="group block rounded-2xl overflow-hidden bg-gradient-to-b from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated h-full"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#E2F0F9] to-[#F0EDE3] dark:from-[#172B48] dark:to-[#112036] flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-32 max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute top-3.5 left-3.5">
                    <Badge variant="teal" size="sm">
                      {item.category.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-[#0B1524]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] text-[#183153] dark:text-white shadow-md">
                      <Eye className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="p-5 text-left">
                  <h3 className="font-serif text-base font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#334C73] dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{item.date}</span>
                    <span className="font-medium text-[#183153] dark:text-slate-200">{item.location}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
