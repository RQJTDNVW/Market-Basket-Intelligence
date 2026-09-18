import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Boxes,
  Network,
  Sparkles,
  ScatterChart,
  GitMerge,
  Info,
  ChevronLeft,
  ChevronRight,
  Activity,
  Database,
  Cpu,
} from 'lucide-react';
import clsx from 'clsx';
import { PageId } from '../../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText, badge: '520k' },
  { id: 'itemsets', label: 'Frequent Itemsets', icon: Boxes, badge: '378' },
  { id: 'rules', label: 'Association Rules', icon: Network, badge: '59' },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'visualization', label: 'Visualization', icon: ScatterChart },
  { id: 'pipeline', label: 'Pipeline', icon: GitMerge },
  { id: 'about', label: 'About', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-white/10 bg-[#0A0F14]/95 backdrop-blur-xl transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top: Branding Header */}
        <div>
          <div className="flex h-20 items-center justify-between px-5 border-b border-white/5">
            <div
              onClick={() => {
                onSelectPage('overview');
                onCloseMobile();
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Abstract network icon */}
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#35E0B5]/30 bg-[#35E0B5]/10 text-[#35E0B5] shadow-glow-teal group-hover:scale-105 transition-all">
                <Network className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B5] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#35E0B5]" />
                </span>
              </div>

              {!isCollapsed && (
                <div className="flex flex-col leading-none">
                  <span className="font-mono text-[10px] font-semibold tracking-widest text-[#35E0B5] uppercase">
                    Market
                  </span>
                  <span className="text-sm font-bold tracking-tight text-[#F5F7FA]">
                    Basket
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-[#8B98A7] uppercase">
                    Intelligence
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white transition-all"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav items list */}
          <nav className="p-3 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={clsx(
                    'group relative flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-[#35E0B5]/15 to-transparent text-[#35E0B5] border border-[#35E0B5]/30 shadow-[0_0_15px_-3px_rgba(53,224,181,0.15)]'
                      : 'text-[#8B98A7] hover:bg-white/5 hover:text-[#F5F7FA] border border-transparent'
                  )}
                >
                  <Icon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                      isActive ? 'text-[#35E0B5]' : 'text-[#8B98A7] group-hover:text-white',
                      !isCollapsed && 'mr-3'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-[10px] font-mono transition-colors',
                        isActive
                          ? 'bg-[#35E0B5]/20 text-[#35E0B5]'
                          : 'bg-white/5 text-[#5A6675] group-hover:text-[#8B98A7]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#35E0B5]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: System Status & Model info */}
        <div className="p-4 border-t border-white/5">
          {!isCollapsed ? (
            <div className="space-y-3">
              {/* System status pill */}
              <div className="rounded-xl border border-white/5 bg-[#0D141B]/80 p-3 text-xs backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B5] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35E0B5]" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#35E0B5]">
                    Analysis Engine Ready
                  </span>
                </div>

                <div className="space-y-1 text-[10px] font-mono text-[#8B98A7]">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" /> Dataset
                    </span>
                    <span className="text-[#F5F7FA]">Online Retail</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Model
                    </span>
                    <span className="text-[#F5F7FA]">Apriori + Rules</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Run</span>
                    <span className="text-[#35E0B5]">RUN #104</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2" title="Analysis Engine Ready">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B5] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#35E0B5]" />
              </span>
              <Activity className="h-4 w-4 text-[#35E0B5]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

