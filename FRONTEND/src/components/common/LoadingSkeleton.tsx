import React from 'react';
import clsx from 'clsx';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'card' | 'table' | 'kpi';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 4,
  type = 'card',
  className,
}) => {
  if (type === 'kpi') {
    return (
      <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-white/5 bg-[#0D141B]/50 animate-pulse p-4 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-8 w-32 bg-white/15 rounded" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={clsx('rounded-xl border border-white/10 bg-[#0D141B]/50 p-4 animate-pulse', className)}>
        <div className="h-10 border-b border-white/5 bg-white/5 rounded mb-3" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 border-b border-white/5 flex items-center gap-4 px-3">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-4 flex-1 bg-white/5 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-44 rounded-xl border border-white/5 bg-[#0D141B]/50 animate-pulse p-5 flex flex-col justify-between"
        >
          <div className="flex justify-between">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-4 w-12 bg-white/10 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-white/15 rounded" />
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-3 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

