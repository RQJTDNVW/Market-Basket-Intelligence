import {
  AssociationRule,
  FrequentItemset,
  TransactionRow,
  DatasetMetadata,
  InsightsData,
  TransactionGroup
} from '../types';

import rawRules from '../data/rules.json';
import rawItemsets from '../data/itemsets.json';
import rawMetadata from '../data/metadata.json';
import rawInsights from '../data/insights.json';

class DataService {
  private rules: AssociationRule[] = rawRules as AssociationRule[];
  private itemsets: FrequentItemset[] = rawItemsets as FrequentItemset[];
  private metadata: DatasetMetadata = rawMetadata as DatasetMetadata;
  private transactions: TransactionRow[] = [];
  private insights: InsightsData = rawInsights as InsightsData;
  private transactionsLoaded: boolean = false;

  // Cache grouped transactions by billNo for instant lookups
  private groupedTransactionsMap: Map<string, TransactionGroup> = new Map();

  private async ensureTransactionsLoaded(): Promise<void> {
    if (!this.transactionsLoaded) {
      const data = await import('../data/transactions.json');
      this.transactions = data.default as TransactionRow[];
      this.indexTransactions();
      this.transactionsLoaded = true;
    }
  }

  private indexTransactions(): void {
    const map = new Map<string, TransactionRow[]>();
    for (const tx of this.transactions) {
      if (!map.has(tx.billNo)) {
        map.set(tx.billNo, []);
      }
      map.get(tx.billNo)!.push(tx);
    }

    for (const [billNo, rows] of map.entries()) {
      const first = rows[0];
      const items = rows.map((r) => ({
        itemname: r.itemname,
        quantity: r.quantity,
        price: r.price,
        total: Number((r.quantity * r.price).toFixed(2)),
      }));

      const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalSpend = Number(items.reduce((sum, i) => sum + i.total, 0).toFixed(2));
      const itemNames = new Set(items.map((i) => i.itemname));

      // Check if this basket matches any mined association rules!
      const matchedRules = this.rules.filter((rule) => {
        const hasAntecedents = rule.antecedents.every((item) => itemNames.has(item));
        const hasConsequents = rule.consequents.every((item) => itemNames.has(item));
        return hasAntecedents && hasConsequents;
      });

      this.groupedTransactionsMap.set(billNo, {
        billNo,
        customerId: first.customerId,
        country: first.country,
        date: first.date,
        totalQuantity,
        totalSpend,
        itemCount: items.length,
        items,
        matchedRules: matchedRules.length > 0 ? matchedRules : undefined,
      });
    }
  }

  public async getMetadata(): Promise<DatasetMetadata> {
    return this.metadata;
  }

  public async getRules(): Promise<AssociationRule[]> {
    return this.rules;
  }

  public async getRuleById(id: string): Promise<AssociationRule | undefined> {
    return this.rules.find((r) => r.id === id);
  }

  public async getItemsets(): Promise<FrequentItemset[]> {
    return this.itemsets;
  }

  public async getInsights(): Promise<InsightsData> {
    return this.insights;
  }

  public async getTransactions(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    country?: string;
    minQuantity?: number;
    sortBy?: keyof TransactionRow;
    sortDirection?: 'asc' | 'desc';
  }): Promise<{
    rows: TransactionRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    await this.ensureTransactionsLoaded();
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    let filtered = [...this.transactions];

    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.billNo.toLowerCase().includes(q) ||
          t.itemname.toLowerCase().includes(q) ||
          t.customerId.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q)
      );
    }

    if (options?.country && options.country !== 'all') {
      filtered = filtered.filter((t) => t.country === options.country);
    }

    if (options?.minQuantity) {
      filtered = filtered.filter((t) => t.quantity >= options.minQuantity!);
    }

    if (options?.sortBy) {
      const field = options.sortBy;
      const dir = options.sortDirection === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        if (a[field] < b[field]) return -1 * dir;
        if (a[field] > b[field]) return 1 * dir;
        return 0;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);

    return {
      rows,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async getTransactionGroup(billNo: string): Promise<TransactionGroup | undefined> {
    await this.ensureTransactionsLoaded();
    return this.groupedTransactionsMap.get(billNo);
  }

  public getAvailableCountries(): string[] {
    return this.metadata.countries;
  }
}

export const dataService = new DataService();

