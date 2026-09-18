import React, { useState, useMemo } from 'react';
import {
  Boxes,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { FrequentItemset } from '../types';
import { analyticsService } from '../services/analyticsService';
import { ItemsetCard } from '../components/itemsets/ItemsetCard';
import { ItemsetTable } from '../components/itemsets/ItemsetTable';
import { FilterSlider } from '../components/common/FilterSlider';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';

interface ItemsetsPageProps {
  itemsets: FrequentItemset[];
}

export const ItemsetsPage: React.FC<ItemsetsPageProps> = ({ itemsets }) => {
  const [minSupport, setMinSupport] = useState<number>(0.02);
  const [sizeFilter, setSizeFilter] = useState<'all' | '1' | '2' | '3+'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'support' | 'size' | 'frequency'>('support');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtered & Sorted Itemsets
  const filteredItemsets = useMemo(() => {
    let list = analyticsService.filterItemsets(
      itemsets,
      minSupport,
      sizeFilter,
      searchQuery
    );

    list.sort((a, b) => {
      if (sortBy === 'size') {
        return b.size - a.size || b.support - a.support;
      }
      if (sortBy === 'frequency') {
        return b.transactionCount - a.transactionCount;
      }
      return b.support - a.support;
    });

    return list;
  }, [itemsets, minSupport, sizeFilter, searchQuery, sortBy]);

  const maxSupportValue = useMemo(() => {
    if (itemsets.length === 0) return 0.12;
    return Math.max(...itemsets.map((it) => it.support));
  }, [itemsets]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA] flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#35E0B5]" />
            Frequent Itemsets
          </h2>
          <p className="text-xs text-[#8B98A7] mt-0.5">
            Discover product combinations that repeatedly appear across customer baskets.
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

      {/* Control Panel: Support Slider + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-2xl border border-white/10 bg-[#0D141B]/80 p-5 backdrop-blur-md">
        {/* Support Slider */}
        <div className="md:col-span-4">
          <FilterSlider
            label="Minimum Support Threshold"
            value={minSupport}
            min={0.02}
            max={0.12}
            step={0.005}
            onChange={setMinSupport}
            formatDisplay={(v) => `${(v * 100).toFixed(1)}%`}
            description="Minimum frequency in all baskets"
            variant="teal"
          />
        </div>

        {/* Search */}
        <div className="md:col-span-4 flex flex-col justify-end">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products in itemset..."
          />
        </div>

        {/* Size Filter & Sort */}
        <div className="md:col-span-4 flex items-end gap-2">
          {/* Size filter */}
          <div className="flex-1">
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1.5 font-semibold">
              Itemset Size
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-white/10 bg-[#091017] px-3 text-xs text-[#F5F7FA] outline-none cursor-pointer"
            >
              <option value="all">All Sizes</option>
              <option value="1">1-Item Anchors</option>
              <option value="2">2-Item Pairs</option>
              <option value="3+">3+ Item Bundles</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="text-[10px] font-mono uppercase text-[#8B98A7] block mb-1.5 font-semibold">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-white/10 bg-[#091017] px-3 text-xs text-[#F5F7FA] outline-none cursor-pointer font-mono"
            >
              <option value="support">Highest Support</option>
              <option value="size">Largest Itemset</option>
              <option value="frequency">Most Frequent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8B98A7]">
        <span>
          Showing{' '}
          <strong className="text-[#35E0B5] font-bold">
            {filteredItemsets.length}
          </strong>{' '}
          of {itemsets.length} frequent itemsets
        </span>
        <span>
          Min Support: {(minSupport * 100).toFixed(1)}% (≈{' '}
          {Math.round(minSupport * 19737).toLocaleString()} baskets)
        </span>
      </div>

      {/* Itemsets View */}
      {filteredItemsets.length === 0 ? (
        <EmptyState
          title="No frequent itemsets found."
          description="None of the item combinations in the catalog meet the selected minimum support threshold."
          suggestion="Try lowering the minimum support slider to 2.0% or clear your product search."
          onReset={() => {
            setMinSupport(0.02);
            setSizeFilter('all');
            setSearchQuery('');
          }}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItemsets.map((itemset, idx) => (
            <ItemsetCard
              key={itemset.id}
              itemset={itemset}
              index={idx}
              maxSupport={maxSupportValue}
            />
          ))}
        </div>
      ) : (
        <ItemsetTable itemsets={filteredItemsets} maxSupport={maxSupportValue} />
      )}
    </div>
  );
};
