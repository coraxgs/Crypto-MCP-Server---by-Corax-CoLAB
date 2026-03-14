import React, { useRef, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

// Feature 1: The "Neural-Net" Liquidity Flow & Arbitrage Map
export default function NeuralNetLiquidity() {
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate synthetic data for exchanges and pairs
    const exchanges = ['Binance', 'Kraken', 'Coinbase', 'KuCoin'];
    const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT'];

    let nodes: any[] = [];
    let links: any[] = [];

    // Add exchanges as large hubs
    exchanges.forEach((ex, idx) => {
      nodes.push({ id: ex, group: 'exchange', size: 20, color: '#10b981' });
    });

    // Add pairs orbiting exchanges
    pairs.forEach((pair, pIdx) => {
      exchanges.forEach((ex, eIdx) => {
        const nodeId = `${ex}-${pair}`;
        nodes.push({ id: nodeId, group: 'pair', size: 5, color: '#60a5fa' });
        links.push({ source: ex, target: nodeId, value: 1 });

        // Randomly link some pairs across exchanges to simulate arbitrage opportunities
        if (Math.random() > 0.8) {
          const otherEx = exchanges[(eIdx + 1) % exchanges.length];
          links.push({
            source: nodeId,
            target: `${otherEx}-${pair}`,
            value: 5,
            isArbitrage: true
          });
        }
      });
    });

    setGraphData({ nodes, links });

    const interval = setInterval(() => {
      // Simulate shockwaves from whale transactions
      if (Math.random() > 0.7 && fgRef.current) {
         // Could trigger some visual effect or update graph data to simulate shockwave
         // For now just re-centering or slight rotation
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card glass-panel" style={{ height: '400px', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ position: 'absolute', top: 10, left: 15, zIndex: 10, color: '#10b981', margin: 0, textShadow: '0 0 10px #10b981' }}>
        NEURAL-NET LIQUIDITY & ARBITRAGE
      </h3>
      <div style={{ position: 'absolute', top: 35, left: 15, zIndex: 10, color: '#94a3b8', fontSize: '12px' }}>
        Cross-Exchange 3D Force-Directed Map
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="id"
          nodeColor={node => (node as any).color}
          nodeRelSize={6}
          linkColor={link => (link as any).isArbitrage ? '#ef4444' : '#334155'}
          linkWidth={link => (link as any).isArbitrage ? 2 : 1}
          linkDirectionalParticles={link => (link as any).isArbitrage ? 4 : 0}
          linkDirectionalParticleSpeed={d => 0.01}
          linkDirectionalParticleWidth={2}
          backgroundColor="#00000000" // transparent
          enableNodeDrag={false}
          showNavInfo={false}
          width={800} // Set a fixed width or use a responsive wrapper
          height={400}
        />
      </div>
      <div style={{ position: 'absolute', bottom: 10, right: 15, zIndex: 10, display: 'flex', gap: '10px' }}>
        <span style={{ color: '#10b981', fontSize: '12px' }}>● Exchange Hub</span>
        <span style={{ color: '#60a5fa', fontSize: '12px' }}>● Trading Pair</span>
        <span style={{ color: '#ef4444', fontSize: '12px' }}>⤍ Arbitrage Flow</span>
      </div>
    </div>
  );
}
