/**
 * Central Media Library Modal
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Provides a responsive asset picker and uploader accessible
 * from every CMS image field across the administrative dashboard.
 *
 * Repaired for Phase 6.1:
 * - Rendered via createPortal to break out of parent form boundaries.
 * - Removed internal <form> tags to prevent accidental native form submission and page refresh.
 * - Ensured all interactive buttons have explicit type="button".
 * - Added robust drag-and-drop handling with event isolation.
 * - Clear error feedback without losing unsaved activity state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  Trash2,
  AlertCircle,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import {
  MediaItem,
  fetchMediaItems,
  uploadMediaAsset,
  deleteMediaAsset,
} from '../../services/mediaService';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: MediaItem) => void;
  initialTab?: 'browse' | 'upload';
  defaultCategory?: string;
  selectedUrl?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Assets' },
  { id: 'activities', label: 'Activities' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'developers', label: 'Developers' },
  { id: 'general', label: 'General' },
];

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialTab = 'browse',
  defaultCategory = 'all',
  selectedUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>(initialTab);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload Tab State
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState(
    defaultCategory !== 'all' ? defaultCategory : 'general'
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadMedia();
      setDeleteError(null);
      setUploadError(null);
    }
  }, [isOpen, initialTab, categoryFilter, searchQuery]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaItems(categoryFilter, searchQuery);
      setItems(data);
      if (selectedUrl) {
        const match = data.find((it) => it.url === selectedUrl);
        if (match) setSelectedItem(match);
      }
    } catch (err: any) {
      console.error('Failed to load media items:', err);
    } finally {
      setLoading(false);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setUploadError('Invalid format. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum allowed size is 10 MB.');
      return;
    }

    setFileToUpload(file);
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadSubmit = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!fileToUpload) {
      setUploadError('Please select an image file first.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const newItem = await uploadMediaAsset(fileToUpload, uploadTitle.trim(), uploadCategory);
      setFileToUpload(null);
      setFilePreview(null);
      setUploadTitle('');
      onSelect(newItem.url, newItem);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload media asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, item: MediaItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete media asset "${item.title || item.filename}"?`)) return;

    setDeleteError(null);
    try {
      await deleteMediaAsset(item.id);
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
      loadMedia();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete media asset.');
    }
  };

  const handleConfirmSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedItem) {
      onSelect(selectedItem.url, selectedItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-library-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) {
          onClose();
        }
      }}
    >
      <div
        className="bg-[#EAF5FB] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CFE3F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CFE3F0] bg-[#E0EFF8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183153] text-white flex items-center justify-center shadow-sm">
              <FolderOpen className="w-5 h-5 text-[#159E9A]" />
            </div>
            <div>
              <h2 id="media-library-modal-title" className="text-lg font-bold text-[#183153]">
                Central Media Library
              </h2>
              <p className="text-xs text-slate-500">
                Pick existing verified campaign photographs or upload new visual assets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="p-2 rounded-xl text-slate-400 hover:text-[#183153] hover:bg-[#DDF3F0] transition-colors disabled:opacity-40"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-[#CFE3F0] bg-[#EAF5FB] shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'border-[#159E9A] text-[#159E9A]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose from Library</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                {items.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[#159E9A] text-[#159E9A]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Image</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          {deleteError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to delete media asset:</p>
                <p>{deleteError}</p>
              </div>
            </div>
          )}

          {activeTab === 'browse' ? (
            <div className="space-y-4">
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
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
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

              {/* Grid of Media Items */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#159E9A]" />
                  <p className="text-xs">Loading media catalog...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center bg-[#F4FAFD] rounded-2xl border border-dashed border-[#CFE3F0] p-8">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#183153]">No media assets found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your category filter or search keywords, or upload a new image.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] transition-all shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const isSelected = selectedItem?.id === item.id || selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative bg-[#F4FAFD] rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col ${
                          isSelected
                            ? 'border-[#159E9A] ring-2 ring-[#159E9A]/20 shadow-md'
                            : 'border-[#CFE3F0] hover:border-[#159E9A] hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                          <img
                            src={item.url}
                            alt={item.title || item.filename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.opacity = '0.3';
                            }}
                          />
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                            {item.category}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#159E9A] text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <p
                            className="text-xs font-semibold text-[#183153] truncate"
                            title={item.title || item.filename}
                          >
                            {item.title || item.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-100">
                            <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(e, item)}
                              title="Delete asset"
                              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Upload Tab (Rendered as DIV to strictly isolate from any parent form) */
            <div className="max-w-xl mx-auto space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drop / Pick Box */}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#159E9A] bg-[#DDF3F0]'
                    : filePreview
                    ? 'border-[#159E9A] bg-[#EAF6FC]/30'
                    : 'border-[#CFE3F0] hover:border-[#159E9A] bg-[#F4FAFD]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />

                {filePreview ? (
                  <div className="space-y-3">
                    <img
                      src={filePreview}
                      alt="Upload preview"
                      className="max-h-52 mx-auto rounded-xl object-contain shadow-sm border border-[#D7E7F0]"
                    />
                    <p className="text-xs text-slate-500 font-mono">
                      {fileToUpload?.name} ({(fileToUpload!.size / 1024).toFixed(1)} KB)
                    </p>
                    <p className="text-[11px] text-[#159E9A] font-semibold underline">
                      Click to choose a different file or drop a new one
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#EAF6FC] text-[#159E9A] flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#183153]">
                      Choose an image or drop it here
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports JPG, PNG, and WEBP formats up to 10 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Asset Title / Caption
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    disabled={uploading}
                    placeholder="e.g., Campus Awareness Rally Front Banner"
                    className="w-full px-3 py-2 bg-[#F4FAFD] border border-[#CFE3F0] rounded-xl text-[#183153] placeholder-slate-400 focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Module Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-[#F4FAFD] border border-[#CFE3F0] rounded-xl text-[#183153] focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A] disabled:opacity-50"
                  >
                    <option value="activities">Activities</option>
                    <option value="gallery">Gallery</option>
                    <option value="developers">Developers</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              {/* Action Button: Explicit type="button" to avoid form submission */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleUploadSubmit}
                  disabled={uploading || !fileToUpload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#159E9A] text-white text-xs font-semibold hover:bg-[#128885] disabled:opacity-50 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Asset...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload &amp; Select</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (for Browse tab) */}
        {activeTab === 'browse' && (
          <div className="px-6 py-3.5 border-t border-[#CFE3F0] bg-[#E8F3FA] flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-500 truncate max-w-sm">
              {selectedItem ? (
                <span className="font-medium text-[#183153]">
                  Selected: {selectedItem.title || selectedItem.filename}
                </span>
              ) : (
                <span>No item selected</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedItem}
                onClick={handleConfirmSelection}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#183153] text-white hover:bg-[#122540] disabled:opacity-40 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
