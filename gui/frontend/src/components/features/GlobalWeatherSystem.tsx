import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ sentiment }: { sentiment: 'bull' | 'bear' | 'neutral' }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 2000;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      const speed = Math.random() * 0.05 + 0.01;
      temp.push({ x, y, z, speed, offset: Math.random() * Math.PI * 2 });
    }
    return temp;
  }, [count]);

  const color = new THREE.Color();
  const dummy = new THREE.Object3D();

  useFrame((state, delta) => {
    if (!mesh.current) return;

    let targetColor = sentiment === 'bull' ? '#10b981' : sentiment === 'bear' ? '#ef4444' : '#60a5fa';

    particles.forEach((particle, i) => {
      let { x, y, z, speed, offset } = particle;

      if (sentiment === 'bear') {
        // Digital Rain falling down fast
        y -= speed * 5;
        if (y < -25) y = 25;
      } else if (sentiment === 'bull') {
        // Floating embers going up
        y += speed * 2;
        x += Math.sin(state.clock.elapsedTime * speed + offset) * 0.05;
        if (y > 25) y = -25;
      } else {
        // Neutral floating slowly
        y += Math.sin(state.clock.elapsedTime * speed + offset) * 0.02;
        x += Math.cos(state.clock.elapsedTime * speed + offset) * 0.02;
      }

      particle.y = y;
      particle.x = x;

      dummy.position.set(x, y, z);

      // Stretch particles if bear market (rain)
      if (sentiment === 'bear') {
          dummy.scale.set(0.1, 1.5, 0.1);
      } else {
          dummy.scale.set(0.3, 0.3, 0.3);
      }

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      // Set color
      color.set(targetColor);
      // add slight random variation to color brightness
      color.lerp(new THREE.Color('#ffffff'), Math.sin(state.clock.elapsedTime * speed * 5 + offset) * 0.2);
      mesh.current!.setColorAt(i, color);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
};

export default function GlobalWeatherSystem({ sentiment = 'neutral' }: { sentiment?: 'bull' | 'bear' | 'neutral' }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', opacity: sentiment === 'neutral' ? 0.3 : 0.6 }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Particles sentiment={sentiment} />
      </Canvas>
      {/* Glitch Overlay for Bear Market */}
      {sentiment === 'bear' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          animation: 'glitch 0.2s infinite',
          opacity: 0.3
        }} />
      )}
      {/* Glow Overlay for Bull Market */}
      {sentiment === 'bull' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)',
          animation: 'pulseBg 4s infinite alternate',
        }} />
      )}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        @keyframes pulseBg {
          0% { opacity: 0.5 }
          100% { opacity: 1 }
        }
      `}</style>
    </div>
  );
}
