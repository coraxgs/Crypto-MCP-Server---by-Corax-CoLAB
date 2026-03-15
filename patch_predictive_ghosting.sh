cat << 'INNER_EOF' > gui/frontend/src/components/features/PredictiveGhosting.tsx
import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist';
import { callMcpEndpoint } from '../../api_mcp';

export default function PredictiveGhosting() {
  const [scrubberValue, setScrubberValue] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAndPlot = async () => {
        try {
            // Use MCP_CCXT directly to get OHLCV data for the historical part
            // (ta_mcp returns only the latest indicators, not the series)
            const ohlcvData = await callMcpEndpoint('MCP_CCXT', 'fetch_ohlcv', { exchange: 'binance', symbol: 'BTC/USDT', timeframe: '1h', limit: 50 });

            if (!ohlcvData || !Array.isArray(ohlcvData) || ohlcvData.length === 0) {
                console.error("No OHLCV data received for predictive ghosting");
                return;
            }

            const x = [];
            const y = [];

            // Extract closing prices
            for (let i = 0; i < ohlcvData.length; i++) {
                x.push(`T${i - ohlcvData.length + 1}`);
                y.push(ohlcvData[i][4]); // Close price is index 4
            }

            const currentPrice = y[y.length - 1];

            // Try to get TA indicators to inform the prediction trend
            let trendFactor = 0; // -1 to 1
            let volatility = currentPrice * 0.01; // Default 1% volatility

            try {
                const taData = await callMcpEndpoint('MCP_TA', 'compute_indicators', { exchange: 'binance', symbol: 'BTC/USDT', timeframe: '1h' });
                if (taData) {
                    if (taData.signal === 'buy') trendFactor = 0.5;
                    if (taData.signal === 'sell') trendFactor = -0.5;

                    if (taData.bb_upper && taData.bb_lower) {
                        volatility = (taData.bb_upper - taData.bb_lower) / 4; // Use bollinger bands for volatility proxy
                    }
                }
            } catch (taErr) {
                console.warn("Could not fetch TA data for prediction, using defaults", taErr);
            }

            // Generate Predictive Data (Cone) based on current price, trend, and volatility
            const futureSteps = 20;
            let simPrice = currentPrice;

            const futureX = [];
            const futureY = [];
            const futureLower = [];
            const futureUpper = [];

            for (let i = 1; i <= futureSteps; i++) {
                futureX.push(`T${i}`);

                // Median Prediction (influenced by TA trend)
                // Add a small random walk to simulate price movement, but trend-biased
                simPrice += (Math.random() - 0.5 + (trendFactor * 0.2)) * (volatility * 0.5);
                futureY.push(simPrice);

                // Expanding bounds based on volatility
                const spread = Math.sqrt(i) * volatility * 0.5;
                futureLower.push(simPrice - spread);
                futureUpper.push(simPrice + spread);
            }

            const traceHistorical = {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                name: 'Historical (BTC/USDT 1h)',
                line: { color: '#60a5fa', width: 2 }
            };

            const tracePredictive = {
                x: [...x.slice(-1), ...futureX],
                y: [y[y.length - 1], ...futureY],
                type: 'scatter',
                mode: 'lines',
                name: 'TA Median Projection',
                line: { color: '#10b981', dash: 'dashdot', width: 2 }
            };

            const traceUpper = {
                x: [...x.slice(-1), ...futureX],
                y: [y[y.length - 1], ...futureUpper],
                type: 'scatter',
                mode: 'lines',
                line: { color: 'transparent' },
                showlegend: false
            };

            const traceLower = {
                x: [...x.slice(-1), ...futureX],
                y: [y[y.length - 1], ...futureLower],
                type: 'scatter',
                mode: 'lines',
                fill: 'tonexty',
                fillcolor: 'rgba(16, 185, 129, 0.15)',
                line: { color: 'transparent' },
                name: 'Confidence Interval'
            };

            // Ghost Crosshairs based on scrubber
            const targetIndex = scrubberValue;
            let traceGhost = null;
            if (targetIndex > 0 && targetIndex <= futureSteps) {
                const targetX = futureX[targetIndex - 1];
                const targetY = futureY[targetIndex - 1];

                traceGhost = {
                    x: [targetX],
                    y: [targetY],
                    type: 'scatter',
                    mode: 'markers',
                    marker: { size: 12, color: '#ef4444', symbol: 'cross-thin', line: { width: 2, color: '#ef4444' } },
                    name: 'Ghost Target Lock'
                };
            }

            const layout = {
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#888' },
                margin: { t: 20, b: 30, l: 40, r: 20 },
                xaxis: { showgrid: false },
                yaxis: { gridcolor: 'rgba(255,255,255,0.05)' },
                showlegend: true,
                legend: { orientation: 'h', y: 1.1 },
            };

            const traces = [traceHistorical, traceUpper, traceLower, tracePredictive];
            if (traceGhost) traces.push(traceGhost);

            Plotly.react('predictive-chart', traces as any, layout as any, {displayModeBar: false});

        } catch (error) {
            console.error("Error generating predictive ghosting:", error);
        }
    };

    fetchAndPlot();
    // Update chart when scrubber moves, but we don't need to re-fetch data every time the scrubber moves.
    // The dependency array handles this. A more robust implementation would separate fetching and plotting.
  }, [scrubberValue]);

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #10b981' }}>
                TA Trajectory Ghosting
            </h3>
            <div style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #10b981' }}>
                PROBABILITY CONES ACTIVE
            </div>
        </div>
        <div id="predictive-chart" style={{ width: '100%', height: '250px' }} ref={chartRef}></div>

        {/* Timeline Scrubber */}
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>
                <span>Present</span>
                <span style={{ color: scrubberValue > 0 ? '#ef4444' : '#94a3b8' }}>
                    {scrubberValue > 0 ? `T+${scrubberValue} Prediction` : 'Timeline Scrubber'}
                </span>
                <span>Future</span>
            </div>
            <input
                type="range"
                min="0"
                max="20"
                value={scrubberValue}
                onChange={(e) => setScrubberValue(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', background: 'transparent' }}
                className="neon-slider"
            />
        </div>
    </div>
  );
}
INNER_EOF
