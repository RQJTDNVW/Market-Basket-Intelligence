import React, { useEffect } from 'react';
import {
  X,
  ShoppingBag,
  MapPin,
  Calendar,
  User,
  Zap,
  Tag,
  DollarSign,
  PackageCheck,
  Receipt,
} from 'lucide-react';
import clsx from 'clsx';
import { TransactionGroup } from '../../types';

interface TransactionDrawerProps {
  group: TransactionGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRule?: (ruleId: string) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  group,
  isOpen,
  onClose,
  onSelectRule,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!group) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#0A0F14]/98 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5B8CFF]/30 bg-[#5B8CFF]/10 text-[#5B8CFF]">
              <Receipt className="h-5 w-5" />
            </span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B8CFF] font-semibold">
                Customer Basket Detail
              </span>
              <h2 className="text-lg font-bold text-[#F5F7FA] font-mono">
                Invoice #{group.billNo}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-lg border border-white/5 bg-[#0D141B] p-3 text-xs">
              <span className="text-[10px] font-mono text-[#8B98A7] block mb-1">
                Customer ID
              </span>
              <span className="font-mono font-medium text-[#F5F7FA] flex items-center gap-1">
                <User className="h-3 w-3 text-[#5B8CFF]" />
                {group.customerId || 'Guest'}
              </span>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#0D141B] p-3 text-xs">
              <span className="text-[10px] font-mono text-[#8B98A7] block mb-1">
                Country
              </span>
              <span className="font-medium text-[#F5F7FA] flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 text-[#35E0B5]" />
                {group.country}
              </span>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#0D141B] p-3 text-xs">
              <span className="text-[10px] font-mono text-[#8B98A7] block mb-1">
                Date & Time
              </span>
              <span className="font-mono text-[11px] text-[#F5F7FA] flex items-center gap-1 truncate">
                <Calendar className="h-3 w-3 text-[#A78BFA]" />
                {group.date}
              </span>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#0D141B] p-3 text-xs">
              <span className="text-[10px] font-mono text-[#8B98A7] block mb-1">
                Total Basket Value
              </span>
              <span className="font-mono font-bold text-[#35E0B5] flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-[#35E0B5]" />
                £{group.totalSpend.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Matched Association Rules (if any) */}
          {group.matchedRules && group.matchedRules.length > 0 && (
            <div className="rounded-xl border border-[#35E0B5]/30 bg-[#35E0B5]/5 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#35E0B5]">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  Mined Association Rule Matched!
                </span>
                <span className="rounded-full bg-[#35E0B5]/20 px-2 py-0.5 text-[10px]">
                  {group.matchedRules.length} Rule Triggered
                </span>
              </div>
              <p className="text-xs text-[#8B98A7]">
                This customer basket satisfies the following predictive association pattern:
              </p>
              {group.matchedRules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => onSelectRule && onSelectRule(rule.id)}
                  className="rounded-lg border border-white/10 bg-[#0D141B] p-3 text-xs cursor-pointer hover:border-[#35E0B5]/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[10px] text-[#35E0B5] font-bold">
                      {rule.id} • {rule.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#F5C451] font-bold">
                      {rule.lift}x Lift
                    </span>
                  </div>
                  <div className="font-medium text-[#F5F7FA]">
                    {rule.rule}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Visual Basket Representation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B98A7] flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#35E0B5]" />
                Visual Basket ({group.itemCount} distinct products • {group.totalQuantity} units)
              </h3>
              <span className="text-xs font-mono text-[#8B98A7]">
                Unit Price & Subtotal
              </span>
            </div>

            {/* Product Chips Grid */}
            <div className="space-y-2">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0D141B] p-3.5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-[#8B98A7]">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F5F7FA] truncate">
                        {item.itemname}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8B98A7] font-mono">
                        <span>£{item.price.toFixed(2)} each</span>
                        <span>•</span>
                        <span className="text-[#35E0B5] font-semibold">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-xs font-bold text-[#F5F7FA]">
                      £{item.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-[#0D141B]/80 flex items-center justify-between text-xs font-mono">
          <span className="text-[#8B98A7]">
            Invoice: <strong className="text-white">{group.billNo}</strong>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-semibold text-[#8B98A7] hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

