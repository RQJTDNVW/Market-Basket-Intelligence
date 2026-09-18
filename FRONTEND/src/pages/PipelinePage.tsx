import React, { useState } from 'react';
import {
  GitMerge,
  Terminal,
  Activity,
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PipelineStage } from '../types';
import { PipelineFlow } from '../components/pipeline/PipelineFlow';
import { StageDetailModal } from '../components/pipeline/StageDetailModal';

export const PipelinePage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F7FA]">
              Data Science Pipeline Architecture
            </h2>
            <span className="rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-2.5 py-0.5 text-xs font-mono text-[#35E0B5]">
              9 Stages Complete
            </span>
          </div>
          <p className="text-xs text-[#8B98A7] mt-0.5">
            Step-by-step transformation: Raw CSV → Vectorized Cleaning → Sparse Pivot → Apriori → Association Rules
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#35E0B5]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B5] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35E0B5]" />
          </span>
          <span>Pipeline Status: 100% Executed & Cached</span>
        </div>
      </div>

      {/* Pipeline Intro Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0D141B]/80 p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#35E0B5] font-semibold">
            Execution Flow
          </span>
          <p className="text-xs text-[#8B98A7]">
            Hover over any stage to highlight its input and output schema, or click{' '}
            <strong className="text-white">"Inspect Code"</strong> to review the exact Python logic extracted from{' '}
            <code className="text-[#35E0B5] bg-white/5 px-1 py-0.5 rounded">preprocessing.py</code> and{' '}
            <code className="text-[#35E0B5] bg-white/5 px-1 py-0.5 rounded">market_basket.py</code>.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#8B98A7] flex-shrink-0">
          <div>
            <span className="text-[9px] block uppercase text-[#5A6675]">Initial Input</span>
            <span className="font-bold text-white">522,064 rows</span>
          </div>
          <span className="text-white/20">➔</span>
          <div>
            <span className="text-[9px] block uppercase text-[#5A6675]">Final Rules</span>
            <span className="font-bold text-[#35E0B5]">59 Rules</span>
          </div>
        </div>
      </div>

      {/* Main Pipeline Flow List */}
      <PipelineFlow onSelectStage={(stage) => setSelectedStage(stage)} />

      {/* Stage Detail Code Modal */}
      <StageDetailModal
        stage={selectedStage}
        isOpen={Boolean(selectedStage)}
        onClose={() => setSelectedStage(null)}
      />
    </div>
  );
};
