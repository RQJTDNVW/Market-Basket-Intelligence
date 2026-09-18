import React from 'react';
import { FilterX, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface EmptyStateProps {
  title?: string;
  description?: string;
  suggestion?: string;
  onReset?: () => void;
  actionText?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No associations meet the current criteria.',
  description,
  suggestion = 'Try lowering the confidence or support threshold, or clear your search query.',
  onReset,
  actionText = 'Reset Filters',
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl border border-white/10 bg-[#0D141B]/60 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF647C]/20 bg-[#FF647C]/10 text-[#FF647C] mb-4">
        <FilterX className="h-6 w-6" />
      </div>

      <h3 className="text-base font-semibold text-[#F5F7FA] mb-1.5">{title}</h3>

      {description && <p className="text-sm text-[#8B98A7] max-w-md mb-2">{description}</p>}

      {suggestion && (
        <p className="text-xs text-[#8B98A7] max-w-md mb-6 font-mono bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
          💡 {suggestion}
        </p>
      )}

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#35E0B5]/15 border border-[#35E0B5]/30 text-xs font-semibold text-[#35E0B5] hover:bg-[#35E0B5]/25 transition-all duration-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
};

