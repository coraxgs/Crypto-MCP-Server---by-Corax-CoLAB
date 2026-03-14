import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Feature 2: Holographic Topographic Order Books (The "Liquidity Trench")
const TrenchView = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Create synthetic order book data
  const { bids, asks } = useMemo(() => {
    let bs = [];
    let as = [];
    let currentPrice = 64000;

    // Bids (Green walls, decreasing price)
    for(let i=1; i<=20; i++) {
      let price = currentPrice - i * 50;
      let volume = Math.random() * 5 + (i===10 ? 15 : 0); // Add a wall at index 10
      bs.push({ price, volume, type: 'bid' });
    }

    // Asks (Red walls, increasing price)
    for(let i=1; i<=20; i++) {
      let price = currentPrice + i * 50;
      let volume = Math.random() * 5 + (i===15 ? 20 : 0); // Add a wall at index 15
      as.push({ price, volume, type: 'ask' });
    }
    return { bids: bs.reverse(), asks: as }; // bids closest to price in middle
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
