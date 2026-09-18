import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import clsx from 'clsx';
import { AssociationRule } from '../../types';
import { MetricBar } from '../common/MetricBar';

interface RuleCardProps {
  rule: AssociationRule;
  onClick: () => void;
  index?: number;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule, onClick, index = 0 }) => {
  // Lift tier styling
  const getLiftTier = (lift: number) => {
    if (lift >= 15) {
      return {
        bg: 'bg-[#35E0B5]/15',
        border: 'border-[#35E0B5]/35',
        text: 'text-[#35E0B5]',
        glow: 'hover:shadow-[0_0_25px_-5px_rgba(53,224,181,0.25)] hover:border-[#35E0B5]/50',
        badge: 'Extreme Affinity',
      };
    }
    if (lift >= 10) {
      return {
        bg: 'bg-[#5B8CFF]/15',
        border: 'border-[#5B8CFF]/35',
        text: 'text-[#5B8CFF]',
        glow: 'hover:shadow-[0_0_25px_-5px_rgba(91,140,255,0.25)] hover:border-[#5B8CFF]/50',
        badge: 'High Affinity',
      };
    }
    return {
      bg: 'bg-[#A78BFA]/15',
      border: 'border-[#A78BFA]/35',
      text: 'text-[#A78BFA]',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(167,139,250,0.25)] hover:border-[#A78BFA]/50',
      badge: 'Moderate Affinity',
    };
  };

  const tier = getLiftTier(rule.lift);

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
      className={clsx(
        'group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0D141B]/90 p-5 backdrop-blur-md',
        'cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1',
        tier.glow,
        'animate-slide-up opacity-0 fill-mode-forwards'
      )}
    >
      {/* Top Header: Rule ID & Category / Lift Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#8B98A7] bg-white/5 border border-white/5 px-2 py-0.5 rounded">
            {rule.id}
          </span>
          <span className="text-xs text-[#8B98A7] font-medium truncate max-w-[140px]">
            {rule.category}
          </span>
        </div>

        <div
          className={clsx(
            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-bold transition-transform duration-200 group-hover:scale-105',
            tier.bg,
            tier.border,
            tier.text
          )}
        >
          <Zap className="h-3 w-3" />
          <span>{rule.lift}x LIFT</span>
        </div>
      </div>

      {/* Main Relationship: Antecedents -> Consequent */}
      <div className="my-2 space-y-3">
        {/* Antecedents */}
        <div>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8B98A7] block mb-1">
            IF CUSTOMER BUYS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {rule.antecedents.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg border border-white/10 bg-[#111A22] px-2.5 py-1 text-xs font-medium text-[#F5F7FA] group-hover:border-[#35E0B5]/40 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Directed Relationship Arrow */}
        <div className="flex items-center gap-2 my-1 text-[#8B98A7] group-hover:text-[#35E0B5] transition-colors">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/40" />
          <div className="flex items-center gap-1 font-mono text-[11px] font-semibold">
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            <span>THEN ALSO BUYS</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/40" />
        </div>

        {/* Consequent */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {rule.consequents.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg border border-[#35E0B5]/25 bg-[#35E0B5]/10 px-2.5 py-1 text-xs font-semibold text-[#35E0B5] group-hover:shadow-[0_0_10px_rgba(53,224,181,0.2)] transition-all"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Breakdown Progress Bars */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5">
        <MetricBar
          value={rule.confidence}
          max={1}
          label="Confidence"
          displayValue={`${rule.confidencePercentage}%`}
          variant="teal"
          height="sm"
        />

        <div className="flex items-center justify-between text-xs text-[#8B98A7] pt-1 font-mono">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-[#5B8CFF]" />
            Support: <strong className="text-[#F5F7FA]">{rule.supportPercentage}%</strong>
          </span>
          <span>
            {rule.transactionCount.toLocaleString()} baskets
          </span>
        </div>
      </div>

      {/* Subtle indicator bar */}
      <div className="absolute inset-x-4 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/50 transition-all duration-500" />
    </div>
  );
};

