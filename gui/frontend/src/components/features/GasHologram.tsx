import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { callMcpEndpoint } from '../../api_mcp';

const ReactorCore = ({ gasPriceGwei }: { gasPriceGwei: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    // Base speed and color on gas price
    // < 20 gwei = cool blue/green (slow)
    // 20-50 = yellow (medium)
    // > 50 = red (fast)

    let color = '#3b82f6';
    let speed = 1;
    let intensity = 1;

    if (gasPriceGwei > 50) {
        color = '#ef4444';
        speed = 5;
        intensity = 3;
    } else if (gasPriceGwei > 20) {
        color = '#facc15';
        speed = 2;
        intensity = 2;
    } else if (gasPriceGwei > 0) {
        color = '#10b981';
    }

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * speed * 0.5;
            meshRef.current.rotation.y += delta * speed;

            // Pulsate size
            const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        }
        if (materialRef.current) {
            materialRef.current.emissiveIntensity = intensity + Math.sin(state.clock.elapsedTime * speed * 2) * 0.5;
        }
    });

    return (
        <group>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[2, 0.5, 100, 16]} />
                <meshStandardMaterial ref={materialRef} color={color} emissive={color} emissiveIntensity={intensity} wireframe={true} />
            </mesh>
            <Text position={[0, 0, 0]} fontSize={1.5} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.1} outlineColor="#000000">
                {gasPriceGwei.toFixed(0)}
            </Text>
            <Text position={[0, -1.5, 0]} fontSize={0.5} color="#cbd5e1" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#000000">
                GWEI
            </Text>
        </group>
    );
};

export default function GasHologram() {
  const [gasPrice, setGasPrice] = useState<number>(0);

  useEffect(() => {
    let active = true;

    const fetchGas = async () => {
        try {
            const data = await callMcpEndpoint('MCP_ONCHAIN', 'gas_price', {});
            if (active && data && data.gas_price_gwei) {
                setGasPrice(parseFloat(data.gas_price_gwei));
            }
        } catch (err) {
            console.error("Error fetching gas price:", err);
        }
    };

    fetchGas();
    const interval = setInterval(fetchGas, 15000); // 15 sec
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #14b8a6', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#14b8a6', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #14b8a6' }}>
              Network Congestion Core
          </h3>
          <div style={{ fontSize: '10px', color: '#14b8a6', background: 'rgba(20, 184, 166, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #14b8a6' }}>
              ETH MAINNET
          </div>
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#020205', borderRadius: '8px', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <ambientLight intensity={0.5} />

              <ReactorCore gasPriceGwei={gasPrice} />

              <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Canvas>
      </div>
    </div>
  );
}
