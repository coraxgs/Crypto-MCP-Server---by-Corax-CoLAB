const fs = require('fs');
const file = 'gui/frontend/src/components/features/HoloOrderFlow.tsx';
let code = fs.readFileSync(file, 'utf8');

const hookImport = `import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import React, { useMemo, useRef } from 'react';", hookImport);

const stateAndEffect = `
  const [bids, setBids] = useState<{price: number, volume: number}[]>([]);
  const [asks, setAsks] = useState<{price: number, volume: number}[]>([]);
  const [maxVolume, setMaxVolume] = useState(1);

  useEffect(() => {
    let active = true;
    const fetchOB = async () => {
      try {
        const ob = await callMcpEndpoint('MCP_CCXT', 'fetch_order_book', { exchange: 'binance', symbol: 'BTC/USDT', limit: 20 });
        if (!active) return;

        let bs = ob.bids.map((b: any) => ({ price: b[0], volume: b[1] }));
        let as = ob.asks.map((a: any) => ({ price: a[0], volume: a[1] }));

        const allVols = [...bs, ...as].map(i => i.volume);
        const maxV = Math.max(...allVols, 1);

        setBids(bs.reverse());
        setAsks(as);
        setMaxVolume(maxV);
      } catch (err) {
        console.error("Order book fetch error", err);
      }
    };
    fetchOB();
    const interval = setInterval(fetchOB, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);
`;

code = code.replace(/const simulatedOrderBook = useMemo\(\(\) => \{[\s\S]*?return \{ bids: b, asks: a, maxVolume \};\n  \}, \[price\]\);/, stateAndEffect);

code = code.replace(/simulatedOrderBook\.bids/g, "bids");
code = code.replace(/simulatedOrderBook\.asks/g, "asks");
code = code.replace(/simulatedOrderBook\.maxVolume/g, "maxVolume");

fs.writeFileSync(file, code, 'utf8');
