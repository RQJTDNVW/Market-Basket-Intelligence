import React, { useState, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Zap } from 'lucide-react';
import { AssociationRule } from '../../types';

interface SupportConfidenceChartProps {
  rules: AssociationRule[];
  onSelectRule: (rule: AssociationRule) => void;
  width?: number;
  height?: number;
}

export const SupportConfidenceChart: React.FC<SupportConfidenceChartProps> = ({
  rules,
  onSelectRule,
  height = 460,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredRule, setHoveredRule] = useState<AssociationRule | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const margin = { top: 30, right: 40, bottom: 50, left: 60 };

  // Calculate scales
  const { minSupp, maxSupp, minConf, maxConf, minLift, maxLift } = useMemo(() => {
    if (rules.length === 0) {
      return { minSupp: 0.02, maxSupp: 0.05, minConf: 0.5, maxConf: 1.0, minLift: 1, maxLift: 20 };
    }
    const supps = rules.map((r) => r.support);
    const confs = rules.map((r) => r.confidence);
    const lifts = rules.map((r) => r.lift);

    return {
      minSupp: Math.max(0.015, Math.min(...supps) * 0.9),
      maxSupp: Math.max(...supps) * 1.08,
      minConf: Math.max(0.4, Math.min(...confs) * 0.95),
      maxConf: 1.0,
      minLift: Math.min(...lifts),
      maxLift: Math.max(...lifts),
    };
  }, [rules]);

  // Viewport dimensions
  const innerWidth = 840;
  const innerHeight = height - margin.top - margin.bottom;

  // D3 Scales
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([minSupp, maxSupp])
      .range([0, innerWidth]);
  }, [minSupp, maxSupp, innerWidth]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([minConf, maxConf])
      .range([innerHeight, 0]);
  }, [minConf, maxConf, innerHeight]);

  const radiusScale = useMemo(() => {
    return d3.scaleSqrt().domain([minLift, maxLift]).range([6, 22]);
  }, [minLift, maxLift]);

  const colorScale = useMemo(() => {
    return d3
      .scaleSequential(d3.interpolateViridis)
      .domain([minLift, maxLift]);
  }, [minLift, maxLift]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.75), 3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col items-center select-none"
    >
      {/* Zoom / Navigation Toolbar */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0D141B]/80 p-1 backdrop-blur-md">
        <button
          onClick={() => handleZoom(0.25)}
          className="p-1.5 rounded text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => handleZoom(-0.25)}
          className="p-1.5 rounded text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded text-[#8B98A7] hover:bg-white/10 hover:text-white transition-colors"
          title="Reset View"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${innerWidth + margin.left + margin.right} ${height}`}
        className="w-full h-auto max-h-[500px]"
      >
        <defs>
          <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35E0B5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.8" />
          </linearGradient>
          <filter id="bubbleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yScale.ticks(6).map((tick) => (
            <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
              <line
                x1={0}
                x2={innerWidth}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
              <text
                x={-10}
                dy="0.32em"
                textAnchor="end"
                className="fill-[#8B98A7] text-[10px] font-mono"
              >
                {(tick * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {xScale.ticks(8).map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
              <line
                y1={0}
                y2={innerHeight}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
              <text
                y={innerHeight + 20}
                textAnchor="middle"
                className="fill-[#8B98A7] text-[10px] font-mono"
              >
                {(tick * 100).toFixed(1)}%
              </text>
            </g>
          ))}

          {/* Axes labels */}
          <text
            x={innerWidth / 2}
            y={innerHeight + 42}
            textAnchor="middle"
            className="fill-[#8B98A7] text-xs font-mono font-semibold uppercase tracking-wider"
          >
            Support (Transaction Frequency) →
          </text>

          <text
            transform="rotate(-90)"
            x={-innerHeight / 2}
            y={-42}
            textAnchor="middle"
            className="fill-[#8B98A7] text-xs font-mono font-semibold uppercase tracking-wider"
          >
            ← Confidence (Rule Reliability)
          </text>

          {/* Data Points / Bubbles */}
          <g transform={`scale(${zoomLevel})`}>
            {rules.map((rule) => {
              const cx = xScale(rule.support);
              const cy = yScale(rule.confidence);
              const r = radiusScale(rule.lift);
              const isHovered = hoveredRule?.id === rule.id;

              // Color based on lift
              const fillColor =
                rule.lift >= 15
                  ? '#35E0B5'
                  : rule.lift >= 10
                  ? '#5B8CFF'
                  : '#A78BFA';

              return (
                <g
                  key={rule.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectRule(rule)}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setTooltipPos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top - 10,
                      });
                    }
                    setHoveredRule(rule);
                  }}
                  onMouseLeave={() => setHoveredRule(null)}
                >
                  {/* Subtle outer halo on hover */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 8}
                      fill={fillColor}
                      fillOpacity={0.2}
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Data Bubble */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? r + 3 : r}
                    fill={fillColor}
                    fillOpacity={isHovered ? 0.9 : 0.65}
                    stroke={fillColor}
                    strokeWidth={isHovered ? 2.5 : 1.2}
                    filter={isHovered ? 'url(#bubbleGlow)' : undefined}
                    className="transition-all duration-150"
                  />

                  {/* Lift text inside larger bubbles */}
                  {r > 12 && (
                    <text
                      cx={cx}
                      cy={cy}
                      x={cx}
                      y={cy + 3.5}
                      textAnchor="middle"
                      className="fill-black font-mono text-[9px] font-bold pointer-events-none"
                    >
                      {rule.lift.toFixed(1)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredRule && (
        <div
          style={{
            left: `${Math.min(Math.max(tooltipPos.x, 140), (containerRef.current?.clientWidth || 800) - 160)}px`,
            top: `${Math.max(tooltipPos.y - 120, 20)}px`,
          }}
          className="pointer-events-none absolute z-30 -translate-x-1/2 rounded-xl border border-white/15 bg-[#0D141B]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in w-72"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span className="font-mono text-[10px] text-[#35E0B5] font-bold">
              {hoveredRule.id} • {hoveredRule.category}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#F5C451]">
              <Zap className="h-3 w-3" />
              {hoveredRule.lift}x LIFT
            </span>
          </div>

          <p className="text-xs font-semibold text-[#F5F7FA] line-clamp-2 mb-2 font-sans">
            {hoveredRule.rule}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8B98A7] bg-white/5 p-2 rounded-lg">
            <div>
              <span>Confidence: </span>
              <strong className="text-[#5B8CFF]">
                {hoveredRule.confidencePercentage}%
              </strong>
            </div>
            <div>
              <span>Support: </span>
              <strong className="text-[#A78BFA]">
                {hoveredRule.supportPercentage}%
              </strong>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-center text-[#35E0B5] font-mono">
            Click bubble to open deep-dive
          </div>
        </div>
      )}
    </div>
  );
};

