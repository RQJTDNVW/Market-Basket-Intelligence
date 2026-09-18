import React, { useState, useEffect } from 'react';
import {
  PageId,
  DatasetMetadata,
  AssociationRule,
  FrequentItemset,
  InsightsData,
} from './types';
import { dataService } from './services/dataService';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ItemsetsPage } from './pages/ItemsetsPage';
import { RulesPage } from './pages/RulesPage';
import { InsightsPage } from './pages/InsightsPage';
import { VisualizationPage } from './pages/VisualizationPage';
import { PipelinePage } from './pages/PipelinePage';
import { AboutPage } from './pages/AboutPage';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { RuleDrawer } from './components/rules/RuleDrawer';
import { Search, X, Zap, Boxes, Receipt, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [rules, setRules] = useState<AssociationRule[]>([]);
  const [itemsets, setItemsets] = useState<FrequentItemset[]>([]);
  const [insights, setInsights] = useState<InsightsData | null>(null);

  // Global selected rule for RuleDrawer
  const [selectedRule, setSelectedRule] = useState<AssociationRule | null>(null);

  // Global Command/Search dialog
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [globalSearchText, setGlobalSearchText] = useState<string>('');

  useEffect(() => {
    const initData = async () => {
      try {
        const [metaRes, rulesRes, itemsetsRes, insightsRes] = await Promise.all([
          dataService.getMetadata(),
          dataService.getRules(),
          dataService.getItemsets(),
          dataService.getInsights(),
        ]);
        setMetadata(metaRes);
        setRules(rulesRes);
        setItemsets(itemsetsRes);
        setInsights(insightsRes);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectRuleById = async (ruleId: string) => {
    const r = await dataService.getRuleById(ruleId);
    if (r) {
      setSelectedRule(r);
    }
  };

  const handleFilterTransactionsByRule = (rule: AssociationRule) => {
    // Navigate to transactions and let the user explore
    setCurrentPage('transactions');
  };

  if (loading || !metadata || !insights) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070A] p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center gap-3 text-[#35E0B5]">
            <span className="h-3 w-3 rounded-full bg-[#35E0B5] animate-ping" />
            <span className="font-mono text-sm font-semibold tracking-wider">
              INITIALIZING ANALYSIS ENGINE...
            </span>
          </div>
          <LoadingSkeleton rows={4} type="card" />
        </div>
      </div>
    );
  }

  // Filter rules for quick global search modal
  const searchResults = globalSearchText
    ? rules
        .filter((r) =>
          r.rule.toLowerCase().includes(globalSearchText.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <AppShell
      currentPage={currentPage}
      onSelectPage={(page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onOpenSearch={() => setSearchOpen(true)}
    >
      {/* Page Routing */}
      {currentPage === 'overview' && (
        <OverviewPage
          metadata={metadata}
          rules={rules}
          onNavigate={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectRule={(r) => setSelectedRule(r)}
        />
      )}

      {currentPage === 'transactions' && (
        <TransactionsPage
          metadata={metadata}
          onSelectRuleById={handleSelectRuleById}
        />
      )}

      {currentPage === 'itemsets' && (
        <ItemsetsPage itemsets={itemsets} />
      )}

      {currentPage === 'rules' && (
        <RulesPage
          rules={rules}
          selectedRule={selectedRule}
          onSelectRule={setSelectedRule}
          onFilterTransactions={handleFilterTransactionsByRule}
        />
      )}

      {currentPage === 'insights' && (
        <InsightsPage
          insights={insights}
          onExploreRuleById={handleSelectRuleById}
          onNavigate={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentPage === 'visualization' && (
        <VisualizationPage
          rules={rules}
          selectedRule={selectedRule}
          onSelectRule={setSelectedRule}
          onFilterTransactions={handleFilterTransactionsByRule}
        />
      )}

      {currentPage === 'pipeline' && <PipelinePage />}

      {currentPage === 'about' && <AboutPage metadata={metadata} />}

      {/* Global Rule Drawer (if triggered from overview or elsewhere) */}
      <RuleDrawer
        rule={selectedRule}
        isOpen={Boolean(selectedRule)}
        onClose={() => setSelectedRule(null)}
        onFilterTransactions={handleFilterTransactionsByRule}
      />

      {/* Quick Global Command Search Modal (Cmd+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0D141B] p-4 shadow-2xl">
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/10 pb-3">
              <Search className="h-5 w-5 text-[#8B98A7] mr-3" />
              <input
                type="text"
                autoFocus
                value={globalSearchText}
                onChange={(e) => setGlobalSearchText(e.target.value)}
                placeholder="Search across rules, items, and SKUs (e.g. TEACUP, JUMBO BAG)..."
                className="w-full bg-transparent text-sm text-[#F5F7FA] placeholder-[#5A6675] outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[#8B98A7] hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Navigation suggestions */}
            {!globalSearchText && (
              <div className="py-4 space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8B98A7] block px-2">
                  Jump to Section
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-medium text-[#F5F7FA]">
                  {[
                    { id: 'rules' as PageId, label: 'Association Rules' },
                    { id: 'insights' as PageId, label: 'Business Insights' },
                    { id: 'visualization' as PageId, label: 'Visualization Engine' },
                    { id: 'transactions' as PageId, label: 'Transaction Explorer' },
                    { id: 'itemsets' as PageId, label: 'Frequent Itemsets' },
                    { id: 'pipeline' as PageId, label: 'Pipeline Architecture' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentPage(p.id);
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between rounded-lg p-2.5 hover:bg-white/5 text-left text-[#8B98A7] hover:text-white transition-colors"
                    >
                      <span>{p.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#35E0B5]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {globalSearchText && (
              <div className="py-2 space-y-1 max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRule(r);
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between rounded-lg p-2.5 hover:bg-white/5 cursor-pointer text-xs transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <span className="text-[10px] font-mono text-[#35E0B5] block">
                          {r.id} • {r.category}
                        </span>
                        <span className="text-[#F5F7FA] font-medium truncate block">
                          {r.rule}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#F5C451] flex-shrink-0">
                        {r.lift}x Lift
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-[#8B98A7]">
                    No matching rules found for "{globalSearchText}".
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-white/5 pt-2 mt-2 flex items-center justify-between text-[10px] font-mono text-[#5A6675]">
              <span>ESC to close</span>
              <span>MARKET BASKET INTELLIGENCE</span>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};
