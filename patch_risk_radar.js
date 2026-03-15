const fs = require('fs');
const file = 'gui/frontend/src/components/features/RiskRadarPanel.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHook = `import React, { useMemo, useState, useEffect, useRef } from 'react';\nimport ForceGraph3D from 'react-force-graph-3d';\nimport { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';", importHook);

const stateAndEffect = `
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    let active = true;
    const fetchNodes = async () => {
      try {
        const result = await callMcpEndpoint('MCP_CCXT', 'fetch_balance', { exchange: 'binance' });
        if (!active || !result.total) return;

        const nodes = [{ id: 'Binance', group: 'exchange', size: 15, color: '#3b82f6' }];
        const links = [];

        let i = 0;
        for (const [coin, amount] of Object.entries(result.total)) {
          if (amount > 0) {
            nodes.push({ id: coin, group: 'asset', size: Math.max(5, Math.min(15, amount)), color: '#10b981' });
            links.push({ source: 'Binance', target: coin, value: amount });
            i++;
          }
        }

        setData({ nodes, links });
      } catch (err) {
        console.error("Failed to fetch risk radar data", err);
      }
    };
    fetchNodes();
    const interval = setInterval(fetchNodes, 10000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

const mockEffectRegex = /\/\/ Generate simulated on-chain network data[\s\S]*?\}, \[\]\);/
code = code.replace(mockEffectRegex, stateAndEffect);

fs.writeFileSync(file, code, 'utf8');
