import React, { useEffect } from 'react';
import {
  X,
  Zap,
  TrendingUp,
  Percent,
  Sparkles,
  ShoppingBag,
  Lightbulb,
  ArrowDown,
  Layers,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { AssociationRule } from '../../types';

interface RuleDrawerProps {
  rule: AssociationRule | null;
  isOpen: boolean;
  onClose: () => void;
  onFilterTransactions?: (rule: AssociationRule) => void;
}

export const RuleDrawer: React.FC<RuleDrawerProps> = ({
  rule,
  isOpen,
  onClose,
  onFilterTransactions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!rule) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#0A0F14]/98 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#35E0B5]/30 bg-[#35E0B5]/10 text-[#35E0B5]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#35E0B5] font-semibold">
                Association Rule Analysis
              </span>
              <h2 className="text-base font-bold text-[#F5F7FA] font-mono">
                {rule.id}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visual Mini Flow Diagram */}
          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-5 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8B98A7] mb-3">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#35E0B5]" />
                Purchasing Relationship Flow
              </span>
              <span className="text-[#35E0B5] font-bold">{rule.category}</span>
            </div>

            <div className="flex flex-col items-center py-2 space-y-3">
              {/* Antecedents Box */}
              <div className="w-full rounded-lg border border-white/15 bg-[#111A22] p-3 text-center shadow-sm">
                <span className="text-[10px] font-mono text-[#8B98A7] uppercase block mb-1.5">
                  Antecedent Condition (When Customer Purchases)
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {rule.antecedents.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="rounded-md bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-[#F5F7FA]">
                        {item}
                      </span>
                      {idx < rule.antecedents.length - 1 && (
                        <span className="text-xs font-bold text-[#35E0B5]">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Animated Flow Conduit */}
              <div className="flex flex-col items-center justify-center my-1 text-[#35E0B5]">
                <div className="h-4 w-[2px] bg-gradient-to-b from-[#35E0B5]/20 to-[#35E0B5]" />
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#35E0B5]/40 bg-[#35E0B5]/15 shadow-glow-teal animate-pulse-slow">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>
                <div className="h-4 w-[2px] bg-gradient-to-b from-[#35E0B5] to-[#35E0B5]/20" />
              </div>

              {/* Consequent Box */}
              <div className="w-full rounded-lg border border-[#35E0B5]/30 bg-[#35E0B5]/10 p-3 text-center shadow-glow-teal">
                <span className="text-[10px] font-mono text-[#35E0B5] uppercase block mb-1.5 font-bold">
                  Consequent Outcome (Customer Also Purchases)
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {rule.consequents.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-[#35E0B5]/20 border border-[#35E0B5]/40 px-3 py-1 text-xs font-bold text-[#35E0B5]"
                    >
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core Analytics Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Lift Card */}
            <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4">
              <span className="text-[10px] font-mono text-[#8B98A7] uppercase block">
                Lift Multiplier
              </span>
              <div className="text-2xl font-bold font-mono text-[#35E0B5] my-1">
                {rule.lift}x
              </div>
              <span className="text-[10px] text-[#8B98A7]">
                vs. random co-occurrence
              </span>
            </div>

            {/* Confidence Card */}
            <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4">
              <span className="text-[10px] font-mono text-[#8B98A7] uppercase block">
                Confidence
              </span>
              <div className="text-2xl font-bold font-mono text-[#5B8CFF] my-1">
                {rule.confidencePercentage}%
              </div>
              <span className="text-[10px] text-[#8B98A7]">
                conversion probability
              </span>
            </div>

            {/* Support Card */}
            <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4">
              <span className="text-[10px] font-mono text-[#8B98A7] uppercase block">
                Support
              </span>
              <div className="text-2xl font-bold font-mono text-[#A78BFA] my-1">
                {rule.supportPercentage}%
              </div>
              <span className="text-[10px] text-[#8B98A7]">
                {rule.transactionCount.toLocaleString()} baskets
              </span>
            </div>
          </div>

          {/* Plain English Explanations */}
          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-5 space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5F7FA] flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#F5C451]" />
              Metric Interpretation (Plain Language)
            </h3>

            <div className="space-y-3 text-xs text-[#8B98A7]">
              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <strong className="text-[#35E0B5] font-mono block mb-1">
                  Lift ({rule.lift}x):
                </strong>
                How strongly the products are associated compared with random co-occurrence.
                Shoppers are <strong className="text-white">{rule.lift} times more likely</strong> to buy the consequent when the antecedent is present.
              </div>

              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <strong className="text-[#5B8CFF] font-mono block mb-1">
                  Confidence ({rule.confidencePercentage}%):
                </strong>
                How often the consequent appears when the antecedent is purchased.
                In <strong className="text-white">{rule.confidencePercentage}%</strong> of transactions where this antecedent was selected, the consequent accompanied it.
              </div>

              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <strong className="text-[#A78BFA] font-mono block mb-1">
                  Support ({rule.supportPercentage}%):
                </strong>
                How frequently this complete combination appears across all customer baskets.
                Found in <strong className="text-white">{rule.transactionCount.toLocaleString()} distinct transactions</strong> ({rule.supportPercentage}% of all retail activity).
              </div>
            </div>
          </div>

          {/* Actionable Merchandising Strategy */}
          <div className="rounded-xl border border-[#35E0B5]/25 bg-[#35E0B5]/5 p-5">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#35E0B5] flex items-center gap-2 mb-2">
              <ShoppingBag className="h-4 w-4" />
              Strategic Retail Recommendation
            </h3>
            <p className="text-xs text-[#F5F7FA] leading-relaxed">
              {rule.businessAction}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 p-5 bg-[#0D141B]/80 flex items-center justify-between gap-3">
          {onFilterTransactions && (
            <button
              onClick={() => {
                onFilterTransactions(rule);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#35E0B5] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#35E0B5]/90 transition-all shadow-glow-teal"
            >
              <span>Explore Matching Baskets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#8B98A7] hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

