import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldAlert, TrendingDown } from 'lucide-react';

const Terrain = ({ stressLevel }: { stressLevel: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const size = 30;
  const segments = 30;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, [size, segments]);

  useFrame((state) => {
    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);

        // Base terrain
        let y = Math.sin(x * 0.5 + time * 0.5) * Math.cos(z * 0.5 + time * 0.5) * 1;

        // Apply stress deformation (simulate market crash)
        if (stressLevel > 0) {
          const distanceToCenter = Math.sqrt(x*x + z*z);
          const impact = Math.exp(-distanceToCenter * 0.2) * stressLevel * 5;
          y -= impact * Math.sin(time * 5); // Vibrating crater
        }

        pos.setY(i, y);
      }
      meshRef.current.geometry.computeVertexNormals();
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const materialColor = stressLevel > 0 ? '#ef4444' : '#60a5fa'; // Red on stress, Blue normally

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={materialColor} wireframe emissive={materialColor} emissiveIntensity={stressLevel > 0 ? 1 : 0.2} roughness={0.8} />
    </mesh>
  );
};

export default function QuantumRiskMap() {
  const [stress, setStress] = useState(0);

  const simulateCrash = () => {
    setStress(1);
    setTimeout(() => setStress(0), 3000);
  };

  return (
    <div className="card" style={{ height: '350px', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert size={20} className={stress > 0 ? 'text-red' : 'text-blue'} />
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Quantum Risk Topography</h3>
      </div>

      <div style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10 }}>
        <button onClick={simulateCrash} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#ef4444', color: '#ef4444' }}>
          <TrendingDown size={14} /> SIMULATE -20% BTC SHOCK
        </button>
      </div>

      {stress > 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: '#ef4444', fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold', textShadow: '0 0 10px #ef4444', animation: 'blink 0.5s infinite' }}>
          LIQUIDATION CASCADE DETECTED
        </div>
      )}

      <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
        <color attach="background" args={['#020205']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={stress > 0 ? 5 : 2} color={stress > 0 ? '#ef4444' : '#ffffff'} />

        <Terrain stressLevel={stress} />

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 - 0.1} autoRotate={stress === 0} autoRotateSpeed={0.5} />
      </Canvas>
      <style>{`
        @keyframes blink { 0% { opacity: 1 } 50% { opacity: 0 } 100% { opacity: 1 } }
      `}</style>
    </div>
  );
}
