import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Anchor } from 'lucide-react';

const Constellation = ({ nodes, links }: { nodes: any[], links: any[] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes (Wallets) */}
      {nodes.map(n => (
        <mesh key={n.id} position={n.pos}>
          <sphereGeometry args={[n.size, 16, 16]} />
          <meshBasicMaterial color={n.type === 'exchange' ? '#f59e0b' : '#c084fc'} transparent opacity={0.8} />

          <Html position={[0, n.size + 0.2, 0]} center>
            <div style={{
              color: n.type === 'exchange' ? '#f59e0b' : '#c084fc',
              fontSize: '10px', fontFamily: 'monospace', textShadow: '0 0 5px #000'
            }}>
              {n.name}
            </div>
          </Html>
        </mesh>
      ))}

      {/* Links (Transactions) */}
      {links.map((l, i) => {
        const start = nodes.find(n => n.id === l.source).pos;
        const end = nodes.find(n => n.id === l.target).pos;
        const points = [start, end];

        return (
          <Line
            key={i}
            points={points}
            color="#3b82f6"
            lineWidth={l.value}
            transparent
            opacity={0.4}
            dashed
            dashScale={50}
            dashSize={2}
            dashOffset={0}
          />
        );
      })}
    </group>
  );
};

export default function WhaleConstellations() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate synthetic on-chain data graph
    const nodes = [
      { id: 'ex1', name: 'Binance Cold Wallet', type: 'exchange', size: 1.5, pos: new THREE.Vector3(-5, 0, 0) },
      { id: 'ex2', name: 'Coinbase Prime', type: 'exchange', size: 1.2, pos: new THREE.Vector3(5, 2, -3) },
      { id: 'w1', name: 'Whale 0x7a2...f3', type: 'whale', size: 0.8, pos: new THREE.Vector3(0, 5, 2) },
      { id: 'w2', name: 'Whale 0x9b...11', type: 'whale', size: 0.6, pos: new THREE.Vector3(2, -4, 4) },
      { id: 'w3', name: 'Whale 0xc2...8a', type: 'whale', size: 0.9, pos: new THREE.Vector3(-3, -3, -5) },
    ];

    const links = [
      { source: 'w1', target: 'ex1', value: 3 }, // Large transfer to exchange
      { source: 'ex2', target: 'w2', value: 1 }, // Small withdrawal
      { source: 'w3', target: 'ex1', value: 5 }, // Massive transfer (dumping)
      { source: 'w1', target: 'w2', value: 0.5 }, // OTC trade
    ];

    setData({ nodes, links });
  }, []);

  return (
    <div className="card" style={{ gridColumn: '1 / -1', height: '350px', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Anchor size={20} className="text-purple" />
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>On-Chain Whale Mapping</h3>
      </div>

      <div style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10, color: '#94a3b8', fontSize: '10px', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width:8, height:8, background:'#f59e0b', borderRadius:'50%'}}></div> EXCHANGES</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 4 }}><div style={{width:8, height:8, background:'#c084fc', borderRadius:'50%'}}></div> PRIVATE WALLETS</div>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#020205']} />

        {/* Deep space background */}
        <mesh position={[0, 0, -20]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#000" />
        </mesh>

        <Constellation nodes={data.nodes} links={data.links} />

        <OrbitControls autoRotate autoRotateSpeed={0.5} minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
}
