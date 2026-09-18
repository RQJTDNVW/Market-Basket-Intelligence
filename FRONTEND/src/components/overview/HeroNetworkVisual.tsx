import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  category: string;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
  connectedTo: string[];
}

interface Packet {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
}

export const HeroNetworkVisual: React.FC<{ onExploreRule?: (ruleName: string) => void }> = ({
  onExploreRule,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [activeRulePreview, setActiveRulePreview] = useState<{
    rule: string;
    lift: string;
    confidence: string;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    window.addEventListener('resize', handleResize);

    // Initial product nodes from retail dataset
    const nodes: Node[] = [
      {
        id: 'tea',
        name: 'REGENCY TEACUP',
        category: 'Dining',
        baseX: width * 0.28,
        baseY: height * 0.35,
        x: width * 0.28,
        y: height * 0.35,
        radius: 26,
        color: '#35E0B5',
        phase: 0,
        speed: 0.0015,
        connectedTo: ['saucer', 'cakestand', 'cake'],
      },
      {
        id: 'saucer',
        name: 'REGENCY SAUCER',
        category: 'Dining',
        baseX: width * 0.52,
        baseY: height * 0.22,
        x: width * 0.52,
        y: height * 0.22,
        radius: 24,
        color: '#35E0B5',
        phase: 1.2,
        speed: 0.0018,
        connectedTo: ['tea', 'cakestand'],
      },
      {
        id: 'cakestand',
        name: 'CAKESTAND 3-TIER',
        category: 'Dining',
        baseX: width * 0.76,
        baseY: height * 0.38,
        x: width * 0.76,
        y: height * 0.38,
        radius: 28,
        color: '#5B8CFF',
        phase: 2.1,
        speed: 0.0014,
        connectedTo: ['tea', 'cake'],
      },
      {
        id: 'cake',
        name: 'PANTRY CAKE TINS',
        category: 'Baking',
        baseX: width * 0.65,
        baseY: height * 0.72,
        x: width * 0.65,
        y: height * 0.72,
        radius: 22,
        color: '#A78BFA',
        phase: 3.4,
        speed: 0.002,
        connectedTo: ['cakestand', 'jumbobag'],
      },
      {
        id: 'jumbobag',
        name: 'JUMBO BAG RED',
        category: 'Storage',
        baseX: width * 0.35,
        baseY: height * 0.75,
        x: width * 0.35,
        y: height * 0.75,
        radius: 25,
        color: '#5B8CFF',
        phase: 4.5,
        speed: 0.0016,
        connectedTo: ['lunchbag', 'cake'],
      },
      {
        id: 'lunchbag',
        name: 'LUNCH BAG BLACK',
        category: 'Storage',
        baseX: width * 0.15,
        baseY: height * 0.58,
        x: width * 0.15,
        y: height * 0.58,
        radius: 23,
        color: '#35E0B5',
        phase: 5.2,
        speed: 0.0017,
        connectedTo: ['jumbobag', 'tea'],
      },
    ];

    // Data packets traveling between nodes
    const packets: Packet[] = [
      { sourceId: 'tea', targetId: 'saucer', progress: 0.2, speed: 0.007 },
      { sourceId: 'saucer', targetId: 'cakestand', progress: 0.6, speed: 0.006 },
      { sourceId: 'cakestand', targetId: 'cake', progress: 0.4, speed: 0.008 },
      { sourceId: 'jumbobag', targetId: 'lunchbag', progress: 0.8, speed: 0.005 },
      { sourceId: 'lunchbag', targetId: 'tea', progress: 0.1, speed: 0.006 },
    ];

    let hoveredId: string | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found: Node | null = null;
      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 6) {
          found = node;
          break;
        }
      }

      hoveredId = found ? found.id : null;
      setHoveredNode(found);

      if (found) {
        if (found.id === 'tea' || found.id === 'saucer') {
          setActiveRulePreview({
            rule: 'GREEN REGENCY TEACUP → ROSES REGENCY TEACUP',
            lift: '18.89x',
            confidence: '90.3%',
          });
        } else if (found.id === 'jumbobag' || found.id === 'lunchbag') {
          setActiveRulePreview({
            rule: 'JUMBO BAG PINK → JUMBO BAG RED RETROSPOT',
            lift: '6.47x',
            confidence: '67.6%',
          });
        } else {
          setActiveRulePreview({
            rule: 'SET OF 3 CAKE TINS → REGENCY CAKESTAND 3 TIER',
            lift: '8.42x',
            confidence: '64.5%',
          });
        }
      } else {
        setActiveRulePreview(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Update positions with floating sinusoidal movement
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(time * node.speed + node.phase) * 12;
        node.y = node.baseY + Math.cos(time * node.speed * 0.8 + node.phase) * 10;
      }

      // Draw Connection Lines
      for (const node of nodes) {
        for (const targetId of node.connectedTo) {
          const target = nodes.find((n) => n.id === targetId);
          if (!target) continue;

          const isConnectedToHovered =
            hoveredId &&
            (hoveredId === node.id ||
              hoveredId === target.id ||
              (hoveredNode &&
                (hoveredNode.connectedTo.includes(node.id) ||
                  hoveredNode.connectedTo.includes(target.id))));

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);

          if (hoveredId) {
            ctx.strokeStyle = isConnectedToHovered
              ? 'rgba(53, 224, 181, 0.7)'
              : 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = isConnectedToHovered ? 2.5 : 1;
          } else {
            ctx.strokeStyle = 'rgba(53, 224, 181, 0.25)';
            ctx.lineWidth = 1.5;
          }
          ctx.stroke();
        }
      }

      // Draw Data Packets along edges
      for (const packet of packets) {
        const src = nodes.find((n) => n.id === packet.sourceId);
        const tgt = nodes.find((n) => n.id === packet.targetId);
        if (!src || !tgt) continue;

        packet.progress += packet.speed;
        if (packet.progress > 1) packet.progress = 0;

        const px = src.x + (tgt.x - src.x) * packet.progress;
        const py = src.y + (tgt.y - src.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#35E0B5';
        ctx.shadowColor = '#35E0B5';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      for (const node of nodes) {
        const isHovered = hoveredId === node.id;

        // Outer glow
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(53, 224, 181, 0.2)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#111A22' : '#0D141B';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#35E0B5' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Inner accent dot
        ctx.beginPath();
        ctx.arc(node.x, node.y - 6, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Label
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = isHovered ? '#35E0B5' : '#F5F7FA';
        ctx.textAlign = 'center';
        ctx.fillText(node.name.split(' ')[0], node.x, node.y + 6);
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#8B98A7';
        ctx.fillText(node.name.split(' ')[1] || '', node.x, node.y + 16);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-[440px] rounded-2xl border border-white/10 bg-[#0D141B]/80 backdrop-blur-xl overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Top Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#35E0B5] animate-ping" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#35E0B5] font-semibold">
          Live Association Topology
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 text-[10px] font-mono text-[#8B98A7]">
        Hover node to illuminate affinity
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

      {/* Floating Dynamic Rule Preview on Hover */}
      {activeRulePreview && (
        <div className="absolute bottom-4 inset-x-4 z-20 rounded-xl border border-[#35E0B5]/40 bg-[#0A0F14]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#35E0B5]/10 border border-[#35E0B5]/30 text-[#35E0B5]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#35E0B5] font-bold">
                Associated Rule Discovery
              </span>
              <p className="text-xs font-semibold text-[#F5F7FA]">
                {activeRulePreview.rule}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[9px] uppercase text-[#8B98A7] block">Lift</span>
              <strong className="text-[#35E0B5] font-bold">{activeRulePreview.lift}</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase text-[#8B98A7] block">Confidence</span>
              <strong className="text-[#5B8CFF] font-bold">{activeRulePreview.confidence}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
