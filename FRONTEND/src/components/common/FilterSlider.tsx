import React from 'react';
import clsx from 'clsx';

interface FilterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
  description?: string;
  variant?: 'teal' | 'blue' | 'purple' | 'amber';
  className?: string;
}

export const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay,
  description,
  variant = 'teal',
  className,
}) => {
  const displayVal = formatDisplay ? formatDisplay(value) : value.toString();

  const badgeColors = {
    teal: 'text-[#35E0B5] bg-[#35E0B5]/10 border-[#35E0B5]/30',
    blue: 'text-[#5B8CFF] bg-[#5B8CFF]/10 border-[#5B8CFF]/30',
    purple: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
    amber: 'text-[#F5C451] bg-[#F5C451]/10 border-[#F5C451]/30',
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#8B98A7]">
          {label}
        </label>
        <span
          className={clsx(
            'rounded px-2 py-0.5 text-xs font-mono font-bold border transition-colors',
            badgeColors[variant]
          )}
        >
          {displayVal}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between items-center text-[10px] font-mono text-[#5A6675]">
        <span>{formatDisplay ? formatDisplay(min) : min}</span>
        {description && <span className="text-[#8B98A7] italic">{description}</span>}
        <span>{formatDisplay ? formatDisplay(max) : max}</span>
      </div>
    </div>
  );
};

