const fs = require('fs');
const file = 'gui/frontend/src/components/features/NewsSingularity.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHook = `import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { Canvas, useFrame } from '@react-three/fiber';\nimport { OrbitControls, Text, Html } from '@react-three/drei';\nimport * as THREE from 'three';\nimport { Globe, Radio, AlertTriangle } from 'lucide-react';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import { Globe, Radio, AlertTriangle } from 'lucide-react';", importHook);

const stateAndEffect = `
  const [newsNodes, setNewsNodes] = useState<NewsNode[]>([]);
  useEffect(() => {
    let active = true;
    const fetchNews = async () => {
      try {
        const result = await callMcpEndpoint('MCP_COINGECKO', 'trending', {});
        if (!active || !result.coins) return;

        const nodes = result.coins.slice(0, 15).map((c: any, i: number) => ({
          id: c.item.id,
          text: \`\${c.item.name} trending\`,
          sentiment: c.item.price_btc > 0 ? 'bullish' : 'bearish',
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          )
        }));
        setNewsNodes(nodes);
      } catch (err) {
        console.error("News fetch error", err);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

code = code.replace(/const \[newsNodes, setNewsNodes\] = useState<NewsNode\[\]>\(\[\]\);[\s\S]*?return \(\) => clearInterval\(interval\);\n  \}, \[\]\);/, stateAndEffect);
fs.writeFileSync(file, code, 'utf8');
