export type PageId =
  | 'overview'
  | 'transactions'
  | 'itemsets'
  | 'rules'
  | 'insights'
  | 'visualization'
  | 'pipeline'
  | 'about';

export interface AssociationRule {
  id: string;
  rule: string;
  antecedents: string[];
  consequents: string[];
  support: number;
  supportPercentage: number;
  confidence: number;
  confidencePercentage: number;
  lift: number;
  transactionCount: number;
  itemCount: number;
  category: string;
  significance: 'High' | 'Moderate' | 'Standard';
  businessAction: string;
}

export interface FrequentItemset {
  id: string;
  items: string[];
  itemsetString: string;
  support: number;
  supportPercentage: number;
  transactionCount: number;
  size: number;
}

export interface TransactionRow {
  id: string;
  billNo: string;
  itemname: string;
  quantity: number;
  date: string;
  price: number;
  customerId: string;
  country: string;
}

export interface TransactionGroup {
  billNo: string;
  customerId: string;
  country: string;
  date: string;
  totalQuantity: number;
  totalSpend: number;
  itemCount: number;
  items: {
    itemname: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  matchedRules?: AssociationRule[];
}

export interface DatasetMetadata {
  projectName: string;
  subtitle: string;
  datasetName: string;
  algorithm: string;
  frameworks: string[];
  metrics: {
    originalRows: number;
    cleanedRows: number;
    transactionsCount: number;
    uniqueProductsCount: number;
    uniqueCustomersCount: number;
    countriesCount: number;
    avgBasketSize: number;
    maxBasketSize: number;
    minBasketSize: number;
    frequentItemsetsCount: number;
    generatedRulesCount: number;
    finalRulesCount: number;
    minSupportThreshold: number;
    minConfidenceThreshold: number;
    minLiftThreshold: number;
    dateRange: {
      from: string;
      to: string;
    };
  };
  countries: string[];
  systemStatus: {
    status: string;
    health: string;
    lastAnalysis: string;
    dataLatency: string;
  };
}

export interface InsightMetric {
  title: string;
  rule?: string;
  product?: string;
  value: string;
  metricName: string;
  explanation: string;
  whyItMatters: string;
  recommendation: string;
  confidence?: string;
  support?: string;
  lift?: string;
  ruleId?: string;
}

export interface CategoryInsight {
  name: string;
  ruleCount: number;
  avgLift: number;
  highlight: string;
}

export interface InsightsData {
  keyMetrics: {
    highestLift: InsightMetric;
    highestConfidence: InsightMetric;
    highestSupport: InsightMetric;
    mostFrequentProduct: InsightMetric;
    mostConnectedProduct: InsightMetric;
  };
  topCategories: CategoryInsight[];
}

export interface PipelineStage {
  id: string;
  number: number;
  name: string;
  shortName: string;
  description: string;
  input: string;
  output: string;
  codeSnippet: string;
  algorithm: string;
  metrics: Record<string, string | number>;
  status: 'completed' | 'active' | 'pending';
}

