import React from 'react';
import clsx from 'clsx';

interface MetricBarProps {
  value: number; // 0 to 1 or 0 to 100
  max?: number;
  label?: string;
  displayValue?: string;
  variant?: 'teal' | 'blue' | 'purple' | 'amber';
  height?: 'sm' | 'md';
  className?: string;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  value,
  max = 1,
  label,
  displayValue,
  variant = 'teal',
  height = 'md',
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const barGradients = {
    teal: 'from-[#35E0B5]/70 to-[#35E0B5]',
    blue: 'from-[#5B8CFF]/70 to-[#5B8CFF]',
    purple: 'from-[#A78BFA]/70 to-[#A78BFA]',
    amber: 'from-[#F5C451]/70 to-[#F5C451]',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || displayValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          {label && <span className="text-[#8B98A7] uppercase tracking-wider text-[10px]">{label}</span>}
          {displayValue && <span className="text-[#F5F7FA] font-medium">{displayValue}</span>}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5',
          height === 'sm' ? 'h-2' : 'h-3'
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            barGradients[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

