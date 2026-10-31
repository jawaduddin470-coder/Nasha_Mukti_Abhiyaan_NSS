import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Lock,
  Globe,
  Sliders,
  X,
  ShieldCheck,
} from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';
import {
  LeaderboardAdminResponse,
  LeaderboardEntryAdmin,
  LeaderboardSettingsUpdate,
  AttemptOverrideRequest,
} from '../../types/leaderboard';

interface QuizLeaderboardManagerProps {
  isSuperAdmin?: boolean;
}

const QUIZZES = [
  {
    id: 'nmba-awareness-challenge-v1',
    title: 'Nasha Mukti Awareness Quiz',
    slug: 'nasha-mukti-awareness',
    badge: 'Primary Awareness Drive',
  },
  {
    id: 'national-unity-day-quiz-v1',
    title: 'National Unity Day Quiz',
    slug: 'national-unity-day',
    badge: 'Rashtriya Ekta Diwas',
  },
  {
    id: 'unified-nss-mjcet-leaderboard',
    title: 'Unified NSS MJCET Leaderboard',
    slug: 'unified',
    badge: 'Combined Grand Standings',
  },
];

export const QuizLeaderboardManager: React.FC<QuizLeaderboardManagerProps> = ({
  isSuperAdmin = false,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(QUIZZES[0].id);
  const [data, setData] = useState<LeaderboardAdminResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settings state
  const [announcementDate, setAnnouncementDate] = useState<string>('');
  const [showPublicNames, setShowPublicNames] = useState<boolean>(true);
  const [highlightTopThree, setHighlightTopThree] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>('');
  const [eligibilityRule, setEligibilityRule] = useState<'any' | 'both'>('any');

  // Override Modal state
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntryAdmin | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editTime, setEditTime] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await leaderboardService.getAdminLeaderboard(selectedQuizId);
      setData(res);
      setAnnouncementDate(res.announcementDate || '');
      setShowPublicNames(res.showPublicNames ?? true);
      setHighlightTopThree(res.highlightTopThree ?? true);
      setCustomNote(res.customNote || '');
      setEligibilityRule(res.eligibilityRule || 'any');
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err?.message || 'Failed to load leaderboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedQuizId]);

  const handlePublishToggle = async () => {
    if (!isSuperAdmin) {
      setMessage({ type: 'error', text: 'Restricted: Only Super Administrators can publish official results.' });
      return;
    }

    if (!data) return;
    setActionLoading(true);
    setMessage(null);

    try {
      if (data.isPublished) {
        const res = await leaderboardService.unpublishLeaderboard(selectedQuizId);
        setMessage({ type: 'success', text: res.message || 'Results retracted to Coming Soon state.' });
      } else {
        const res = await leaderboardService.publishLeaderboard(selectedQuizId);
        setMessage({ type: 'success', text: res.message || 'Results published live to the public!' });
      }
      await fetchLeaderboard();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setMessage({ type: 'error', text: 'Restricted: Only Super Administrators can update settings.' });
      return;
    }

    setActionLoading(true);
    setMessage(null);
    try {
      const payload: LeaderboardSettingsUpdate = {
        announcementDate,
        showPublicNames,
        highlightTopThree,
        customNote,
        eligibilityRule: selectedQuizId === 'unified-nss-mjcet-leaderboard' ? eligibilityRule : undefined,
      };
      await leaderboardService.updateSettings(selectedQuizId, payload);
      setMessage({ type: 'success', text: 'Presentation settings updated successfully.' });
      await fetchLeaderboard();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to update settings.' });
    } finally {
      setActionLoading(false);
    }
  };

  const openOverrideModal = (entry: LeaderboardEntryAdmin) => {
    setEditingEntry(entry);
    setEditScore(entry.score);
    setEditTime(entry.timeTakenSeconds || 0);
    setEditName(entry.participantName);
    setEditNotes('');
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setActionLoading(true);
    try {
      const payload: AttemptOverrideRequest = {
        score: editScore,
        timeTakenSeconds: editTime > 0 ? editTime : undefined,
        participantName: editName.trim(),
        notes: editNotes.trim(),
      };
      await leaderboardService.overrideAttempt(editingEntry.attemptId, payload);
      setMessage({ type: 'success', text: `Attempt for '${editName}' updated successfully.` });
      setEditingEntry(null);
      await fetchLeaderboard();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to override attempt.' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEntries = (data?.entries || []).filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      entry.participantName.toLowerCase().includes(q) ||
      entry.participantEmail.toLowerCase().includes(q) ||
      entry.participantInstitution.toLowerCase().includes(q) ||
      (entry.rollNumber && entry.rollNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-[#183153] dark:text-white">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-serif">Quiz Leaderboard Management</h1>
          </div>
          <p className="text-xs text-[#4F678A] dark:text-slate-300">
            Authoritative scoring calculations, official results publication, and participant ranking administration.
          </p>
        </div>

        {/* Global Action / Refresh */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Calculations</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="text-xs opacity-75 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quiz Switcher Tabs */}
      <div className="flex flex-wrap gap-3">
        {QUIZZES.map((quiz) => {
          const isSelected = selectedQuizId === quiz.id;
          return (
            <button
              key={quiz.id}
              type="button"
              onClick={() => setSelectedQuizId(quiz.id)}
              className={`flex-1 sm:flex-initial p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#183153] to-[#24476B] text-white border-[#183153] shadow-md'
                  : 'bg-white dark:bg-[#183153] text-[#183153] dark:text-white border-[#CFE3F0] dark:border-[#22416D] hover:border-[#159E9A]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">{quiz.badge}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              </div>
              <p className="text-sm font-bold font-serif mt-1">{quiz.title}</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white dark:bg-[#183153] rounded-2xl border border-[#CFE3F0] dark:border-[#22416D]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#159E9A] mb-2" />
          <p className="text-xs text-slate-500">Calculating authoritative rankings...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* =======================================================================
              1. PUBLICATION CONTROL & STATUS BAR
              ======================================================================= */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                    data.isPublished
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  }`}
                >
                  {data.isPublished ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{data.isPublished ? 'PUBLISHED LIVE' : 'RESULTS COMING SOON (UNPUBLISHED)'}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {data.totalParticipants} Genuine Entries
                </span>
              </div>

              <p className="text-xs text-[#4F678A] dark:text-slate-300">
                {data.isPublished
                  ? `Published on ${new Date(data.publishedAt || '').toLocaleString()} by ${data.publishedBy || 'Super Admin'}`
                  : 'Public users currently see the countdown-free "RESULTS COMING SOON" announcement. Scores are securely hidden.'}
              </p>
            </div>

            {/* Authoritative Toggle Button */}
            <div className="flex items-center gap-3">
              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={actionLoading}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    data.isPublished
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  }`}
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : data.isPublished ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{data.isPublished ? 'Unpublish Results' : 'Publish Official Results'}</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Only Super Administrators hold publication clearance.</span>
                </div>
              )}
            </div>
          </div>

          {/* =======================================================================
              2. CONFIGURATION & PRESENTATION SETTINGS
              ======================================================================= */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#CFE3F0] dark:border-[#22416D]">
              <Sliders className="w-4 h-4 text-[#159E9A]" />
              <h2 className="text-sm font-bold tracking-tight">Presentation &amp; Privacy Configuration</h2>
            </div>

            <form onSubmit={handleSaveSettings} className={`grid grid-cols-1 md:grid-cols-2 ${selectedQuizId === 'unified-nss-mjcet-leaderboard' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Official Announcement Date (Optional)
                </label>
                <input
                  type="text"
                  value={announcementDate}
                  onChange={(e) => setAnnouncementDate(e.target.value)}
                  placeholder="e.g. November 2, 2026"
                  disabled={!isSuperAdmin}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Gazette Notice / Authenticity Note
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Authenticated by NSS MJCET Authority"
                  disabled={!isSuperAdmin}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              {selectedQuizId === 'unified-nss-mjcet-leaderboard' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Leaderboard Eligibility Rule
                  </label>
                  <select
                    value={eligibilityRule}
                    onChange={(e) => setEligibilityRule(e.target.value as 'any' | 'both')}
                    disabled={!isSuperAdmin}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  >
                    <option value="any">Any Quiz Attempted (Inclusive)</option>
                    <option value="both">Both Quizzes Required (Dual Completion)</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={showPublicNames}
                    onChange={(e) => setShowPublicNames(e.target.checked)}
                    disabled={!isSuperAdmin}
                    className="w-4 h-4 text-[#159E9A] rounded focus:ring-teal-500"
                  />
                  <span>Show Full Participant Names</span>
                </label>
                <p className="text-[10px] text-slate-400">If unchecked, public sees masked names (e.g. J*** D***)</p>
              </div>

              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={highlightTopThree}
                    onChange={(e) => setHighlightTopThree(e.target.checked)}
                    disabled={!isSuperAdmin}
                    className="w-4 h-4 text-[#159E9A] rounded focus:ring-teal-500"
                  />
                  <span>Highlight Top 3 on Podium</span>
                </label>
                {isSuperAdmin && (
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2 rounded-xl bg-[#159E9A] hover:bg-[#0E8581] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* =======================================================================
              3. CALCULATED LEADERBOARD PREVIEW (ALL PARTICIPANTS)
              ======================================================================= */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-serif">Calculated Standings Preview</h2>
                <p className="text-xs text-[#4F678A] dark:text-slate-300">
                  Ranking rules: 1) Highest score first, 2) Shorter completion time, 3) Exact ties share rank.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, email, roll..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No participant attempt records found for this quiz.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#CFE3F0] dark:border-[#22416D]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#EAF5FB] dark:bg-[#12233C] text-[#183153] dark:text-slate-200 border-b border-[#CFE3F0] dark:border-[#22416D] uppercase text-[10px] font-bold">
                      <th className="py-3 px-3 text-center w-14">Rank</th>
                      <th className="py-3 px-3">Participant</th>
                      <th className="py-3 px-3">Email &amp; Roll Number</th>
                      <th className="py-3 px-3">Institution</th>
                      {selectedQuizId === 'unified-nss-mjcet-leaderboard' && (
                        <th className="py-3 px-3 text-center">Score Breakdown</th>
                      )}
                      <th className="py-3 px-3 text-center">
                        {selectedQuizId === 'unified-nss-mjcet-leaderboard' ? 'Combined Score' : 'Score'}
                      </th>
                      <th className="py-3 px-3 text-center">Time Taken</th>
                      <th className="py-3 px-3 text-center">Distinction</th>
                      {isSuperAdmin && <th className="py-3 px-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF5FB] dark:divide-[#1F375B]">
                    {filteredEntries.map((entry) => {
                      const isTop1 = entry.rank === 1;
                      const isTop2 = entry.rank === 2;
                      const isTop3 = entry.rank === 3;

                      return (
                        <tr
                          key={entry.attemptId}
                          className={`hover:bg-[#EAF6FC]/50 dark:hover:bg-[#1E3B63]/40 transition-colors ${
                            isTop1
                              ? 'bg-amber-50/50 dark:bg-amber-950/20'
                              : isTop2
                              ? 'bg-slate-50/50 dark:bg-slate-900/20'
                              : isTop3
                              ? 'bg-orange-50/30 dark:bg-orange-950/20'
                              : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-bold">
                            {isTop1 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs font-mono font-bold">
                                1
                              </span>
                            ) : isTop2 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold">
                                2
                              </span>
                            ) : isTop3 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-700/30 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold">
                                3
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono">#{entry.rank}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#183153] dark:text-white">
                            {entry.participantName}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            <div>{entry.participantEmail}</div>
                            {entry.rollNumber && <div className="text-[10px] text-slate-400">Roll: {entry.rollNumber}</div>}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                            {entry.participantInstitution}
                          </td>
                          {selectedQuizId === 'unified-nss-mjcet-leaderboard' && (
                            <td className="py-3 px-3 text-center text-[10px] space-y-1">
                              <div className="flex items-center justify-center gap-1.5 font-mono">
                                <span className="text-cyan-700 dark:text-cyan-400 font-semibold">NM: {entry.nashaMuktiScore ?? '-'}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-amber-700 dark:text-amber-400 font-semibold">Unity: {entry.unityDayScore ?? '-'}</span>
                              </div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                {entry.quizzesAttemptedCount ?? entry.completedQuizzes?.length ?? 1}/2 Quizzes
                              </span>
                            </td>
                          )}
                          <td className="py-3 px-3 text-center font-mono font-bold text-[#183153] dark:text-white">
                            <span>{entry.score}</span>
                            <span className="text-[10px] text-slate-400">/{entry.maxScore}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                            {entry.timeFormatted}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5FB] dark:bg-[#12233C] text-[#159E9A] dark:text-[#5EEAD4] border border-[#CFE3F0] dark:border-[#22416D]">
                              {entry.badgeName}
                            </span>
                          </td>
                          {isSuperAdmin && (
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => openOverrideModal(entry)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3 text-[#159E9A]" />
                                <span>Correct</span>
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* =======================================================================
          OVERRIDE / CORRECTION MODAL (SUPER ADMIN ONLY)
          ======================================================================= */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#CFE3F0] dark:border-[#22416D] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#159E9A]" />
                <h3 className="font-bold text-sm font-serif">Administrative Record Correction</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Participant Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Earned Score</label>
                  <input
                    type="number"
                    value={editScore}
                    onChange={(e) => setEditScore(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Completion Time (Seconds)</label>
                  <input
                    type="number"
                    value={editTime}
                    onChange={(e) => setEditTime(Number(e.target.value))}
                    min={0}
                    placeholder="e.g. 240 for 4 mins"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-200">
                  Administrative Reason / Note
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Corrected spelling per student college ID"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="pt-3 border-t border-[#CFE3F0] dark:border-[#22416D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-[#159E9A] hover:bg-[#0E8581] text-white font-bold transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Apply Correction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
