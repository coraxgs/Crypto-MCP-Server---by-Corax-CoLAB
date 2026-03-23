import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { callMcpEndpoint } from '../../api_mcp';

const Word = ({ text, sentiment, position, index }: { text: string, sentiment: string, position: [number, number, number], index: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const color = sentiment === 'bullish' ? '#10b981' : sentiment === 'bearish' ? '#ef4444' : '#cbd5e1';

    useFrame((state) => {
        if (meshRef.current) {
            // Make them face the camera (billboard)
            meshRef.current.quaternion.copy(state.camera.quaternion);
            // Slight hover effect
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.005;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <Text fontSize={0.8} color={color} anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#000000">
                {text}
            </Text>
        </mesh>
    );
};

export default function SentimentWordCloud() {
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
        try {
            const data = await callMcpEndpoint('MCP_NEWS', 'get_latest_news', { limit: 20 });
            if (active && data && data.news) {
                const newWords: any[] = [];
                const radius = 5;

                // Extract unique currencies/keywords
                const keywordsMap: Record<string, {count: number, sentiment: string}> = {};

                data.news.forEach((n: any) => {
                    if (n.currencies) {
                        n.currencies.forEach((c: string) => {
                            if (!keywordsMap[c]) keywordsMap[c] = { count: 0, sentiment: n.sentiment };
                            keywordsMap[c].count++;
                            // Override neutral if a polarized article appears
                            if (n.sentiment !== 'neutral') keywordsMap[c].sentiment = n.sentiment;
                        });
                    }
                });

                Object.keys(keywordsMap).forEach((k, i) => {
                    // Golden ratio distribution on sphere
                    const phi = Math.acos(-1 + (2 * i) / Object.keys(keywordsMap).length);
                    const theta = Math.sqrt(Object.keys(keywordsMap).length * Math.PI) * phi;

                    const x = radius * Math.cos(theta) * Math.sin(phi);
                    const y = radius * Math.sin(theta) * Math.sin(phi);
                    const z = radius * Math.cos(phi);

                    newWords.push({
                        text: k.toUpperCase(),
                        sentiment: keywordsMap[k].sentiment,
                        position: [x, y, z]
                    });
                });

                setWords(newWords);
            }
        } catch (err) {
            console.error("Error fetching news for Word Cloud:", err);
        }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 120000); // 2 min
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #3b82f6', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #3b82f6' }}>
              AI Sentiment Sphere
          </h3>
          <div style={{ fontSize: '10px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #3b82f6' }}>
              NEWS ANALYSIS LIVE
          </div>
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', background: 'radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(2,2,5,1) 100%)', borderRadius: '8px', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
              <ambientLight intensity={1} />

              <group>
                  {words.map((w, i) => (
                      <Word key={i} index={i} text={w.text} sentiment={w.sentiment} position={w.position} />
                  ))}
              </group>

              <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} autoRotate={true} autoRotateSpeed={1.0} />
          </Canvas>

          <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10b981', fontSize: '10px', fontFamily: 'monospace' }}>BULLISH</span>
              <span style={{ color: '#ef4444', fontSize: '10px', fontFamily: 'monospace' }}>BEARISH</span>
              <span style={{ color: '#cbd5e1', fontSize: '10px', fontFamily: 'monospace' }}>NEUTRAL</span>
          </div>
      </div>
    </div>
  );
}
