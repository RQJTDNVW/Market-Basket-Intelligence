import { AssociationRule } from '../types';

export interface RuleFilters {
  minConfidence: number;
  minLift: number;
  minSupport: number;
  search: string;
  category: string;
  itemCount: 'all' | '2' | '3+';
  sortBy: 'lift' | 'confidence' | 'support' | 'transactions';
  sortDirection: 'asc' | 'desc';
}

export interface NetworkNode {
  id: string;
  name: string;
  group: string;
  degree: number;
  support: number;
  radius: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  lift: number;
  confidence: number;
  support: number;
  ruleId: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export class RulesService {
  public filterRules(rules: AssociationRule[], filters: RuleFilters): AssociationRule[] {
    return rules
      .filter((r) => {
        if (r.confidence < filters.minConfidence) return false;
        if (r.lift < filters.minLift) return false;
        if (r.support < filters.minSupport) return false;

        if (filters.category !== 'all' && r.category !== filters.category) {
          return false;
        }

        if (filters.itemCount === '2' && r.itemCount !== 2) {
          return false;
        }
        if (filters.itemCount === '3+' && r.itemCount < 3) {
          return false;
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matches =
            r.rule.toLowerCase().includes(q) ||
            r.antecedents.some((a) => a.toLowerCase().includes(q)) ||
            r.consequents.some((c) => c.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        switch (filters.sortBy) {
          case 'confidence':
            valA = a.confidence;
            valB = b.confidence;
            break;
          case 'support':
            valA = a.support;
            valB = b.support;
            break;
          case 'transactions':
            valA = a.transactionCount;
            valB = b.transactionCount;
            break;
          case 'lift':
          default:
            valA = a.lift;
            valB = b.lift;
            break;
        }

        return filters.sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }

  public getCategories(rules: AssociationRule[]): string[] {
    const cats = new Set<string>();
    rules.forEach((r) => cats.add(r.category));
    return Array.from(cats);
  }

  public generateNetworkData(rules: AssociationRule[], maxNodes = 40): NetworkData {
    const nodeDegrees = new Map<string, { degree: number; category: string; maxLift: number }>();
    const links: NetworkLink[] = [];

    // Collect edges and degree
    for (const rule of rules) {
      for (const ante of rule.antecedents) {
        for (const cons of rule.consequents) {
          links.push({
            source: ante,
            target: cons,
            lift: rule.lift,
            confidence: rule.confidence,
            support: rule.support,
            ruleId: rule.id,
          });

          const currentA = nodeDegrees.get(ante) || { degree: 0, category: rule.category, maxLift: 0 };
          currentA.degree += 1;
          currentA.maxLift = Math.max(currentA.maxLift, rule.lift);
          nodeDegrees.set(ante, currentA);

          const currentC = nodeDegrees.get(cons) || { degree: 0, category: rule.category, maxLift: 0 };
          currentC.degree += 1;
          currentC.maxLift = Math.max(currentC.maxLift, rule.lift);
          nodeDegrees.set(cons, currentC);
        }
      }
    }

    // Sort nodes by degree and cap if needed
    const sortedNodes = Array.from(nodeDegrees.entries())
      .sort((a, b) => b[1].degree - a[1].degree)
      .slice(0, maxNodes);

    const validNodeNames = new Set(sortedNodes.map((n) => n[0]));

    const nodes: NetworkNode[] = sortedNodes.map(([name, info]) => ({
      id: name,
      name,
      group: info.category,
      degree: info.degree,
      support: 0.03, // approximate average
      radius: Math.max(6, Math.min(22, 6 + info.degree * 2.2)),
    }));

    // Keep only links between valid nodes
    const validLinks = links.filter(
      (l) => validNodeNames.has(l.source) && validNodeNames.has(l.target)
    );

    return {
      nodes,
      links: validLinks,
    };
  }
}

export const rulesService = new RulesService();

