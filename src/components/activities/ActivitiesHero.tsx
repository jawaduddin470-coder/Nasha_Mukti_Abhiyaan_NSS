import React from 'react';
import { Search, Calendar, Users, Award, Shield, X, Filter, CheckCircle2 } from 'lucide-react';
import { ActivityCategoryMeta, ActivityStats } from '../../types/activity';
import { ScrollReveal } from '../common/ScrollReveal';

interface ActivitiesHeroProps {
  categories: ActivityCategoryMeta[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: ActivityStats;
}

export const ActivitiesHero: React.FC<ActivitiesHeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  stats,
}) => {
  return (
    <div className="relative pt-4 pb-10">
      {/* Editorial Hero Layout: Headline + Layered Visual Collage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Editorial Headline & Mission */}
        <div className="lg:col-span-7 text-left space-y-4">
          <ScrollReveal direction="up" delayMs={50}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDFB] dark:bg-teal-950/40 border border-[#99F6E4] dark:border-teal-800 text-[#0F8380] dark:text-[#5EEAD4] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus &amp; Community Mobilization</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#183153] dark:text-white leading-[1.15] tracking-tight mt-3">
              Action in Solidarity.<br />
              <span className="text-[#159E9A] dark:text-[#5EEAD4]">Campus Drives</span> for Freedom.
            </h1>

            <p className="text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed max-w-xl">
              Engage in student-led anti-drug rallies, certified clinical counseling circles, mass pledge drives, and community outreach campaigns organized by the NSS MJCET cohort.
            </p>
          </ScrollReveal>
        </div>

        {/* Right Column: Layered Photographic Collage */}
        <div className="lg:col-span-5 relative">
          <ScrollReveal direction="up" delayMs={100}>
            <div className="relative h-64 sm:h-72 w-full max-w-md mx-auto">
              {/* Back Card (Angled Left) */}
              <div className="absolute top-2 left-2 w-48 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-[#14243D] rotate-[-6deg] opacity-80 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop"
                  alt="Student solidarity gathering"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Card (Dominant, Center) */}
              <div className="absolute top-8 right-2 sm:right-6 w-56 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#14243D] rotate-[4deg] hover:rotate-0 transition-transform duration-300 z-10">
                <img
                  src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop"
                  alt="Campus awareness march"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-[#0B1524]/85 backdrop-blur-md text-white text-[11px] flex items-center justify-between">
                  <span className="font-bold">Walkathon 2026</span>
                  <span className="text-[#5EEAD4] font-mono">NSS MJCET</span>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute bottom-0 left-6 z-20 px-3 py-2 rounded-xl bg-[#EAF5FB] dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card flex items-center gap-2 text-xs font-semibold text-[#183153] dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#239B70]" />
                <span>Zero Retribution Policy</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Aggregate Impact Stats Strip */}
      <ScrollReveal direction="up" delayMs={120}>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card">
          <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DDF3F0]/40 dark:hover:bg-[#1B2F4E]/60 cursor-default group">
            <div className="w-10 h-10 rounded-xl bg-[#DDF3F0] dark:bg-teal-950/70 border border-[#A7E8DE] dark:border-teal-800 text-[#159E9A] dark:text-[#5EEAD4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-serif text-[#183153] dark:text-white leading-none">
                {stats.totalActivities}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-wider">
                Configured Drives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DCEBF5]/40 dark:hover:bg-[#1B2F4E]/60 cursor-default group">
            <div className="w-10 h-10 rounded-xl bg-[#DCEBF5] dark:bg-blue-950/70 border border-[#BED7E8] dark:border-blue-800 text-[#4F8FE8] dark:text-[#95C2FA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-serif text-[#183153] dark:text-white leading-none">
                {stats.totalVolunteersEngaged}+
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-wider">
                Target Volunteers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DDF0E6]/40 dark:hover:bg-[#1B2F4E]/60 cursor-default group">
            <div className="w-10 h-10 rounded-xl bg-[#DDF0E6] dark:bg-emerald-950/70 border border-[#B5E9CC] dark:border-emerald-800 text-[#239B70] dark:text-[#34D399] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-serif text-[#183153] dark:text-white leading-none">
                {stats.totalPledgeSignatures}+
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-wider">
                Target Pledges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F5F0E5]/40 dark:hover:bg-[#1B2F4E]/60 cursor-default group">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E5] dark:bg-slate-800/70 border border-[#E8DFC8] dark:border-slate-700 text-[#0F8380] dark:text-[#A8D8CB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-serif text-[#183153] dark:text-white leading-none">
                {stats.upcomingCount} Active
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mt-1 uppercase tracking-wider">
                Upcoming Milestones
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter and Search Controls */}
      <ScrollReveal direction="up" delayMs={150}>
        <div className="mt-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#EAF5FB]/95 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card">
            {/* Status Segmented Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] w-fit">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#159E9A]" />
                Filter:
              </span>
              {[
                { label: 'All', value: 'all' },
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Completed Archive', value: 'completed' },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onSelectStatus(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] hover:-translate-y-0.5 active:scale-[0.98] ${
                    selectedStatus === s.value
                      ? 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#183153] dark:text-white shadow-2xs font-bold'
                      : 'text-[#334C73] dark:text-slate-400 hover:text-[#183153] dark:hover:text-white hover:bg-white/40 dark:hover:bg-[#1B2F4E]/60'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title, venue, or tags..."
                aria-label="Search activities"
                className="w-full pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] text-[#183153] dark:text-white placeholder-slate-400 border border-[#CFE3F0] dark:border-[#243A5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
            role="tablist"
            aria-label="Filter activities by category"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] hover:-translate-y-0.5 active:scale-[0.98] ${
                selectedCategory === 'all'
                  ? 'bg-[#159E9A] text-white font-semibold border-[#159E9A] shadow-2xs'
                  : 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#334C73] dark:text-slate-300 border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#DDF3F0] dark:hover:bg-[#1B2F4E] hover:border-[#159E9A]'
              }`}
            >
              All Categories
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] hover:-translate-y-0.5 active:scale-[0.98] ${
                  selectedCategory === c.id
                    ? 'bg-[#159E9A] text-white font-semibold border-[#159E9A] shadow-2xs'
                    : 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#334C73] dark:text-slate-300 border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#DDF3F0] dark:hover:bg-[#1B2F4E] hover:border-[#159E9A]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
