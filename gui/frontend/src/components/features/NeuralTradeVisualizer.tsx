import React, { useMemo, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

export default function NeuralTradeVisualizer({ active }: { active: boolean }) {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate static graph
    const nodes = [
      { id: 'Source', group: 1, val: 5 },
      { id: 'Liquidity Pool 1', group: 2, val: 2 },
      { id: 'Liquidity Pool 2', group: 2, val: 2 },
      { id: 'DEX Aggregator', group: 3, val: 3 },
      { id: 'Dark Pool', group: 4, val: 1 },
      { id: 'Target (CCXT)', group: 5, val: 5 }
    ];

    const links = [
      { source: 'Source', target: 'Liquidity Pool 1' },
      { source: 'Source', target: 'Liquidity Pool 2' },
      { source: 'Liquidity Pool 1', target: 'DEX Aggregator' },
      { source: 'Liquidity Pool 2', target: 'DEX Aggregator' },
      { source: 'DEX Aggregator', target: 'Dark Pool' },
      { source: 'Dark Pool', target: 'Target (CCXT)' },
      { source: 'DEX Aggregator', target: 'Target (CCXT)' }
    ];

    setData({ nodes, links });
  }, []);

  return (
    <div style={{ height: '150px', background: '#020205', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: `1px solid ${active ? '#3b82f6' : '#334155'}` }}>
        <div style={{ position: 'absolute', top: 5, left: 5, fontSize: '10px', color: active ? '#3b82f6' : '#888', zIndex: 10, fontFamily: 'monospace' }}>
            {active ? 'EXECUTING NEURAL ROUTING...' : 'ROUTING MAP IDLE'}
        </div>
        <ForceGraph3D
            graphData={data}
            nodeLabel="id"
            nodeAutoColorBy="group"
            linkColor={() => active ? '#3b82f6' : 'rgba(255,255,255,0.1)'}
            linkWidth={active ? 2 : 1}
            linkDirectionalParticles={active ? 4 : 0}
            linkDirectionalParticleSpeed={0.01}
            linkDirectionalParticleColor={() => '#3b82f6'}
            backgroundColor="#020205"
            showNavInfo={false}
            width={300}
            height={150}
        />
        {/* Scanning line effect when active */}
        {active && (
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)',
                animation: 'scan 2s linear infinite',
                pointerEvents: 'none'
            }} />
        )}
        <style>{`
            @keyframes scan {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
            }
        `}</style>
    </div>
  );
}
