cat << 'INNER_EOF' > gui/frontend/src/components/features/NewsSingularity.tsx
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Globe } from 'lucide-react';
import { callMcpEndpoint } from '../../api_mcp';

const Singularity = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vec3 color = vec3(0.1, 0.4, 0.8);

      float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      vec3 glow = color * intensity * 2.5;

      float noise = fract(sin(dot(vUv * time, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 noiseColor = vec3(0.0, 0.5, 1.0) * noise * 0.2;

      gl_FragColor = vec4(glow + noiseColor, 0.8);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 } }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const NewsNode = ({ position, text, sentiment }: { position: THREE.Vector3, text: string, sentiment: 'positive' | 'negative' | 'neutral' }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const dir = new THREE.Vector3().copy(position).normalize().multiplyScalar(-0.02);
      meshRef.current.position.add(dir);

      if (meshRef.current.position.length() < 2.5) {
        meshRef.current.position.copy(position);
      }
    }
  });

  const color = sentiment === 'positive' ? '#10b981' : sentiment === 'negative' ? '#ef4444' : '#9ca3af';

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={color} />
      <Html position={[0.2, 0, 0]} center zIndexRange={[100, 0]}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: `1px solid ${color}`,
          padding: '2px 6px',
          borderRadius: '2px',
          color: color,
          fontFamily: 'monospace',
          fontSize: '10px',
          whiteSpace: 'nowrap',
          boxShadow: `0 0 5px ${color}`,
          opacity: 0.8
        }}>
          {text.substring(0, 20)}...
        </div>
      </Html>
    </mesh>
  );
};

export default function NewsSingularity() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingData = await callMcpEndpoint('MCP_COINGECKO', 'trending');
        if (trendingData && trendingData.coins) {
            const newNodes = trendingData.coins.slice(0, 7).map((coinItem: any) => {
                const coin = coinItem.item;
                const priceChange = coin.data?.price_change_percentage_24h?.usd;

                let sentiment = 'neutral';
                if (priceChange > 5) sentiment = 'positive';
                else if (priceChange < -5) sentiment = 'negative';

                return {
                    id: coin.id + Math.random(),
                    text: `Trending: ${coin.symbol.toUpperCase()} (${priceChange ? priceChange.toFixed(2) + '%' : 'N/A'})`,
                    sentiment: sentiment,
                    position: new THREE.Vector3(
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 15
                    ).normalize().multiplyScalar(10)
                };
            });
            setNews(newNodes);
        }
      } catch (err) {
        console.error("Failed to fetch trending coins for News Singularity", err);
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card interactive-element" style={{ height: '350px', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe size={20} className="text-blue" />
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Trending Singularity</h3>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <color attach="background" args={['#020205']} />

        <Singularity />

        {news.map(n => (
          <NewsNode key={n.id} position={n.position} text={n.text} sentiment={n.sentiment as any} />
        ))}

        {/* Orbit paths */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.9, 10, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <ringGeometry args={[7.9, 8, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>

        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} minDistance={5} maxDistance={20} />
      </Canvas>
    </div>
  );
}
INNER_EOF
