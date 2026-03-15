import React, { useEffect, useState, useRef } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist';
import { callMcpEndpoint } from '../../api_mcp';
import { callMcpEndpoint } from '../../api_mcp';

export default function PredictiveGhosting() {
  const [scrubberValue, setScrubberValue] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate base trend
    const x = [];
    const y = [];
    const lowerBound = [];
    const upperBound = [];

    let price = 50000;

    // Historical Data
    for (let i = -50; i <= 0; i++) {
      x.push(`T${i}`);
      y.push(price);
      lowerBound.push(null);
      upperBound.push(null);
      price += (Math.random() - 0.45) * 500;
    }

    // Predictive Data (Cone)
    const futureSteps = 20;
    let currentPrice = price;

    const futureX = [];
    const futureY = [];
    const futureLower = [];
    const futureUpper = [];

    for (let i = 1; i <= futureSteps; i++) {
        futureX.push(`T${i}`);

        // Median Prediction (Slight upward trend)
        currentPrice += (Math.random() - 0.3) * 600;
        futureY.push(currentPrice);

        // Expanding bounds
        const spread = i * 400;
        futureLower.push(currentPrice - spread);
        futureUpper.push(currentPrice + spread);
    }

    const traceHistorical = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      name: 'Historical',
      line: { color: '#60a5fa', width: 2 }
    };

    const tracePredictive = {
        x: [...x.slice(-1), ...futureX],
        y: [y[y.length - 1], ...futureY],
        type: 'scatter',
        mode: 'lines',
        name: 'AI Median Projection',
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
        fillcolor: 'rgba(16, 185, 129, 0.15)', // Light green cone
        line: { color: 'transparent' },
        name: 'Confidence Interval (95%)'
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
      // Update shapes for crosshair lines if needed
    };

    const traces = [traceHistorical, traceUpper, traceLower, tracePredictive];
    if (traceGhost) traces.push(traceGhost);

    Plotly.react('predictive-chart', traces as any, layout as any, {displayModeBar: false});
  }, [scrubberValue]);

  return (
    <div className="card glass-panel interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px #10b981' }}>
                AI Trajectory Ghosting
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
