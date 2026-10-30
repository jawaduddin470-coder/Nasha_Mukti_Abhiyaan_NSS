import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface PermanentDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemType: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = ({
  isOpen,
  title,
  itemType,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-[#EAF5FB] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CFE3F0] space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 id="delete-modal-title" className="text-base font-bold text-[#183153]">
              Permanently Delete {itemType}?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-800 font-semibold">"{title}"</strong>?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 leading-relaxed">
          <strong className="font-bold">Caution:</strong> This action permanently purges the record from the database and cannot be undone. Any shared images referenced by other activities or gallery items will remain protected and will not be deleted.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-[#CFE3F0] text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting Permanently...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
