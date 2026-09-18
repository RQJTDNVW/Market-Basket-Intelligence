import React from 'react';
import clsx from 'clsx';
import { AnimatedCounter } from './AnimatedCounter';

interface KpiCardProps {
  title: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badgeText?: string;
  badgeVariant?: 'teal' | 'blue' | 'purple' | 'amber';
  accentColor?: 'teal' | 'blue' | 'purple' | 'amber';
  delayIndex?: number;
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  decimals = 0,
  prefix,
  suffix,
  subtitle,
  icon,
  badgeText,
  badgeVariant = 'teal',
  accentColor = 'teal',
  delayIndex = 0,
  onClick,
  className,
}) => {
  const accentGlows = {
    teal: 'hover:border-[#35E0B5]/40 hover:shadow-[0_0_25px_-5px_rgba(53,224,181,0.2)]',
    blue: 'hover:border-[#5B8CFF]/40 hover:shadow-[0_0_25px_-5px_rgba(91,140,255,0.2)]',
    purple: 'hover:border-[#A78BFA]/40 hover:shadow-[0_0_25px_-5px_rgba(167,139,250,0.2)]',
    amber: 'hover:border-[#F5C451]/40 hover:shadow-[0_0_25px_-5px_rgba(245,196,81,0.2)]',
  };

  const iconColors = {
    teal: 'text-[#35E0B5] bg-[#35E0B5]/10 border-[#35E0B5]/20',
    blue: 'text-[#5B8CFF] bg-[#5B8CFF]/10 border-[#5B8CFF]/20',
    purple: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20',
    amber: 'text-[#F5C451] bg-[#F5C451]/10 border-[#F5C451]/20',
  };

  const badgeColors = {
    teal: 'text-[#35E0B5] bg-[#35E0B5]/10 border-[#35E0B5]/30',
    blue: 'text-[#5B8CFF] bg-[#5B8CFF]/10 border-[#5B8CFF]/30',
    purple: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
    amber: 'text-[#F5C451] bg-[#F5C451]/10 border-[#F5C451]/30',
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delayIndex * 80}ms` }}
      className={clsx(
        'group relative rounded-xl border border-white/10 bg-[#0D141B]/90 p-5 backdrop-blur-md',
        'transition-all duration-300 ease-out hover:-translate-y-1',
        accentGlows[accentColor],
        onClick && 'cursor-pointer',
        'animate-slide-up opacity-0 fill-mode-forwards',
        className
      )}
    >
      {/* Top row: Icon + Title & Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-transform duration-300 group-hover:scale-110',
                iconColors[accentColor]
              )}
            >
              {icon}
            </div>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B98A7]">
            {title}
          </span>
        </div>

        {badgeText && (
          <span
            className={clsx(
              'rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium',
              badgeColors[badgeVariant]
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F5F7FA] font-mono transition-transform duration-300 group-hover:translate-x-0.5">
          <AnimatedCounter
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        </div>
      </div>

      {/* Subtitle / Context note */}
      {subtitle && (
        <p className="mt-2 text-xs text-[#8B98A7] flex items-center gap-1.5 font-sans">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-[#35E0B5] transition-colors" />
          {subtitle}
        </p>
      )}

      {/* Bottom faint highlight gradient bar */}
      <div className="absolute inset-x-4 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/50 transition-all duration-500" />
    </div>
  );
};

