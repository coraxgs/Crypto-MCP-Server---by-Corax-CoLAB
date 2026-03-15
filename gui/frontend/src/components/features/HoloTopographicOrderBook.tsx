import React, { useRef, useMemo, useState, useEffect } from 'react';
import { callMcpEndpoint } from '../../api_mcp';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Feature 2: Holographic Topographic Order Books (The "Liquidity Trench")
const TrenchView = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Create synthetic order book data

  const [bids, setBids] = useState<{price: number, volume: number, type: string}[]>([]);
  const [asks, setAsks] = useState<{price: number, volume: number, type: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOB = async () => {
      try {
        const ob = await callMcpEndpoint('MCP_CCXT', 'fetch_order_book', { exchange: 'binance', symbol: 'BTC/USDT', limit: 20 });
        if (!active) return;

        let bs = ob.bids.map((b: any) => ({ price: b[0], volume: b[1], type: 'bid' }));
        let as = ob.asks.map((a: any) => ({ price: a[0], volume: a[1], type: 'ask' }));
        setBids(bs.reverse());
        setAsks(as);
      } catch (err) {
        console.error("Order book fetch error", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOB();
    const interval = setInterval(fetchOB, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);


  // Animate the trench slightly
  useFrame((state) => {
    if (groupRef.current) {
       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -10]}>
      {/* Bids (Left side) */}
      {bids.map((bid, i) => (
        <group key={`bid-${i}`} position={[-bids.length + i, 0, 0]}>
          <mesh position={[0, bid.volume / 2, 0]}>
            <boxGeometry args={[0.8, bid.volume, 2]} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={0.6}
              emissive="#10b981"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <Text
            position={[0, -0.5, 1.1]}
            fontSize={0.3}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {bid.price}
          </Text>
        </group>
      ))}

      {/* Center gap / Spread */}
      <mesh position={[0, 0, 0]}>
         <boxGeometry args={[1, 0.1, 4]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Asks (Right side) */}
      {asks.map((ask, i) => (
        <group key={`ask-${i}`} position={[1 + i, 0, 0]}>
          <mesh position={[0, ask.volume / 2, 0]}>
            <boxGeometry args={[0.8, ask.volume, 2]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.6}
              emissive="#ef4444"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <Text
            position={[0, -0.5, 1.1]}
            fontSize={0.3}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            {ask.price}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default function HoloTopographicOrderBook() {
  return (
    <div className="card glass-panel" style={{ height: '400px', width: '100%', position: 'relative', padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10 }}>
        <h3 style={{ color: '#10b981', margin: 0, textShadow: '0 0 10px #10b981' }}>
          LIQUIDITY TRENCH
        </h3>
        <span className="small-muted" style={{ display: 'block' }}>Holographic Topographic Order Book</span>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
        <pointLight position={[-10, 10, 10]} intensity={1.5} color="#ef4444" />
        <TrenchView />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2} // Don't allow camera under the floor
        />
        <gridHelper args={[50, 50, '#334155', '#1e293b']} position={[0, -2, -10]} />
      </Canvas>
    </div>
  );
}
