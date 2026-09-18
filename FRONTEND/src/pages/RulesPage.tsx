import React, { useState, useMemo } from 'react';
import {
  Network,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { AssociationRule } from '../types';
import { rulesService, RuleFilters } from '../services/rulesService';
import { RuleCard } from '../components/rules/RuleCard';
import { RuleTable } from '../components/rules/RuleTable';
import { RuleDrawer } from '../components/rules/RuleDrawer';
import { FilterSlider } from '../components/common/FilterSlider';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';

interface RulesPageProps {
  rules: AssociationRule[];
  selectedRule: AssociationRule | null;
  onSelectRule: (rule: AssociationRule | null) => void;
  onFilterTransactions?: (rule: AssociationRule) => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({
  rules,
  selectedRule,
  onSelectRule,
  onFilterTransactions,
}) => {
  const [minConfidence, setMinConfidence] = useState<number>(0.5);
  const [minLift, setMinLift] = useState<number>(1.0);
  const [minSupport, setMinSupport] = useState<number>(0.02);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemCountFilter, setItemCountFilter] = useState<'all' | '2' | '3+'>('all');
  const [sortBy, setSortBy] = useState<'lift' | 'confidence' | 'support' | 'transactions'>('lift');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const categories = useMemo(() => {
    return rulesService.getCategories(rules);
  }, [rules]);

  // Apply filters & sorting
  const filteredRules = useMemo(() => {
    const filters: RuleFilters = {
      minConfidence,
      minLift,
      minSupport,
      search: searchQuery,
      category: selectedCategory,
      itemCount: itemCountFilter,
      sortBy,
      sortDirection,
    };
    return rulesService.filterRules(rules, filters);
  }, [
    rules,
    minConfidence,
    minLift,
    minSupport,
    searchQuery,
    selectedCategory,
    itemCountFilter,
    sortBy,
    sortDirection,
  ]);

  const handleResetFilters = () => {
    setMinConfidence(0.5);
    setMinLift(1.0);
    setMinSupport(0.02);
    setSearchQuery('');
    setSelectedCategory('all');
    setItemCountFilter('all');
    setSortBy('lift');
    setSortDirection('desc');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F7FA]">Association Rules</h2>
            <span className="rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-2.5 py-0.5 text-xs font-mono text-[#35E0B5]">
              {filteredRules.length} Rules
            </span>
          </div>
          <p className="text-xs text-[#8B98A7] mt-0.5 font-sans">
            Where purchasing behavior becomes predictable.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-white/10 bg-[#0D141B] p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                viewMode === 'cards'
                  ? 'bg-[#35E0B5]/15 text-[#35E0B5]'
                  : 'text-[#8B98A7] hover:text-white'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors',
                viewMode === 'table'
                  ? 'bg-[#35E0B5]/15 text-[#35E0B5]'
                  : 'text-[#8B98A7] hover:text-white'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="rounded-2xl border border-white/10 bg-[#0D141B]/80 p-5 backdrop-blur-md space-y-4">
        {/* Sliders Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FilterSlider
            label="Minimum Confidence"
            value={minConfidence}
            min={0.3}
            max={0.95}
            step={0.05}
            onChange={setMinConfidence}
            formatDisplay={(v) => `${(v * 100).toFixed(0)}%`}
            description="Probability of consequent given antecedent"
            variant="teal"
          />

          <FilterSlider
            label="Minimum Lift Multiplier"
            value={minLift}
            min={1.0}
            max={18.0}
            step={0.5}
            onChange={setMinLift}
            formatDisplay={(v) => `${v.toFixed(1)}x`}
            description="Affinity strength vs random chance"
            variant="blue"
          />

          <FilterSlider
            label="Minimum Support"
            value={minSupport}
            min={0.015}
            max={0.045}
            step={0.002}
            onChange={setMinSupport}
            formatDisplay={(v) => `${(v * 100).toFixed(1)}%`}
            description="Basket penetration percentage"
            variant="purple"
          />
        </div>

        {/* Search, Category, Size, Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          {/* Search */}
          <div className="col-span-1">
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1 font-semibold">
              Search Rule Items
            </label>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search product in rules..."
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1 font-semibold">
              Category Affinity
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/10 bg-[#091017] px-3 text-xs text-[#F5F7FA] outline-none cursor-pointer"
            >
              <option value="all">All Product Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Rule Size */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1 font-semibold">
              Rule Combination Size
            </label>
            <select
              value={itemCountFilter}
              onChange={(e) => setItemCountFilter(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-white/10 bg-[#091017] px-3 text-xs text-[#F5F7FA] outline-none cursor-pointer"
            >
              <option value="all">All Rule Sizes</option>
              <option value="2">2-Item (1 ➔ 1)</option>
              <option value="3+">3-Item Multi-Bundle (2 ➔ 1)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1 font-semibold">
              Sort Rules By
            </label>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 h-10 rounded-lg border border-white/10 bg-[#091017] px-3 text-xs text-[#F5F7FA] outline-none cursor-pointer font-mono"
              >
                <option value="lift">Highest Lift</option>
                <option value="confidence">Highest Confidence</option>
                <option value="support">Highest Support</option>
                <option value="transactions">Transaction Volume</option>
              </select>

              <button
                onClick={() =>
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-white/10 bg-[#091017] text-[#8B98A7] hover:text-white transition-colors"
                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Content */}
      {filteredRules.length === 0 ? (
        <EmptyState
          title="No associations meet the current criteria."
          description="None of the mined association rules satisfy your active confidence, lift, or search filters."
          suggestion="Try lowering the confidence or support threshold, or choose a broader category."
          onReset={handleResetFilters}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRules.map((rule, idx) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={idx}
              onClick={() => onSelectRule(rule)}
            />
          ))}
        </div>
      ) : (
        <RuleTable rules={filteredRules} onSelectRule={onSelectRule} />
      )}

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
