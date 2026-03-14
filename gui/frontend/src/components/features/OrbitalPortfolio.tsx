import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Feature 4: Orbital Portfolio Control Deck
const Planet = ({ asset, onSelect, selected }: { asset: any, onSelect: any, selected: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  // Random starting angle
  const [angle] = useState(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!selected) {
      if (orbitRef.current) {
         // Speed based on volatility
         orbitRef.current.rotation.y += asset.speed * delta;
      }
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
    } else {
       // if selected, move to center or stop orbiting
       if (orbitRef.current) {
          // smoothly rotate to face camera?
       }
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[asset.distance - 0.05, asset.distance + 0.05, 64]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* The Planet */}
      <mesh
        ref={meshRef}
        position={[Math.cos(angle) * asset.distance, 0, Math.sin(angle) * asset.distance]}
        onClick={(e) => { e.stopPropagation(); onSelect(asset); }}
        onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
        onPointerOut={(e) => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[asset.size, 32, 32]} />
        <meshStandardMaterial
          color={asset.color}
          emissive={asset.color}
          emissiveIntensity={selected ? 0.8 : 0.2}
          wireframe={selected}
        />
        <Text
          position={[0, asset.size + 0.5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {asset.name}
        </Text>

        {selected && (
           <Html position={[asset.size + 0.5, 0, 0]}>
              <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${asset.color}`,
                  padding: '10px',
                  borderRadius: '5px',
                  color: 'white',
                  width: '150px',
                  boxShadow: `0 0 10px ${asset.color}`
              }}>
                 <h4 style={{ margin: 0, color: asset.color }}>{asset.name}</h4>
                 <p style={{ margin: '5px 0', fontSize: '12px' }}>Allocation: {asset.allocation}%</p>
                 <p style={{ margin: '5px 0', fontSize: '12px' }}>Value: ${asset.value}</p>
                 <p style={{ margin: '5px 0', fontSize: '12px' }}>24h Vol: {asset.volatility}%</p>
              </div>
           </Html>
        )}
      </mesh>
    </group>
  );
};

export default function OrbitalPortfolio() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const assets = useMemo(() => [
    { id: 'btc', name: 'BTC', size: 1.5, distance: 4, speed: 0.2, color: '#f59e0b', allocation: 45, value: '45,000', volatility: 2.4 },
    { id: 'eth', name: 'ETH', size: 1.2, distance: 7, speed: 0.3, color: '#60a5fa', allocation: 30, value: '30,000', volatility: 3.8 },
    { id: 'sol', name: 'SOL', size: 0.8, distance: 10, speed: 0.5, color: '#10b981', allocation: 15, value: '15,000', volatility: 5.2 },
    { id: 'link', name: 'LINK', size: 0.6, distance: 12, speed: 0.4, color: '#3b82f6', allocation: 10, value: '10,000', volatility: 4.1 },
  ], []);

  return (
    <div className="card glass-panel interactive-element" style={{ height: '400px', width: '100%', position: 'relative', padding: 0, overflow: 'hidden', borderLeft: '4px solid #8b5cf6' }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10 }}>
        <h3 style={{ color: '#8b5cf6', margin: 0, textShadow: '0 0 10px #8b5cf6' }}>
          ORBITAL PORTFOLIO
        </h3>
        <span className="small-muted" style={{ display: 'block' }}>3D Control Deck</span>
      </div>

      {selectedAsset && (
        <button
           onClick={() => setSelectedAsset(null)}
           style={{ position: 'absolute', top: 15, right: 15, zIndex: 10, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
           UNLOCK HUD
        </button>
      )}

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />

        {/* Central Star (Total Portfolio) */}
        <mesh onClick={() => setSelectedAsset(null)}>
           <sphereGeometry args={[2, 32, 32]} />
           <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} wireframe />
           <Text
              position={[0, 3, 0]}
              fontSize={0.5}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              TOTAL: $100K
            </Text>
        </mesh>

        {assets.map((asset) => (
          <Planet
             key={asset.id}
             asset={asset}
             onSelect={(a: any) => setSelectedAsset(a.id)}
             selected={selectedAsset === asset.id}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={!selectedAsset}
          autoRotateSpeed={0.5}
        />

        {/* Subtle background stars */}
        <points>
           <bufferGeometry>
              <bufferAttribute
                 attach="attributes-position"
                 count={500}
                 array={new Float32Array(1500).map(() => (Math.random() - 0.5) * 100)}
                 itemSize={3}
              />
           </bufferGeometry>
           <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.5} />
        </points>

      </Canvas>
    </div>
  );
}
