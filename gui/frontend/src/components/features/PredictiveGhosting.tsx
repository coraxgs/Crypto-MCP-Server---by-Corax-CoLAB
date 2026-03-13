import React, { useEffect } from 'react';
import Plotly from 'plotly.js-basic-dist';

export default function PredictiveGhosting() {
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

    const layout = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#888' },
      margin: { t: 20, b: 30, l: 40, r: 20 },
      xaxis: { showgrid: false },
      yaxis: { gridcolor: 'rgba(255,255,255,0.05)' },
      showlegend: true,
      legend: { orientation: 'h', y: 1.1 }
    };

    Plotly.react('predictive-chart', [traceHistorical, traceUpper, traceLower, tracePredictive] as any, layout as any, {displayModeBar: false});
  }, []);

  return (
    <div className="card interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Trajectory Ghosting
            </h3>
            <div style={{ fontSize: '10px', color: '#fff', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #10b981' }}>
                MODEL: KERNEL-SVR
            </div>
        </div>
        <div id="predictive-chart" style={{ width: '100%', height: '200px' }}></div>
    </div>
  );
}
