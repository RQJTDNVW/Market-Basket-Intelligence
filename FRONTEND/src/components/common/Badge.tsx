import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    teal: 'bg-[#35E0B5]/10 text-[#35E0B5] border-[#35E0B5]/25',
    blue: 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/25',
    purple: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/25',
    amber: 'bg-[#F5C451]/10 text-[#F5C451] border-[#F5C451]/25',
    rose: 'bg-[#FF647C]/10 text-[#FF647C] border-[#FF647C]/25',
    slate: 'bg-white/5 text-[#8B98A7] border-white/10',
    outline: 'bg-transparent text-[#8B98A7] border-white/15',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

