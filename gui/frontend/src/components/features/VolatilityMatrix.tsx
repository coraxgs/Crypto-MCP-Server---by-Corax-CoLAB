import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Terrain = () => {
  const mesh = useRef<THREE.Mesh>(null);

  // Create a grid geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 50, 50), []);

  useFrame((state) => {
    if (!mesh.current) return;

    // Animate vertices to create waves
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Calculate a noise-like sine wave value
      const t = state.clock.elapsedTime * 0.5;
      const wave = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 1.5;

      positions[i + 2] = wave; // Modify Z
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial color="#8b5cf6" wireframe={true} emissive="#8b5cf6" emissiveIntensity={0.5} transparent opacity={0.6} />
    </mesh>
  );
};

export default function VolatilityMatrix() {
  return (
    <div className="card interactive-element" style={{ height: '300px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <h3 style={{ margin: 0, color: '#8b5cf6', fontFamily: 'monospace', fontSize: '14px', textShadow: '0 0 5px #8b5cf6' }}>QUANTUM ANOMALY MATRIX</h3>
        <div style={{ fontSize: '10px', color: '#a3a3a3' }}>3D Volatility Surface mapping</div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
          <Terrain />
          <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </div>
  );
}
