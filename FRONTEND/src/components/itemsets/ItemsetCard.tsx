import React from 'react';
import { Boxes, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { FrequentItemset } from '../../types';
import { MetricBar } from '../common/MetricBar';

interface ItemsetCardProps {
  itemset: FrequentItemset;
  index?: number;
  maxSupport?: number;
}

export const ItemsetCard: React.FC<ItemsetCardProps> = ({
  itemset,
  index = 0,
  maxSupport = 0.12,
}) => {
  const sizeColors = {
    1: 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/30',
    2: 'bg-[#35E0B5]/10 text-[#35E0B5] border-[#35E0B5]/30',
    3: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30',
  };

  return (
    <div
      style={{ animationDelay: `${(index % 12) * 45}ms` }}
      className={clsx(
        'group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0D141B]/90 p-5 backdrop-blur-md',
        'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#35E0B5]/40 hover:shadow-glow-teal',
        'animate-slide-up opacity-0 fill-mode-forwards'
      )}
    >
      {/* Top: Itemset ID & Size Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[10px] text-[#8B98A7] bg-white/5 border border-white/5 px-2 py-0.5 rounded">
          {itemset.id}
        </span>

        <span
          className={clsx(
            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold',
            sizeColors[itemset.size as keyof typeof sizeColors] || sizeColors[2]
          )}
        >
          <Boxes className="h-3 w-3" />
          {itemset.size}-ITEM BUNDLE
        </span>
      </div>

      {/* Product Combination Chips */}
      <div className="my-2 space-y-1.5 min-h-[58px]">
        <div className="flex flex-wrap items-center gap-1.5">
          {itemset.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="rounded-lg border border-white/10 bg-[#111A22] px-2.5 py-1 text-xs font-semibold text-[#F5F7FA] group-hover:border-[#35E0B5]/30 transition-colors">
                {item}
              </span>
              {idx < itemset.items.length - 1 && (
                <span className="text-xs font-bold text-[#35E0B5]">+</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Horizontal Support Metric Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
        <MetricBar
          value={itemset.support}
          max={maxSupport}
          label="Support (Frequency)"
          displayValue={`${itemset.supportPercentage}%`}
          variant={itemset.size === 1 ? 'blue' : 'teal'}
          height="sm"
        />

        <div className="flex items-center justify-between text-xs text-[#8B98A7] font-mono">
          <span>Appears in:</span>
          <span className="font-semibold text-[#F5F7FA]">
            {itemset.transactionCount.toLocaleString()} transactions
          </span>
        </div>
      </div>

      {/* Bottom faint highlight */}
      <div className="absolute inset-x-4 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/50 transition-all duration-500" />
    </div>
  );
};

