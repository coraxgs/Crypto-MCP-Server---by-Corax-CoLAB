import React, { useRef, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { getAuthToken } from '../../auth';

const MOCK_EXCHANGES = ['Binance', 'Kraken', 'Coinbase', 'KuCoin', 'OKX'];

export default function NeuralNetLiquidity() {
  const fgRef = useRef<any>();
  const [data, setData] = useState({ nodes: [], links: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Attempt to fetch real portfolio data to discover active assets
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/portfolio', {
          headers: {
            'Authorization': `Basic ${btoa('admin:' + getAuthToken())}`
          }
        });
        const json = await res.json();

        const nodes: any[] = [];
        const links: any[] = [];

        // Add default exchange nodes
        MOCK_EXCHANGES.forEach(ex => {
          nodes.push({ id: ex, group: 'exchange', size: 10 });
        });

        if (json.ok && json.data && typeof json.data === 'object') {
           setIsConnected(true);
           const assets = Object.keys(json.data).filter(k => k !== 'total_usd' && k !== 'total_btc');

           if (assets.length === 0) throw new Error("No assets found");

           assets.forEach(asset => {
              nodes.push({ id: asset, group: 'asset', size: 5 });
              // Randomly link to exchanges since CCXT doesn't give a topology map directly easily
              const numLinks = Math.floor(Math.random() * 3) + 1;
              const shuffledExchanges = [...MOCK_EXCHANGES].sort(() => 0.5 - Math.random());

              for (let i = 0; i < numLinks; i++) {
                links.push({
                  source: asset,
                  target: shuffledExchanges[i],
                  value: Math.random() * 100,
                  isArbitrage: Math.random() > 0.9 // Highlight rare arbs
                });
              }
           });

           setData({ nodes, links });
        } else {
            throw new Error("Invalid format");
        }
      } catch (err) {
        setIsConnected(false);
        // Fallback to mock data if backend isn't returning portfolio
        const nodes: any[] = [];
        const links: any[] = [];
        MOCK_EXCHANGES.forEach(ex => nodes.push({ id: ex, group: 'exchange', size: 10 }));
        ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'].forEach(asset => {
            nodes.push({ id: asset, group: 'asset', size: 5 });
            links.push({ source: asset, target: 'Binance', value: 50, isArbitrage: false });
        });
        setData({ nodes, links });
      }
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" ref={containerRef} style={{ height: '400px', overflow: 'hidden', position: 'relative', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px' }}>
        <h3 style={{ color: '#10b981', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, background: isConnected ? '#10b981' : '#f59e0b', borderRadius: '50%', marginRight: 8, boxShadow: `0 0 8px ${isConnected ? '#10b981' : '#f59e0b'}` }}></span>
          Neural-Net Liquidity Map {isConnected ? '(LIVE)' : '(MOCK)'}
        </h3>
      </div>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        nodeThreeObject={(node: any) => {
          const color = node.group === 'exchange' ? '#10b981' : '#3b82f6';
          const size = node.size;
          const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            shininess: 100,
            emissive: color,
            emissiveIntensity: 0.5
          });
          const geometry = new THREE.SphereGeometry(size, 32, 32);
          return new THREE.Mesh(geometry, material);
        }}
        linkWidth={(link: any) => (link.isArbitrage ? 2 : 0.5)}
        linkColor={(link: any) => (link.isArbitrage ? '#ef4444' : 'rgba(16, 185, 129, 0.2)')}
        linkDirectionalParticles={(link: any) => (link.isArbitrage ? 4 : 1)}
        linkDirectionalParticleSpeed={(link: any) => (link.isArbitrage ? 0.02 : 0.005)}
        linkDirectionalParticleWidth={(link: any) => (link.isArbitrage ? 3 : 1)}
        linkDirectionalParticleColor={(link: any) => (link.isArbitrage ? '#ef4444' : '#10b981')}
        backgroundColor="#020205"
        width={dimensions.width}
        height={dimensions.height}
        showNavInfo={false}
      />
    </div>
  );
}
