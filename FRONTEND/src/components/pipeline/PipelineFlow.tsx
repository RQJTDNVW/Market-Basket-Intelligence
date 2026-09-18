import React, { useState } from 'react';
import {
  Database,
  Filter,
  Layers,
  Grid,
  Cpu,
  Boxes,
  Network,
  CheckCircle,
  Sparkles,
  ArrowDown,
  Code,
  Eye,
  Activity,
  Terminal,
} from 'lucide-react';
import clsx from 'clsx';
import { PipelineStage } from '../../types';

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'raw-data',
    number: 1,
    name: 'Raw Online Retail Data',
    shortName: 'Raw Ingestion',
    description: 'Ingest 522,064 raw transaction records with invoice numbers, product descriptions, quantities, invoice dates, unit prices, customer IDs, and country codes.',
    input: 'online_retail_500.csv (41.2 MB, semicolon-delimited, 522,064 rows)',
    output: 'DataFrame with shape (522064, 7)',
    algorithm: 'Pandas CSV Ingestion',
    codeSnippet: `df = pd.read_csv("data/online_retail_500.csv", sep=";")\nprint(f"Original dataset shape: {df.shape}")`,
    metrics: {
      'Input Records': '522,064',
      'Format': 'Semicolon delimited',
      'Initial Columns': 7,
    },
    status: 'completed',
  },
  {
    id: 'cleaning',
    number: 2,
    name: 'Data Cleaning & Normalization',
    shortName: 'Preprocessing',
    description: 'Eliminate cancelled invoices (beginning with "C"), filter out non-positive quantities and zero prices, drop missing descriptions, and normalize SKU naming.',
    input: '522,064 raw rows',
    output: '520,136 cleaned, valid transaction rows (1,928 invalid rows dropped)',
    algorithm: 'Vectorized Cleaning Pipeline',
    codeSnippet: `df = df[~df["BillNo"].astype(str).str.startswith("C")]\ndf = df[df["Quantity"] > 0]\ndf["Itemname"] = df["Itemname"].str.strip().str.upper()`,
    metrics: {
      'Valid Rows': '520,136',
      'Dropped Invalids': '1,928',
      'Data Integrity': '99.63%',
    },
    status: 'completed',
  },
  {
    id: 'grouping',
    number: 3,
    name: 'Transaction Grouping',
    shortName: 'Basket Grouping',
    description: 'Group line items by unique BillNo to construct customer transaction baskets. Multi-item purchases are aggregated into distinct market baskets.',
    input: '520,136 cleaned rows',
    output: '19,737 unique customer baskets across 30 countries',
    algorithm: 'Pandas GroupBy Aggregation',
    codeSnippet: `basket = cleaned_df.groupby(["BillNo", "Itemname"])["Quantity"] \\\n    .sum().unstack().reset_index().fillna(0)`,
    metrics: {
      'Unique Baskets': '19,737',
      'Avg Basket Size': '26.35 items',
      'Max Basket': '310 items',
    },
    status: 'completed',
  },
  {
    id: 'matrix',
    number: 4,
    name: 'Binary Basket Matrix',
    shortName: 'Binary Pivot',
    description: 'One-hot encode the transactions into a binary incidence matrix where rows represent transactions (BillNo) and columns represent unique products (1 = purchased, 0 = absent).',
    input: '19,737 grouped baskets with 4,051 distinct product SKUs',
    output: 'Sparse Binary Matrix of shape (19737, 4051)',
    algorithm: 'Binary Incidence Encoding',
    codeSnippet: `def encode_units(x):\n    return 1 if x >= 1 else 0\nbasket_matrix = basket.applymap(encode_units)`,
    metrics: {
      'Matrix Rows': '19,737',
      'Matrix Columns': '4,051',
      'Sparsity': '99.35%',
    },
    status: 'completed',
  },
  {
    id: 'apriori',
    number: 5,
    name: 'Apriori Mining Algorithm',
    shortName: 'Apriori Search',
    description: 'Apply the downward-closure (Apriori principle) algorithm to prune exponential item combinations and identify all product sets exceeding the minimum support threshold.',
    input: 'Binary Basket Matrix (19,737 × 4,051), min_support = 0.02',
    output: 'Candidate itemsets generated across k-item levels',
    algorithm: 'Apriori (mlxtend.frequent_patterns)',
    codeSnippet: `frequent_itemsets = apriori(\n    basket_matrix,\n    min_support=0.02,\n    use_colnames=True\n)`,
    metrics: {
      'Min Support': '2.0% (395 baskets)',
      'Pruning Efficiency': '99.98%',
      'Max Itemset Size': 3,
    },
    status: 'completed',
  },
  {
    id: 'frequent-itemsets',
    number: 6,
    name: 'Frequent Itemsets Discovery',
    shortName: 'Itemsets Found',
    description: 'Discovered item combinations meeting the minimum frequency threshold, categorized by 1-item anchors, 2-item pairs, and 3-item bundles.',
    input: 'Apriori candidate generation',
    output: '378 validated frequent itemsets (sorted by support descending)',
    algorithm: 'Support Frequency Sort',
    codeSnippet: `frequent_itemsets["itemset_size"] = frequent_itemsets["itemsets"].apply(len)\nfrequent_itemsets = frequent_itemsets.sort_values(by="support", ascending=False)`,
    metrics: {
      'Total Itemsets': '378',
      '1-Item Sets': '320',
      '2-Item Sets': '56',
      '3-Item Sets': '2',
    },
    status: 'completed',
  },
  {
    id: 'association-rules',
    number: 7,
    name: 'Association Rules Mining',
    shortName: 'Rule Generation',
    description: 'Generate directional rules (Antecedents → Consequents) from frequent itemsets using confidence metric with an exploratory threshold of 0.30.',
    input: '378 frequent itemsets',
    output: 'Unfiltered rule pool computed by mlxtend association_rules',
    algorithm: 'Association Rule Generation',
    codeSnippet: `rules = association_rules(\n    frequent_itemsets,\n    metric="confidence",\n    min_threshold=0.30\n)`,
    metrics: {
      'Rules Generated': '182',
      'Min Conf Threshold': '0.30',
      'Metrics Computed': 'Support, Conf, Lift',
    },
    status: 'completed',
  },
  {
    id: 'filtering',
    number: 8,
    name: 'Confidence & Lift Filtering',
    shortName: 'Quality Pruning',
    description: 'Apply strict dual-criteria filtering: Confidence ≥ 0.50 (at least 50% conversion probability) and Lift > 1.0 (positive association beyond random co-occurrence).',
    input: '182 unpruned candidate rules',
    output: '59 elite high-affinity association rules sorted by Lift descending',
    algorithm: 'Dual Threshold Filtering',
    codeSnippet: `filtered_rules = rules[\n    (rules["confidence"] >= 0.50) &\n    (rules["lift"] > 1.00)\n].sort_values(by="lift", ascending=False)`,
    metrics: {
      'Passed Filter': '59 Rules',
      'Max Lift': '18.89x',
      'Max Confidence': '90.35%',
    },
    status: 'completed',
  },
  {
    id: 'insights',
    number: 9,
    name: 'Interactive Visualization & Insights',
    shortName: 'Intelligence Delivery',
    description: 'Transform mathematical association rule outputs into interactive visual analytics, scatter bubble plots, network topology graphs, and merchandising playbooks.',
    input: '59 elite rules + 19,737 transaction baskets',
    output: 'Interactive UI, Business Insights, Bundle Recommendations',
    algorithm: 'Market Basket Intelligence UI',
    codeSnippet: `render_interactive_dashboard(\n    rules=filtered_rules,\n    itemsets=frequent_itemsets,\n    transactions=cleaned_df\n)`,
    metrics: {
      'Max Lift Affinity': '18.89x',
      'Visualized Views': 8,
      'Latency': '< 16ms (60fps)',
    },
    status: 'active',
  },
];

