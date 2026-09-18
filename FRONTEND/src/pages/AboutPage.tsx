import React from 'react';
import {
  Info,
  Terminal,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  FileText,
  ExternalLink,
  Code2,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import { DatasetMetadata } from '../types';

interface AboutPageProps {
  metadata: DatasetMetadata;
}

export const AboutPage: React.FC<AboutPageProps> = ({ metadata }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-3 py-1 text-xs font-mono text-[#35E0B5] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Project Mission & Technical Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
          Market Basket Intelligence
        </h1>
        <p className="text-sm sm:text-base text-[#8B98A7] mt-2 leading-relaxed">
          An enterprise-grade, portfolio-defining retail intelligence product engineered to discover
          latent purchasing relationships from raw transaction logs using association rule mining.
        </p>
      </div>

      {/* Portfolio Showcase: "Why I Built This" */}
      <section className="rounded-2xl border border-[#35E0B5]/30 bg-gradient-to-br from-[#0D141B] via-[#0A0F14] to-[#111A22] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#35E0B5]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#35E0B5] font-bold">
            Author Narrative & Design Philosophy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA]">
            Why I Built Market Basket Intelligence
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#8B98A7] leading-relaxed font-sans">
            <p>
              In modern e-commerce and retail analytics, raw transaction logs are often treated as
              passive historical records rather than rich predictive graphs. Every customer basket
              contains latent intent—subtle micro-decisions where certain items systematically pull
              other products into the transaction.
            </p>
            <p>
              I built <strong className="text-white">Market Basket Intelligence</strong> to demonstrate
              how rigorous unsupervised machine learning (Apriori and association rule mining) can bridge
              the gap between algorithmic data processing and executive merchandising strategy.
            </p>
            <p>
              Rather than presenting static Matplotlib charts or a generic dashboard template, this
              system was designed from the ground up as a production-grade data product. It empowers
              growth teams, category managers, and retail analysts to interactively drill down from
              520,000 raw purchase lines to mathematically backed bundling recommendations with
              instantaneous sub-millisecond responsiveness.
            </p>
          </div>
        </div>
      </section>

      {/* Core Methodology & Mathematics */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#5B8CFF]" />
          Methodology & Association Rule Mathematics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#35E0B5]">
                1. Support
              </span>
              <span className="text-[10px] font-mono text-[#8B98A7]">
                P(A ∩ B)
              </span>
            </div>
            <p className="text-xs text-[#8B98A7] leading-relaxed">
              The proportion of all transactions in the dataset that contain both itemsets A and B.
              Sets the baseline threshold to eliminate rare statistical flukes.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[11px] text-[#35E0B5]">
              Support(A ➔ B) = Count(A ∪ B) / Total_Baskets
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#5B8CFF]">
                2. Confidence
              </span>
              <span className="text-[10px] font-mono text-[#8B98A7]">
                P(B | A)
              </span>
            </div>
            <p className="text-xs text-[#8B98A7] leading-relaxed">
              The conditional probability that item B is purchased given that item A is in the basket.
              Measures the reliability of the predictive rule.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[11px] text-[#5B8CFF]">
              Confidence(A ➔ B) = Support(A ➔ B) / Support(A)
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#A78BFA]">
                3. Lift
              </span>
              <span className="text-[10px] font-mono text-[#8B98A7]">
                P(B|A) / P(B)
              </span>
            </div>
            <p className="text-xs text-[#8B98A7] leading-relaxed">
              The ratio of observed joint probability to the expected probability if A and B were
              independent. Lift &gt; 1 indicates genuine positive affinity.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[11px] text-[#A78BFA]">
              Lift(A ➔ B) = Confidence(A ➔ B) / Support(B)
            </div>
          </div>
        </div>
      </section>

      {/* Data Processing & Filtration Criteria */}
      <section className="rounded-2xl border border-white/10 bg-[#0D141B]/90 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
          <Database className="h-4 w-4 text-[#F5C451]" />
          Data Processing Audit Trail & Filtration Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase text-[#35E0B5]">
              Preprocessing Rules Applied:
            </h3>
            <ul className="space-y-2 text-[#8B98A7]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#35E0B5] flex-shrink-0 mt-0.5" />
                <span><strong>Invoice Clean:</strong> Cancelled invoices (starting with 'C') removed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#35E0B5] flex-shrink-0 mt-0.5" />
                <span><strong>Quantity Validation:</strong> Only rows where Quantity &gt; 0 and Price &gt; 0 retained.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#35E0B5] flex-shrink-0 mt-0.5" />
                <span><strong>SKU Normalization:</strong> Item descriptions stripped of excess whitespace and uppercase-normalized.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#35E0B5] flex-shrink-0 mt-0.5" />
                <span><strong>Binary Pivot:</strong> Multi-line purchases encoded into a 19,737 × 4,051 binary sparse matrix.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase text-[#5B8CFF]">
              Rule Mining & Quality Thresholds:
            </h3>
            <ul className="space-y-2 text-[#8B98A7]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5B8CFF] flex-shrink-0 mt-0.5" />
                <span><strong>Minimum Support:</strong> 0.02 (itemset must appear in at least 2% / 395 of all baskets).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5B8CFF] flex-shrink-0 mt-0.5" />
                <span><strong>Minimum Confidence:</strong> ≥ 0.50 (at least 50% conditional conversion probability).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5B8CFF] flex-shrink-0 mt-0.5" />
                <span><strong>Minimum Lift:</strong> &gt; 1.00 (eliminates spurious independent co-occurrences).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5B8CFF] flex-shrink-0 mt-0.5" />
                <span><strong>Final Yield:</strong> 59 elite rules mined, with top lift reaching 18.89x.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Stack Badges */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#F5F7FA]">
          Engineered With Modern Technology
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Python 3.12',
            'Pandas',
            'mlxtend',
            'Matplotlib',
            'React 18',
            'TypeScript',
            'Vite',
            'Tailwind CSS',
            'D3.js',
            'Canvas Graphics',
            'Lucide Icons',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-[#111A22] px-3 py-1.5 text-xs font-mono text-[#F5F7FA] shadow-sm hover:border-[#35E0B5]/40 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
