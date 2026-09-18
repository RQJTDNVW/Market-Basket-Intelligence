import { AssociationRule, FrequentItemset, DatasetMetadata } from '../types';

export interface LiftDistributionBucket {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SupportDistributionBucket {
  range: string;
  count: number;
}

export class AnalyticsService {
  public calculateLiftDistribution(rules: AssociationRule[]): LiftDistributionBucket[] {
    const buckets = [
      { range: '1.0x - 5.0x', min: 1.0, max: 5.0, count: 0, color: '#5B8CFF' },
      { range: '5.0x - 10.0x', min: 5.0, max: 10.0, count: 0, color: '#A78BFA' },
      { range: '10.0x - 15.0x', min: 10.0, max: 15.0, count: 0, color: '#F5C451' },
      { range: '15.0x +', min: 15.0, max: 999.0, count: 0, color: '#35E0B5' },
    ];

    for (const rule of rules) {
      for (const bucket of buckets) {
        if (rule.lift >= bucket.min && rule.lift < bucket.max) {
          bucket.count += 1;
          break;
        }
      }
    }

    const total = rules.length || 1;
    return buckets.map((b) => ({
      range: b.range,
      count: b.count,
      percentage: Number(((b.count / total) * 100).toFixed(1)),
      color: b.color,
    }));
  }

  public getCategoryBreakdown(rules: AssociationRule[]): { name: string; count: number; avgLift: number }[] {
    const map = new Map<string, { count: number; totalLift: number }>();

    for (const rule of rules) {
      const cur = map.get(rule.category) || { count: 0, totalLift: 0 };
      cur.count += 1;
      cur.totalLift += rule.lift;
      map.set(rule.category, cur);
    }

    return Array.from(map.entries())
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        avgLift: Number((stat.totalLift / stat.count).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count);
  }

  public filterItemsets(
    itemsets: FrequentItemset[],
    minSupport: number,
    sizeFilter: 'all' | '1' | '2' | '3+',
    search: string
  ): FrequentItemset[] {
    return itemsets.filter((it) => {
      if (it.support < minSupport) return false;

      if (sizeFilter === '1' && it.size !== 1) return false;
      if (sizeFilter === '2' && it.size !== 2) return false;
      if (sizeFilter === '3+' && it.size < 3) return false;

      if (search) {
        const q = search.toLowerCase();
        const matches =
          it.itemsetString.toLowerCase().includes(q) ||
          it.items.some((i) => i.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }

  public getGlobalStats(metadata: DatasetMetadata, rules: AssociationRule[]) {
    const avgLift =
      rules.length > 0
        ? Number((rules.reduce((sum, r) => sum + r.lift, 0) / rules.length).toFixed(2))
        : 0;

    const avgConfidence =
      rules.length > 0
        ? Number(
            (
              (rules.reduce((sum, r) => sum + r.confidence, 0) / rules.length) *
              100
            ).toFixed(1)
          )
        : 0;

    return {
      totalTransactions: metadata.metrics.transactionsCount,
      uniqueProducts: metadata.metrics.uniqueProductsCount,
      frequentItemsets: metadata.metrics.frequentItemsetsCount,
      activeRules: rules.length,
      avgLift,
      avgConfidence,
      cleanedRows: metadata.metrics.cleanedRows,
      countriesCount: metadata.metrics.countriesCount,
      avgBasketSize: metadata.metrics.avgBasketSize,
    };
  }
}

export const analyticsService = new AnalyticsService();

