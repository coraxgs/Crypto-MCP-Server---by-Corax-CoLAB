import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface OrderBookProps {
    symbol: string;
    bids: [number, number][]; // [price, volume]
    asks: [number, number][]; // [price, volume]
}

function TerrainMesh({ data, type, color, offset }: { data: [number, number][], type: 'bid' | 'ask', color: string, offset: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = data.length;

    const dummy = React.useMemo(() => new THREE.Object3D(), []);
    const maxVolume = Math.max(...data.map(d => d[1]), 0.0001);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        // Dynamic "breathing" effect for liquidity
        const time = clock.elapsedTime;
        const breath = Math.sin(time * 2) * 0.05 + 1;

        for (let i = 0; i < count; i++) {
             const [price, volume] = data[i];

             // X position based on price order
             const xPos = type === 'bid' ? -i * 0.5 - offset : i * 0.5 + offset;

             // Height based on volume
             const height = (volume / maxVolume) * 10 * breath;

             dummy.position.set(xPos, height / 2, 0);
             dummy.scale.set(0.4, height, 2); // Depth is constant 2
             dummy.updateMatrix();

             meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
            <boxGeometry />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
                wireframe={true}
            />
        </instancedMesh>
    );
}


export default function TopographicOrderBook({ symbol, bids, asks }: OrderBookProps) {
    if (!bids.length && !asks.length) return null;

    // Sort asks ascending price, bids descending price
    const sortedAsks = [...asks].sort((a, b) => a[0] - b[0]).slice(0, 50);
    const sortedBids = [...bids].sort((a, b) => b[0] - a[0]).slice(0, 50);

    return (
        <div style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', zIndex: 10, padding: '10px', fontFamily: 'monospace', color: '#fff', fontSize: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px' }}>
                HOLOGRAPHIC ORDER BOOK: {symbol}
            </div>
            <Canvas camera={{ position: [0, 15, 25], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 20, 10]} intensity={2} color="#ffffff" />

                {/* Center "Spot Price" line */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 20, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                <TerrainMesh data={sortedBids} type="bid" color="#10b981" offset={1} />
                <TerrainMesh data={sortedAsks} type="ask" color="#ef4444" offset={1} />

                <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />

                {/* Grid Helper */}
                <gridHelper args={[50, 50, '#334155', '#1e293b']} position={[0, -0.5, 0]} />
            </Canvas>
        </div>
    );
}
