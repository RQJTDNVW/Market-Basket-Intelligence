import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Network,
  Filter,
  Download,
  Maximize2,
  Info,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { AssociationRule } from '../types';
import { ChartContainer } from '../components/visualization/ChartContainer';
import { SupportConfidenceChart } from '../components/visualization/SupportConfidenceChart';
import { AssociationNetworkGraph } from '../components/visualization/AssociationNetworkGraph';
import { RuleDrawer } from '../components/rules/RuleDrawer';
import { FilterSlider } from '../components/common/FilterSlider';

interface VisualizationPageProps {
  rules: AssociationRule[];
  selectedRule: AssociationRule | null;
  onSelectRule: (rule: AssociationRule | null) => void;
  onFilterTransactions?: (rule: AssociationRule) => void;
}

export const VisualizationPage: React.FC<VisualizationPageProps> = ({
  rules,
  selectedRule,
  onSelectRule,
  onFilterTransactions,
}) => {
  const [activeTab, setActiveTab] = useState<'scatter' | 'network'>('scatter');
  const [minConfidence, setMinConfidence] = useState<number>(0.5);
  const [minLift, setMinLift] = useState<number>(1.0);

  const filteredRules = useMemo(() => {
    return rules.filter(
      (r) => r.confidence >= minConfidence && r.lift >= minLift
    );
  }, [rules, minConfidence, minLift]);

  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredRules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'association_rules_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F7FA]">
              Analytical Visualization Engine
            </h2>
            <span className="rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-2.5 py-0.5 text-xs font-mono text-[#35E0B5]">
              Interactive Canvas
            </span>
          </div>
          <p className="text-xs text-[#8B98A7] mt-0.5">
            Explore multidimensional relationship dynamics via bubble scatter distributions and force network graphs
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-lg border border-white/10 bg-[#0D141B] p-1">
          <button
            onClick={() => setActiveTab('scatter')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
              activeTab === 'scatter'
                ? 'bg-[#35E0B5]/15 text-[#35E0B5]'
                : 'text-[#8B98A7] hover:text-white'
            )}
          >
            <ScatterChart className="h-3.5 w-3.5" />
            <span>Support vs Confidence</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
              activeTab === 'network'
                ? 'bg-[#35E0B5]/15 text-[#35E0B5]'
                : 'text-[#8B98A7] hover:text-white'
            )}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Association Network</span>
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      {activeTab === 'scatter' ? (
        <ChartContainer
          title="Support vs. Confidence Metric Distribution"
          subtitle="X-axis: Support frequency, Y-axis: Confidence conversion probability, Bubble radius: Lift affinity strength. Click any point to open diagnostic drawer."
          badge={`${filteredRules.length} Plotted Rules`}
          onExport={handleExportData}
          filterControls={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FilterSlider
                label="Confidence Filter"
                value={minConfidence}
                min={0.3}
                max={0.9}
                step={0.05}
                onChange={setMinConfidence}
                formatDisplay={(v) => `${(v * 100).toFixed(0)}%`}
                variant="teal"
              />
              <FilterSlider
                label="Lift Filter"
                value={minLift}
                min={1.0}
                max={15.0}
                step={0.5}
                onChange={setMinLift}
                formatDisplay={(v) => `${v.toFixed(1)}x`}
                variant="blue"
              />
            </div>
          }
        >
          <SupportConfidenceChart
            rules={filteredRules}
            onSelectRule={onSelectRule}
          />
        </ChartContainer>
      ) : (
        <ChartContainer
          title="Interactive Product Association Network Graph"
          subtitle="Force-directed network connecting Antecedent and Consequent products. Nodes are draggable; hover over any SKU to illuminate its affinity cluster."
          badge="Force Directed Physics"
          onExport={handleExportData}
        >
          <AssociationNetworkGraph rules={filteredRules} />
        </ChartContainer>
      )}

      {/* Metric Primer Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#35E0B5] font-bold">
            X-Axis: Support P(A ∩ B)
          </span>
          <p className="text-xs text-[#8B98A7]">
            Measures prevalence. What proportion of all 19,737 retail baskets contain both itemsets.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#5B8CFF] font-bold">
            Y-Axis: Confidence P(B|A)
          </span>
          <p className="text-xs text-[#8B98A7]">
            Measures predictive certainty. How frequently item B is added given item A is already in the basket.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#A78BFA] font-bold">
            Bubble Size: Lift P(B|A)/P(B)
          </span>
          <p className="text-xs text-[#8B98A7]">
            Measures association intensity. A lift of 18.89x means co-occurrence is 1,889% higher than random chance.
          </p>
        </div>
      </div>

      {/* Rule Detail Drawer */}
      <RuleDrawer
        rule={selectedRule}
        isOpen={Boolean(selectedRule)}
        onClose={() => onSelectRule(null)}
        onFilterTransactions={onFilterTransactions}
      />
    </div>
  );
};
