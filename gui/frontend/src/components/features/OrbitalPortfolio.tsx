import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Asset {
    symbol: string;
    balance: number;
    value: number;
    price: number;
}

interface OrbitalPortfolioProps {
    assets: Asset[];
    totalValue: number;
}

function Planet({ asset, distance, index, totalValue }: { asset: Asset, distance: number, index: number, totalValue: number }) {
    const ref = useRef<THREE.Mesh>(null);
    const orbitSpeed = useMemo(() => 0.005 + Math.random() * 0.015, []);
    const orbitAngle = useMemo(() => Math.random() * Math.PI * 2, []);

    // Size relative to total portfolio value (min size 0.5, max size 2)
    const size = Math.max(0.5, Math.min(2, (asset.value / totalValue) * 5));

    // Random color per asset based on symbol hash
    const color = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < asset.symbol.length; i++) {
            hash = asset.symbol.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    }, [asset.symbol]);

    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * orbitSpeed + orbitAngle;
        ref.current.position.x = Math.cos(t) * distance;
        ref.current.position.z = Math.sin(t) * distance;
        ref.current.rotation.y += 0.01; // self rotation
    });

    return (
        <group>
            {/* Orbit path ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.02, distance + 0.02, 64]} />
                <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            <mesh
                ref={ref}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.2} wireframe={hovered} />

                {hovered && (
                     <Html position={[0, size + 0.5, 0]} center zIndexRange={[100, 0]}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: `1px solid ${color}`,
                            padding: '10px',
                            borderRadius: '8px',
                            color: 'white',
                            fontFamily: 'monospace',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            boxShadow: `0 0 10px ${color}`
                        }}>
                            <div style={{fontWeight: 'bold', color}}>{asset.symbol}</div>
                            <div>Bal: {asset.balance.toFixed(4)}</div>
                            <div>Val: ${asset.value.toFixed(2)}</div>
                        </div>
                    </Html>
                )}
            </mesh>
        </group>
    );
}


export default function OrbitalPortfolio({ assets, totalValue }: OrbitalPortfolioProps) {
    if (assets.length === 0) {
        return <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>No assets found</div>
    }

    return (
        <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
            <Canvas camera={{ position: [0, 15, 25], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />

                {/* Central Star (Total Portfolio Value) */}
                <mesh>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} wireframe />
                    <Html position={[0, 3, 0]} center>
                         <div style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: `1px solid #10b981`,
                            padding: '5px 10px',
                            borderRadius: '4px',
                            color: '#10b981',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            textShadow: '0 0 5px #10b981'
                        }}>
                            ${totalValue.toFixed(2)}
                        </div>
                    </Html>
                </mesh>

                {/* Planets (Assets) */}
                {assets.map((asset, index) => {
                     // Calculate distance (further out for smaller index to spread them)
                     const distance = 5 + (index * 3);
                     return <Planet key={asset.symbol} asset={asset} distance={distance} index={index} totalValue={totalValue} />;
                })}
            </Canvas>
        </div>
    );
}
