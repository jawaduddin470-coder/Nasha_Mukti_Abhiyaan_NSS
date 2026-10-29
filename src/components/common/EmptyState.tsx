import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message = 'There are currently no items matching your criteria. Check back shortly for updates.',
  actionText,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF5FB]/80 dark:bg-[#14243D]/80 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#B9DDF5] dark:border-[#243A5E] flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] mb-4 shadow-soft-card">
        {icon || <SearchX className="w-7 h-7" aria-hidden="true" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#183153] dark:text-white font-serif">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#334C73] dark:text-slate-300 max-w-md leading-relaxed">
        {message}
      </p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
