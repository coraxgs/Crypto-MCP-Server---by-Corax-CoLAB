import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { callMcpEndpoint } from '../../api_mcp';
import { useActivePortfolioSymbol } from '../../hooks/useActivePortfolioSymbol';

const SonarPing = ({ position, color, size, onComplete }: { position: [number, number, number], color: string, size: number, onComplete: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(0.8);

  useFrame((state, delta) => {
    if (scale < size) {
      setScale(prev => prev + delta * 20);
      setOpacity(prev => Math.max(0, prev - delta * 0.5));
    } else {
      onComplete();
    }
    if (meshRef.current) {
        meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.9, 1.0, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default function DarkPoolSonar() {
  const [pings, setPings] = useState<any[]>([]);
  const { targetSymbol: activeSymbolHook, targetExchange: activeExchange } = useActivePortfolioSymbol();

  useEffect(() => {
    let active = true;

    const fetchTrades = async () => {
        try {
            const limit = 50;
            const trades = await callMcpEndpoint('MCP_CCXT', 'fetch_trades', { exchange: activeExchange, symbol: activeSymbolHook, limit });

            if (active && trades && Array.isArray(trades)) {
                // Find "whale" trades relative to the batch
                const amounts = trades.map((t: any) => t.amount * t.price);
                const avgVolume = amounts.reduce((a, b) => a + b, 0) / (amounts.length || 1);

                const newPings: any[] = [];
                trades.forEach((trade: any, idx: number) => {
                    const volumeUsd = trade.amount * trade.price;
                    if (volumeUsd > avgVolume * 2) { // 2x average is a "whale" in this context
                        // Randomize position slightly for visual effect
                        const x = (Math.random() - 0.5) * 10;
                        const y = (Math.random() - 0.5) * 10;
                        const z = (Math.random() - 0.5) * 10;
                        const color = trade.side === 'buy' ? '#10b981' : '#ef4444';
                        const size = Math.min(10, Math.max(2, volumeUsd / avgVolume));

                        newPings.push({
                            id: `${trade.id}-${idx}-${Date.now()}`,
                            position: [x, y, z],
                            color,
                            size,
                            trade
                        });
                    }
                });

                if (newPings.length > 0) {
                    setPings(prev => [...prev, ...newPings].slice(-20)); // Keep last 20
                }
            }
        } catch (err) {
            console.error("Error fetching trades for Dark Pool Sonar:", err);
        }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 5000);
    return () => { active = false; clearInterval(interval); };
  }, [activeSymbolHook, activeExchange]);

  const removePing = (id: string) => {
      setPings(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #8b5cf6', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #8b5cf6' }}>
              Dark Pool Sonar
          </h3>
          <div style={{ fontSize: '10px', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #8b5cf6' }}>
              WHALE TRACKER LIVE
          </div>
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#020205', borderRadius: '8px', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
              <ambientLight intensity={0.5} />

              {/* Sonar Grid */}
              <gridHelper args={[20, 20, '#334155', '#1e293b']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

              {pings.map((ping) => (
                  <group key={ping.id}>
                    <SonarPing
                        position={ping.position}
                        color={ping.color}
                        size={ping.size}
                        onComplete={() => removePing(ping.id)}
                    />
                    <Html position={ping.position}>
                        <div style={{ color: ping.color, fontSize: '10px', fontFamily: 'monospace', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px' }}>
                            {ping.trade.side.toUpperCase()}: {(ping.trade.amount * ping.trade.price).toFixed(0)} USD
                        </div>
                    </Html>
                  </group>
              ))}

              <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} autoRotate={true} autoRotateSpeed={0.5} />
          </Canvas>

          <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: 'monospace' }}>
              SCANNING {activeExchange.toUpperCase()} {activeSymbolHook}
          </div>
      </div>
    </div>
  );
}
