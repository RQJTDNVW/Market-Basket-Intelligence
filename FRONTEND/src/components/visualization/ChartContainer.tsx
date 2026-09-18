import React, { useState } from 'react';
import { Maximize2, Minimize2, Download, Filter, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  filterControls?: React.ReactNode;
  onExport?: () => void;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  badge,
  children,
  filterControls,
  onExport,
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-2xl border border-white/10 bg-[#0D141B]/95 backdrop-blur-md transition-all duration-300',
        isFullscreen
          ? 'fixed inset-4 z-50 p-6 shadow-2xl bg-[#0A0F14]/98'
          : 'p-6 shadow-lg',
        className
      )}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-[#F5F7FA] tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="rounded-full border border-[#35E0B5]/30 bg-[#35E0B5]/10 px-2 py-0.5 text-[10px] font-mono text-[#35E0B5]">
                {badge}
              </span>
            )}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-[#8B98A7] hover:text-white transition-colors"
              title="Chart help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[#8B98A7] max-w-2xl font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action buttons: Export & Fullscreen */}
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#8B98A7] hover:border-white/20 hover:text-white transition-all"
              title="Export Chart"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:border-white/20 hover:text-white transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Optional Filter Controls Bar */}
      {filterControls && (
        <div className="mb-4 rounded-xl border border-white/5 bg-[#111A22]/80 p-3">
          {filterControls}
        </div>
      )}

      {/* Help disclosure banner */}
      {showHelp && (
        <div className="mb-4 rounded-xl border border-[#5B8CFF]/30 bg-[#5B8CFF]/10 p-3.5 text-xs text-[#F5F7FA] font-sans">
          <strong className="block text-[#5B8CFF] font-semibold mb-1">
            Understanding this visualization:
          </strong>
          Points represent discovered association rules. Hover over any bubble to inspect antecedents, consequents, support %, confidence %, and lift multipliers. Click any bubble to open the full diagnostic drawer.
        </div>
      )}

      {/* Chart Canvas / SVG Container */}
      <div className="relative flex-1 w-full min-h-[380px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

