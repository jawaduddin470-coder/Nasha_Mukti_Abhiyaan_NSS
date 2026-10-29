import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '../components/common/Container';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { GalleryHero, GalleryViewMode } from '../components/gallery/GalleryHero';
import { DraggableFloatingPhotoWall } from '../components/gallery/DraggableFloatingPhotoWall';
import { GalleryPhotoList } from '../components/gallery/GalleryPhotoList';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { galleryService } from '../services/galleryService';
import { GalleryItem, GalleryCategoryMeta, GalleryStats } from '../types/gallery';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategoryMeta[]>([]);
  const [stats, setStats] = useState<GalleryStats>({
    totalPhotos: 0,
    categoriesCount: 0,
    drivesDocumented: 0,
    totalViews: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<GalleryViewMode>('3d');
  const [loading, setLoading] = useState<boolean>(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, st] = await Promise.all([
          galleryService.getCategories(),
          galleryService.getStats(),
        ]);
        setCategories(cats);
        setStats(st);
      } catch (err) {
        console.error('Failed to load gallery metadata', err);
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await galleryService.getGalleryItems({
          category: selectedCategory as any,
          searchQuery,
        });
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery items', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedCategory, searchQuery]);

  const activeLightboxItem = useMemo(() => {
    if (lightboxIndex === null || !items[lightboxIndex]) return null;
    return items[lightboxIndex];
  }, [lightboxIndex, items]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleOpenLightbox = (item: GalleryItem) => {
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  return (
    <div className="py-6 sm:py-12 bg-[#EAF6FC]/50 dark:bg-[#0B1524] relative overflow-hidden transition-colors duration-200">
      {/* Coherent Atmospheric Background with flowing ribbons and authentic watermark */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      <Container size="wide" className="relative z-10">
        {/* Gallery Hero with Mode Switcher & Unified Toolbar */}
        <GalleryHero
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          stats={stats}
        />

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingState variant="spinner" label="Loading campaign gallery..." />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No photographs match your selection"
              message="Adjust your category filter or search keywords to view other documented campaign drives."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          </div>
        ) : (
          <div className="mt-4 sm:mt-6">
            {/* View 1: 3D Gallery Mode (Default: Unboxed, Free-Floating Kinetic Field) */}
            {viewMode === '3d' && (
              <DraggableFloatingPhotoWall
                items={items}
                onOpenLightbox={handleOpenLightbox}
              />
            )}

            {/* View 2: Photo List Mode (Clean, Spacious Photographic Collection Grid) */}
            {viewMode === 'list' && (
              <GalleryPhotoList
                photos={items}
                onOpenLightbox={handleOpenLightbox}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            )}
          </div>
        )}

        {/* Accessible Full-Screen Lightbox */}
        <GalleryLightbox
          item={activeLightboxItem}
          items={items}
          currentIndex={lightboxIndex ?? 0}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      </Container>
    </div>
  );
};

export default GalleryPage;
