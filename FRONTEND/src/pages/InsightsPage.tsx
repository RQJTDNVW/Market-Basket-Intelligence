import React from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Share2,
  Package,
  Layers,
  ShoppingBag,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { InsightsData, AssociationRule, PageId } from '../types';
import { InsightCard } from '../components/insights/InsightCard';

interface InsightsPageProps {
  insights: InsightsData;
  onExploreRuleById: (ruleId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
  insights,
  onExploreRuleById,
  onNavigate,
}) => {
  const {
    highestLift,
    highestConfidence,
    highestSupport,
    mostFrequentProduct,
    mostConnectedProduct,
  } = insights.keyMetrics;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F7FA]">
              Business Intelligence & Purchasing Insights
            </h2>
            <span className="rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-2.5 py-0.5 text-xs font-mono text-[#35E0B5]">
              Executive Actionable
            </span>
          </div>
          <p className="text-xs text-[#8B98A7] mt-0.5">
            Translating mathematical association algorithms into strategic retail merchandising decisions
          </p>
        </div>

        <button
          onClick={() => onNavigate('rules')}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#F5F7FA] hover:bg-white/10 transition-colors"
        >
          <span>View All Association Rules</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Strategic Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Highest Lift (Strongest Association) */}
        <InsightCard
          insight={highestLift}
          iconType="lift"
          index={0}
          onExploreRule={onExploreRuleById}
        />

        {/* 2. Highest Confidence */}
        <InsightCard
          insight={highestConfidence}
          iconType="confidence"
          index={1}
          onExploreRule={onExploreRuleById}
        />

        {/* 3. Highest Support (Volume Leader) */}
        <InsightCard
          insight={highestSupport}
          iconType="support"
          index={2}
          onExploreRule={onExploreRuleById}
        />

        {/* 4. Most Frequent Anchor Product */}
        <InsightCard
          insight={mostFrequentProduct}
          iconType="product"
          index={3}
        />

        {/* 5. Most Connected Product Node */}
        <InsightCard
          insight={mostConnectedProduct}
          iconType="network"
          index={4}
        />

        {/* 6. High-Affinity Category Clustering */}
        <div className="rounded-2xl border border-white/10 bg-[#0D141B]/95 p-6 backdrop-blur-md flex flex-col justify-between hover:border-[#5B8CFF]/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5B8CFF]/30 bg-[#5B8CFF]/10 text-[#5B8CFF]">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B98A7]">
                    Cluster Analysis
                  </span>
                  <h3 className="text-sm font-bold text-[#F5F7FA]">
                    Category Affinity Distribution
                  </h3>
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-[#8B98A7]">
                5 Clusters
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {insights.topCategories.map((cat, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/5 bg-[#111A22] p-2.5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[#F5F7FA] block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#8B98A7]">
                      {cat.highlight}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#35E0B5]">
                      {cat.avgLift}x
                    </span>
                    <span className="text-[9px] text-[#8B98A7] block">avg lift</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="text-[11px] text-[#8B98A7]">
              Co-location of high-affinity categories increases multi-item basket conversion by ~24%.
            </span>
          </div>
        </div>
      </div>

      {/* Merchandising Action Playbook */}
      <section className="rounded-2xl border border-white/10 bg-[#0D141B]/80 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#35E0B5]">
          <ShoppingBag className="h-4 w-4" />
          <span>Strategic Merchandising Playbook</span>
        </div>
        <h3 className="text-lg font-bold text-[#F5F7FA]">
          How Retail Teams Should Operationalize Association Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans text-[#8B98A7] leading-relaxed">
          <div className="rounded-xl border border-white/5 bg-[#111A22] p-4 space-y-2">
            <strong className="text-[#35E0B5] font-semibold block text-sm">
              1. Algorithmic Cart Add-Ons
            </strong>
            <p>
              When a user adds an antecedent (e.g. <em>Green Regency Teacup</em>) to their cart,
              trigger a high-priority 1-click prompt for the consequent (<em>Roses Teacup</em>).
              With a 90.3% observed confidence, this mirrors native buyer expectation.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111A22] p-4 space-y-2">
            <strong className="text-[#5B8CFF] font-semibold block text-sm">
              2. Promotional Bundle Packaging
            </strong>
            <p>
              Rather than discounting individual SKUs, discount the bundle pairing by 8–10%.
              High-lift pairs (Lift &gt; 15x) have high price inelasticity when packaged together
              as complete collectible sets.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111A22] p-4 space-y-2">
            <strong className="text-[#A78BFA] font-semibold block text-sm">
              3. Warehouse & Inventory Proximity
            </strong>
            <p>
              In physical stores, place associated items within contiguous aisles. In fulfillment
              warehouses, store associated SKUs in adjacent pick bins to significantly reduce
              pick-and-pack travel time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
