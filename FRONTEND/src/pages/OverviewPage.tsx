import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ReceiptText,
  Boxes,
  Network,
  ShoppingBag,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PageId, DatasetMetadata, AssociationRule } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { HeroNetworkVisual } from '../components/overview/HeroNetworkVisual';
import { RuleCard } from '../components/rules/RuleCard';

interface OverviewPageProps {
  metadata: DatasetMetadata;
  rules: AssociationRule[];
  onNavigate: (page: PageId) => void;
  onSelectRule: (rule: AssociationRule) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  metadata,
  rules,
  onNavigate,
  onSelectRule,
}) => {
  const topRules = rules.slice(0, 3);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 lg:pt-6">
        {/* Left Column: Copywriting & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-3.5 py-1.5 text-xs font-mono text-[#35E0B5] shadow-glow-teal">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Retail Pattern Discovery Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.1]">
            Find the products <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#35E0B5] via-[#5B8CFF] to-[#A78BFA]">
              that move together.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8B98A7] leading-relaxed max-w-xl font-sans">
            Market Basket Intelligence transforms transaction-level retail data into
            actionable purchasing relationships using association rule mining.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('insights')}
              className="group inline-flex items-center gap-2 rounded-xl bg-[#35E0B5] px-6 py-3.5 text-sm font-bold text-black shadow-glow-teal hover:bg-[#35E0B5]/90 transition-all duration-200"
            >
              <span>Explore Insights</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('rules')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F5F7FA] hover:bg-white/10 hover:border-white/25 transition-all duration-200"
            >
              <Network className="h-4 w-4 text-[#5B8CFF]" />
              <span>View Analysis</span>
            </button>
          </div>

          {/* Micro stats under CTA */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-xs text-[#8B98A7] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35E0B5]" />
              <span>Zero fabricated values</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5B8CFF]" />
              <span>Apriori Level-wise Search</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Network Interactive Visual */}
        <div className="lg:col-span-6">
          <HeroNetworkVisual />
        </div>
      </section>

      {/* KPI Cards Row (Animated Counters & Staggered Entrance) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8B98A7]">
            Core Data Intelligence Metrics
          </h2>
          <span className="text-[11px] font-mono text-[#35E0B5]">
            Live Verified Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Transactions"
            value={metadata.metrics.transactionsCount}
            subtitle="Unique customer baskets (BillNo)"
            icon={<ReceiptText className="h-4 w-4" />}
            badgeText="520k Rows"
            badgeVariant="blue"
            accentColor="blue"
            delayIndex={0}
            onClick={() => onNavigate('transactions')}
          />

          <KpiCard
            title="Products"
            value={metadata.metrics.uniqueProductsCount}
            subtitle="Distinct catalog retail SKUs"
            icon={<ShoppingBag className="h-4 w-4" />}
            badgeText="30 Countries"
            badgeVariant="purple"
            accentColor="purple"
            delayIndex={1}
            onClick={() => onNavigate('transactions')}
          />

          <KpiCard
            title="Frequent Itemsets"
            value={metadata.metrics.frequentItemsetsCount}
            subtitle="At min support threshold ≥ 2.0%"
            icon={<Boxes className="h-4 w-4" />}
            badgeText="Apriori Mined"
            badgeVariant="amber"
            accentColor="amber"
            delayIndex={2}
            onClick={() => onNavigate('itemsets')}
          />

          <KpiCard
            title="Association Rules"
            value={metadata.metrics.finalRulesCount}
            subtitle="Confidence ≥ 50% & Lift > 1.0"
            icon={<Network className="h-4 w-4" />}
            badgeText="Up to 18.89x Lift"
            badgeVariant="teal"
            accentColor="teal"
            delayIndex={3}
            onClick={() => onNavigate('rules')}
          />
        </div>
      </section>

      {/* Spotlight: Top Association Rules Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              Highest Affinity Purchasing Rules
            </h2>
            <p className="text-xs text-[#8B98A7]">
              Top rules exhibiting highest measured Lift in customer purchase patterns
            </p>
          </div>

          <button
            onClick={() => onNavigate('rules')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#35E0B5] hover:underline"
          >
            <span>View All {rules.length} Rules</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRules.map((rule, idx) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={idx}
              onClick={() => onSelectRule(rule)}
            />
          ))}
        </div>
      </section>

      {/* Quick Architecture Callout Banner */}
      <section className="rounded-2xl border border-white/10 bg-[#0D141B]/80 p-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#35E0B5]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#35E0B5] font-semibold">
                End-to-End Pipeline Architecture
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F7FA]">
              From 522,064 Raw Purchases to High-Precision Rules
            </h3>
            <p className="text-xs text-[#8B98A7] max-w-2xl font-sans leading-relaxed">
              Explore how raw online retail transactions undergo systematic cleaning,
              incidence matrix encoding, level-wise Apriori candidate generation, and
              dual confidence/lift filtration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('pipeline')}
              className="inline-flex items-center gap-2 rounded-xl border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-5 py-2.5 text-xs font-bold text-[#35E0B5] hover:bg-[#35E0B5]/20 transition-all shadow-glow-teal"
            >
              <Layers className="h-4 w-4" />
              <span>Explore Interactive Pipeline</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
