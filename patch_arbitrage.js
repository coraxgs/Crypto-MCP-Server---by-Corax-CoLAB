const fs = require('fs');
const file = 'gui/frontend/src/components/features/ArbitrageWormhole.tsx';
let code = fs.readFileSync(file, 'utf8');

const hookImport = `import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { Canvas, useFrame } from '@react-three/fiber';\nimport { OrbitControls, Text, Line } from '@react-three/drei';\nimport * as THREE from 'three';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import { Canvas, useFrame } from '@react-three/fiber';", hookImport);

const stateAndEffect = `
  useEffect(() => {
    let active = true;
    const fetchArbitrage = async () => {
      try {
        // Fetch tickers from different exchanges to compare spread
        const t1 = await callMcpEndpoint('MCP_CCXT', 'get_ticker', { exchange: 'kraken', symbol: 'BTC/USDT' });
        const t2 = await callMcpEndpoint('MCP_CCXT', 'get_ticker', { exchange: 'binance', symbol: 'BTC/USDT' });

        if (!active) return;

        if (t1 && t2 && t1.last && t2.last) {
          const spread = Math.abs(t1.last - t2.last);
          if (spread > 10) {
            setOpportunities([{
              pair: 'BTC/USDT',
              source: t1.last < t2.last ? 'Kraken' : 'Binance',
              target: t1.last < t2.last ? 'Binance' : 'Kraken',
              spread: spread.toFixed(2),
              p1: t1.last < t2.last ? t1.last : t2.last,
              p2: t1.last < t2.last ? t2.last : t1.last
            }]);
          } else {
            setOpportunities([]);
          }
        }
      } catch (err) {
        console.error("Arbitrage fetch error", err);
      }
    };
    fetchArbitrage();
    const interval = setInterval(fetchArbitrage, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

const mockEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\/\/ Mocking real-time arbitrage detection[\s\S]*?\}, 4000\);\n    return \(\) => clearInterval\(interval\);\n  \}, \[\]\);/;

code = code.replace(mockEffectRegex, stateAndEffect);

fs.writeFileSync(file, code, 'utf8');
