import React, { useState } from 'react';
import clsx from 'clsx';
import { PageId } from '../../types';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NetworkBackground } from './NetworkBackground';

interface AppShellProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  children: React.ReactNode;
  onOpenSearch?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onSelectPage,
  children,
  onOpenSearch,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen bg-[#05070A] text-[#F5F7FA] overflow-x-hidden">
      {/* Interactive Network / Particle Canvas Background */}
      <NetworkBackground />

      {/* Fixed Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={onSelectPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={clsx(
          'relative z-10 flex min-h-screen flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Topbar */}
        <Topbar
          currentPage={currentPage}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenSearch={onOpenSearch}
          onNavigateToAbout={() => onSelectPage('about')}
        />

        {/* Page Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Subtle Footer */}
        <footer className="border-t border-white/5 py-4 px-4 lg:px-8 text-center text-xs text-[#5A6675] font-mono">
          <span>MARKET BASKET INTELLIGENCE</span>
          <span className="mx-2">•</span>
          <span>Apriori Association Rule Mining Engine</span>
          <span className="mx-2">•</span>
          <span className="text-[#35E0B5]">Online Retail Analytics</span>
        </footer>
      </div>
    </div>
  );
};

