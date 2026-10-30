/**
 * Complete Admin CMS Dashboard
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Full-featured administrative control suite for Super Admins and Editors.
 * Features live MongoDB metrics, Central Media Library integration, and complete CRUD
 * management for Activities, Gallery, Media, Developers, Quiz Curriculum,
 * Quiz Participants Excel Export, Post-Quiz Awareness Messages, Users, and Audit Logs.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  Users,
  FileQuestion,
  Award,
  Sparkles,
  ShieldCheck,
  Settings,
  History,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Download,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Save,
  RefreshCw,
  FolderOpen,
  Search,
  Upload,
  AlertCircle,
  Loader2,
  Check,
  Archive,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { useAdminAuth, AdminRole } from '../../context/AdminAuthContext';
import { apiClient, API_BASE_URL } from '../../services/apiClient';
import { auth } from '../../lib/firebase/config';
import { MediaPickerInput } from '../../components/admin/MediaPickerInput';
import { MediaLibraryModal } from '../../components/admin/MediaLibraryModal';
import { MediaItem, fetchMediaItems, deleteMediaAsset } from '../../services/mediaService';
import { HomepageContentManager } from '../../components/admin/HomepageContentManager';
import { PermanentDeleteModal } from '../../components/admin/PermanentDeleteModal';
import { activityService } from '../../services/activityService';
import { galleryService } from '../../services/galleryService';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

type TabKey =
  | 'overview'
  | 'homepage_manager'
  | 'activities'
  | 'gallery'
  | 'media'
  | 'developers'
  | 'participants'
  | 'quiz_questions'
  | 'awareness_messages'
  | 'users'
  | 'settings'
  | 'audit_logs';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser, signOut, isLoading: authLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !adminUser) {
      navigate('/login/admin', { replace: true });
    }
  }, [authLoading, adminUser, navigate]);

  if (authLoading || !adminUser) {
    return (
      <div className="min-h-screen bg-[#EAF6FC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperAdmin = adminUser.role === 'SUPER_ADMIN';

  // Guard against non-superadmin navigating to restricted tabs
  const handleTabChange = (tab: TabKey) => {
    if (!isSuperAdmin && (tab === 'users' || tab === 'settings' || tab === 'audit_logs')) {
      setActiveTab('overview');
    } else {
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FB] text-[#183153] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#183153] border-b border-[#22416D] px-4 py-3 flex items-center justify-between sticky top-0 z-50 text-white">
        <div className="flex items-center gap-2.5">
          <img src="/NSS-LOGO.png" alt="NSS Logo" className="w-7 h-7 object-contain" />
          <span className="font-bold text-sm text-white tracking-tight">NSS MJCET CMS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-white/20 text-white hover:bg-[#1E3B63]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'fixed inset-0 z-40 bg-[#183153] flex' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-[#183153] border-r border-[#152744] shrink-0 md:sticky md:top-0 md:h-screen text-white`}
      >
        <div className="p-5 border-b border-[#22416D] flex items-center gap-3">
          <img src="/NSS-LOGO.png" alt="NSS Logo" className="w-9 h-9 object-contain" />
          <div>
            <h2 className="font-bold text-sm text-white tracking-tight">Nasha Mukti Portal</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#239B70] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider text-[#A8D8CB] uppercase">
                {adminUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-sm font-medium">
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('homepage_manager')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'homepage_manager'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#A8D8CB]" />
            <span>Homepage Content Manager</span>
          </button>

          <button
            onClick={() => handleTabChange('activities')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'activities'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Activities</span>
          </button>

          <button
            onClick={() => handleTabChange('gallery')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'gallery'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Photos</span>
          </button>

          <button
            onClick={() => handleTabChange('media')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'media'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-[#A8D8CB]" />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => handleTabChange('developers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'developers'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Developers</span>
          </button>

          <button
            onClick={() => handleTabChange('participants')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'participants'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Quiz Participants</span>
          </button>

          <button
            onClick={() => handleTabChange('quiz_questions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'quiz_questions'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>Quiz Curriculum</span>
          </button>

          <button
            onClick={() => handleTabChange('awareness_messages')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'awareness_messages'
                ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Post-Quiz Messages</span>
          </button>

          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-[#A8D8CB]/80 uppercase tracking-wider">
                Super Admin Controls
              </div>

              <button
                onClick={() => handleTabChange('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === 'users'
                    ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                    : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#A8D8CB]" />
                <span>Users & Roles</span>
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                    : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Settings</span>
              </button>

              <button
                onClick={() => handleTabChange('audit_logs')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === 'audit_logs'
                    ? 'bg-[#159E9A] text-white font-semibold shadow-md'
                    : 'text-white/75 hover:bg-[#1E3B63] hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            </>
          )}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-[#22416D] bg-[#122540]">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <div className="text-xs font-bold text-white truncate">
                {adminUser.displayName || adminUser.email}
              </div>
              <div className="text-[11px] text-slate-300 truncate">{adminUser.email}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#159E9A]/20 text-[#A8D8CB] border border-[#159E9A]/30">
              {adminUser.role === 'SUPER_ADMIN' ? 'SUPER' : 'EDITOR'}
            </span>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'overview' && <OverviewView onNavigate={handleTabChange} isSuperAdmin={isSuperAdmin} />}
        {activeTab === 'homepage_manager' && <HomepageContentManager />}
        {activeTab === 'activities' && <ActivitiesView />}
        {activeTab === 'gallery' && <GalleryView />}
        {activeTab === 'media' && <MediaLibraryView />}
        {activeTab === 'developers' && <DevelopersView />}
        {activeTab === 'participants' && <QuizParticipantsView isSuperAdmin={isSuperAdmin} />}
        {activeTab === 'quiz_questions' && <QuizQuestionsView isSuperAdmin={isSuperAdmin} />}
        {activeTab === 'awareness_messages' && <AwarenessMessagesView isSuperAdmin={isSuperAdmin} />}
        {activeTab === 'users' && isSuperAdmin && <UsersView />}
        {activeTab === 'settings' && isSuperAdmin && <SettingsView />}
        {activeTab === 'audit_logs' && isSuperAdmin && <AuditLogsView />}
      </main>
    </div>
  );
};

// =============================================================
// 1. OVERVIEW VIEW
// =============================================================
const OverviewView: React.FC<{ onNavigate: (tab: TabKey) => void; isSuperAdmin: boolean }> = ({
  onNavigate,
  isSuperAdmin,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/analytics/overview');
      setData(res);
    } catch (e) {
      console.error('Failed to load analytics overview:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const act = data?.activities || {};
  const qz = data?.quiz || {};

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Campaign Operations Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Genuine database-backed operational metrics from MongoDB Atlas.
          </p>
        </div>
        <button
          onClick={fetchOverview}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[#D7E7F0] bg-[#F4FAFD] text-[#183153] hover:bg-[#DDF3F0] self-start transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#159E9A]" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('activities')}
          className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-5 rounded-2xl border border-[#CFE3F0] shadow-sm cursor-pointer hover:border-[#159E9A] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Activities</span>
            <Calendar className="w-4 h-4 text-[#159E9A]" />
          </div>
          <div className="text-3xl font-extrabold text-[#183153]">{act.published || 0}</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>{act.completed || 0} completed</span> • <span>{act.upcoming || 0} upcoming</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('gallery')}
          className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-5 rounded-2xl border border-[#CFE3F0] shadow-sm cursor-pointer hover:border-[#239B70] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gallery Photographs</span>
            <ImageIcon className="w-4 h-4 text-[#239B70]" />
          </div>
          <div className="text-3xl font-extrabold text-[#183153]">{data?.gallery?.published || 0}</div>
          <div className="text-xs text-slate-500 mt-2">Active in 3D floating constellation</div>
        </div>

        <div
          onClick={() => onNavigate('participants')}
          className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-5 rounded-2xl border border-[#CFE3F0] shadow-sm cursor-pointer hover:border-[#4F8FE8] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Quiz Attempts</span>
            <Award className="w-4 h-4 text-[#4F8FE8]" />
          </div>
          <div className="text-3xl font-extrabold text-[#183153]">{qz.totalAttempts || 0}</div>
          <div className="text-xs text-slate-500 mt-2">
            {qz.uniqueParticipants || 0} unique verified participants
          </div>
        </div>

        <div
          onClick={() => onNavigate('participants')}
          className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-5 rounded-2xl border border-[#CFE3F0] shadow-sm cursor-pointer hover:border-[#159E9A] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Score / Pass Rate</span>
            <FileQuestion className="w-4 h-4 text-[#159E9A]" />
          </div>
          <div className="text-3xl font-extrabold text-[#183153]">{qz.averageScore || 0}%</div>
          <div className="text-xs text-slate-500 mt-2">{qz.passingRate || 0}% passing threshold</div>
        </div>
      </div>

      {/* Recent Activity Log Table */}
      <div className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 rounded-2xl border border-[#CFE3F0] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#183153]">Recent Administrative Actions</h2>
          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('audit_logs')}
              className="text-xs text-[#159E9A] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E7F0]">
              {data?.recentAuditLogs?.length > 0 ? (
                data.recentAuditLogs.map((log: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#F0F7FB]/60">
                    <td className="py-3 px-3 text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{log.actorEmail}</td>
                    <td className="py-3 px-3 font-semibold text-[#183153]">{log.action}</td>
                    <td className="py-3 px-3 text-slate-500">{log.module}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 truncate max-w-xs">{log.recordId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No recent actions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// 2. ACTIVITIES VIEW (With Media Library Integration & <=5 Cap)
// =============================================================
const ActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal Form State
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/activities');
      setActivities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openNewActivityModal = () => {
    setEditingActivity(null);
    setCoverImage('');
    setGalleryImages([]);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditActivityModal = (act: any) => {
    setEditingActivity(act);
    setCoverImage(act.coverImage || '');
    setGalleryImages(act.galleryImages?.map((g: any) => g.url) || []);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleAddGallerySlot = () => {
    const totalCurrent = (coverImage ? 1 : 0) + galleryImages.length;
    if (totalCurrent >= 5) {
      alert('Strict Cap Reached: An activity can have at most 5 total images (cover + gallery photos).');
      return;
    }
    if (galleryImages.length >= 4) {
      alert('Maximum 4 additional gallery photos allowed.');
      return;
    }
    setGalleryImages([...galleryImages, '']);
  };

  const handleUpdateGallerySlot = (idx: number, val: string) => {
    const next = [...galleryImages];
    next[idx] = val;
    setGalleryImages(next);
  };

  const handleRemoveGallerySlot = (idx: number) => {
    const next = [...galleryImages];
    next.splice(idx, 1);
    setGalleryImages(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get('title') as string).trim();
    const category = formData.get('category') as string;
    const summary = (formData.get('summary') as string).trim();
    const description = (formData.get('description') as string).trim();
    const venue = (formData.get('venue') as string).trim();
    const date = (formData.get('date') as string).trim();
    const timeDisplay = (formData.get('timeDisplay') as string).trim();
    const status = formData.get('status') as string;
    const publicationStatus = formData.get('publicationStatus') as string;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 1;

    // Validate image count strictly <= 5
    const cleanedGallery = galleryImages.map((u) => u.trim()).filter(Boolean);
    const totalImages = (coverImage.trim() ? 1 : 0) + cleanedGallery.length;

    if (totalImages > 5) {
      setErrorMsg(`An activity may have at most 5 total images (cover + gallery). Found ${totalImages}.`);
      return;
    }

    const payload = {
      title,
      slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      category,
      summary,
      description,
      venue,
      date,
      timeDisplay,
      status,
      publicationStatus,
      coverImage: coverImage.trim(),
      galleryImages: cleanedGallery.map((url, i) => ({ url, caption: '', displayOrder: i + 1 })),
      impactMetrics: editingActivity?.impactMetrics || [{ label: 'Volunteers Engaged', value: '500+' }],
      agenda: editingActivity?.agenda || [{ time: '10:00 AM', title: 'Assembly & Welcome', description: '' }],
      coordinators: editingActivity?.coordinators || ['NSS MJCET Lead'],
      tags: ['Awareness', 'Youth', 'Community'],
      featured: true,
      displayOrder,
    };

    try {
      if (editingActivity?.id) {
        await apiClient.put(`/admin/activities/${editingActivity.id}`, payload);
      } else {
        await apiClient.post('/admin/activities', payload);
      }
      setIsModalOpen(false);
      setEditingActivity(null);
      fetchActivities();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nmba_cms_updated', { detail: { type: 'activities' } }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save activity');
    }
  };

  const handleArchive = async (act: any) => {
    try {
      await activityService.archiveActivity(act.id);
      fetchActivities();
      setActionFeedback({
        type: 'success',
        message: `Activity "${act.title}" has been archived and hidden from public view. You can restore it anytime.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to archive activity' });
    }
  };

  const handleRestore = async (act: any) => {
    try {
      await activityService.restoreActivity(act.id);
      fetchActivities();
      setActionFeedback({
        type: 'success',
        message: `Activity "${act.title}" has been restored to published status and is now visible on public sections.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to restore activity' });
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    try {
      setIsDeleting(true);
      await activityService.deleteActivityPermanently(permanentDeleteTarget.id);
      const title = permanentDeleteTarget.title;
      setPermanentDeleteTarget(null);
      fetchActivities();
      setActionFeedback({
        type: 'success',
        message: `Activity "${title}" was permanently deleted from the database. Shared images remain safe.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to delete activity permanently' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (statusFilter === 'all') return true;
    return act.publicationStatus?.toLowerCase() === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Campaign Activities Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and publish activities showcased in the 3D rotating carousel and detail modal.
          </p>
        </div>
        <button
          onClick={openNewActivityModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Activity</span>
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0] pb-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#183153] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          All ({activities.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('published')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'published'
              ? 'bg-[#159E9A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          Published ({activities.filter((a) => a.publicationStatus === 'published').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('draft')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'draft'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          Drafts ({activities.filter((a) => a.publicationStatus === 'draft').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('archived')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'archived'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          Archived Items ({activities.filter((a) => a.publicationStatus === 'archived').length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#EAF5FB] rounded-2xl border border-[#CFE3F0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Activity Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date & Venue</th>
                <th className="py-3 px-3">Imagery Cap</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E7F0]">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No activities found matching "{statusFilter}".
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const totalImg = (act.coverImage ? 1 : 0) + (act.galleryImages?.length || 0);
                  const isArchived = act.publicationStatus === 'archived';
                  return (
                    <tr key={act.id} className="hover:bg-[#F0F7FB]/60">
                      <td className="py-3.5 px-4 font-bold text-[#183153] max-w-xs truncate">
                        {act.title}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF6FC] text-[#159E9A] uppercase tracking-wider">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div>{act.date}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{act.venue}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">
                        <span className="px-1.5 py-0.5 rounded bg-[#F0F7FB] border border-[#D7E7F0] font-bold text-[11px] text-[#183153]">
                          {totalImg}/5 images
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            act.publicationStatus === 'published'
                              ? 'bg-emerald-50 text-[#239B70] border border-emerald-200'
                              : act.publicationStatus === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {act.publicationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-600">{act.displayOrder}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isArchived ? (
                            <>
                              <button
                                onClick={() => openEditActivityModal(act)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#159E9A] hover:bg-[#EAF6FC] transition-colors"
                                title="Edit Activity"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleArchive(act)}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Archive (Removes from public view, preserves data)"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setPermanentDeleteTarget(act)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Permanently Delete (Purge from database)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(act)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-[11px] font-semibold"
                                title="Restore Activity to Published"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>
                              <button
                                onClick={() => setPermanentDeleteTarget(act)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Permanently Delete (Purge from database)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      <PermanentDeleteModal
        isOpen={!!permanentDeleteTarget}
        title={permanentDeleteTarget?.title || ''}
        itemType="activity"
        onClose={() => setPermanentDeleteTarget(null)}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
      />

      {/* Activity Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#EAF5FB] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E7F0] bg-[#F0F7FB]">
              <h2 className="text-lg font-bold text-[#183153]">
                {editingActivity ? `Edit Activity: ${editingActivity.title}` : 'Create New Campaign Activity'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#DDF3F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                  <input
                    name="title"
                    defaultValue={editingActivity?.title || ''}
                    required
                    placeholder="e.g. Anti-Drug Awareness Walkathon"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingActivity?.category || 'rallies'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="rallies">Rallies</option>
                    <option value="pledges">Pledges</option>
                    <option value="seminars">Seminars</option>
                    <option value="street-plays">Street Plays</option>
                    <option value="workshops">Workshops</option>
                    <option value="counseling">Counseling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Venue *</label>
                  <input
                    name="venue"
                    defaultValue={editingActivity?.venue || 'MJCET Main Campus'}
                    required
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingActivity?.displayOrder || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    name="date"
                    defaultValue={editingActivity?.date || '2026-11-01'}
                    required
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Display *</label>
                  <input
                    name="timeDisplay"
                    defaultValue={editingActivity?.timeDisplay || '10:00 AM - 01:00 PM IST'}
                    required
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingActivity?.status || 'completed'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingActivity?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Summary *</label>
                <textarea
                  name="summary"
                  rows={2}
                  defaultValue={editingActivity?.summary || ''}
                  required
                  placeholder="Concise overview shown on the 3D rotating card..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Description *</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingActivity?.description || ''}
                  required
                  placeholder="Detailed background and student participation narrative..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              {/* Photos Section (Strict Cap: Max 5 Total) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-[#D7E7F0] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#183153] block">
                      Activity Imagery (Strict Cap: Max 5 Total)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      1 Cover Image + up to 4 Additional Gallery Photos
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#159E9A]/10 text-[#159E9A]">
                    {(coverImage ? 1 : 0) + galleryImages.length} / 5 Used
                  </span>
                </div>

                {/* Cover Image Picker */}
                <div className="bg-[#F4FAFD] p-3.5 rounded-xl border border-[#CFE3F0]">
                  <MediaPickerInput
                    label="Primary Cover Image"
                    value={coverImage}
                    onChange={setCoverImage}
                    category="activities"
                    required
                    helperText="Featured on the 3D carousel card"
                  />
                </div>

                {/* Additional Gallery Photos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-xs">
                      Additional Gallery Photos ({galleryImages.length}/4)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddGallerySlot}
                      disabled={(coverImage ? 1 : 0) + galleryImages.length >= 5 || galleryImages.length >= 4}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4FAFD] border border-[#CFE3F0] text-slate-700 hover:bg-[#DDF3F0] disabled:opacity-40 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#159E9A]" />
                      <span>Add Gallery Photo</span>
                    </button>
                  </div>

                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="bg-[#F4FAFD] p-3.5 rounded-xl border border-[#CFE3F0] relative">
                      <MediaPickerInput
                        label={`Gallery Photo ${idx + 1}`}
                        value={imgUrl}
                        onChange={(val) => handleUpdateGallerySlot(idx, val)}
                        category="activities"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGallerySlot(idx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 text-xs"
                        title="Remove photo slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7E7F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingActivity ? 'Save Changes' : 'Create Activity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 3. GALLERY VIEW (With Full Add/Edit CMS & Media Library)
// =============================================================
const GalleryView: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'archived'>('all');
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [imageUrl, setImageUrl] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/gallery');
      setPhotos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const openNewPhotoModal = () => {
    setEditingPhoto(null);
    setImageUrl('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditPhotoModal = (photo: any) => {
    setEditingPhoto(photo);
    setImageUrl(photo.imageUrl || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get('title') as string).trim();
    const caption = (formData.get('caption') as string).trim();
    const category = formData.get('category') as string;
    const date = (formData.get('date') as string).trim();
    const location = (formData.get('location') as string).trim() || 'MJCET Campus';
    const aspectRatio = formData.get('aspectRatio') as any;
    const publicationStatus = formData.get('publicationStatus') as any;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 1;
    const featuredIn3D = formData.get('featuredIn3D') === 'on';
    const rawTags = (formData.get('tags') as string) || '';
    const tags = rawTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (!imageUrl.trim()) {
      setErrorMsg('Please select or upload a photograph image.');
      return;
    }

    const payload = {
      title,
      caption,
      category,
      imageUrl: imageUrl.trim(),
      thumbnailUrl: imageUrl.trim(),
      photographer: 'NSS MJCET Media Wing',
      date,
      location,
      aspectRatio,
      tags: tags.length > 0 ? tags : ['Nasha Mukti', 'MJCET', 'Awareness'],
      publicationStatus,
      featuredIn3D,
      displayOrder,
    };

    try {
      if (editingPhoto?.id) {
        await apiClient.put(`/admin/gallery/${editingPhoto.id}`, payload);
      } else {
        await apiClient.post('/admin/gallery', payload);
      }
      setIsModalOpen(false);
      setEditingPhoto(null);
      fetchPhotos();
      setActionFeedback({
        type: 'success',
        message: `Photograph "${title}" saved successfully.`,
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nmba_cms_updated', { detail: { type: 'gallery' } }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save photograph.');
    }
  };

  const handleArchive = async (photo: any) => {
    try {
      await galleryService.archiveGalleryPhoto(photo.id);
      fetchPhotos();
      setActionFeedback({
        type: 'success',
        message: `Photograph "${photo.title}" archived. It is hidden from the public gallery and homepage but can be restored anytime.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to archive photograph' });
    }
  };

  const handleRestore = async (photo: any) => {
    try {
      await galleryService.restoreGalleryPhoto(photo.id);
      fetchPhotos();
      setActionFeedback({
        type: 'success',
        message: `Photograph "${photo.title}" restored to published status.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to restore photograph' });
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    try {
      setIsDeleting(true);
      await galleryService.deleteGalleryPhotoPermanently(permanentDeleteTarget.id);
      const title = permanentDeleteTarget.title;
      setPermanentDeleteTarget(null);
      fetchPhotos();
      setActionFeedback({
        type: 'success',
        message: `Photograph "${title}" was permanently removed from MongoDB. Shared images remain safe.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Failed to permanently delete photograph' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.publicationStatus?.toLowerCase() === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Gallery Photographs CMS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage photographs featured in the floating 3D orbital constellation, public gallery, and homepage.
          </p>
        </div>
        <button
          onClick={openNewPhotoModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photograph</span>
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0] pb-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#183153] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          All ({photos.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('published')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'published'
              ? 'bg-[#159E9A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          Published ({photos.filter((p) => p.publicationStatus === 'published').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('archived')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'archived'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          Archived Items ({photos.filter((p) => p.publicationStatus === 'archived').length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No photographs found matching "{statusFilter}".
            </div>
          ) : (
            filteredPhotos.map((photo) => {
              const isArchived = photo.publicationStatus === 'archived';
              return (
                <div key={photo.id} className="bg-[#F4FAFD] rounded-2xl border border-[#CFE3F0] overflow-hidden shadow-sm flex flex-col group hover:border-[#159E9A] transition-all">
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={resolveMediaUrl(photo.imageUrl)}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => handleMediaError(e, photo.title, photo.category)}
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF5FB]/95 text-[#183153] border border-[#CFE3F0] shadow-xs">
                        {photo.category}
                      </span>
                      {isArchived && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white shadow-xs">
                          Archived
                        </span>
                      )}
                    </div>
                    {photo.featuredIn3D && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#239B70] text-white shadow-xs">
                        Featured in 3D Wall
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-[#183153] truncate">{photo.title}</h3>
                        <span className="text-[10px] font-mono text-slate-400">Order: {photo.displayOrder}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{photo.caption}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#D7E7F0] flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{photo.date}</span>
                      <div className="flex items-center gap-1.5">
                        {!isArchived ? (
                          <>
                            <button
                              onClick={() => openEditPhotoModal(photo)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#159E9A] hover:bg-[#EAF6FC] transition-colors"
                              title="Edit photo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleArchive(photo)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Archive (Hide from public, preserve file)"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPermanentDeleteTarget(photo)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete permanently from database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(photo)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-[11px] font-semibold"
                              title="Restore to published"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                            <button
                              onClick={() => setPermanentDeleteTarget(photo)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete permanently from database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      <PermanentDeleteModal
        isOpen={!!permanentDeleteTarget}
        title={permanentDeleteTarget?.title || ''}
        itemType="gallery photograph"
        onClose={() => setPermanentDeleteTarget(null)}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
      />

      {/* Add / Edit Photograph Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#EAF5FB] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E7F0] bg-[#F0F7FB]">
              <h2 className="text-lg font-bold text-[#183153]">
                {editingPhoto ? `Edit Photograph: ${editingPhoto.title}` : 'Add Campaign Photograph'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#DDF3F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Media Picker Input */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <MediaPickerInput
                  label="Photograph Image"
                  value={imageUrl}
                  onChange={setImageUrl}
                  category="gallery"
                  required
                  helperText="Select from Media Library or upload new"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                  <input
                    name="title"
                    defaultValue={editingPhoto?.title || ''}
                    required
                    placeholder="e.g. Student Oath Ceremony"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingPhoto?.category || 'rallies'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="rallies">Rallies</option>
                    <option value="pledges">Pledges</option>
                    <option value="seminars">Seminars</option>
                    <option value="street-plays">Street Plays</option>
                    <option value="workshops">Workshops</option>
                    <option value="counseling">Counseling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Caption *</label>
                <textarea
                  name="caption"
                  rows={2}
                  defaultValue={editingPhoto?.caption || ''}
                  required
                  placeholder="Informative narrative context about the photograph..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    name="date"
                    defaultValue={editingPhoto?.date || '2026-10-28'}
                    required
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location</label>
                  <input
                    name="location"
                    defaultValue={editingPhoto?.location || 'MJCET Campus'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Aspect Ratio</label>
                  <select
                    name="aspectRatio"
                    defaultValue={editingPhoto?.aspectRatio || 'landscape'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingPhoto?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingPhoto?.displayOrder || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  name="tags"
                  defaultValue={editingPhoto?.tags?.join(', ') || 'Nasha Mukti, Pledge, Youth'}
                  placeholder="Youth, Pledge, 2026, Rally"
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredIn3D"
                  name="featuredIn3D"
                  defaultChecked={editingPhoto?.featuredIn3D ?? true}
                  className="rounded text-[#159E9A] focus:ring-[#159E9A]"
                />
                <label htmlFor="featuredIn3D" className="font-semibold text-slate-700">
                  Feature in floating 3D orbital constellation
                </label>
              </div>

              <div className="pt-3 border-t border-[#D7E7F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPhoto ? 'Save Changes' : 'Add Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 4. CENTRAL MEDIA LIBRARY VIEW (Standalone Dashboard Tab)
// =============================================================
const MediaLibraryView: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaItems(categoryFilter, searchQuery);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [categoryFilter, searchQuery]);

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Delete media item "${item.title || item.filename}"?`)) return;
    setDeleteError(null);
    try {
      await deleteMediaAsset(item.id);
      loadMedia();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete asset.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Central Media Library</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, upload, and safely manage all campaign photographs and visual assets.
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {deleteError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to delete media asset:</p>
            <p>{deleteError}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or filename..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4FAFD] border border-[#CFE3F0] rounded-xl text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'activities', label: 'Activities' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'developers', label: 'Developers' },
            { id: 'general', label: 'General' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-[#F4FAFD] border border-[#CFE3F0] text-slate-600 hover:bg-[#DDF3F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-[#F4FAFD] rounded-2xl border border-dashed border-[#CFE3F0] p-8">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#183153]">No media assets found</p>
          <p className="text-xs text-slate-400 mt-1">Adjust your search or upload a new campaign photograph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-[#F4FAFD] rounded-2xl border border-[#CFE3F0] overflow-hidden shadow-xs flex flex-col group hover:border-[#159E9A] transition-all">
              <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                <img
                  src={resolveMediaUrl(item.url)}
                  alt={item.title || item.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => handleMediaError(e, item.title || item.filename, item.category)}
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#183153] truncate" title={item.title || item.filename}>
                    {item.title || item.filename}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{item.url}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#D7E7F0]">
                  <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete media asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal Triggered from Standalone View */}
      <MediaLibraryModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSelect={() => {
          setUploadModalOpen(false);
          loadMedia();
        }}
        initialTab="upload"
      />
    </div>
  );
};

// =============================================================
// 5. DEVELOPERS VIEW (With Add/Edit CMS & Avatar Media Picker)
// =============================================================
const DevelopersView: React.FC = () => {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDev, setEditingDev] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/developers');
      setDevelopers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const openNewDevModal = () => {
    setEditingDev(null);
    setAvatarUrl('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditDevModal = (dev: any) => {
    setEditingDev(dev);
    setAvatarUrl(dev.avatarUrl || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = (formData.get('fullName') as string).trim();
    const role = (formData.get('role') as string).trim() || 'Platform Engineer';
    const roleCategory = (formData.get('roleCategory') as string) || 'Core Team';
    const bio = (formData.get('bio') as string).trim() || 'Contributed to platform engineering and institutional campaign technology.';
    const githubUrl = (formData.get('githubUrl') as string).trim() || null;
    const linkedinUrl = (formData.get('linkedinUrl') as string).trim() || null;
    const departmentOrAffiliation = (formData.get('departmentOrAffiliation') as string).trim() || 'MJCET';
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 1;
    const publicationStatus = (formData.get('publicationStatus') as any) || 'published';
    const featured = formData.get('featured') === 'on';
    const rawSkills = (formData.get('skills') as string) || '';
    const skills = rawSkills.split(',').map((s) => s.trim()).filter(Boolean);

    if (!fullName) {
      setErrorMsg('Please enter the developer full name.');
      return;
    }

    const payload = {
      fullName,
      role,
      roleCategory,
      bio,
      avatarUrl: avatarUrl ? avatarUrl.trim() : '',
      skills: skills.length > 0 ? skills : ['React', 'TypeScript'],
      githubUrl,
      linkedinUrl,
      otherUrl: null,
      departmentOrAffiliation,
      featured,
      displayOrder,
      publicationStatus,
    };

    try {
      if (editingDev?.id) {
        await apiClient.put(`/admin/developers/${editingDev.id}`, payload);
      } else {
        await apiClient.post('/admin/developers', payload);
      }
      setIsModalOpen(false);
      setEditingDev(null);
      fetchDevelopers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save developer profile.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete contributor profile '${id}'?`)) return;
    try {
      await apiClient.delete(`/admin/developers/${id}`);
      fetchDevelopers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete developer profile.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Meet the Developers CMS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and reorder engineering team contributor cards displayed on the public homepage.
          </p>
        </div>
        <button
          onClick={openNewDevModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Developer</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developers.map((dev) => (
            <div key={dev.id} className="bg-[#F4FAFD] p-5 rounded-2xl border border-[#CFE3F0] shadow-sm flex gap-4 hover:border-[#159E9A] transition-all">
              <img
                src={resolveMediaUrl(dev.avatarUrl)}
                alt={dev.fullName}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#D7E7F0]"
                onError={(e) => handleMediaError(e, dev.fullName, 'Developer')}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#183153] truncate">{dev.fullName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF6FC] text-[#159E9A] border border-[#B9DDF5]">
                    Order: {dev.displayOrder}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#159E9A] mt-0.5 truncate">{dev.role}</div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dev.bio}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D7E7F0]">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {dev.githubUrl && (
                      <a href={dev.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[#183153] font-medium transition-colors">
                        GitHub
                      </a>
                    )}
                    {dev.linkedinUrl && (
                      <a href={dev.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-[#4F8FE8] font-medium transition-colors">
                        LinkedIn
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDevModal(dev)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#159E9A] hover:bg-[#EAF6FC] transition-colors"
                      title="Edit developer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete developer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Developer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#EAF5FB] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E7F0] bg-[#F0F7FB]">
              <h2 className="text-lg font-bold text-[#183153]">
                {editingDev ? `Edit Developer: ${editingDev.fullName}` : 'Add Developer Contributor'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#DDF3F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Avatar Media Picker */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <MediaPickerInput
                  label="Avatar Photograph"
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  category="developers"
                  required
                  helperText="Choose profile photo from library or upload"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    name="fullName"
                    defaultValue={editingDev?.fullName || ''}
                    required
                    placeholder="e.g. Merajuddin"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Role</label>
                  <input
                    name="role"
                    defaultValue={editingDev?.role || 'Platform Engineer'}
                    placeholder="e.g. Lead Fullstack Architect"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role Category</label>
                  <select
                    name="roleCategory"
                    defaultValue={editingDev?.roleCategory || 'Core Team'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="Core Team">Core Team</option>
                    <option value="Frontend & 3D Web">Frontend & 3D Web</option>
                    <option value="Fullstack & Cloud">Fullstack & Cloud</option>
                    <option value="Content & Research">Content & Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department / College</label>
                  <input
                    name="departmentOrAffiliation"
                    defaultValue={editingDev?.departmentOrAffiliation || 'MJCET'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Biography / Contribution Narrative</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={editingDev?.bio || ''}
                  placeholder="Detail contribution to architecture, 3D experience, or campaign mission..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Technical Skills (Comma-separated)</label>
                <input
                  name="skills"
                  defaultValue={editingDev?.skills?.join(', ') || 'React, TypeScript, Three.js, Python'}
                  placeholder="React, TypeScript, Vite, Tailwind, MongoDB"
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GitHub Profile URL</label>
                  <input
                    name="githubUrl"
                    defaultValue={editingDev?.githubUrl || ''}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">LinkedIn Profile URL</label>
                  <input
                    name="linkedinUrl"
                    defaultValue={editingDev?.linkedinUrl || editingDev?.socialLinks?.linkedin || ''}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingDev?.displayOrder || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingDev?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7E7F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingDev ? 'Save Changes' : 'Add Developer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 6. QUIZ PARTICIPANTS & EXCEL EXPORT VIEW (Role Separated)
// =============================================================
const QuizParticipantsView: React.FC<{ isSuperAdmin?: boolean }> = ({ isSuperAdmin = false }) => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/quiz/attempts?limit=50');
      setAttempts(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

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
      a.download = `nss_mjcet_quiz_attempts_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Excel export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Quiz Participants & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative participant submissions recorded in MongoDB Atlas ({total} total attempts).
          </p>
        </div>
        {/* Strictly hide Excel Export for Editors, visible only to Super Admins */}
        {isSuperAdmin && (
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#239B70] text-white text-xs font-semibold hover:bg-[#1D8560] shadow-sm transition-all self-start disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting Workbook...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export to Excel (.xlsx)</span>
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#EAF5FB] rounded-2xl border border-[#CFE3F0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-3">Institution & Dept</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Badge</th>
                <th className="py-3 px-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E7F0]">
              {attempts.length > 0 ? (
                attempts.map((att) => {
                  const p = att.participant || {};
                  return (
                    <tr key={att.attemptId} className="hover:bg-[#F0F7FB]/60">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#183153]">{p.fullName}</div>
                        <div className="text-[11px] text-slate-500">{p.email}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-700 font-medium">{p.institutionName}</div>
                        <div className="text-[11px] text-slate-500">{p.department}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#183153]">
                        {att.percentage}% ({att.score}/{att.maxScore})
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            att.passed
                              ? 'bg-emerald-50 text-[#239B70] border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {att.passed ? 'PASSED' : 'ATTEMPTED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{att.badgeName}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(att.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No quiz attempts recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 7. QUIZ CURRICULUM QUESTIONS VIEW (With Add/Edit & Type Validation)
// =============================================================
const QuizQuestionsView: React.FC<{ isSuperAdmin?: boolean }> = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [qType, setQType] = useState<'single' | 'multiple' | 'boolean'>('single');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: 'opt-1', text: '' },
    { id: 'opt-2', text: '' },
    { id: 'opt-3', text: '' },
    { id: 'opt-4', text: '' },
  ]);
  const [correctAnswerIds, setCorrectAnswerIds] = useState<string[]>([]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/quiz/questions');
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openNewQuestionModal = () => {
    setEditingQuestion(null);
    setQType('single');
    setOptions([
      { id: 'opt-1', text: '' },
      { id: 'opt-2', text: '' },
      { id: 'opt-3', text: '' },
      { id: 'opt-4', text: '' },
    ]);
    setCorrectAnswerIds(['opt-1']);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditQuestionModal = (q: any) => {
    setEditingQuestion(q);
    setQType(q.type || 'single');
    setOptions(q.options || []);
    setCorrectAnswerIds(q.correctAnswerIds || []);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleTypeChange = (newType: 'single' | 'multiple' | 'boolean') => {
    setQType(newType);
    if (newType === 'boolean') {
      const boolOpts = [
        { id: 'opt-true', text: 'True' },
        { id: 'opt-false', text: 'False' },
      ];
      setOptions(boolOpts);
      setCorrectAnswerIds(['opt-true']);
    } else if (options.length < 2) {
      setOptions([
        { id: 'opt-1', text: '' },
        { id: 'opt-2', text: '' },
      ]);
    }
  };

  const handleAddOption = () => {
    const nextId = `opt-${Date.now() % 100000}`;
    setOptions([...options, { id: nextId, text: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      alert('Questions must have at least 2 options.');
      return;
    }
    setOptions(options.filter((o) => o.id !== id));
    setCorrectAnswerIds(correctAnswerIds.filter((cid) => cid !== id));
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const handleToggleCorrect = (id: string) => {
    if (qType === 'single' || qType === 'boolean') {
      setCorrectAnswerIds([id]);
    } else {
      // multiple
      if (correctAnswerIds.includes(id)) {
        if (correctAnswerIds.length === 1) {
          alert('Multiple choice questions must have at least 1 correct answer.');
          return;
        }
        setCorrectAnswerIds(correctAnswerIds.filter((c) => c !== id));
      } else {
        setCorrectAnswerIds([...correctAnswerIds, id]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const text = (formData.get('text') as string).trim();
    const category = formData.get('category') as string;
    const explanation = (formData.get('explanation') as string).trim();
    const points = parseInt(formData.get('points') as string, 10) || 1;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 1;
    const publicationStatus = formData.get('publicationStatus') as any;

    // Validate options
    for (const opt of options) {
      if (!opt.text.trim()) {
        setErrorMsg('All options must have non-empty text.');
        return;
      }
    }

    if (correctAnswerIds.length === 0) {
      setErrorMsg('Please select at least one correct answer.');
      return;
    }

    const payload = {
      text,
      category,
      type: qType,
      options,
      correctAnswerIds,
      explanation,
      points,
      displayOrder,
      publicationStatus,
    };

    try {
      if (editingQuestion?.id) {
        await apiClient.put(`/admin/quiz/questions/${editingQuestion.id}`, payload);
      } else {
        await apiClient.post('/admin/quiz/questions', payload);
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save quiz question.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete question '${id}'?`)) return;
    try {
      await apiClient.delete(`/admin/quiz/questions/${id}`);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Quiz Curriculum Bank CMS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Evidence-based awareness questions, authoring single/multiple/boolean types, and clinical explanations.
          </p>
        </div>
        <button
          onClick={openNewQuestionModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-[#F4FAFD] p-5 rounded-2xl border border-[#CFE3F0] shadow-sm space-y-3 hover:border-[#159E9A] transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#183153] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#159E9A]">
                    {q.category?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    • {q.type} choice • {q.points || 1} pt
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditQuestionModal(q)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#159E9A] hover:bg-[#EAF6FC] transition-colors"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-[#183153] leading-relaxed">{q.text}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {q.options?.map((opt: any) => {
                  const isCorrect = q.correctAnswerIds?.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
                  <span className="font-bold">Clinical Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#EAF5FB] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E7F0] bg-[#F0F7FB]">
              <h2 className="text-lg font-bold text-[#183153]">
                {editingQuestion ? 'Edit Quiz Question' : 'Create Quiz Curriculum Question'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#DDF3F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Prompt *</label>
                <textarea
                  name="text"
                  rows={2}
                  defaultValue={editingQuestion?.text || ''}
                  required
                  placeholder="e.g. Which neurochemical pathway is predominantly affected by repeated opioid use?"
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Curriculum Category</label>
                  <select
                    name="category"
                    defaultValue={editingQuestion?.category || 'substance_facts'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="substance_facts">Substance Facts</option>
                    <option value="health_impacts">Health Impacts</option>
                    <option value="legal_social">Legal & Social</option>
                    <option value="rehabilitation">Rehabilitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Question Type</label>
                  <select
                    value={qType}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="single">Single Choice (1 correct)</option>
                    <option value="multiple">Multiple Choice (&ge;1 correct)</option>
                    <option value="boolean">Boolean (True / False)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Points</label>
                  <input
                    name="points"
                    type="number"
                    defaultValue={editingQuestion?.points || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              {/* Dynamic Answer Options Builder */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Answer Options & Correct Answer Key</span>
                  {qType !== 'boolean' && options.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-[#159E9A] hover:underline font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {options.map((opt, idx) => {
                    const isChecked = correctAnswerIds.includes(opt.id);
                    return (
                      <div key={opt.id} className="flex items-center gap-2 bg-[#F4FAFD] p-2.5 rounded-xl border border-[#CFE3F0]">
                        <button
                          type="button"
                          onClick={() => handleToggleCorrect(opt.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                              : 'bg-[#EAF5FB] border-[#CFE3F0] text-transparent hover:border-emerald-500'
                          }`}
                          title={isChecked ? 'Marked as Correct Answer' : 'Click to mark as Correct Answer'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                          disabled={qType === 'boolean'}
                          placeholder={`Option ${idx + 1} text...`}
                          className="flex-1 px-3 py-1.5 border border-[#CFE3F0] rounded-lg text-xs bg-[#F4FAFD] text-[#183153]"
                        />

                        {qType !== 'boolean' && options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.id)}
                            className="p-1 text-slate-400 hover:text-red-500"
                            title="Remove option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500">
                  {qType === 'single' || qType === 'boolean'
                    ? 'Click the circle icon next to the option to designate the single correct answer.'
                    : 'Toggle circles to designate one or more correct answers.'}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Clinical / Educational Explanation *</label>
                <textarea
                  name="explanation"
                  rows={3}
                  defaultValue={editingQuestion?.explanation || ''}
                  required
                  placeholder="Detailed rationale displayed upon participant test review..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingQuestion?.displayOrder || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingQuestion?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7E7F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingQuestion ? 'Save Changes' : 'Create Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 8. POST-QUIZ AWARENESS MESSAGES VIEW (With Full Add/Edit CMS)
// =============================================================
const AwarenessMessagesView: React.FC<{ isSuperAdmin?: boolean }> = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMsg, setEditingMsg] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/awareness-messages');
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openNewMsgModal = () => {
    setEditingMsg(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditMsgModal = (msg: any) => {
    setEditingMsg(msg);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get('title') as string).trim();
    const body = (formData.get('body') as string).trim();
    const category = formData.get('category') as string;
    const callToAction = (formData.get('callToAction') as string).trim() || 'Explore Care Pathways';
    const resourceLink = (formData.get('resourceLink') as string).trim() || '/support';
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 1;
    const publicationStatus = formData.get('publicationStatus') as any;

    const payload = {
      title,
      body,
      category,
      callToAction,
      resourceLink,
      displayOrder,
      publicationStatus,
    };

    try {
      if (editingMsg?.id) {
        await apiClient.put(`/admin/awareness-messages/${editingMsg.id}`, payload);
      } else {
        await apiClient.post('/admin/awareness-messages', payload);
      }
      setIsModalOpen(false);
      setEditingMsg(null);
      fetchMessages();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save awareness message.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete awareness message '${id}'?`)) return;
    try {
      await apiClient.delete(`/admin/awareness-messages/${id}`);
      fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Post-Quiz Awareness Messages CMS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Supportive and harm-reduction messages dynamically presented to participants alongside their score.
          </p>
        </div>
        <button
          onClick={openNewMsgModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Message</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-[#F4FAFD] p-5 rounded-2xl border border-[#CFE3F0] shadow-sm flex flex-col justify-between hover:border-[#159E9A] transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF6FC] text-[#159E9A] uppercase tracking-wider">
                    {msg.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditMsgModal(msg)}
                      className="p-1 rounded text-slate-400 hover:text-[#159E9A] transition-colors"
                      title="Edit message"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#183153] mt-2.5">{msg.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{msg.body}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D7E7F0] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#159E9A]">{msg.callToAction}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{msg.publicationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Awareness Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#EAF5FB] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E7F0] bg-[#F0F7FB]">
              <h2 className="text-lg font-bold text-[#183153]">
                {editingMsg ? 'Edit Awareness Message' : 'Create Awareness Message'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#DDF3F0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                <input
                  name="title"
                  defaultValue={editingMsg?.title || ''}
                  required
                  placeholder="e.g. Confidential Helpline Support"
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <input
                  name="category"
                  defaultValue={editingMsg?.category || 'Harm Reduction'}
                  placeholder="Harm Reduction, Peer Support, Clinical Care, Helpline Guidance"
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message Body *</label>
                <textarea
                  name="body"
                  rows={3}
                  defaultValue={editingMsg?.body || ''}
                  required
                  placeholder="Clear guidance on health pathways, toll-free lines, or peer reassurance..."
                  className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Call to Action Label</label>
                  <input
                    name="callToAction"
                    defaultValue={editingMsg?.callToAction || 'Explore Care Pathways'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Resource Link</label>
                  <input
                    name="resourceLink"
                    defaultValue={editingMsg?.resourceLink || '/support'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingMsg?.displayOrder || 1}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingMsg?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D7E7F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMsg ? 'Save Changes' : 'Create Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 9. USERS & PERMISSIONS VIEW (SUPER ADMIN ONLY)
// =============================================================
const UsersView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<AdminRole>('EDITOR');
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/admin/users');
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await apiClient.post('/admin/users', {
        email: emailInput.trim(),
        role: roleInput,
        displayName: nameInput.trim() || undefined,
      });
      setEmailInput('');
      setNameInput('');
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authorize user');
    }
  };

  const handleRevoke = async (email: string) => {
    if (!window.confirm(`Revoke administrative access for ${email}?`)) return;
    try {
      await apiClient.delete(`/admin/users/${encodeURIComponent(email)}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Revocation prohibited');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Users & Role Assignments</h1>
        <p className="text-sm text-slate-500 mt-1">
          Super Admin console managing institutional administrative allowlist and privilege levels.
        </p>
      </div>

      {/* Add User Card */}
      <div className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-6 rounded-2xl border border-[#CFE3F0] shadow-sm">
        <h2 className="text-base font-bold text-[#183153] mb-4">Authorize Administrative Google Account</h2>
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="google_email@example.com"
            required
            className="sm:col-span-2 px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
          />
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Display Name (optional)"
            className="px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
          />
          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value as AdminRole)}
            className="px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] font-semibold focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
          >
            <option value="EDITOR">EDITOR (Content Management)</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN (Full Privileges)</option>
          </select>
          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Authorize Account</span>
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#EAF5FB] rounded-2xl border border-[#CFE3F0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Added By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E7F0]">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-[#F0F7FB]/60">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#183153]">{u.displayName || u.email}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-[#EAF6FC] text-[#159E9A] border border-[#B9DDF5]'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#239B70]">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{u.addedBy || 'System Seed'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRevoke(u.email)}
                      className="text-red-500 hover:text-red-700 p-1 font-medium hover:underline text-xs"
                    >
                      Revoke Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 10. SITE SETTINGS VIEW (SUPER ADMIN ONLY)
// =============================================================
const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiClient.get('/settings').then((res) => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      siteTitle: formData.get('siteTitle'),
      institutionName: formData.get('institutionName'),
      campaignTagline: formData.get('campaignTagline'),
      contactEmail: formData.get('contactEmail'),
      helplineNumber: formData.get('helplineNumber'),
      address: formData.get('address'),
      footerNotice: formData.get('footerNotice'),
    };
    try {
      await apiClient.put('/admin/settings', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Settings update failed');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Institutional Site Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Verified campaign branding, contact channels, and toll-free helpline information.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 p-6 rounded-2xl border border-[#CFE3F0] shadow-sm">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#239B70] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#239B70]" />
            <span>Site settings updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Platform Title</label>
            <input
              name="siteTitle"
              defaultValue={settings?.siteTitle}
              required
              className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Institution Name</label>
            <input
              name="institutionName"
              defaultValue={settings?.institutionName}
              required
              className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Campaign Tagline</label>
            <input
              name="campaignTagline"
              defaultValue={settings?.campaignTagline}
              required
              className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Email</label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={settings?.contactEmail}
                required
                className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">National Helpline Number</label>
              <input
                name="helplineNumber"
                defaultValue={settings?.helplineNumber}
                required
                className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Campus Address</label>
            <textarea
              name="address"
              rows={2}
              defaultValue={settings?.address}
              className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Footer Notice</label>
            <textarea
              name="footerNotice"
              rows={2}
              defaultValue={settings?.footerNotice}
              className="w-full px-3 py-2 border border-[#CFE3F0] rounded-xl bg-[#F4FAFD] text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#159E9A] text-white font-semibold hover:bg-[#128885] shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =============================================================
// 11. AUDIT LOGS VIEW (SUPER ADMIN ONLY)
// =============================================================
const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<any>('/admin/audit-logs?limit=50').then((res) => {
      setLogs(res.items || []);
      setTotal(res.total || 0);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Security Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Chronological immutable audit log of administrative and security events ({total} records).
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#EAF5FB] rounded-2xl border border-[#CFE3F0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E7F0] bg-[#F0F7FB] text-[#183153] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-3">Actor Email</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-4">Record Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E7F0]">
              {logs.map((log) => (
                <tr key={log._id || log.timestamp} className="hover:bg-[#F0F7FB]/60">
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{log.actorEmail}</td>
                  <td className="py-3 px-3 font-semibold text-[#183153]">{log.action}</td>
                  <td className="py-3 px-3 text-slate-500">{log.module}</td>
                  <td className="py-3 px-4 font-mono text-slate-600 truncate max-w-xs">{log.recordId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
