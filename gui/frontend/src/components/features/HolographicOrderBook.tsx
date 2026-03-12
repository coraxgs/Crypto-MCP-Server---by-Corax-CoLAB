import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { io } from 'socket.io-client';

const MAX_LEVELS = 50;

const LiquidityWall = ({ data, type, position }: { data: any[], type: 'bid' | 'ask', position: [number, number, number] }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const color = type === 'bid' ? '#10b981' : '#ef4444';
  const emissiveColor = new THREE.Color(color).multiplyScalar(0.5);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (meshRef.current) {
      const levelsToRender = Math.min(data.length, MAX_LEVELS);
      for (let i = 0; i < levelsToRender; i++) {
        const level = data[i];
        const x = (i - levelsToRender / 2) * 0.5;
        // The volume is represented by size. If level.size is missing, use a tiny mock volume
        const size = level[1] ? parseFloat(level[1]) * 10 : (Math.random() * 5 + 0.1);
        const y = size / 2;
        const z = 0;

        const dynamicScale = 1 + Math.sin(Date.now() * 0.005 + i) * 0.1;

        dummy.position.set(x, y * dynamicScale, z);
        dummy.scale.set(0.4, size * dynamicScale, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.count = levelsToRender; // Only render available instances
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_LEVELS]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          transparent={true}
          opacity={0.8}
          transmission={0.5}
          ior={1.5}
          thickness={0.5}
        />
      </instancedMesh>
    </group>
  );
};

export default function HolographicOrderBook() {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const socket = io(socketUrl);

    // We reuse the existing 'ticker' socket emission to infer orderbook mock depth if actual orderbook isn't available
    socket.on('ticker', (data) => {
      setIsConnected(true);
      if (data && data.last) {
        // If CCXT MCP provides full orderbook in future, map here.
        // For now, derive a mock orderbook around the real live price
        const currentPrice = data.last;
        const bids = [];
        const asks = [];
        for (let i = 0; i < MAX_LEVELS; i++) {
            bids.push([currentPrice - (i * 10), Math.random() * 5 + 0.1]);
            asks.push([currentPrice + (i * 10), Math.random() * 5 + 0.1]);
        }
        setOrderBook({ bids, asks });
      }
    });

    socket.on('connect_error', () => setIsConnected(false));
    socket.on('disconnect', () => setIsConnected(false));

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="card" style={{ height: '400px', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px' }}>
        <h3 style={{ color: '#10b981', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, background: isConnected ? '#10b981' : '#f59e0b', borderRadius: '50%', marginRight: 8, boxShadow: `0 0 8px ${isConnected ? '#10b981' : '#f59e0b'}` }}></span>
          Holographic Liquidity Trench {isConnected ? '(LIVE)' : '(DISCONNECTED)'}
        </h3>
      </div>

      <Canvas shadows camera={{ position: [0, 5, 15], fov: 45 }} style={{ background: '#020205' }}>
        <color attach="background" args={['#020205']} />
        <fog attach="fog" args={['#020205', 10, 30]} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, 0, -20]} color="#10b981" intensity={1.5} distance={50} />
        <pointLight position={[10, 0, -20]} color="#ef4444" intensity={1.5} distance={50} />

        <group position={[0, -2, 0]}>
          {/* Floor grid */}
          <gridHelper args={[50, 50, '#334155', '#1e293b']} position={[0, -0.1, 0]} />

          {/* Bid Wall (Green) */}
          <LiquidityWall data={orderBook.bids} type="bid" position={[-8, 0, -5]} />

          {/* Ask Wall (Red) */}
          <LiquidityWall data={orderBook.asks} type="ask" position={[8, 0, -5]} />

          {/* Current Price 'Laser' */}
          <mesh position={[0, 0, -5]}>
            <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        </group>

        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.1} />
      </Canvas>
    </div>
  );
}
