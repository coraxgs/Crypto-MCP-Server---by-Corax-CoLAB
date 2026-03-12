import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { io } from 'socket.io-client';

const FUTURE_POINTS = 20;

export default function PredictiveTrajectoryChart() {
  const [data, setData] = useState<any>(null);
  const [scrubberValue, setScrubberValue] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [symbol, setSymbol] = useState('BTC/USDT');

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const socket = io(socketUrl);

    // We listen to the ticker for the live price to anchor the trajectory
    socket.on('ticker', (tickerData) => {
        setIsConnected(true);
        if (tickerData && tickerData.last) {
            setSymbol(tickerData.symbol);

            // Generate a more robust mock based on the real time live price anchor
            const currentPrice = tickerData.last;

            // Mock Historical (In production, this would fetch from a /api/klines endpoint via CCXT)
            const x = [];
            const y = [];
            let histPrice = currentPrice - 500;
            for (let i = -50; i <= 0; i++) {
                x.push(i);
                y.push(histPrice);
                histPrice += (Math.random() - 0.45) * 20; // Upward drift to match current price
            }

            // Generate AI Probability cone starting strictly from current live price
            const xFuture = [];
            const yUpper = [];
            const yLower = [];
            const yTarget = [];

            let currentUpper = currentPrice;
            let currentLower = currentPrice;
            let currentTarget = currentPrice;

            for (let i = 0; i <= FUTURE_POINTS; i++) {
                xFuture.push(i);
                yTarget.push(currentTarget);
                yUpper.push(currentUpper);
                yLower.push(currentLower);

                // Expand cone over time based on volatility
                const volatility = tickerData.percentage ? Math.abs(tickerData.percentage) / 10 : 0.05;
                const spread = i * (currentPrice * volatility);

                currentUpper = currentTarget + spread + Math.random() * 50;
                currentLower = currentTarget - spread - Math.random() * 50;
                // Add a directional bias based on recent change
                const bias = (tickerData.change || 0) > 0 ? 1 : -1;
                currentTarget += (Math.random() - 0.5 + (bias * 0.1)) * (currentPrice * 0.001);
            }

            setData({
                hist: { x, y, lastPrice: currentPrice },
                probs: { xFuture, yUpper, yLower, yTarget }
            });
        }
    });

    socket.on('connect_error', () => setIsConnected(false));
    socket.on('disconnect', () => setIsConnected(false));

    return () => { socket.disconnect(); };
  }, []);

  if (!data) return <div className="card">Loading Trajectories...</div>;

  const { hist, probs } = data;

  const historicalTrace = {
    x: hist.x,
    y: hist.y,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#3b82f6', width: 2 },
    name: `Historical (${symbol})`
  };

  const confidenceCone = {
    x: [...probs.xFuture, ...probs.xFuture.slice().reverse()],
    y: [...probs.yUpper, ...probs.yLower.slice().reverse()],
    fill: 'toself',
    fillcolor: 'rgba(16, 185, 129, 0.1)',
    line: { color: 'transparent' },
    name: 'AI Confidence Cone',
    showlegend: false,
    hoverinfo: 'skip'
  };

  const aiTargetLine = {
    x: probs.xFuture,
    y: probs.yTarget,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#10b981', width: 2, dash: 'dot' },
    marker: { color: '#10b981', size: 4 },
    name: 'AI Prediction'
  };

  // The 'Ghost' crosshair based on scrubber
  const ghostCrosshairX = scrubberValue;
  const ghostCrosshairY = probs.yTarget[scrubberValue];

  const ghostPoint = {
    x: [ghostCrosshairX],
    y: [ghostCrosshairY],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: '#ef4444',
      size: 15,
      symbol: 'cross-thin',
      line: { color: '#ef4444', width: 2 }
    },
    name: 'Execution Target'
  };

  return (
    <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: '#10b981', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, background: isConnected ? '#10b981' : '#f59e0b', borderRadius: '50%', marginRight: 8, boxShadow: `0 0 8px ${isConnected ? '#10b981' : '#f59e0b'}` }}></span>
          Predictive Trajectory {isConnected ? '(LIVE)' : '(DISCONNECTED)'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Timeline Scrubber (T+{scrubberValue})</span>
            <input
                type="range"
                min="0"
                max={FUTURE_POINTS}
                value={scrubberValue}
                onChange={(e) => setScrubberValue(parseInt(e.target.value))}
                style={{ width: '150px', accentColor: '#10b981' }}
            />
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <Plot
          data={[historicalTrace, confidenceCone, aiTargetLine, ghostPoint]}
          layout={{
            autosize: true,
            margin: { t: 10, r: 10, b: 30, l: 40 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: {
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              tickfont: { color: '#94a3b8' },
              title: { text: 'Time (T)', font: { color: '#64748b', size: 10 } }
            },
            yaxis: {
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              tickfont: { color: '#94a3b8', family: 'monospace' },
              tickprefix: '$'
            },
            showlegend: true,
            legend: {
              orientation: 'h',
              y: 1.1,
              x: 0,
              font: { color: '#94a3b8', size: 10 }
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ displayModeBar: false }}
        />

        {/* Cyberpunk Scanline overlay specifically for chart area */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 4px, 6px 100%',
            pointerEvents: 'none',
            zIndex: 10
        }}></div>
      </div>
    </div>
  );
}
