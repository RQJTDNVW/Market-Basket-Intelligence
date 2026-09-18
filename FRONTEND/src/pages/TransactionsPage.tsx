import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  ShoppingBag,
  Database,
  Globe,
  Layers,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import {
  DatasetMetadata,
  TransactionRow,
  TransactionGroup,
  AssociationRule,
} from '../types';
import { dataService } from '../services/dataService';
import { KpiCard } from '../components/common/KpiCard';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionDrawer } from '../components/transactions/TransactionDrawer';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

interface TransactionsPageProps {
  metadata: DatasetMetadata;
  onSelectRuleById?: (ruleId: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  metadata,
  onSelectRuleById,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof TransactionRow>('billNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Drawer state
  const [selectedGroup, setSelectedGroup] = useState<TransactionGroup | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Fetch transactions based on state
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const res = await dataService.getTransactions({
        page,
        pageSize,
        search: searchQuery,
        country: selectedCountry,
        sortBy,
        sortDirection,
      });

      if (isMounted) {
        setRows(res.rows);
        setTotalRows(res.total);
        setTotalPages(res.totalPages);
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, searchQuery, selectedCountry, sortBy, sortDirection]);

  const handleSortChange = (column: keyof TransactionRow) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleSelectBillNo = async (billNo: string) => {
    const group = await dataService.getTransactionGroup(billNo);
    if (group) {
      setSelectedGroup(group);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA] flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-[#5B8CFF]" />
            Transaction Explorer
          </h2>
          <p className="text-xs text-[#8B98A7] mt-0.5">
            Browse and inspect customer purchasing logs with integrated rule match detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-white/10 bg-[#0D141B] px-3 py-1.5 text-xs font-mono text-[#8B98A7]">
            Showing representative sample of {metadata.metrics.cleanedRows.toLocaleString()} total rows
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard
          title="Total Transactions"
          value={metadata.metrics.transactionsCount}
          subtitle="Distinct BillNo orders"
          accentColor="blue"
          delayIndex={0}
        />

        <KpiCard
          title="Unique Products"
          value={metadata.metrics.uniqueProductsCount}
          subtitle="Catalog SKU count"
          accentColor="purple"
          delayIndex={1}
        />

        <KpiCard
          title="Cleaned Rows"
          value={metadata.metrics.cleanedRows}
          subtitle="Validated purchase lines"
          accentColor="teal"
          delayIndex={2}
        />

        <KpiCard
          title="Countries"
          value={metadata.metrics.countriesCount}
          subtitle="Global retail markets"
          accentColor="amber"
          delayIndex={3}
        />

        <KpiCard
          title="Avg Basket Size"
          value={metadata.metrics.avgBasketSize}
          decimals={1}
          suffix=" items"
          subtitle="Mean items per basket"
          accentColor="teal"
          delayIndex={4}
        />
      </div>

      {/* Transaction Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={12} />
      ) : (
        <TransactionTable
          rows={rows}
          totalRows={totalRows}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          selectedCountry={selectedCountry}
          onCountryChange={(c) => {
            setSelectedCountry(c);
            setPage(1);
          }}
          countries={metadata.countries}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onSelectBillNo={handleSelectBillNo}
        />
      )}

      {/* Transaction Detail Drawer */}
      <TransactionDrawer
        group={selectedGroup}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectRule={(ruleId) => {
          setDrawerOpen(false);
          if (onSelectRuleById) onSelectRuleById(ruleId);
        }}
      />
    </div>
  );
};
