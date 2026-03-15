const fs = require('fs');
const file = 'gui/frontend/src/components/features/HoloTopographicOrderBook.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace mock with real
const hookImport = `import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import React, { useRef, useMemo } from 'react';", hookImport);

const stateAndEffect = `
  const [bids, setBids] = useState<{price: number, volume: number, type: string}[]>([]);
  const [asks, setAsks] = useState<{price: number, volume: number, type: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOB = async () => {
      try {
        const ob = await callMcpEndpoint('MCP_CCXT', 'fetch_order_book', { exchange: 'binance', symbol: 'BTC/USDT', limit: 20 });
        if (!active) return;

        let bs = ob.bids.map((b: any) => ({ price: b[0], volume: b[1], type: 'bid' }));
        let as = ob.asks.map((a: any) => ({ price: a[0], volume: a[1], type: 'ask' }));
        setBids(bs.reverse());
        setAsks(as);
      } catch (err) {
        console.error("Order book fetch error", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOB();
    const interval = setInterval(fetchOB, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

// Remove old synthetic code
code = code.replace(/const { bids, asks } = useMemo\(\(\) => \{[\s\S]*?return \{ bids: bs.reverse\(\), asks: as \}; \/\/ bids closest to price in middle\n  \}, \[\]\);/, stateAndEffect);

fs.writeFileSync(file, code, 'utf8');
