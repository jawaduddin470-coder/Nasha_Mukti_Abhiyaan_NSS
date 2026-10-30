/**
 * Reusable Media Picker Input Component
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Provides a standardized visual preview and picker input
 * for all CMS models (Activities, Gallery, Developers).
 */

import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, FolderOpen } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

interface MediaPickerInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: 'activities' | 'gallery' | 'developers' | 'general';
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export const MediaPickerInput: React.FC<MediaPickerInputProps> = ({
  label,
  value,
  onChange,
  category = 'general',
  placeholder = '/images/... or https://...',
  required = false,
  helperText,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'browse' | 'upload'>('browse');

  const openBrowse = () => {
    setModalTab('browse');
    setModalOpen(true);
  };

  const openUpload = () => {
    setModalTab('upload');
    setModalOpen(true);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Thumbnail Preview */}
        <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative group">
          {value ? (
            <>
              <img
                src={resolveMediaUrl(value)}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={(e) => handleMediaError(e, label, category)}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
              <span className="text-[9px] font-semibold">No Image</span>
            </div>
          )}
        </div>

        {/* Input & Action Buttons */}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 text-xs bg-[#F4FAFD] border border-[#CFE3F0] rounded-xl text-[#183153] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#159E9A]/20 focus:border-[#159E9A]"
          />

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={openBrowse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F7FB] border border-[#D7E7F0] text-[#183153] font-semibold hover:bg-[#E2F0F9] transition-colors shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#159E9A]" />
              <span>Choose from Library</span>
            </button>
            <button
              type="button"
              onClick={openUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF6FC] border border-[#B9DDF5] text-[#159E9A] font-semibold hover:bg-[#D5EEFA] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setModalOpen(false);
        }}
        initialTab={modalTab}
        defaultCategory={category}
        selectedUrl={value}
      />
    </div>
  );
};
