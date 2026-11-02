/**
 * Quiz Participants & Secure Deletion Manager
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Professional administrative participant management system:
 * - Multi-filter active participants table with Quiz Type & 3-dot action menu
 * - Single-attempt soft deletion with confirmation dialog
 * - Multi-attempt participant deletion with impact analysis and typed "DELETE" confirmation
 * - Deleted Participants archive with restore and Super Admin permanent purge
 * - Automatic certificate revocation/restoration and leaderboard synchronization
 * - Full audit logging and Super Admin Excel export
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Loader2,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Eye,
  History,
  UserX,
  UserCheck,
  MoreVertical,
  AlertTriangle,
  ShieldCheck,
  Award,
  ExternalLink,
  Calendar,
  Mail,
  Building,
  AlertCircle,
  X,
  CheckCircle2,
  Shield,
  FileText,
} from 'lucide-react';
import { quizService } from '../../services/quizService';
import { auth } from '../../lib/firebase/config';
import { API_BASE_URL } from '../../services/apiClient';

interface QuizParticipantsManagerProps {
  isSuperAdmin?: boolean;
}

export const QuizParticipantsManager: React.FC<QuizParticipantsManagerProps> = ({
  isSuperAdmin = false,
}) => {
  // Navigation tab: 'active' or 'deleted'
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');

  // Attempts and counts
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activeTotal, setActiveTotal] = useState<number>(0);
  const [deletedTotal, setDeletedTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quizFilter, setQuizFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Action Menu dropdown state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [submissionModalAttempt, setSubmissionModalAttempt] = useState<any | null>(null);
  const [historyModalEmail, setHistoryModalEmail] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  // Deletion modals
  const [deleteAttemptTarget, setDeleteAttemptTarget] = useState<any | null>(null);
  const [deleteAttemptReason, setDeleteAttemptReason] = useState<string>('Administrative removal');
  const [isDeletingAttempt, setIsDeletingAttempt] = useState<boolean>(false);

  const [deleteParticipantTarget, setDeleteParticipantTarget] = useState<any | null>(null);
  const [participantImpact, setParticipantImpact] = useState<any | null>(null);
  const [impactLoading, setImpactLoading] = useState<boolean>(false);
  const [deleteParticipantConfirmText, setDeleteParticipantConfirmText] = useState<string>('');
  const [deleteParticipantReason, setDeleteParticipantReason] = useState<string>('Administrative participant removal');
  const [isDeletingParticipant, setIsDeletingParticipant] = useState<boolean>(false);

  // Permanent Delete Modal
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<{
    type: 'attempt' | 'participant';
    idOrEmail: string;
    name: string;
    quizTitle?: string;
  } | null>(null);
  const [permDeleteConfirmText, setPermDeleteConfirmText] = useState<string>('');
  const [isPermDeleting, setIsPermDeleting] = useState<boolean>(false);

  // Notification Banner
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Close 3-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch attempts from server
  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await quizService.getAdminAttempts({
        status: activeTab,
        quiz_id: quizFilter,
        passed: statusFilter === 'passed' ? true : statusFilter === 'attempted' ? false : undefined,
        search: searchTerm.trim() || undefined,
        department: departmentFilter,
        limit: 100,
      });

      setAttempts(res.items || []);
      setActiveTotal(res.activeTotal || 0);
      setDeletedTotal(res.deletedTotal || 0);
    } catch (e: any) {
      console.error('Failed to load quiz attempts:', e);
      showNotification('error', e?.message || 'Failed to load participant attempts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [activeTab, quizFilter, statusFilter, departmentFilter]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttempts();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Helper for Quiz Type badge
  const renderQuizTypeBadge = (quizId: string) => {
    const isUnity = quizId && quizId.toLowerCase().includes('unity');
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${
          isUnity
            ? 'bg-[#183153] text-[#CFE3F0] border border-[#2A4B7C]'
            : 'bg-[#E6F7F6] text-[#0F766E] border border-[#99F6E4]'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isUnity ? 'bg-amber-400' : 'bg-[#159E9A]'}`} />
        <span>{isUnity ? 'National Unity Day' : 'Nasha Mukti Awareness'}</span>
      </span>
    );
  };

  // Excel Export Handler (Super Admin only)
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      let authHeader = '';
      if (auth && auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        authHeader = `Bearer ${token}`;
      } else if (import.meta.env.DEV) {
        const devToken = localStorage.getItem('nmba_admin_dev_token');
        if (devToken) authHeader = `Bearer ${devToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/admin/quiz/export`, {
        headers: authHeader ? { Authorization: authHeader } : {},
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Export request failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nss_mjcet_quiz_participants_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showNotification('success', 'Participant workbook exported successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Excel export failed.');
    } finally {
      setExporting(false);
    }
  };

  // Open Participant History Modal
  const openParticipantHistory = async (email: string) => {
    setHistoryModalEmail(email);
    setHistoryLoading(true);
    setOpenMenuId(null);
    try {
      const data = await quizService.getParticipantHistory(email);
      setHistoryData(data);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to fetch participant history.');
      setHistoryModalEmail(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Open Delete Participant Modal & fetch impact
  const openDeleteParticipantModal = async (attempt: any) => {
    const email = attempt.participant?.email;
    if (!email) return;
    setDeleteParticipantTarget(attempt);
    setDeleteParticipantConfirmText('');
    setDeleteParticipantReason('Administrative participant removal');
    setImpactLoading(true);
    setOpenMenuId(null);

    try {
      const impact = await quizService.getParticipantImpact(email);
      setParticipantImpact(impact);
    } catch (err: any) {
      showNotification('error', err.message || 'Could not compute participant impact.');
      setDeleteParticipantTarget(null);
    } finally {
      setImpactLoading(false);
    }
  };

  // Execute Soft Delete Attempt
  const handleConfirmDeleteAttempt = async () => {
    if (!deleteAttemptTarget) return;
    setIsDeletingAttempt(true);
    try {
      await quizService.deleteAttempt(deleteAttemptTarget.attemptId, deleteAttemptReason);
      showNotification(
        'success',
        `Attempt '${deleteAttemptTarget.attemptId}' for ${deleteAttemptTarget.participant?.fullName || 'participant'} archived.`,
      );
      setDeleteAttemptTarget(null);
      fetchAttempts();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to archive attempt.');
    } finally {
      setIsDeletingAttempt(false);
    }
  };

  // Execute Restore Attempt
  const handleRestoreAttempt = async (attemptId: string) => {
    try {
      await quizService.restoreAttempt(attemptId);
      showNotification('success', `Attempt '${attemptId}' restored to active standing.`);
      fetchAttempts();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to restore attempt.');
    }
  };

  // Execute Soft Delete Participant
  const handleConfirmDeleteParticipant = async () => {
    if (!deleteParticipantTarget || deleteParticipantConfirmText.trim() !== 'DELETE') return;
    setIsDeletingParticipant(true);
    const email = deleteParticipantTarget.participant?.email;
    try {
      const res = await quizService.deleteParticipant(email, deleteParticipantReason, 'DELETE');
      showNotification(
        'success',
        `Archived participant ${email} (${res.attemptsArchived} attempts, ${res.certificatesArchived} certificates).`,
      );
      setDeleteParticipantTarget(null);
      setParticipantImpact(null);
      fetchAttempts();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to archive participant.');
    } finally {
      setIsDeletingParticipant(false);
    }
  };

  // Execute Restore Participant
  const handleRestoreParticipant = async (email: string) => {
    try {
      const res = await quizService.restoreParticipant(email);
      showNotification(
        'success',
        `Restored participant ${email} (${res.attemptsRestored} attempts, ${res.certificatesRestored} certificates).`,
      );
      fetchAttempts();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to restore participant.');
    }
  };

  // Execute Permanent Delete (Super Admin only)
  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteTarget || permDeleteConfirmText.trim() !== 'DELETE') return;
    setIsPermDeleting(true);
    try {
      if (permanentDeleteTarget.type === 'attempt') {
        await quizService.permanentDeleteAttempt(permanentDeleteTarget.idOrEmail);
        showNotification('success', `Attempt '${permanentDeleteTarget.idOrEmail}' permanently purged.`);
      } else {
        await quizService.permanentDeleteParticipant(permanentDeleteTarget.idOrEmail, 'DELETE');
        showNotification(
          'success',
          `Participant '${permanentDeleteTarget.idOrEmail}' permanently purged from database and disk.`,
        );
      }
      setPermanentDeleteTarget(null);
      setPermDeleteConfirmText('');
      fetchAttempts();
    } catch (err: any) {
      showNotification('error', err.message || 'Permanent deletion failed.');
    } finally {
      setIsPermDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-sm animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Excel Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-[#183153] tracking-tight">
              Quiz Participants &amp; Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5FB] text-[#159E9A] border border-[#CFE3F0]">
              MongoDB Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative participant submissions recorded in MongoDB Atlas ({activeTotal} active, {deletedTotal} archived).
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#239B70] text-white text-xs font-semibold hover:bg-[#1D8560] shadow-sm transition-all self-start disabled:opacity-50 cursor-pointer"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting Workbook...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Active Participants (.xlsx)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0]">
        <button
          type="button"
          onClick={() => {
            setActiveTab('active');
            setOpenMenuId(null);
          }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'active'
              ? 'border-[#159E9A] text-[#183153]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>Active Participants</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EAF5FB] text-[#159E9A] font-mono">
            {activeTotal}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('deleted');
            setOpenMenuId(null);
          }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'deleted'
              ? 'border-amber-500 text-[#183153]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>Deleted Participants Archive</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-mono">
            {deletedTotal}
          </span>
        </button>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#CFE3F0] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CFE3F0] bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#159E9A]"
            />
          </div>

          {/* Quiz Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={quizFilter}
              onChange={(e) => setQuizFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-[#CFE3F0] bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#159E9A]"
            >
              <option value="all">All Quiz Initiatives</option>
              <option value="nmba-awareness-challenge-v1">Nasha Mukti Awareness Challenge</option>
              <option value="national-unity-day-quiz-v1">National Unity Day Challenge</option>
            </select>
          </div>

          {/* Pass/Attempt Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-[#CFE3F0] bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#159E9A]"
            >
              <option value="all">All Result Statuses</option>
              <option value="passed">Passed (Score ≥ 70%)</option>
              <option value="attempted">Attempted (Score &lt; 70%)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-[#CFE3F0] bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#159E9A]"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science &amp; Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics &amp; Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || quizFilter !== 'all' || statusFilter !== 'all' || departmentFilter !== 'all') && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#F1F5F9]">
            <span>Showing {attempts.length} filtered results matching active criteria</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setQuizFilter('all');
                setStatusFilter('all');
                setDepartmentFilter('all');
              }}
              className="text-[#159E9A] hover:underline font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading participant submissions from MongoDB Atlas...</p>
        </div>
      ) : activeTab === 'active' ? (
        /* ================= ACTIVE PARTICIPANTS TABLE ================= */
        <div className="bg-[#EAF5FB] rounded-2xl border border-[#CFE3F0] shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-3">Quiz Type</th>
                  <th className="py-3 px-3">Institution &amp; Dept</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Badge</th>
                  <th className="py-3 px-3">Certificate</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7E7F0]">
                {attempts.length > 0 ? (
                  attempts.map((att) => {
                    const p = att.participant || {};
                    const isMenuOpen = openMenuId === att.attemptId;
                    const cert = att.certificate;

                    return (
                      <tr key={att.attemptId} className="hover:bg-[#F0F7FB]/70 transition-colors">
                        {/* Participant info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#183153] font-serif text-sm">{p.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.email}</div>
                          {p.rollNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">Roll: {p.rollNumber}</div>
                          )}
                        </td>

                        {/* Quiz Type */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {renderQuizTypeBadge(att.quizId)}
                        </td>

                        {/* Institution & Department */}
                        <td className="py-3.5 px-3">
                          <div className="text-slate-700 font-medium">{p.institutionName || 'MJCET'}</div>
                          <div className="text-[11px] text-slate-500">{p.department}</div>
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-3 font-mono font-bold text-[#183153] whitespace-nowrap">
                          <div>{att.percentage}%</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            ({att.score}/{att.maxScore || 100})
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              att.passed
                                ? 'bg-emerald-50 text-[#239B70] border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {att.passed ? 'PASSED' : 'ATTEMPTED'}
                          </span>
                        </td>

                        {/* Badge */}
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{att.badgeName || 'Campus Champion'}</span>
                          </div>
                        </td>

                        {/* Certificate Link */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {cert && !cert.isDeleted ? (
                            <a
                              href={cert.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                              title="Inspect issued certificate PDF"
                            >
                              <span>{cert.certificateId}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              {att.passed ? 'Eligible' : 'Not earned'}
                            </span>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(att.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions (3-Dot Menu) */}
                        <td className="py-3.5 px-4 text-right relative whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : att.attemptId);
                            }}
                            className="p-1.5 rounded-xl border border-[#CFE3F0] bg-white hover:bg-[#F0F7FB] text-slate-600 transition-colors cursor-pointer"
                            title="Participant Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              className="absolute right-4 top-12 z-50 w-56 rounded-2xl bg-white border border-[#CFE3F0] shadow-xl py-2 text-xs text-left animate-in fade-in zoom-in-95 duration-100"
                            >
                              <div className="px-3.5 py-1.5 border-b border-[#F1F5F9] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Participant Actions
                              </div>

                              {/* 1. View Submission */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSubmissionModalAttempt(att);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-[#F0F7FB] text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#159E9A]" />
                                <span>View Submission Details</span>
                              </button>

                              {/* 2. View Participant History */}
                              <button
                                type="button"
                                onClick={() => openParticipantHistory(p.email)}
                                className="w-full px-3.5 py-2 hover:bg-[#F0F7FB] text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <History className="w-3.5 h-3.5 text-blue-600" />
                                <span>View Participant History</span>
                              </button>

                              <div className="my-1 border-t border-[#F1F5F9]" />

                              {/* 3. Delete Attempt */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteAttemptTarget(att);
                                  setDeleteAttemptReason('Administrative removal');
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-amber-50 text-amber-700 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Delete Attempt</span>
                              </button>

                              {/* 4. Delete Participant */}
                              <button
                                type="button"
                                onClick={() => openDeleteParticipantModal(att)}
                                className="w-full px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition-colors font-semibold"
                              >
                                <UserX className="w-3.5 h-3.5 text-red-600" />
                                <span>Delete Participant (All)</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No active quiz attempts match your current search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= DELETED PARTICIPANTS TABLE ================= */
        <div className="bg-[#FFFBEB] rounded-2xl border border-amber-200 shadow-sm overflow-visible">
          <div className="p-4 bg-amber-100/60 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Deleted Participants Archive: Records here are excluded from active leaderboards, analytics, and certificate issuance. They can be safely restored or permanently purged by a Super Admin.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-200 bg-amber-50/70 text-[#183153] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-3">Quiz Type</th>
                  <th className="py-3 px-3">Score &amp; Status</th>
                  <th className="py-3 px-3">Archived On</th>
                  <th className="py-3 px-3">Archived By</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/60">
                {attempts.length > 0 ? (
                  attempts.map((att) => {
                    const p = att.participant || {};
                    return (
                      <tr key={att.attemptId} className="hover:bg-amber-100/40 transition-colors">
                        {/* Participant */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#183153] font-serif text-sm">{p.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.email}</div>
                          <div className="text-[10px] text-slate-400">{p.institutionName || 'MJCET'}</div>
                        </td>

                        {/* Quiz Type */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {renderQuizTypeBadge(att.quizId)}
                        </td>

                        {/* Score & Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap font-mono">
                          <div className="font-bold text-[#183153]">{att.percentage}%</div>
                          <span className="text-[10px] text-slate-500">
                            {att.passed ? 'Passed' : 'Attempted'}
                          </span>
                        </td>

                        {/* Archived Date */}
                        <td className="py-3.5 px-3 text-[11px] font-mono text-slate-600 whitespace-nowrap">
                          {att.deletedAt
                            ? new Date(att.deletedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Archived'}
                        </td>

                        {/* Archived By */}
                        <td className="py-3.5 px-3 text-[11px] text-slate-600 font-mono">
                          {att.deletedBy || 'System'}
                        </td>

                        {/* Deletion Reason */}
                        <td className="py-3.5 px-4 text-xs text-slate-700 italic max-w-xs truncate">
                          "{att.deletionReason || 'Administrative removal'}"
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSubmissionModalAttempt(att)}
                            className="p-1.5 rounded-lg border border-[#CFE3F0] bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                            title="View Archived Submission Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Restore Attempt */}
                          <button
                            type="button"
                            onClick={() => handleRestoreAttempt(att.attemptId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Restore Attempt"
                          >
                            <RotateCcw className="w-3 h-3 text-emerald-600" />
                            <span>Restore</span>
                          </button>

                          {/* Restore All for Participant */}
                          <button
                            type="button"
                            onClick={() => handleRestoreParticipant(p.email)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Restore Entire Participant"
                          >
                            <UserCheck className="w-3 h-3 text-teal-600" />
                            <span>Restore All</span>
                          </button>

                          {/* Permanent Delete (Super Admin Only) */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setPermanentDeleteTarget({
                                  type: 'attempt',
                                  idOrEmail: att.attemptId,
                                  name: p.fullName || 'Participant',
                                  quizTitle: att.quizTitle || 'Quiz Attempt',
                                });
                                setPermDeleteConfirmText('');
                              }}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Permanently Purge Attempt (Super Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No deleted records in archive.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DELETE SINGLE ATTEMPT CONFIRMATION MODAL                               */}
      {/* ========================================================================= */}
      {deleteAttemptTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#EAF5FB] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CFE3F0] space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#183153] font-serif">
                  Archive Single Quiz Attempt?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You are about to archive this specific submission from active standing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteAttemptTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Card Details */}
            <div className="p-4 rounded-xl bg-white border border-[#CFE3F0] space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                <span className="text-slate-400">Participant:</span>
                <span className="font-bold text-[#183153]">
                  {deleteAttemptTarget.participant?.fullName}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                <span className="text-slate-400">Registered Email:</span>
                <span className="font-mono text-slate-700">
                  {deleteAttemptTarget.participant?.email}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                <span className="text-slate-400">Quiz Initiative:</span>
                <span>{renderQuizTypeBadge(deleteAttemptTarget.quizId)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                <span className="text-slate-400">Score Achieved:</span>
                <span className="font-mono font-bold text-[#183153]">
                  {deleteAttemptTarget.percentage}% ({deleteAttemptTarget.score} pts)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Submission Date:</span>
                <span className="font-mono text-slate-700">
                  {new Date(deleteAttemptTarget.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Scope explanation */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Isolated Scope:</strong> Only this single attempt record will be moved to the archive. Any other attempts, submissions, or achievements by this participant remain completely intact.
            </div>

            {/* Reason input */}
            <div>
              <label className="block text-xs font-semibold text-[#183153] mb-1">
                Reason for Deletion (Recorded in Audit Trail)
              </label>
              <input
                type="text"
                value={deleteAttemptReason}
                onChange={(e) => setDeleteAttemptReason(e.target.value)}
                placeholder="e.g. Duplicate attempt, student request, testing..."
                className="w-full px-3 py-2 rounded-xl border border-[#CFE3F0] bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#159E9A]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAttemptTarget(null)}
                disabled={isDeletingAttempt}
                className="px-4 py-2 rounded-xl border border-[#CFE3F0] text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAttempt}
                disabled={isDeletingAttempt}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeletingAttempt ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Archiving Attempt...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Archive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DELETE PARTICIPANT CONFIRMATION MODAL (Multi-Attempt with DELETE check) */}
      {/* ========================================================================= */}
      {deleteParticipantTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#EAF5FB] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <UserX className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#183153] font-serif">
                  Archive Entire Participant Records?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This multi-record action archives all quiz submissions and certificates for this individual.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteParticipantTarget(null);
                  setParticipantImpact(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Impact Details Grid */}
            {impactLoading || !participantImpact ? (
              <div className="py-8 flex justify-center items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#159E9A]" />
                <span>Computing participant impact across database...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-[#CFE3F0] text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="font-bold text-[#183153]">{participantImpact.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-700">{participantImpact.email}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                    <span className="text-slate-400">Institution &amp; Dept:</span>
                    <span className="text-slate-700">
                      {participantImpact.institutionName} • {participantImpact.department}
                    </span>
                  </div>
                </div>

                {/* Impact Counts Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-white border border-[#CFE3F0]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Attempts</span>
                    <span className="text-lg font-bold font-mono text-[#183153]">{participantImpact.totalAttempts}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#CFE3F0]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Nasha Mukti</span>
                    <span className="text-lg font-bold font-mono text-teal-600">{participantImpact.nashaMuktiAttempts}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#CFE3F0]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Unity Day</span>
                    <span className="text-lg font-bold font-mono text-[#183153]">{participantImpact.unityDayAttempts}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#CFE3F0]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificates</span>
                    <span className="text-lg font-bold font-mono text-amber-600">{participantImpact.certificateCount}</span>
                  </div>
                </div>

                {/* Critical Warning */}
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-900 leading-relaxed">
                  <strong>Notice:</strong> This action moves all {participantImpact.totalAttempts} attempts to the Deleted Participants archive, revokes {participantImpact.certificateCount} issued certificate credentials, and removes the participant from all active leaderboards.
                </div>

                {/* Deletion Reason */}
                <div>
                  <label className="block text-xs font-semibold text-[#183153] mb-1">
                    Audit Reason
                  </label>
                  <input
                    type="text"
                    value={deleteParticipantReason}
                    onChange={(e) => setDeleteParticipantReason(e.target.value)}
                    placeholder="Reason for archiving participant..."
                    className="w-full px-3 py-2 rounded-xl border border-[#CFE3F0] bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                  />
                </div>

                {/* Typed Confirmation Requirement */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-red-700">
                    Type <span className="font-mono uppercase bg-red-100 px-1.5 py-0.5 rounded text-red-800">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteParticipantConfirmText}
                    onChange={(e) => setDeleteParticipantConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-3 py-2 rounded-xl border-2 border-red-300 focus:border-red-500 bg-white font-mono text-xs text-red-800 focus:outline-none tracking-wider"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteParticipantTarget(null);
                  setParticipantImpact(null);
                }}
                disabled={isDeletingParticipant}
                className="px-4 py-2 rounded-xl border border-[#CFE3F0] text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteParticipant}
                disabled={isDeletingParticipant || deleteParticipantConfirmText.trim() !== 'DELETE'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeletingParticipant ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Archiving All Records...</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>Archive Participant</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERMANENT DELETE MODAL (SUPER ADMIN ONLY)                             */}
      {/* ========================================================================= */}
      {permanentDeleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFF5F5] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase tracking-wider mb-1">
                  <Shield className="w-3 h-3" />
                  <span>Super Admin Privilege Required</span>
                </div>
                <h3 className="text-base font-bold text-red-950 font-serif">
                  Permanent Database Purge
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-red-100/70 border border-red-300 text-xs text-red-900 leading-relaxed space-y-2">
              <p>
                You are about to <strong>permanently destroy</strong> all database documents and associated PDF certificate files for:
              </p>
              <p className="font-mono font-bold text-red-950">
                {permanentDeleteTarget.name} ({permanentDeleteTarget.idOrEmail})
              </p>
              <p className="text-[11px] text-red-700 italic">
                This action is irreversible. It bypasses the soft-delete archive and purges MongoDB records directly.
              </p>
            </div>

            {/* Type confirmation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-red-900">
                Type <span className="font-mono uppercase bg-red-200 px-1.5 py-0.5 rounded text-red-950">DELETE</span> to confirm permanent destruction:
              </label>
              <input
                type="text"
                value={permDeleteConfirmText}
                onChange={(e) => setPermDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 rounded-xl border-2 border-red-400 focus:border-red-600 bg-white font-mono text-xs text-red-950 tracking-wider focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                disabled={isPermDeleting}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                disabled={isPermDeleting || permDeleteConfirmText.trim() !== 'DELETE'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPermDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Purging from Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Purge Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUBMISSION DETAILS MODAL                                              */}
      {/* ========================================================================= */}
      {submissionModalAttempt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#EAF5FB] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#CFE3F0] flex items-start justify-between bg-white">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Attempt ID: {submissionModalAttempt.attemptId}
                </span>
                <h3 className="text-lg font-bold text-[#183153] font-serif mt-0.5">
                  {submissionModalAttempt.participant?.fullName || 'Participant Submission'}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  {renderQuizTypeBadge(submissionModalAttempt.quizId)}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      submissionModalAttempt.passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {submissionModalAttempt.percentage}% • {submissionModalAttempt.passed ? 'PASSED' : 'ATTEMPTED'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionModalAttempt(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Participant Profile Card */}
              <div className="p-4 rounded-xl bg-white border border-[#CFE3F0] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-[#159E9A] shrink-0" />
                  <span className="font-mono">{submissionModalAttempt.participant?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Building className="w-3.5 h-3.5 text-[#159E9A] shrink-0" />
                  <span>{submissionModalAttempt.participant?.institutionName || 'MJCET'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-[#159E9A] shrink-0" />
                  <span>
                    {submissionModalAttempt.participant?.department} ({submissionModalAttempt.participant?.yearOfStudy || 'Student'})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-[#159E9A] shrink-0" />
                  <span className="font-mono">
                    {new Date(submissionModalAttempt.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Certificate Banner (if issued) */}
              {submissionModalAttempt.certificate && !submissionModalAttempt.certificate.isDeleted && (
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#159E9A]" />
                    <span className="text-xs font-semibold text-[#0F766E]">
                      Issued Certificate: <strong>{submissionModalAttempt.certificate.certificateId}</strong>
                    </span>
                  </div>
                  <a
                    href={submissionModalAttempt.certificate.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-teal-300 text-xs font-bold text-[#159E9A] hover:bg-teal-50 cursor-pointer shadow-2xs"
                  >
                    <span>Inspect PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Answers Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#183153] uppercase tracking-wider text-[10px]">
                  Submitted Answers ({Object.keys(submissionModalAttempt.userAnswers || {}).length} questions answered)
                </h4>
                <div className="p-4 rounded-xl bg-white border border-[#CFE3F0] font-mono text-[11px] space-y-1.5 max-h-52 overflow-y-auto">
                  {Object.entries(submissionModalAttempt.userAnswers || {}).map(([qId, ans]) => (
                    <div key={qId} className="flex justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-slate-500">{qId}:</span>
                      <span className="font-bold text-[#183153]">
                        {Array.isArray(ans) ? ans.join(', ') : String(ans)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#CFE3F0] bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSubmissionModalAttempt(null)}
                className="px-5 py-2 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#22446E] transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PARTICIPANT HISTORY TIMELINE MODAL                                     */}
      {/* ========================================================================= */}
      {historyModalEmail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#EAF5FB] rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="p-6 border-b border-[#CFE3F0] flex items-start justify-between bg-white">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Comprehensive Participant Journey
                </span>
                <h3 className="text-lg font-bold text-[#183153] font-serif mt-0.5">
                  {historyData?.fullName || historyModalEmail}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{historyModalEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHistoryModalEmail(null);
                  setHistoryData(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              {historyLoading ? (
                <div className="py-12 flex justify-center items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-[#159E9A]" />
                  <span>Loading participant journey...</span>
                </div>
              ) : historyData?.attempts?.length > 0 ? (
                historyData.attempts.map((att: any, idx: number) => {
                  return (
                    <div
                      key={att.attemptId || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        att.isDeleted
                          ? 'bg-amber-50/70 border-amber-200 opacity-80'
                          : 'bg-white border-[#CFE3F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderQuizTypeBadge(att.quizId)}
                          {att.isDeleted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              ARCHIVED
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">
                          {new Date(att.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px]">Score: </span>
                          <strong className="text-[#183153] font-mono font-bold">
                            {att.percentage}% ({att.score} pts)
                          </strong>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                              att.passed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {att.passed ? 'PASSED' : 'ATTEMPTED'}
                          </span>
                        </div>

                        {att.certificate && !att.certificate.isDeleted && (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-[#0F766E] font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            <Award className="w-3 h-3 text-[#159E9A]" />
                            <span>{att.certificate.certificateId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-slate-400 py-8">No historical attempts recorded.</p>
              )}
            </div>

            <div className="p-4 border-t border-[#CFE3F0] bg-white flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setHistoryModalEmail(null);
                  setHistoryData(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#22446E] transition-colors cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
