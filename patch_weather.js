const fs = require('fs');
const file = 'gui/frontend/src/components/features/GlobalWeatherSystem.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHook = `import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { Canvas, useFrame } from '@react-three/fiber';\nimport { Environment, Cloud, Stars } from '@react-three/drei';\nimport * as THREE from 'three';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import { Environment, Cloud, Stars } from '@react-three/drei';", importHook);

const stateAndEffect = `
  useEffect(() => {
    let active = true;
    const fetchSentiment = async () => {
      try {
        const result = await callMcpEndpoint('MCP_COINGECKO', 'price', { coin_id: 'bitcoin', vs_currency: 'usd' });
        if (!active || !result.bitcoin) return;

        // Simple logic: If BTC changes in 24h is negative -> bear, positive -> bull, small -> neutral.
        const change = result.bitcoin.usd_24h_change || 0;
        if (change > 2) setSentiment('bull');
        else if (change < -2) setSentiment('bear');
        else setSentiment('neutral');
      } catch (err) {
        console.error("Failed to fetch global weather sentiment", err);
      }
    };
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

code = code.replace(/useEffect\(\(\) => \{[\s\S]*?\/\/ Simulate sentiment changes[\s\S]*?\}, 15000\);\n    return \(\) => clearInterval\(interval\);\n  \}, \[\]\);/, stateAndEffect);

fs.writeFileSync(file, code, 'utf8');
