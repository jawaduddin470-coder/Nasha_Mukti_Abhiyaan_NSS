import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Medal,
  Crown,
  FileCheck2,
  Calendar,
  Lock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { leaderboardService } from '../services/leaderboardService';
import { LeaderboardPublicResponse, LeaderboardEntryPublic } from '../types/leaderboard';
import { LoadingState } from '../components/common/LoadingState';

type QuizTab = 'nasha-mukti' | 'unity-day' | 'unified';

interface QuizTabOption {
  key: QuizTab;
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  themeColor: string;
  accentBg: string;
}

const QUIZ_TABS: QuizTabOption[] = [
  {
    key: 'nasha-mukti',
    id: 'nmba-awareness-challenge-v1',
    title: 'Nasha Mukti Awareness Quiz',
    shortTitle: 'Nasha Mukti Awareness',
    subtitle: 'Youth Substance Awareness, Prevention Science & Campus Solidarity',
    badge: 'Campus Awareness',
    themeColor: 'from-[#159E9A] to-[#0F766E]',
    accentBg: 'bg-[#159E9A]',
  },
  {
    key: 'unity-day',
    id: 'national-unity-day-quiz-v1',
    title: 'National Unity Day Quiz',
    shortTitle: 'National Unity Day',
    subtitle: 'Rashtriya Ekta Diwas • Celebrating Sardar Vallabhbhai Patel & National Harmony',
    badge: 'Rashtriya Ekta Diwas',
    themeColor: 'from-[#EA580C] via-[#F59E0B] to-[#15803D]',
    accentBg: 'bg-[#EA580C]',
  },
  {
    key: 'unified',
    id: 'unified-nss-mjcet-leaderboard',
    title: 'Unified NSS MJCET Leaderboard',
    shortTitle: 'Unified Leaderboard',
    subtitle: 'Comprehensive Combined Honors Across Both Awareness & National Unity Challenges',
    badge: 'Combined Grand Standings',
    themeColor: 'from-amber-500 via-[#159E9A] to-[#183153]',
    accentBg: 'bg-amber-500',
  },
];