interface PipelineFlowProps {
  onSelectStage: (stage: PipelineStage) => void;
}

export const PipelineFlow: React.FC<PipelineFlowProps> = ({ onSelectStage }) => {
  const [activeStageId, setActiveStageId] = useState<string>('raw-data');

  const stageIcons = [
    Database,
    Filter,
    Layers,
    Grid,
    Cpu,
    Boxes,
    Network,
    CheckCircle,
    Sparkles,
  ];

  return (
    <div className="relative w-full py-4 space-y-6">
      {/* Animated Data Stream Line (SVG background) */}
      <div className="relative">
        {/* Stages Vertical Cards */}
        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stageIcons[idx] || Activity;
            const isSelected = activeStageId === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => {
                    setActiveStageId(stage.id);
                    onSelectStage(stage);
                  }}
                  onMouseEnter={() => setActiveStageId(stage.id)}
                  className={clsx(
                    'group relative rounded-2xl border p-5 backdrop-blur-md cursor-pointer transition-all duration-300 ease-out',
                    isSelected
                      ? 'border-[#35E0B5]/50 bg-[#0D141B] shadow-[0_0_30px_-5px_rgba(53,224,181,0.2)] -translate-y-0.5'
                      : 'border-white/10 bg-[#0D141B]/70 hover:border-white/20 hover:bg-[#0D141B]'
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Stage number + Icon + Title */}
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Step index badge */}
                      <div
                        className={clsx(
                          'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-base font-mono font-bold transition-transform duration-300 group-hover:scale-105',
                          isSelected
                            ? 'border-[#35E0B5]/40 bg-[#35E0B5]/15 text-[#35E0B5] shadow-glow-teal'
                            : 'border-white/10 bg-white/5 text-[#8B98A7]'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-[#35E0B5] uppercase tracking-wider font-bold">
                            Stage 0{stage.number} • {stage.algorithm}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#F5F7FA]">
                          {stage.name}
                        </h3>
                        <p className="text-xs text-[#8B98A7] mt-0.5 max-w-2xl">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Metrics Badges & Action */}
                    <div className="flex items-center gap-3 self-end lg:self-center">
                      <div className="hidden sm:flex items-center gap-2">
                        {Object.entries(stage.metrics).slice(0, 2).map(([k, v]) => (
                          <div
                            key={k}
                            className="rounded-lg border border-white/5 bg-[#111A22] px-3 py-1.5 text-right font-mono"
                          >
                            <span className="text-[9px] uppercase tracking-wider text-[#8B98A7] block leading-none mb-1">
                              {k}
                            </span>
                            <span className="text-xs font-bold text-[#F5F7FA]">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStage(stage);
                        }}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-3 text-xs font-semibold text-[#35E0B5] hover:bg-[#35E0B5]/20 transition-all"
                      >
                        <Code className="h-3.5 w-3.5" />
                        <span>Inspect Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Input / Output preview pills */}
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#8B98A7] truncate">
                      <span className="text-[10px] uppercase font-bold text-[#5B8CFF]">
                        Input:
                      </span>
                      <span className="text-[#F5F7FA] truncate">{stage.input}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8B98A7] truncate">
                      <span className="text-[10px] uppercase font-bold text-[#35E0B5]">
                        Output:
                      </span>
                      <span className="text-[#F5F7FA] truncate">{stage.output}</span>
                    </div>
                  </div>
                </div>

                {/* Animated connector arrow between stages */}
                {idx < PIPELINE_STAGES.length - 1 && (
                  <div className="flex items-center justify-center my-1 text-[#35E0B5]">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-[1.5px] bg-gradient-to-b from-[#35E0B5]/40 to-[#35E0B5]" />
                      <div className="h-5 w-5 rounded-full border border-[#35E0B5]/30 bg-[#0A0F14] flex items-center justify-center text-[#35E0B5] shadow-glow-teal">
                        <ArrowDown className="h-3 w-3 animate-pulse" />
                      </div>
                      <div className="h-3 w-[1.5px] bg-gradient-to-b from-[#35E0B5] to-[#35E0B5]/40" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
