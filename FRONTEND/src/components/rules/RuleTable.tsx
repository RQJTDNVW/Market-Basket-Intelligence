import React from 'react';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';
import { AssociationRule } from '../../types';

interface RuleTableProps {
  rules: AssociationRule[];
  onSelectRule: (rule: AssociationRule) => void;
}

export const RuleTable: React.FC<RuleTableProps> = ({ rules, onSelectRule }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D141B]/90 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#111A22]/80 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8B98A7]">
              <th className="py-3.5 px-4">Rule ID</th>
              <th className="py-3.5 px-4">Antecedent (If Bought)</th>
              <th className="py-3.5 px-2 text-center">→</th>
              <th className="py-3.5 px-4">Consequent (Also Bought)</th>
              <th className="py-3.5 px-4 text-right">Support</th>
              <th className="py-3.5 px-4 text-right">Confidence</th>
              <th className="py-3.5 px-4 text-right">Lift</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-sans">
            {rules.map((rule) => (
              <tr
                key={rule.id}
                onClick={() => onSelectRule(rule)}
                className="group cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <td className="py-3.5 px-4 font-mono text-[#8B98A7]">
                  <span className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[11px]">
                    {rule.id}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#F5F7FA] max-w-[260px] truncate">
                  <div className="flex flex-wrap gap-1">
                    {rule.antecedents.map((a, i) => (
                      <span key={i} className="rounded bg-[#111A22] border border-white/10 px-2 py-0.5 text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-2 text-center text-[#35E0B5]">
                  <ArrowRight className="h-3.5 w-3.5 mx-auto group-hover:translate-x-1 transition-transform" />
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#35E0B5] max-w-[260px] truncate">
                  <div className="flex flex-wrap gap-1">
                    {rule.consequents.map((c, i) => (
                      <span key={i} className="rounded bg-[#35E0B5]/10 border border-[#35E0B5]/30 px-2 py-0.5 text-[11px] text-[#35E0B5]">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#8B98A7]">
                  <span className="text-[#F5F7FA] font-medium">{rule.supportPercentage}%</span>
                  <div className="text-[10px] text-[#5A6675]">
                    {rule.transactionCount.toLocaleString()} tx
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  <span className="font-semibold text-[#F5F7FA]">
                    {rule.confidencePercentage}%
                  </span>
                  <div className="w-16 ml-auto h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#35E0B5] rounded-full"
                      style={{ width: `${rule.confidencePercentage}%` }}
                    />
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border',
                      rule.lift >= 15
                        ? 'bg-[#35E0B5]/15 text-[#35E0B5] border-[#35E0B5]/40'
                        : rule.lift >= 10
                        ? 'bg-[#5B8CFF]/15 text-[#5B8CFF] border-[#5B8CFF]/40'
                        : 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/40'
                    )}
                  >
                    <Zap className="h-3 w-3" />
                    {rule.lift}x
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] group-hover:border-[#35E0B5]/40 group-hover:text-[#35E0B5] transition-colors ml-auto">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

