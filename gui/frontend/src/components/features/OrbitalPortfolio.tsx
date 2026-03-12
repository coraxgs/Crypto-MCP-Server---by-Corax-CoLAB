import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { io } from 'socket.io-client';
import { getAuthToken } from '../../auth';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

const Planet = ({ asset, index, totalValue, onLock }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRadius = 2 + index * 1.5;

  // Use a pseudo-random initial angle based on the symbol string to keep it stable
  const initialAngle = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < asset.symbol.length; i++) hash = asset.symbol.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % (Math.PI * 2);
  }, [asset.symbol]);

  const value = asset.value || 0;
  const size = Math.max(0.2, Math.min(1.5, (value / totalValue) * 3));
  // Use a mock volatility for orbital speed if real volatility isn't provided
  const speed = asset.volatility ? asset.volatility * 10 : 0.5 + (Math.random() * 0.5);

  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current && !hovered) {
      const t = clock.getElapsedTime() * speed * 0.5 + initialAngle;
      groupRef.current.position.x = Math.cos(t) * orbitRadius;
      groupRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onLock(asset); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Trail width={size * 2} color={asset.color} length={50} decay={1.5} local={false}>
          <mesh ref={meshRef} scale={hovered ? 1.2 : 1}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
              color={asset.color}
              emissive={asset.color}
              emissiveIntensity={hovered ? 0.8 : 0.2}
              wireframe={hovered}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
      </Trail>

      {/* Orbit Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Asset Label */}
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.3}
        color={hovered ? '#ffffff' : asset.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {asset.symbol}
      </Text>

      {hovered && (
          <Text
            position={[0, size + 0.6, 0]}
            fontSize={0.15}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
      )}
    </group>
  );
};

export default function OrbitalPortfolio() {
  const [lockedAsset, setLockedAsset] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const socket = io(socketUrl);

    socket.on('portfolio', (data) => {
        setIsConnected(true);
        if (data && typeof data === 'object') {
            const newAssets: any[] = [];
            let total = 0;
            Object.keys(data).forEach((key, index) => {
                if (key !== 'total_usd' && key !== 'total_btc') {
                    const val = typeof data[key] === 'object' && data[key].usd_value !== undefined
                        ? data[key].usd_value
                        : parseFloat(data[key]);

                    if (!isNaN(val) && val > 0) {
                        newAssets.push({
                            symbol: key,
                            value: val,
                            volatility: 0.05, // Placeholder for real volatility
                            color: COLORS[index % COLORS.length]
                        });
                        total += val;
                    }
                }
            });

            // Prefer the backend's explicit total if provided, otherwise use calculated
            const finalTotal = data.total_usd || total;

            // If the portfolio is empty, fallback to mock data
            if (newAssets.length === 0) {
                 setAssets([
                    { symbol: 'BTC', value: 50000, volatility: 0.05, color: '#f59e0b' },
                    { symbol: 'ETH', value: 20000, volatility: 0.08, color: '#3b82f6' }
                 ]);
                 setTotalValue(70000);
            } else {
                 setAssets(newAssets);
                 setTotalValue(finalTotal);
            }
        }
    });

    // Initial fetch
    fetch('/api/portfolio', {
      headers: {
        'Authorization': `Basic ${btoa('admin:' + getAuthToken())}`
      }
    }).then(r => r.json()).then(json => {
       if (json.ok && json.data) {
           socket.emit('portfolio', json.data); // Trigger handler above manually
       }
    }).catch(err => {
        // Mock fallback if api fails
        setAssets([
            { symbol: 'BTC', value: 50000, volatility: 0.05, color: '#f59e0b' },
            { symbol: 'ETH', value: 20000, volatility: 0.08, color: '#3b82f6' }
        ]);
        setTotalValue(70000);
        setIsConnected(false);
    });

    socket.on('connect_error', () => setIsConnected(false));
    socket.on('disconnect', () => setIsConnected(false));

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="card" style={{ height: '400px', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', pointerEvents: 'none' }}>
        <h3 style={{ color: '#10b981', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, background: isConnected ? '#10b981' : '#f59e0b', borderRadius: '50%', marginRight: 8, boxShadow: `0 0 8px ${isConnected ? '#10b981' : '#f59e0b'}` }}></span>
          Orbital Portfolio {isConnected ? '(LIVE)' : '(MOCK)'}
        </h3>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginTop: '5px', fontFamily: 'monospace' }}>
            TOTAL: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
      </div>

      {lockedAsset && (
          <div style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '15px', borderRadius: '4px', backdropFilter: 'blur(5px)', width: '250px' }}>
              <h4 style={{ color: lockedAsset.color, margin: '0 0 10px 0', textTransform: 'uppercase' }}>{lockedAsset.symbol} - HUD LOCK</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '12px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#94a3b8' }}>ALLOCATION:</span>
                  <span style={{ color: '#fff', textAlign: 'right' }}>{((lockedAsset.value / totalValue) * 100).toFixed(1)}%</span>

                  <span style={{ color: '#94a3b8' }}>VOLATILITY (EST):</span>
                  <span style={{ color: '#fff', textAlign: 'right' }}>{(lockedAsset.volatility * 100).toFixed(1)}%</span>

                  <span style={{ color: '#94a3b8' }}>EST. VALUE:</span>
                  <span style={{ color: '#10b981', textAlign: 'right' }}>${lockedAsset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <button
                  onClick={() => setLockedAsset(null)}
                  style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '5px', cursor: 'pointer', fontFamily: 'monospace' }}
              >
                  RELEASE LOCK
              </button>
          </div>
      )}

      <Canvas camera={{ position: [0, 8, 10], fov: 45 }} style={{ background: '#020205' }} onPointerMissed={() => setLockedAsset(null)}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={20} decay={2} />

        {/* Central Star (Total Portfolio Body) */}
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} wireframe={true} />
        </mesh>

        {/* Planets (Assets) */}
        {assets.map((asset, index) => (
          <Planet
            key={asset.symbol}
            asset={asset}
            index={index}
            totalValue={totalValue}
            onLock={setLockedAsset}
          />
        ))}

        <Stars radius={50} depth={20} count={2000} factor={4} saturation={1} fade speed={1} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
