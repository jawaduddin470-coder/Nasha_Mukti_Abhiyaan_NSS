import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '../components/common/Container';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { EmptyState } from '../components/common/EmptyState';
import { ActivitiesHero } from '../components/activities/ActivitiesHero';
import { RotatingActivitiesCarousel } from '../components/activities/RotatingActivitiesCarousel';
import { ActivitiesArchive } from '../components/activities/ActivitiesArchive';
import { ActivityDetailModal } from '../components/activities/ActivityDetailModal';
import { activityService } from '../services/activityService';
import { Activity, ActivityCategoryMeta, ActivityStats } from '../types/activity';
import { LoadingState } from '../components/common/LoadingState';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<ActivityCategoryMeta[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalActivities: 0,
    upcomingCount: 0,
    completedCount: 0,
    totalVolunteersEngaged: 0,
    totalPledgeSignatures: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalActivity, setActiveModalActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, st] = await Promise.all([
          activityService.getCategories(),
          activityService.getStats(),
        ]);
        setCategories(cats);
        setStats(st);
      } catch (err) {
        console.error('Failed to load activity metadata', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activityService.getActivities({
          category: selectedCategory as any,
          status: selectedStatus as any,
          searchQuery,
        });
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [selectedCategory, selectedStatus, searchQuery]);

  // Completed activities for timeline archive
  const completedActivities = useMemo(() => {
    return activities.filter((a) => a.status === 'completed');
  }, [activities]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="py-8 sm:py-16 bg-[#EAF6FC]/50 dark:bg-[#0B1524] relative overflow-hidden transition-colors duration-200">
      {/* Coherent Atmospheric Background with flowing ribbons and authentic watermark */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      <Container size="wide" className="relative z-10">
        {/* Hero Section with Search, Stats & Categories */}
        <ActivitiesHero
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stats={stats}
        />

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingState variant="spinner" label="Loading campaign activities..." />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No activities match your filters"
              message="Try broadening your category or status selection, or clearing your search term to see other initiatives."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {/* 1. Primary Event Discovery: Self-Rotating 3D Activities Carousel Showcase */}
            {activities.length > 0 && (
              <RotatingActivitiesCarousel
                activities={activities}
                onOpenDetails={setActiveModalActivity}
                isModalOpen={Boolean(activeModalActivity)}
              />
            )}

            {/* 2. Past Activities & Timeline Archive */}
            {selectedStatus !== 'upcoming' && completedActivities.length > 0 && (
              <ActivitiesArchive
                completedActivities={completedActivities}
                onOpenDetails={setActiveModalActivity}
              />
            )}
          </div>
        )}

        {/* Detailed Modal Drawer */}
        <ActivityDetailModal
          activity={activeModalActivity}
          onClose={() => setActiveModalActivity(null)}
        />
      </Container>
    </div>
  );
};

export default ActivitiesPage;
