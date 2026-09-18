import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Cpu, Database } from 'lucide-react';
import { PipelineStage } from '../../types';

interface StageDetailModalProps {
  stage: PipelineStage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stage,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !stage) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(stage.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0A0F14] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#35E0B5]/30 bg-[#35E0B5]/10 text-[#35E0B5] font-mono font-bold text-sm">
              0{stage.number}
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#35E0B5] font-semibold">
                Pipeline Stage Architecture
              </span>
              <h3 className="text-base font-bold text-[#F5F7FA]">
                {stage.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs font-sans">
          <p className="text-[#8B98A7] leading-relaxed">
            {stage.description}
          </p>

          {/* Input / Output Box */}
          <div className="rounded-xl border border-white/10 bg-[#0D141B] p-4 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-start gap-2">
              <span className="text-[#5B8CFF] font-bold uppercase min-w-[60px]">
                Input:
              </span>
              <span className="text-[#F5F7FA]">{stage.input}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#35E0B5] font-bold uppercase min-w-[60px]">
                Output:
              </span>
              <span className="text-[#F5F7FA]">{stage.output}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(stage.metrics).map(([key, val]) => (
              <div
                key={key}
                className="rounded-lg border border-white/5 bg-[#111A22] p-3 text-center"
              >
                <span className="text-[9px] font-mono text-[#8B98A7] uppercase block mb-1">
                  {key}
                </span>
                <span className="text-xs font-mono font-bold text-[#F5F7FA]">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Python Code Snippet */}
          <div className="relative rounded-xl border border-white/10 bg-[#05070A] p-4 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[#8B98A7]">
              <span className="flex items-center gap-1.5 text-[10px] text-[#35E0B5]">
                <Terminal className="h-3 w-3" /> Python Engine Implementation
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#8B98A7] hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-[#35E0B5]" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="overflow-x-auto text-[#35E0B5] leading-relaxed">
              <code>{stage.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#8B98A7] hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
