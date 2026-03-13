import React, { useState } from 'react';
import { Network, Activity, Settings, Cpu } from 'lucide-react';

const Node = ({ type, title, position, active }: { type: 'source' | 'logic' | 'action', title: string, position: {x: number, y: number}, active: boolean }) => {
  const colors = {
    source: '#3b82f6', // blue
    logic: '#f59e0b', // amber
    action: '#10b981' // green
  };
  const Icon = type === 'source' ? Activity : type === 'logic' ? Cpu : Network;

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      background: 'rgba(0,0,0,0.8)',
      border: `1px solid ${active ? colors[type] : '#334155'}`,
      borderRadius: '8px',
      padding: '12px',
      width: '180px',
      boxShadow: active ? `0 0 15px ${colors[type]}40` : 'none',
      transition: 'all 0.3s',
      cursor: 'move',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
        <Icon size={16} color={colors[type]} />
        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
        <span>IN: {type !== 'source' ? '●' : ' '}</span>
        <span>OUT: {type !== 'action' ? '●' : ' '}</span>
      </div>
    </div>
  );
};

const Connection = ({ start, end, active }: { start: {x: number, y: number}, end: {x: number, y: number}, active: boolean }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const path = `M ${start.x} ${start.y} C ${start.x + dx/2} ${start.y}, ${start.x + dx/2} ${end.y}, ${end.x} ${end.y}`;

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
      <path
        d={path}
        fill="none"
        stroke={active ? '#10b981' : '#334155'}
        strokeWidth={active ? 2 : 1}
        className={active ? 'pulse-path' : ''}
      />
      <style>{`
        .pulse-path {
          stroke-dasharray: 10;
          animation: dash 1s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </svg>
  );
};

export default function AlgoGridArchitect() {
  const [activePath, setActivePath] = useState(false);

  // Triggering the animation every few seconds to simulate a live strategy executing
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivePath(true);
      setTimeout(() => setActivePath(false), 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 1, type: 'source' as const, title: 'CCXT: BTC/USDT', pos: { x: 20, y: 50 } },
    { id: 2, type: 'source' as const, title: 'On-Chain: Whale Alert', pos: { x: 20, y: 180 } },
    { id: 3, type: 'logic' as const, title: 'Freqtrade: RSI < 30', pos: { x: 250, y: 50 } },
    { id: 4, type: 'logic' as const, title: 'AND Gate', pos: { x: 250, y: 180 } },
    { id: 5, type: 'action' as const, title: 'Hummingbot: TWAP Buy', pos: { x: 480, y: 110 } },
  ];

  return (
    <div className="card interactive-element" style={{ gridColumn: '1 / -1', height: '350px', position: 'relative', overflow: 'hidden', backgroundColor: '#020205' }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={20} className="text-amber" />
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Strategy Grid Architect</h3>
      </div>

      <div style={{ position: 'absolute', top: 15, right: 15, zIndex: 20 }}>
        <button className="btn-outline" style={{ fontSize: '10px', padding: '4px 8px' }}>+ ADD NODE</button>
      </div>

      {/* Grid Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.2
      }} />

      {/* Connections (hardcoded for demo) */}
      <Connection start={{x: 200, y: 80}} end={{x: 250, y: 80}} active={activePath} />
      <Connection start={{x: 200, y: 210}} end={{x: 250, y: 210}} active={activePath} />
      <Connection start={{x: 430, y: 80}} end={{x: 480, y: 130}} active={activePath} />
      <Connection start={{x: 430, y: 210}} end={{x: 480, y: 150}} active={activePath} />

      {/* Nodes */}
      {nodes.map(n => (
        <Node key={n.id} type={n.type} title={n.title} position={n.pos} active={activePath} />
      ))}
    </div>
  );
}
