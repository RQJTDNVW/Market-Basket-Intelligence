import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Network, RotateCcw, Zap } from 'lucide-react';
import { AssociationRule } from '../../types';
import { rulesService, NetworkNode, NetworkLink } from '../../services/rulesService';

interface AssociationNetworkGraphProps {
  rules: AssociationRule[];
  onSelectProduct?: (productName: string) => void;
  height?: number;
}

export const AssociationNetworkGraph: React.FC<AssociationNetworkGraphProps> = ({
  rules,
  onSelectProduct,
  height = 500,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [minLiftFilter, setMinLiftFilter] = useState<number>(10);

  const filteredRules = useMemo(() => {
    return rules.filter((r) => r.lift >= minLiftFilter);
  }, [rules, minLiftFilter]);

  const networkData = useMemo(() => {
    return rulesService.generateNetworkData(filteredRules, 35);
  }, [filteredRules]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const svg = d3.select(el);
    svg.selectAll('*').remove();

    const width = el.clientWidth || 800;

    // Simulation setup
    const simulation = d3
      .forceSimulation<any>(networkData.nodes)
      .force(
        'link',
        d3
          .forceLink<any, any>(networkData.links)
          .id((d) => d.id)
          .distance(75)
      )
      .force('charge', d3.forceManyBody().strength(-160))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 12));

    const g = svg.append('g').attr('class', 'network-graph-group');

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Arrow marker definition
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#35E0B5')
      .attr('opacity', 0.6);

    // Links (edges)
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(networkData.links)
      .enter()
      .append('line')
      .attr('stroke', '#35E0B5')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d) => Math.max(1, Math.min(4, d.lift / 5)))
      .attr('marker-end', 'url(#arrow)');

    // Drag behavior
    const drag = d3
      .drag<any, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(networkData.nodes)
      .enter()
      .append('g')
      .call(drag);

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.group.includes('Dining') || d.group.includes('Regency')) return '#35E0B5';
        if (d.group.includes('Bags') || d.group.includes('Storage')) return '#5B8CFF';
        if (d.group.includes('Clocks')) return '#A78BFA';
        return '#F5C451';
      })
      .attr('fill-opacity', 0.75)
      .attr('stroke', '#F5F7FA')
      .attr('stroke-width', 1.5)
      .attr('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');

    // Node labels
    node
      .append('text')
      .text((d) => (d.name.length > 18 ? d.name.slice(0, 16) + '...' : d.name))
      .attr('x', (d) => d.radius + 4)
      .attr('y', 4)
      .attr('fill', '#F5F7FA')
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('pointer-events', 'none')
      .attr('opacity', 0.85);

    // Hover interactions
    node
      .on('mouseenter', (_event, d: any) => {
        setHoveredNode(d.name);

        const connectedNodeIds = new Set<string>();
        connectedNodeIds.add(d.id);

        networkData.links.forEach((l: any) => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          if (sId === d.id) connectedNodeIds.add(tId);
          if (tId === d.id) connectedNodeIds.add(sId);
        });

        node.attr('opacity', (n: any) => (connectedNodeIds.has(n.id) ? 1 : 0.15));
        link.attr('stroke-opacity', (l: any) => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          return sId === d.id || tId === d.id ? 0.85 : 0.05;
        });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        node.attr('opacity', 1);
        link.attr('stroke-opacity', 0.3);
      })
      .on('click', (_event, d: any) => {
        if (onSelectProduct) onSelectProduct(d.name);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [networkData, height, onSelectProduct]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Network Toolbar */}
      <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-[#8B98A7]">
        <div className="flex items-center gap-2">
          <span>Min Lift Threshold:</span>
          <select
            value={minLiftFilter}
            onChange={(e) => setMinLiftFilter(Number(e.target.value))}
            className="rounded bg-[#111A22] border border-white/10 px-2 py-1 text-xs text-[#35E0B5] font-mono outline-none"
          >
            <option value={5}>5x+ Lift</option>
            <option value={10}>10x+ Lift</option>
            <option value={15}>15x+ Lift (Core Clusters)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#35E0B5]" /> Regency Dining
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#5B8CFF]" /> Storage Bags
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#A78BFA]" /> Clocks & Decor
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full rounded-xl border border-white/5 bg-[#05070A]/50 cursor-grab active:cursor-grabbing"
        style={{ height: `${height}px` }}
      />

      {/* Hovered node banner */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-[#35E0B5]/30 bg-[#0D141B]/95 px-3 py-1.5 text-xs text-[#F5F7FA] font-mono shadow-xl backdrop-blur-md">
          <span className="text-[#8B98A7]">Inspecting: </span>
          <strong className="text-[#35E0B5]">{hoveredNode}</strong>
        </div>
      )}
    </div>
  );
};

