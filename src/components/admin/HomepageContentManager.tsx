import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Clock,
  X,
  UploadCloud,
} from 'lucide-react';
import { homepageService } from '../../services/homepageService';
import {
  HomepageAdminResponse,
  PopulatedFeaturedActivity,
  PopulatedFeaturedGallery,
} from '../../types/homepage';
import { Activity } from '../../types/activity';
import { GalleryItem } from '../../types/gallery';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

export const HomepageContentManager: React.FC = () => {
  const [data, setData] = useState<HomepageAdminResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'activities' | 'gallery' | 'preview'>('activities');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Local draft working state
  const [draftActivities, setDraftActivities] = useState<PopulatedFeaturedActivity[]>([]);
  const [draftGallery, setDraftGallery] = useState<PopulatedFeaturedGallery[]>([]);
  const [hasUnsavedLocalChanges, setHasUnsavedLocalChanges] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await homepageService.getAdminHomepage();
      setData(res);
      setDraftActivities(res.draftActivities || []);
      setDraftGallery(res.draftGallery || []);
      setHasUnsavedLocalChanges(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load homepage configuration.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper to re-index display orders
  const reindexActivities = (list: PopulatedFeaturedActivity[]) =>
    list.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));

  const reindexGallery = (list: PopulatedFeaturedGallery[]) =>
    list.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));

  // Activity Handlers
  const handleAddActivity = (activity: Activity) => {
    if (draftActivities.some((a) => a.activityId === activity.id)) return;
    const newItem: PopulatedFeaturedActivity = {
      activityId: activity.id,
      displayOrder: draftActivities.length + 1,
      enabled: true,
      activity,
    };
    const updated = reindexActivities([...draftActivities, newItem]);
    setDraftActivities(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleRemoveActivity = (activityId: string) => {
    const updated = reindexActivities(draftActivities.filter((a) => a.activityId !== activityId));
    setDraftActivities(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleToggleActivity = (activityId: string) => {
    const updated = draftActivities.map((a) =>
      a.activityId === activityId ? { ...a, enabled: !a.enabled } : a
    );
    setDraftActivities(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= draftActivities.length) return;
    const copy = [...draftActivities];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);
    setDraftActivities(reindexActivities(copy));
    setHasUnsavedLocalChanges(true);
  };

  // Gallery Handlers
  const handleAddGalleryPhoto = (photo: GalleryItem) => {
    if (draftGallery.some((g) => g.photoId === photo.id)) return;
    const newItem: PopulatedFeaturedGallery = {
      photoId: photo.id,
      displayOrder: draftGallery.length + 1,
      enabled: true,
      photo,
    };
    const updated = reindexGallery([...draftGallery, newItem]);
    setDraftGallery(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleRemoveGalleryPhoto = (photoId: string) => {
    const updated = reindexGallery(draftGallery.filter((g) => g.photoId !== photoId));
    setDraftGallery(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleToggleGalleryPhoto = (photoId: string) => {
    const updated = draftGallery.map((g) =>
      g.photoId === photoId ? { ...g, enabled: !g.enabled } : g
    );
    setDraftGallery(updated);
    setHasUnsavedLocalChanges(true);
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= draftGallery.length) return;
    const copy = [...draftGallery];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);
    setDraftGallery(reindexGallery(copy));
    setHasUnsavedLocalChanges(true);
  };

  // Persistence Actions
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setFeedback(null);
      const payload = {
        featuredActivities: draftActivities.map((a) => ({
          activityId: a.activityId,
          displayOrder: a.displayOrder,
          enabled: a.enabled,
        })),
        featuredGallery: draftGallery.map((g) => ({
          photoId: g.photoId,
          displayOrder: g.displayOrder,
          enabled: g.enabled,
        })),
      };
      const res = await homepageService.updateDraft(payload);
      setData(res);
      setDraftActivities(res.draftActivities || []);
      setDraftGallery(res.draftGallery || []);
      setHasUnsavedLocalChanges(false);
      setFeedback({ type: 'success', message: 'Homepage selections saved to draft successfully.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save draft selections.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish these selections live to the public homepage?')) return;
    try {
      setSaving(true);
      setFeedback(null);
      // Auto-save local draft first if there are uncommitted local edits
      if (hasUnsavedLocalChanges) {
        const payload = {
          featuredActivities: draftActivities.map((a) => ({
            activityId: a.activityId,
            displayOrder: a.displayOrder,
            enabled: a.enabled,
          })),
          featuredGallery: draftGallery.map((g) => ({
            photoId: g.photoId,
            displayOrder: g.displayOrder,
            enabled: g.enabled,
          })),
        };
        await homepageService.updateDraft(payload);
      }
      const res = await homepageService.publishChanges();
      setData(res);
      setDraftActivities(res.draftActivities || []);
      setDraftGallery(res.draftGallery || []);
      setHasUnsavedLocalChanges(false);
      setFeedback({ type: 'success', message: 'Homepage selections published live! Public website updated.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish homepage selections.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = async () => {
    if (!window.confirm('Revert all unpublished changes back to currently live published selections?')) return;
    try {
      setSaving(true);
      setFeedback(null);
      const res = await homepageService.revertChanges();
      setData(res);
      setDraftActivities(res.draftActivities || []);
      setDraftGallery(res.draftGallery || []);
      setHasUnsavedLocalChanges(false);
      setFeedback({ type: 'success', message: 'Draft reverted to published state.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to revert changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Homepage Content Manager...</p>
      </div>
    );
  }

  const hasChanges = (data?.hasUnpublishedChanges || hasUnsavedLocalChanges);
  const selectedActivityIds = new Set(draftActivities.map((a) => a.activityId));
  const selectedGalleryIds = new Set(draftGallery.map((g) => g.photoId));

  const unselectedActivities = (data?.availableActivities || []).filter(
    (a) => !selectedActivityIds.has(a.id)
  );

  const unselectedGallery = (data?.availableGallery || []).filter(
    (g) => !selectedGalleryIds.has(g.id)
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#CFE3F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#183153] tracking-tight">Homepage Content Manager</h1>
            {hasChanges ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Draft Changes (Unpublished)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live on Homepage
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Select, reorder, toggle, and preview which activities and solidarity photographs appear on the public homepage. Removing items from the homepage never deletes the original records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRevert}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CFE3F0] text-xs font-semibold text-slate-600 hover:text-[#183153] hover:bg-[#F0F7FB] transition-all disabled:opacity-40 disabled:pointer-events-none"
            title="Revert draft to currently published selections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || !hasUnsavedLocalChanges}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#159E9A] text-xs font-semibold text-[#159E9A] hover:bg-[#EAF6FC] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#159E9A] text-white text-xs font-bold hover:bg-[#128885] shadow-xs transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Publish to Homepage</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('activities')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'activities'
              ? 'bg-[#183153] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Featured Activities ({draftActivities.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gallery')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'gallery'
              ? 'bg-[#183153] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#183153]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Featured Gallery ({draftGallery.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'preview'
              ? 'bg-[#159E9A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#EAF6FC] hover:text-[#159E9A]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Homepage Preview</span>
        </button>
      </div>

      {/* SECTION 1: ACTIVITIES CONTENT MANAGER */}
      {activeSubTab === 'activities' && (
        <div className="space-y-6">
          {/* Selected Activities Table */}
          <div className="bg-white rounded-2xl border border-[#CFE3F0] overflow-hidden shadow-xs">
            <div className="px-6 py-4 bg-[#F8FBFC] border-b border-[#CFE3F0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#183153]">Selected Featured Activities for Homepage</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ordered sequential display. Use controls to reorder, toggle visibility, or remove.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#EAF6FC] border border-[#CFE3F0] text-[11px] font-bold text-[#159E9A]">
                {draftActivities.filter((a) => a.enabled).length} of {draftActivities.length} Active on Homepage
              </span>
            </div>

            {draftActivities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No activities selected for homepage yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Select activities from the catalog below to feature them on the public homepage.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EAF2F7]">
                {draftActivities.map((item, index) => {
                  const act = item.activity;
                  return (
                    <div
                      key={item.activityId}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        item.enabled ? 'bg-white' : 'bg-slate-50/70 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 text-center font-mono font-bold text-xs text-slate-400">
                          #{item.displayOrder}
                        </div>

                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#CFE3F0] bg-slate-100 shrink-0">
                          {act?.coverImage ? (
                            <img
                              src={resolveMediaUrl(act.coverImage)}
                              alt={act.title || 'Activity'}
                              className="w-full h-full object-cover"
                              onError={handleMediaError}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Calendar className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#183153] line-clamp-1">
                              {act?.title || `Activity: ${item.activityId}`}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EAF6FC] text-[#159E9A]">
                              {act?.category || 'General'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {act?.date} &bull; {act?.venue || 'Campus'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        {/* Move Up/Down Controls */}
                        <div className="flex items-center border border-[#CFE3F0] rounded-xl overflow-hidden bg-[#F8FBFC]">
                          <button
                            type="button"
                            onClick={() => handleMoveActivity(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-slate-500 hover:text-[#183153] hover:bg-[#EAF6FC] disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1.5 text-[10px] font-mono font-bold text-slate-400 border-x border-[#CFE3F0]">
                            {item.displayOrder}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveActivity(index, 'down')}
                            disabled={index === draftActivities.length - 1}
                            className="p-1.5 text-slate-500 hover:text-[#183153] hover:bg-[#EAF6FC] disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Enabled Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleActivity(item.activityId)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                            item.enabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {item.enabled ? 'Enabled' : 'Hidden'}
                        </button>

                        {/* Remove from Homepage (Safe Action) */}
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(item.activityId)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove from Homepage (Preserves original activity record in Activities CMS)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Activities to Add Picker */}
          <div className="bg-white rounded-2xl border border-[#CFE3F0] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Available Activities to Feature</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Browse published drives from the Activities CMS and click to add them to the homepage selection.
              </p>
            </div>

            {unselectedActivities.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">
                All currently published activities are already selected for the homepage.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {unselectedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-[#CFE3F0] hover:border-[#159E9A] bg-[#F8FBFC] flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#CFE3F0] bg-slate-100 shrink-0">
                        {act.coverImage ? (
                          <img
                            src={resolveMediaUrl(act.coverImage)}
                            alt={act.title}
                            className="w-full h-full object-cover"
                            onError={handleMediaError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Calendar className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#183153] truncate">{act.title}</p>
                        <p className="text-[10px] text-slate-400">{act.date} &bull; {act.category}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddActivity(act)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#159E9A] text-white text-[11px] font-semibold hover:bg-[#128885] shrink-0 shadow-2xs transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: GALLERY CONTENT MANAGER */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          {/* Selected Gallery Grid */}
          <div className="bg-white rounded-2xl border border-[#CFE3F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#183153]">Selected Featured Gallery Photographs for Homepage</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ordered visual showcase. Drag/reorder, toggle status, or remove items without deleting from Gallery.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#EAF6FC] border border-[#CFE3F0] text-[11px] font-bold text-[#159E9A]">
                {draftGallery.filter((g) => g.enabled).length} of {draftGallery.length} Active on Homepage
              </span>
            </div>

            {draftGallery.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No gallery photographs selected for homepage yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Select photographs from the catalog below to feature them on the public homepage.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftGallery.map((item, index) => {
                  const photo = item.photo;
                  return (
                    <div
                      key={item.photoId}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        item.enabled
                          ? 'border-[#CFE3F0] bg-white shadow-2xs'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        {photo?.imageUrl ? (
                          <img
                            src={resolveMediaUrl(photo.imageUrl)}
                            alt={photo.title || 'Gallery'}
                            className="w-full h-full object-cover"
                            onError={handleMediaError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#183153]/85 text-white font-mono text-[10px] font-bold backdrop-blur-xs">
                          #{item.displayOrder}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-[#183153] line-clamp-1">
                            {photo?.title || `Photo: ${item.photoId}`}
                          </h4>
                          <p className="text-[10px] text-slate-400 capitalize">{photo?.category} &bull; {photo?.location || 'Campus'}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#F0F5F8]">
                          {/* Reorder Buttons */}
                          <div className="flex items-center border border-[#CFE3F0] rounded-lg overflow-hidden bg-[#F8FBFC]">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryPhoto(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-500 hover:text-[#183153] hover:bg-[#EAF6FC] disabled:opacity-20"
                              title="Move Earlier"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <span className="px-1 text-[10px] font-mono font-bold text-slate-400 border-x border-[#CFE3F0]">
                              {item.displayOrder}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryPhoto(index, 'down')}
                              disabled={index === draftGallery.length - 1}
                              className="p-1 text-slate-500 hover:text-[#183153] hover:bg-[#EAF6FC] disabled:opacity-20"
                              title="Move Later"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleGalleryPhoto(item.photoId)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                item.enabled
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-300'
                              }`}
                            >
                              {item.enabled ? 'Enabled' : 'Hidden'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(item.photoId)}
                              className="p-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove from Homepage (Preserves photo in Gallery CMS)"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Gallery Photos Picker */}
          <div className="bg-white rounded-2xl border border-[#CFE3F0] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Available Gallery Photos to Feature</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Browse photographs from the Gallery CMS and click to add them to the homepage showcase.
              </p>
            </div>

            {unselectedGallery.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">
                All currently published gallery photos are already selected for the homepage.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {unselectedGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl border border-[#CFE3F0] hover:border-[#159E9A] overflow-hidden bg-[#F8FBFC] flex flex-col justify-between transition-all"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden relative">
                      {photo.imageUrl ? (
                        <img
                          src={resolveMediaUrl(photo.imageUrl)}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onError={handleMediaError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-bold text-[#183153] truncate">{photo.title}</p>
                      <button
                        type="button"
                        onClick={() => handleAddGalleryPhoto(photo)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#159E9A] text-white text-[10px] font-semibold hover:bg-[#128885] shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: LIVE HOMEPAGE PREVIEW */}
      {activeSubTab === 'preview' && (
        <div className="space-y-8 bg-[#F0F7FB] p-6 rounded-2xl border border-[#CFE3F0]">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFE3F0]">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#159E9A]" />
                <h3 className="text-sm font-bold text-[#183153]">Simulated Public Homepage View</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Renders how your draft selections will appear on the live website upon publishing.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#159E9A] text-white text-xs font-bold hover:bg-[#128885] shadow-xs transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publish Now</span>
            </button>
          </div>

          {/* Activities Section Preview */}
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#159E9A] uppercase">
                Active & Upcoming Drives
              </span>
              <h2 className="font-serif text-xl font-bold text-[#183153]">
                Mobilizing Campus Solidarity
              </h2>
            </div>

            {draftActivities.filter((a) => a.enabled).length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#CFE3F0] text-xs text-slate-400">
                No activities currently enabled for homepage. Public website will fall back to default published drives.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {draftActivities
                  .filter((a) => a.enabled)
                  .slice(0, 3)
                  .map((item) => {
                    const act = item.activity;
                    return (
                      <div
                        key={item.activityId}
                        className="bg-white rounded-2xl border border-[#CFE3F0] overflow-hidden shadow-xs p-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                            {act?.coverImage ? (
                              <img
                                src={resolveMediaUrl(act.coverImage)}
                                alt={act.title}
                                className="w-full h-full object-cover"
                                onError={handleMediaError}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Calendar className="w-6 h-6" />
                              </div>
                            )}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#183153]/85 text-white uppercase">
                              {act?.category || 'General'}
                            </span>
                          </div>

                          <h4 className="font-serif text-sm font-bold text-[#183153] line-clamp-2">
                            {act?.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {act?.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#F0F5F8] text-[11px] text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#159E9A]" />
                            {act?.date}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin className="w-3.5 h-3.5 text-[#159E9A]" />
                            {act?.venue}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Gallery Section Preview */}
          <div className="space-y-4 pt-4 border-t border-[#CFE3F0]">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#159E9A] uppercase">
                Moments of Campus Solidarity
              </span>
              <h2 className="font-serif text-xl font-bold text-[#183153]">
                Visual Reflections & Student Action
              </h2>
            </div>

            {draftGallery.filter((g) => g.enabled).length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#CFE3F0] text-xs text-slate-400">
                No gallery photographs currently enabled for homepage. Public website will fall back to default published photos.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {draftGallery
                  .filter((g) => g.enabled)
                  .slice(0, 3)
                  .map((item) => {
                    const photo = item.photo;
                    return (
                      <div
                        key={item.photoId}
                        className="bg-white rounded-2xl border border-[#CFE3F0] overflow-hidden shadow-xs"
                      >
                        <div className="aspect-video bg-slate-100 overflow-hidden relative">
                          {photo?.imageUrl ? (
                            <img
                              src={resolveMediaUrl(photo.imageUrl)}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                              onError={handleMediaError}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="text-xs font-bold text-[#183153] line-clamp-1">
                            {photo?.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {photo?.caption}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
