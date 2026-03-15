const fs = require('fs');
const file = 'gui/frontend/src/components/features/BacktestArenaPanel.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHook = `import React, { useState, useEffect, useMemo } from 'react';\nimport { Play, Pause, FastForward, Rewind, Settings } from 'lucide-react';\nimport Plotly from 'plotly.js-basic-dist';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import Plotly from 'plotly.js-basic-dist';", importHook);

const stateAndEffect = `
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const result = await callMcpEndpoint('MCP_CCXT', 'fetch_ohlcv', { exchange: 'binance', symbol: 'BTC/USDT', timeframe: '1h', limit: 100 });
        if (!active || !result) return;

        const data = result.map((c: any) => {
          const isTrade = Math.random() > 0.8;
          const tradeType = isTrade ? (Math.random() > 0.5 ? 'BUY' : 'SELL') : null;
          return {
            date: new Date(c[0]).toISOString().split('T')[0],
            open: c[1],
            high: c[2],
            low: c[3],
            close: c[4],
            trade: tradeType,
            profit: tradeType === 'SELL' ? (c[4] - c[1]) * 0.1 : 0
          };
        });
        setHistoricalData(data);
      } catch (err) {
        console.error("Backtest fetch error", err);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);
`;

const mockEffectRegex = /\/\/ Generate simulated historical data[\s\S]*?\}, \[\]\);/
code = code.replace(mockEffectRegex, stateAndEffect);

fs.writeFileSync(file, code, 'utf8');
