import React, { useState, useEffect } from 'react';
import { callMcpEndpoint } from '../../api_mcp';
import { useActivePortfolioSymbol } from '../../hooks/useActivePortfolioSymbol';

export default function FlashCrashMatrix() {
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const { targetSymbol: activeSymbolHook, targetExchange: activeExchange } = useActivePortfolioSymbol();

  useEffect(() => {
    let active = true;

    const fetchOrderBook = async () => {
        try {
            const obData = await callMcpEndpoint('MCP_CCXT', 'fetch_order_book', { exchange: activeExchange, symbol: activeSymbolHook, limit: 100 });
            if (!active || !obData || !obData.bids || !obData.asks) return;

            // Group into 10 price buckets
            const numBuckets = 10;
            const buckets: any[] = [];

            const highestBid = obData.bids[0][0];
            const lowestAsk = obData.asks[0][0];
            const midPrice = (highestBid + lowestAsk) / 2;

            // Analyze a range of +/- 5% around mid price
            const range = midPrice * 0.05;
            const bucketSize = range / (numBuckets / 2);

            for (let i = 0; i < numBuckets; i++) {
                const priceTarget = midPrice - range + (i * bucketSize);

                let bidVol = 0;
                let askVol = 0;

                obData.bids.forEach((b: any) => {
                    if (Math.abs(b[0] - priceTarget) <= bucketSize / 2) bidVol += b[1];
                });

                obData.asks.forEach((a: any) => {
                    if (Math.abs(a[0] - priceTarget) <= bucketSize / 2) askVol += a[1];
                });

                buckets.push({
                    price: priceTarget,
                    bidVol,
                    askVol,
                    imbalance: bidVol - askVol,
                    totalVol: bidVol + askVol
                });
            }

            setMatrixData(buckets);
        } catch (err) {
            console.error("Error fetching orderbook for Flash Crash Matrix:", err);
        }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000); // Fast updates
    return () => { active = false; clearInterval(interval); };
  }, [activeSymbolHook, activeExchange]);

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #ef4444', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #ef4444' }}>
              Flash-Crash Matrix
          </h3>
          <div style={{ fontSize: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ef4444' }}>
              ORDERBOOK IMBALANCE
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', overflowY: 'auto' }}>
          {matrixData.map((bucket, i) => {
              const total = bucket.totalVol || 1;
              const bidPct = (bucket.bidVol / total) * 100;
              const askPct = (bucket.askVol / total) * 100;
              const intensity = Math.min(1, Math.abs(bucket.imbalance) / (total + 1));

              const isDanger = bucket.imbalance < 0 && intensity > 0.5;
              const isPump = bucket.imbalance > 0 && intensity > 0.5;

              return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '5px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', borderLeft: isDanger ? '2px solid #ef4444' : isPump ? '2px solid #10b981' : '2px solid #334155' }}>
                      <div style={{ width: '80px', color: '#cbd5e1', fontSize: '12px', fontFamily: 'monospace' }}>
                          ${bucket.price.toFixed(2)}
                      </div>
                      <div style={{ flex: 1, display: 'flex', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${bidPct}%`, background: '#10b981', opacity: 0.8 }}></div>
                          <div style={{ width: `${askPct}%`, background: '#ef4444', opacity: 0.8 }}></div>
                      </div>
                      <div style={{ width: '60px', textAlign: 'right', color: isDanger ? '#ef4444' : isPump ? '#10b981' : '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>
                          {intensity > 0.5 ? 'CRITICAL' : 'STABLE'}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
}
