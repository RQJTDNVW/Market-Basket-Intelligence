import React from 'react';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  Command,
  ExternalLink,
} from 'lucide-react';
import { PageId } from '../../types';

interface TopbarProps {
  currentPage: PageId;
  onOpenMobile: () => void;
  onOpenSearch?: () => void;
  onNavigateToAbout?: () => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  overview: {
    title: 'Market Basket Overview',
    subtitle: 'High-level purchase graph & key retail metrics',
  },
  transactions: {
    title: 'Transaction Explorer',
    subtitle: 'Browse 520k retail rows and customer baskets',
  },
  itemsets: {
    title: 'Frequent Itemsets',
    subtitle: 'Frequent product combinations discovered by Apriori',
  },
  rules: {
    title: 'Association Rules',
    subtitle: 'Mined relationships filtered by Support, Confidence & Lift',
  },
  insights: {
    title: 'Business Insights',
    subtitle: 'Actionable merchandising & cross-selling recommendations',
  },
  visualization: {
    title: 'Analytics Visualization',
    subtitle: 'Interactive Support vs. Confidence plot & Association Graph',
  },
  pipeline: {
    title: 'Data Science Pipeline',
    subtitle: 'From raw retail transactions to association rules',
  },
  about: {
    title: 'Project Architecture & Mission',
    subtitle: 'Methodology, algorithms, and engineering motivation',
  },
};

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  onOpenMobile,
  onOpenSearch,
  onNavigateToAbout,
}) => {
  const current = PAGE_TITLES[currentPage] || {
    title: 'Market Basket Intelligence',
    subtitle: 'Retail Analytics Engine',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#05070A]/85 px-4 lg:px-8 backdrop-blur-xl">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:text-white lg:hidden transition-colors"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold tracking-tight text-[#F5F7FA]">
            {current.title}
          </h1>
          <p className="hidden sm:block text-xs text-[#8B98A7]">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Dataset Indicator + Search + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Dataset Status Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#35E0B5]/20 bg-[#35E0B5]/5 px-3 py-1 text-xs text-[#8B98A7]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B5] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35E0B5]" />
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#F5F7FA] tracking-wider uppercase">
            ONLINE RETAIL DATA
          </span>
        </div>

        {/* Global Search button / shortcut */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#8B98A7] hover:border-white/20 hover:text-white transition-all"
          title="Search anything"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Search rules & items</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-[#8B98A7]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B8CFF]" />
            </span>
          </button>
        </div>

        {/* Portfolio / Author Avatar */}
        <button
          onClick={onNavigateToAbout}
          className="flex items-center gap-2 pl-2 border-l border-white/10 hover:opacity-80 transition-opacity"
          title="About the AI / ML Engineer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#35E0B5] via-[#5B8CFF] to-[#A78BFA] text-xs font-bold text-black shadow-glow-teal">
            MBI
          </div>
          <div className="hidden xl:flex flex-col text-left text-xs leading-none">
            <span className="font-medium text-[#F5F7FA]">AI / ML Engineer</span>
            <span className="text-[10px] text-[#35E0B5]">Portfolio Edition</span>
          </div>
        </button>
      </div>
    </header>
  );
};