export const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuizTab>('nasha-mukti');
  const [data, setData] = useState<LeaderboardPublicResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentQuizMeta = QUIZ_TABS.find((t) => t.key === activeTab) || QUIZ_TABS[0];
  const isUnifiedTab = activeTab === 'unified';

  useEffect(() => {
    let isMounted = true;
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await leaderboardService.getPublicLeaderboard(currentQuizMeta.id);
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load public leaderboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [activeTab, currentQuizMeta.id]);

  const filteredEntries = (data?.entries || []).filter((item: LeaderboardEntryPublic) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.participantName.toLowerCase().includes(q) ||
      item.participantInstitution.toLowerCase().includes(q) ||
      item.badgeName.toLowerCase().includes(q)
    );
  });

  const topThree = (data?.entries || []).slice(0, 3);

  return (
    <div className="relative min-h-[90vh] py-10 sm:py-16 overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F4FAFD] to-[#E8F3FA] dark:from-[#0B1524] dark:via-[#0F1D33] dark:to-[#08111D] text-[#183153] dark:text-white select-none">
      {/* Dynamic Atmospheric Canvas */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      {/* Subtle gold ambient glow for champions theme */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-400/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <Container size="wide" className="relative z-10 space-y-10 sm:space-y-12">
        {/* =========================================================================
            1. HERO HEADER: THE CHAMPIONS BOARD
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-amber-500/15 dark:from-amber-400/20 dark:to-teal-400/20 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-400/30 shadow-xs backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Official Recognition Hall</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#183153] dark:text-white font-serif leading-tight">
            The Champions Board
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-medium text-[#159E9A] dark:text-[#5EEAD4] tracking-wider uppercase font-sans">
            Excellence &bull; Awareness &bull; Impact
          </p>

          <p className="text-xs sm:text-sm text-[#4F678A] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Honouring students and volunteers who demonstrated exceptional knowledge, conscious decision-making, and collegiate leadership across our awareness initiatives.
          </p>
        </div>

        {/* =========================================================================
            2. THREE LEADERBOARD TABS (Nasha Mukti, Unity Day, and Unified)
            ========================================================================= */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-[#12233C]/90 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] shadow-sm max-w-3xl w-full sm:w-auto">
            {QUIZ_TABS.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#183153] to-[#203D67] text-white shadow-md shadow-[#183153]/20 dark:from-[#1E3B63] dark:to-[#152B49]'
                      : 'text-[#4F678A] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC]/60 dark:hover:bg-[#1A3153]/60'
                  }`}
                  aria-selected={isSelected}
                  role="tab"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? tab.key === 'unity-day'
                          ? 'bg-[#EA580C]'
                          : tab.key === 'unified'
                          ? 'bg-amber-400'
                          : 'bg-[#159E9A]'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span>{tab.shortTitle}</span>
                  {isSelected && (
                    <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Quiz Descriptor Header Strip */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-white/75 dark:bg-[#10243D]/80 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#EAF5FB] dark:bg-[#1A3153] text-[#159E9A] dark:text-[#5EEAD4] border border-[#CFE3F0] dark:border-[#243A5E]">
                {currentQuizMeta.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isUnifiedTab ? 'Aggregated Grand Standings' : 'Official Examination Protocol'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#183153] dark:text-white truncate">
              {currentQuizMeta.title}
            </h2>
            <p className="text-xs text-[#4F678A] dark:text-slate-300 line-clamp-1">
              {currentQuizMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EAF5FB] dark:bg-[#172D4D] text-[#183153] dark:text-white hover:bg-[#DDF3F0] dark:hover:bg-[#1F3C66] border border-[#CFE3F0] dark:border-[#2B4773] transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#159E9A]" />
              <span>Explore Challenges</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN CONTENT: UNPUBLISHED ANNOUNCEMENT vs PUBLISHED RESULTS
            ========================================================================= */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingState variant="spinner" label="Accessing Certified Official Records..." />
          </div>
        ) : !data?.isPublished ? (
          /* =======================================================================
             STAGE 1 (INITIAL RELEASE): RESULTS TO BE ANNOUNCED SOON
             COUNTDOWN-FREE, HIGH-AESTHETIC EDITORIAL ANNOUNCEMENT
             ZERO FAKE PARTICIPANTS, ZERO FABRICATED WINNERS
             ======================================================================= */
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Monumental Announcement Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#10243D] via-[#142B49] to-[#0D1C30] border border-[#2B4773] p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl shadow-[#10243D]/25">
              {/* Radial background flare */}
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),rgba(21,158,154,0.08),transparent_70%)] pointer-events-none"
                aria-hidden="true"
              />

              {/* Decorative Subtle Corner Borders */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                {/* Illuminated Trophy Icon Motif */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-b from-[#1C3A63] to-[#12243E] border-2 border-amber-400/50 shadow-xl shadow-amber-500/10 flex items-center justify-center relative group">
                  <div className="absolute inset-0 rounded-3xl bg-amber-400/10 animate-pulse pointer-events-none" />
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />
                  <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1.5 -right-1.5 animate-bounce" />
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-amber-400/10 text-amber-300 border border-amber-400/25">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Sealed Administrative Evaluation</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight text-white">
                    {data?.message || 'RESULTS TO BE ANNOUNCED SOON'}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl mx-auto">
                    {data?.supportingText ||
                      'Our participants have taken on the challenge. Official results and rankings will be revealed soon by NSS MJCET. Stay tuned!'}
                  </p>
                </div>

                {/* Announcement Date Notice if Scheduled */}
                {data?.announcementDate && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-amber-200">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scheduled Official Release: {data.announcementDate}</span>
                  </div>
                )}

                {/* Institutional Reassurance Note */}
                <div className="pt-4 border-t border-[#243D61] text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#159E9A]" />
                    <span>Authoritative Evaluation Protocol</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <span>Strict Score &amp; Time Verification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Participation CTA */}
            <div className="rounded-2xl border border-[#CFE3F0] dark:border-[#243A5E] bg-white/80 dark:bg-[#12233C]/80 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                  Have you completed both awareness challenges?
                </h3>
                <p className="text-xs sm:text-sm text-[#4F678A] dark:text-slate-300">
                  Participate in the Nasha Mukti Challenge and the National Unity Day Challenge to earn combined honors on the Unified Board.
                </p>
              </div>
              <Link
                to="/quiz"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#183153] to-[#159E9A] text-white shadow-sm hover:opacity-95 transition-all"
              >
                <span>Enter Challenge Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* =======================================================================
             STAGE 2: OFFICIAL RESULTS PUBLISHED
             Dynamic Podium & Standings Table for Single or Unified Board
             ======================================================================= */
          <div className="space-y-12 animate-fadeIn">
            {/* Top Three Podium Composition */}
            {data?.highlightTopThree && topThree.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
                    Official Champions Podium
                  </h3>
                  <p className="text-xs text-[#4F678A] dark:text-slate-400">
                    Highest authentic scores verified with shortest completion duration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-8">
                  {/* Rank 2 (Silver) */}
                  {topThree[1] && (
                    <div className="order-2 md:order-1 flex flex-col items-center">
                      <div className="w-full rounded-2xl bg-gradient-to-b from-white via-slate-50 to-[#EAF5FB] dark:from-[#13253E] dark:to-[#0C1726] border-2 border-slate-300 dark:border-slate-600 p-6 text-center shadow-lg relative space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-400 mx-auto -mt-12 flex items-center justify-center shadow-md">
                          <Medal className="w-6 h-6 text-slate-600 dark:text-slate-200" />
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          2nd Place &bull; Silver
                        </span>
                        <h4 className="text-lg font-bold font-serif text-[#183153] dark:text-white truncate">
                          {topThree[1].participantName}
                        </h4>
                        <p className="text-xs text-[#4F678A] dark:text-slate-400 truncate">
                          {topThree[1].participantInstitution}
                        </p>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-around text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Score</span>
                            <span className="font-bold font-mono text-[#183153] dark:text-white">
                              {topThree[1].score}/{topThree[1].maxScore}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Time</span>
                            <span className="font-bold font-mono text-slate-600 dark:text-slate-300">
                              {topThree[1].timeFormatted}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block w-full h-16 bg-gradient-to-t from-slate-200 dark:from-slate-800/40 to-transparent rounded-b-xl -mt-2" />
                    </div>
                  )}

                  {/* Rank 1 (Gold) */}
                  {topThree[0] && (
                    <div className="order-1 md:order-2 flex flex-col items-center z-10">
                      <div className="w-full rounded-2xl bg-gradient-to-b from-amber-50/90 via-white to-amber-100/60 dark:from-[#1D324F] dark:to-[#122238] border-2 border-amber-400 dark:border-amber-400/80 p-7 text-center shadow-2xl shadow-amber-500/10 relative space-y-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white dark:border-amber-200 mx-auto -mt-14 flex items-center justify-center shadow-lg">
                          <Crown className="w-7 h-7 text-white drop-shadow-sm" />
                        </div>
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                          1st Place &bull; Gold Champion
                        </span>
                        <h4 className="text-xl font-bold font-serif text-[#183153] dark:text-white truncate">
                          {topThree[0].participantName}
                        </h4>
                        <p className="text-xs text-[#4F678A] dark:text-slate-400 truncate">
                          {topThree[0].participantInstitution}
                        </p>
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-400/30 flex items-center justify-around text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Score</span>
                            <span className="font-bold font-mono text-amber-600 dark:text-amber-400 text-sm">
                              {topThree[0].score}/{topThree[0].maxScore}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Time</span>
                            <span className="font-bold font-mono text-[#183153] dark:text-white">
                              {topThree[0].timeFormatted}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block w-full h-24 bg-gradient-to-t from-amber-100 dark:from-amber-950/40 to-transparent rounded-b-xl -mt-2" />
                    </div>
                  )}

                  {/* Rank 3 (Bronze) */}
                  {topThree[2] && (
                    <div className="order-3 flex flex-col items-center">
                      <div className="w-full rounded-2xl bg-gradient-to-b from-white via-orange-50/20 to-[#EAF5FB] dark:from-[#13253E] dark:to-[#0C1726] border-2 border-amber-700/40 dark:border-amber-600/40 p-6 text-center shadow-lg relative space-y-3">
                        <div className="w-12 h-12 rounded-full bg-amber-700/20 dark:bg-amber-900/60 border-2 border-amber-700/60 mx-auto -mt-12 flex items-center justify-center shadow-md">
                          <Medal className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-700/15 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                          3rd Place &bull; Bronze
                        </span>
                        <h4 className="text-lg font-bold font-serif text-[#183153] dark:text-white truncate">
                          {topThree[2].participantName}
                        </h4>
                        <p className="text-xs text-[#4F678A] dark:text-slate-400 truncate">
                          {topThree[2].participantInstitution}
                        </p>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-around text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Score</span>
                            <span className="font-bold font-mono text-[#183153] dark:text-white">
                              {topThree[2].score}/{topThree[2].maxScore}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Time</span>
                            <span className="font-bold font-mono text-slate-600 dark:text-slate-300">
                              {topThree[2].timeFormatted}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block w-full h-12 bg-gradient-to-t from-orange-100 dark:from-orange-950/20 to-transparent rounded-b-xl -mt-2" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Complete Rankings Table & Search */}
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#183153] dark:text-white">
                    {isUnifiedTab ? 'Unified Participant Grand Standings' : 'Official Participant Standings'}
                  </h3>
                  <p className="text-xs text-[#4F678A] dark:text-slate-400">
                    {isUnifiedTab
                      ? 'Combined aggregate scores achieved across both challenges.'
                      : 'Certified individual results ranked strictly by score and duration.'}
                  </p>
                </div>

                {/* Search Filter */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or college..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-[#12233C] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/60 dark:bg-[#10243D]/60 border border-[#CFE3F0] dark:border-[#243A5E] text-slate-500 text-sm">
                  No participants matched your search criteria.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#CFE3F0] dark:border-[#243A5E] bg-white/90 dark:bg-[#10243D]/90 shadow-sm backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF5FB]/70 dark:bg-[#142B49] text-[#183153] dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                          <th className="py-3.5 px-4">Participant</th>
                          <th className="py-3.5 px-4 hidden md:table-cell">Institution</th>
                          {isUnifiedTab && (
                            <th className="py-3.5 px-4 text-center hidden sm:table-cell">Completed Quizzes</th>
                          )}
                          <th className="py-3.5 px-4 text-center">Score</th>
                          <th className="py-3.5 px-4 text-center hidden sm:table-cell">Duration</th>
                          <th className="py-3.5 px-4 text-center">Distinction Badge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#CFE3F0]/60 dark:divide-[#243A5E]/60">
                        {filteredEntries.map((entry: LeaderboardEntryPublic) => {
                          const isGold = entry.rank === 1;
                          const isSilver = entry.rank === 2;
                          const isBronze = entry.rank === 3;

                          return (
                            <tr
                              key={entry.attemptId}
                              className={`transition-colors ${
                                isGold
                                  ? 'bg-amber-50/40 dark:bg-amber-950/20'
                                  : isSilver
                                  ? 'bg-slate-50/50 dark:bg-slate-800/20'
                                  : isBronze
                                  ? 'bg-orange-50/30 dark:bg-orange-950/10'
                                  : 'hover:bg-[#EAF6FC]/40 dark:hover:bg-[#152B49]/40'
                              }`}
                            >
                              <td className="py-3.5 px-4 text-center font-mono">
                                {isGold ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-xs">
                                    1
                                  </span>
                                ) : isSilver ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs shadow-xs">
                                    2
                                  </span>
                                ) : isBronze ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/60 text-white font-bold text-xs shadow-xs">
                                    3
                                  </span>
                                ) : (
                                  <span className="font-semibold text-slate-500">#{entry.rank}</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 font-medium text-[#183153] dark:text-white">
                                <div className="truncate max-w-[180px] sm:max-w-xs">{entry.participantName}</div>
                                <div className="text-[11px] text-slate-400 md:hidden truncate">
                                  {entry.participantInstitution}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 hidden md:table-cell">
                                <div className="truncate max-w-xs">{entry.participantInstitution}</div>
                              </td>

                              {isUnifiedTab && (
                                <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                                  {entry.completedQuizzes && entry.completedQuizzes.length === 2 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Both Quizzes
                                    </span>
                                  ) : entry.completedQuizzes && entry.completedQuizzes[0]?.includes('unity') ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                      Unity Day Only
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                                      Awareness Only
                                    </span>
                                  )}
                                </td>
                              )}

                              <td className="py-3.5 px-4 text-center">
                                <span className="font-mono font-bold text-[#183153] dark:text-white">
                                  {entry.score}
                                </span>
                                <span className="text-[10px] text-slate-400">/{entry.maxScore}</span>
                              </td>

                              <td className="py-3.5 px-4 text-center font-mono text-slate-500 hidden sm:table-cell">
                                {entry.timeFormatted}
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FB] dark:bg-[#162D4A] text-[#159E9A] dark:text-[#5EEAD4] border border-[#CFE3F0] dark:border-[#243A5E]">
                                  {entry.badgeName}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
