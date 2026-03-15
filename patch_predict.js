const fs = require('fs');
const file = 'gui/frontend/src/components/features/PredictiveGhosting.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHook = `import React, { useEffect, useState, useRef } from 'react';\nimport Plotly from 'plotly.js-basic-dist';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import Plotly from 'plotly.js-basic-dist';", importHook);

const stateAndEffect = `
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const result = await callMcpEndpoint('MCP_CCXT', 'fetch_ohlcv', { exchange: 'binance', symbol: 'BTC/USDT', timeframe: '1h', limit: 50 });
        if (!active || !result || !chartRef.current) return;

        const x = [];
        const y = [];
        const lowerBound = [];
        const upperBound = [];

        let lastPrice = result[result.length - 1][4];

        for (let i = 0; i < result.length; i++) {
          x.push(i - 50);
          y.push(result[i][4]);
          lowerBound.push(null);
          upperBound.push(null);
        }

        let currentPrice = lastPrice;
        for (let i = 1; i <= 20; i++) {
          x.push(i);
          // Very simple mock prediction based on real data bounds
          currentPrice += (Math.random() - 0.3) * 600;
          y.push(currentPrice);
          upperBound.push(currentPrice + i * 200);
          lowerBound.push(currentPrice - i * 200);
        }

        const traceHist = { x: x.slice(0, 51), y: y.slice(0, 51), mode: 'lines', name: 'Actual', line: { color: '#10b981', width: 3 } };
        const traceGhost = { x: x.slice(50), y: y.slice(50), mode: 'lines', name: 'AI Ghost', line: { color: 'rgba(16, 185, 129, 0.4)', width: 2, dash: 'dash' } };
        const traceUpper = { x: x.slice(50), y: upperBound.slice(50), mode: 'lines', name: 'Upper', line: { width: 0 }, showlegend: false };
        const traceLower = { x: x.slice(50), y: lowerBound.slice(50), mode: 'lines', name: 'Lower', fill: 'tonexty', fillcolor: 'rgba(59, 130, 246, 0.1)', line: { width: 0 }, showlegend: false };

        const layout = {
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { t: 10, b: 30, l: 40, r: 10 },
          xaxis: { gridcolor: '#334155', color: '#94a3b8' },
          yaxis: { gridcolor: '#334155', color: '#94a3b8' },
          showlegend: false,
          hovermode: 'x unified'
        };

        Plotly.newPlot(chartRef.current, [traceUpper, traceLower, traceHist, traceGhost], layout as any, { responsive: true, displayModeBar: false });
      } catch (err) {
        console.error("Predictive fetch error", err);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);
`;

const mockEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/
code = code.replace(mockEffectRegex, stateAndEffect);
fs.writeFileSync(file, code, 'utf8');
