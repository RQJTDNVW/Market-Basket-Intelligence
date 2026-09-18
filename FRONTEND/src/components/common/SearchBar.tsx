import React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search products, transactions, or rules...',
  className,
}) => {
  return (
    <div className={clsx('relative flex items-center', className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-[#8B98A7] pointer-events-none transition-colors group-focus-within:text-[#35E0B5]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border border-white/10 bg-[#091017]/80 pl-10 pr-10 text-sm text-[#F5F7FA] placeholder-[#5A6675] outline-none transition-all duration-200 focus:border-[#35E0B5]/50 focus:bg-[#0D141B] focus:ring-1 focus:ring-[#35E0B5]/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

