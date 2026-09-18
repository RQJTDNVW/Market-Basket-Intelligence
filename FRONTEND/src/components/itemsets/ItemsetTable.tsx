import React from 'react';
import { Boxes } from 'lucide-react';
import clsx from 'clsx';
import { FrequentItemset } from '../../types';

interface ItemsetTableProps {
  itemsets: FrequentItemset[];
  maxSupport?: number;
}

export const ItemsetTable: React.FC<ItemsetTableProps> = ({
  itemsets,
  maxSupport = 0.12,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D141B]/90 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#111A22]/80 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8B98A7]">
              <th className="py-3.5 px-4">Itemset ID</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">Product Combination</th>
              <th className="py-3.5 px-4 text-right">Support</th>
              <th className="py-3.5 px-4 text-right">Transactions</th>
              <th className="py-3.5 px-4">Frequency Bar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-sans">
            {itemsets.map((itemset) => (
              <tr
                key={itemset.id}
                className="group hover:bg-white/[0.04] transition-colors"
              >
                <td className="py-3 px-4 font-mono text-[#8B98A7]">
                  <span className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[11px]">
                    {itemset.id}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold',
                      itemset.size === 1
                        ? 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/30'
                        : itemset.size === 2
                        ? 'bg-[#35E0B5]/10 text-[#35E0B5] border-[#35E0B5]/30'
                        : 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30'
                    )}
                  >
                    <Boxes className="h-2.5 w-2.5" />
                    {itemset.size}-item
                  </span>
                </td>

                <td className="py-3 px-4 font-medium text-[#F5F7FA]">
                  <div className="flex flex-wrap items-center gap-1.5 max-w-xl">
                    {itemset.items.map((it, i) => (
                      <React.Fragment key={i}>
                        <span className="rounded bg-[#111A22] border border-white/10 px-2 py-0.5 text-[11px]">
                          {it}
                        </span>
                        {i < itemset.items.length - 1 && (
                          <span className="text-[#35E0B5] font-bold">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </td>

                <td className="py-3 px-4 text-right font-mono font-bold text-[#F5F7FA]">
                  {itemset.supportPercentage}%
                </td>

                <td className="py-3 px-4 text-right font-mono text-[#8B98A7]">
                  {itemset.transactionCount.toLocaleString()} tx
                </td>

                <td className="py-3 px-4 w-40">
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-[#35E0B5]/60 to-[#35E0B5] h-full rounded-full"
                      style={{
                        width: `${Math.min((itemset.support / maxSupport) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

