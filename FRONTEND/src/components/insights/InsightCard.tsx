import React from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Share2,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import clsx from 'clsx';
import { InsightMetric } from '../../types';

interface InsightCardProps {
  insight: InsightMetric;
  iconType?: 'lift' | 'confidence' | 'support' | 'product' | 'network';
  onExploreRule?: (ruleId: string) => void;
  index?: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  iconType = 'lift',
  onExploreRule,
  index = 0,
}) => {
  const iconConfig = {
    lift: {
      icon: Zap,
      accent: 'text-[#35E0B5] bg-[#35E0B5]/10 border-[#35E0B5]/30',
      glow: 'hover:border-[#35E0B5]/50 hover:shadow-glow-teal',
      badge: 'High Impact',
    },
    confidence: {
      icon: Target,
      accent: 'text-[#5B8CFF] bg-[#5B8CFF]/10 border-[#5B8CFF]/30',
      glow: 'hover:border-[#5B8CFF]/50 hover:shadow-glow-blue',
      badge: 'Predictive Certainty',
    },
    support: {
      icon: TrendingUp,
      accent: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
      glow: 'hover:border-[#A78BFA]/50 hover:shadow-glow-purple',
      badge: 'Volume Anchor',
    },
    product: {
      icon: Sparkles,
      accent: 'text-[#F5C451] bg-[#F5C451]/10 border-[#F5C451]/30',
      glow: 'hover:border-[#F5C451]/50 hover:shadow-[0_0_25px_-5px_rgba(245,196,81,0.2)]',
      badge: 'Core SKU',
    },
    network: {
      icon: Share2,
      accent: 'text-[#35E0B5] bg-[#35E0B5]/10 border-[#35E0B5]/30',
      glow: 'hover:border-[#35E0B5]/50 hover:shadow-glow-teal',
      badge: 'Network Hub',
    },
  };

  const currentConfig = iconConfig[iconType] || iconConfig.lift;
  const IconComponent = currentConfig.icon;

  return (
    <div
      style={{ animationDelay: `${index * 80}ms` }}
      className={clsx(
        'group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0D141B]/95 p-6 backdrop-blur-md',
        'transition-all duration-300 ease-out hover:-translate-y-1',
        currentConfig.glow,
        'animate-slide-up opacity-0 fill-mode-forwards'
      )}
    >
      <div>
        {/* Top Header: Badge + Category */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-xl border text-sm',
                currentConfig.accent
              )}
            >
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B98A7] block leading-tight">
                {insight.metricName}
              </span>
              <h3 className="text-sm font-bold text-[#F5F7FA]">
                {insight.title}
              </h3>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-[#8B98A7]">
            {currentConfig.badge}
          </span>
        </div>

        {/* Primary Insight Hero Value / Rule Display */}
        <div className="my-3 rounded-xl border border-white/5 bg-[#111A22]/90 p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] font-mono text-[#8B98A7] uppercase tracking-wider">
              Discovered Pattern
            </span>
            <span className="text-xl font-mono font-bold text-[#35E0B5]">
              {insight.value}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#F5F7FA] font-sans">
            {insight.rule || insight.product}
          </p>
        </div>

        {/* Short Explanation */}
        <div className="space-y-3 text-xs text-[#8B98A7] my-4 leading-relaxed">
          <div>
            <strong className="text-[#F5F7FA] block mb-0.5 font-sans">
              Behavioral Explanation:
            </strong>
            <p>{insight.explanation}</p>
          </div>

          <div>
            <strong className="text-[#35E0B5] block mb-0.5 font-sans flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5 text-[#F5C451]" />
              Why It Matters:
            </strong>
            <p>{insight.whyItMatters}</p>
          </div>
        </div>
      </div>

      {/* Strategic Recommendation Box */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="rounded-lg bg-[#35E0B5]/5 border border-[#35E0B5]/20 p-3 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#35E0B5] font-semibold flex items-center gap-1 mb-1">
            <CheckCircle2 className="h-3 w-3" />
            Executive Action
          </span>
          <p className="text-xs text-[#F5F7FA] leading-snug">
            {insight.recommendation}
          </p>
        </div>

        {/* Click to open rule drawer if applicable */}
        {insight.ruleId && onExploreRule && (
          <button
            onClick={() => onExploreRule(insight.ruleId!)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-[#8B98A7] hover:border-[#35E0B5]/30 hover:text-[#35E0B5] hover:bg-[#35E0B5]/10 transition-all"
          >
            <span>View Rule Deep Dive</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Subtle indicator bar */}
      <div className="absolute inset-x-4 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#35E0B5]/50 transition-all duration-500" />
    </div>
  );
};

