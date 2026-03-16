import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, Canvas } from '@react-three/fiber';

// Defines the Sentiment level: -1 (Bearish/Panic), 0 (Neutral), 1 (Bullish/Euphoria)
export type SentimentLevel = -1 | 0 | 1;

function DigitalRain({ sentiment }: { sentiment: SentimentLevel }) {
  const { viewport } = useThree();
  const count = 2000;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  const speeds = useRef(new Float32Array(count));
  const positions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    if (!meshRef.current) return;

    // Initialize drop positions and speeds
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 - 0.5) * viewport.width * 2;
      positions.current[i * 3 + 1] = ((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 * viewport.height * 2;
      positions.current[i * 3 + 2] = (((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 - 0.5) * 10;

      speeds.current[i] = 0.05 + ((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 * 0.1;

      dummy.position.set(positions.current[i * 3], positions.current[i * 3 + 1], positions.current[i * 3 + 2]);
      dummy.scale.set(0.05, ((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 * 0.5 + 0.1, 0.05); // elongated drops
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [viewport, count]);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      // Move drops down
      positions.current[i * 3 + 1] -= speeds.current[i] * (sentiment === -1 ? 2 : 0.5); // Faster if bearish

      // Reset if off screen
      if (positions.current[i * 3 + 1] < -viewport.height) {
        positions.current[i * 3 + 1] = viewport.height;
      }

      dummy.position.set(positions.current[i * 3], positions.current[i * 3 + 1], positions.current[i * 3 + 2]);
      dummy.scale.set(0.05, (sentiment === -1 ? 0.8 : 0.2), 0.05); // Longer drops if bearish
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const color = sentiment === -1 ? '#ff0033' : '#10b981';

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} visible={sentiment !== 0}>
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
}

function Aurora({ sentiment }: { sentiment: SentimentLevel }) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
    });

    return (
        <mesh ref={meshRef} visible={sentiment === 1}>
            <sphereGeometry args={[15, 32, 32]} />
            <meshBasicMaterial
                color="#00ffcc"
                transparent
                opacity={0.15}
                wireframe={true}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

function Lightning({ sentiment }: { sentiment: SentimentLevel }) {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (!lightRef.current || sentiment !== -1) return;

        // Random flashes
        const deterministicRand = ((Math.sin(state.clock.elapsedTime * 12.9898) * 43758.5453) % 1 + 1) % 1;
        if (deterministicRand > 0.98) {
            lightRef.current.intensity = 5 + deterministicRand * 5;
        } else {
            lightRef.current.intensity *= 0.8; // fade out quickly
        }
    });

    return (
        <pointLight ref={lightRef} color="#ffffff" intensity={0} distance={100} visible={sentiment === -1} position={[0, 0, 5]} />
    );
}


export default function SentimentWeather() {
  const [sentiment, setSentiment] = useState<SentimentLevel>(0);

  // Simulate sentiment changes for demo purposes
  useEffect(() => {
      const interval = setInterval(() => {
          const rand = ((Math.sin(Date.now() * 12.9898) * 43758.5453) % 1 + 1) % 1;
          if (rand < 0.33) setSentiment(-1);
          else if (rand < 0.66) setSentiment(0);
          else setSentiment(1);
      }, 10000); // Change every 10 seconds

      return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Behind everything
        pointerEvents: 'none'
    }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.2} />
          <Aurora sentiment={sentiment} />
          <DigitalRain sentiment={sentiment} />
          <Lightning sentiment={sentiment} />
      </Canvas>
      <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          color: sentiment === -1 ? '#ff0033' : sentiment === 1 ? '#00ffcc' : '#aaa',
          border: `1px solid ${sentiment === -1 ? '#ff0033' : sentiment === 1 ? '#00ffcc' : '#555'}`,
          zIndex: 10
      }}>
          MARKET WEATHER: {sentiment === -1 ? 'FLASH CRASH / PANIC' : sentiment === 1 ? 'EUPHORIA / BULL' : 'NEUTRAL'}
      </div>
    </div>
  );
}
