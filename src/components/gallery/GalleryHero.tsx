import React from 'react';
import { Camera, Search, X, Sparkles, LayoutGrid } from 'lucide-react';
import { GalleryCategoryMeta, GalleryStats } from '../../types/gallery';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

export type GalleryViewMode = '3d' | 'list';

interface GalleryHeroProps {
  categories: GalleryCategoryMeta[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: GalleryViewMode;
  onViewModeChange: (mode: GalleryViewMode) => void;
  stats: GalleryStats;
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  stats,
}) => {
  return (
    <div className="relative pt-4 sm:pt-6 pb-6">
      {/* Subtle Ambient Glow */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 bg-radial from-[#159E9A]/15 via-[#4F8FE8]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <ScrollReveal direction="up" delayMs={40}>
        <SectionHeader
          kicker="Visual Documentation"
          kickerVariant="teal"
          kickerIcon={<Camera className="w-3.5 h-3.5" aria-hidden="true" />}
          title="Campaign Visual Gallery"
          subtitle="An immersive spatial archive documenting student solidarity, campus pledge walls, clinical counseling circles, and grassroots outreach drives led by NSS MJCET."
          headingLevel="h1"
          className="max-w-3xl"
        />
      </ScrollReveal>

      {/* Refined Unified Gallery Toolbar */}
      <ScrollReveal direction="up" delayMs={80}>
        <div className="mt-6 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-[#EAF5FB] to-[#F4FAFD] dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card space-y-3">
          {/* Top Row: View Mode Switcher + Live Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Mode Switcher */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#E8F3FA] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] self-start sm:self-auto"
              role="group"
              aria-label="Gallery display view options"
            >
              <button
                type="button"
                onClick={() => onViewModeChange('3d')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  viewMode === '3d'
                    ? 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#183153] dark:text-white shadow-xs border border-[#CFE3F0] dark:border-[#243A5E]'
                    : 'text-[#334C73] dark:text-slate-400 hover:text-[#183153] dark:hover:text-white'
                }`}
                aria-pressed={viewMode === '3d'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#159E9A]" />
                <span>3D Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  viewMode === 'list'
                    ? 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#183153] dark:text-white shadow-xs border border-[#CFE3F0] dark:border-[#243A5E]'
                    : 'text-[#334C73] dark:text-slate-400 hover:text-[#183153] dark:hover:text-white'
                }`}
                aria-pressed={viewMode === 'list'}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#4F8FE8]" />
                <span>Photo List</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs md:max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title, location, or tag..."
                aria-label="Search gallery photographs"
                className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs bg-[#F4FAFD] dark:bg-[#1B2F4E] text-[#183153] dark:text-white placeholder-slate-400 border border-[#CFE3F0] dark:border-[#243A5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear gallery search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Chips Filter */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none"
            role="tablist"
            aria-label="Filter gallery by category"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 border hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                selectedCategory === 'all'
                  ? 'bg-[#159E9A] text-white font-semibold border-[#159E9A] shadow-xs'
                  : 'bg-[#EAF6FC]/70 dark:bg-[#1B2F4E] text-[#334C73] dark:text-slate-300 border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#DDF3F0] dark:hover:bg-[#14243D] hover:border-[#159E9A] dark:hover:border-teal-500'
              }`}
            >
              All Photos ({stats.totalPhotos})
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 border hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  selectedCategory === c.id
                    ? 'bg-[#159E9A] text-white font-semibold border-[#159E9A] shadow-xs'
                    : 'bg-[#EAF6FC]/70 dark:bg-[#1B2F4E] text-[#334C73] dark:text-slate-300 border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#DDF3F0] dark:hover:bg-[#14243D] hover:border-[#159E9A] dark:hover:border-teal-500'
                }`}
              >
                {c.label} {c.count !== undefined ? `(${c.count})` : ''}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
