import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

interface PredictiveChartProps {
    symbol: string;
    historicalData: {x: string, y: number}[];
}

export default function PredictiveChart({ symbol, historicalData }: PredictiveChartProps) {
    if (!historicalData || historicalData.length === 0) return null;

    // Generate mock probability cone
    const lastPoint = historicalData[historicalData.length - 1];
    const lastPrice = lastPoint.y;
    const lastDate = new Date(lastPoint.x);

    const futureDates = Array.from({length: 20}, (_, i) => {
        const d = new Date(lastDate);
        d.setMinutes(d.getMinutes() + (i+1)*5);
        return d.toISOString();
    });

    // Simulate cone expanding over time
    const upperConfidence = futureDates.map((_, i) => lastPrice + (lastPrice * 0.005 * i));
    const lowerConfidence = futureDates.map((_, i) => lastPrice - (lastPrice * 0.005 * i));
    const predictedPath = futureDates.map((_, i) => lastPrice + (lastPrice * 0.001 * i * (Math.random() > 0.5 ? 1 : -1)));


    return (
        <div style={{ position: 'relative', height: '300px', width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, fontFamily: 'monospace', color: '#3b82f6', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '4px' }}>
                AI PREDICTIVE GHOSTING: {symbol}
            </div>
            <Plot
                data={[
                    // Historical line
                    {
                        x: historicalData.map(d => d.x),
                        y: historicalData.map(d => d.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {color: '#10b981', width: 2},
                        name: 'Historical'
                    },
                    // Upper Confidence Bound
                    {
                        x: [lastPoint.x, ...futureDates],
                        y: [lastPrice, ...upperConfidence],
                        type: 'scatter',
                        mode: 'lines',
                        line: {color: 'rgba(59, 130, 246, 0)'},
                        showlegend: false,
                        hoverinfo: 'skip'
                    },
                    // Lower Confidence Bound (filled area)
                    {
                        x: [lastPoint.x, ...futureDates],
                        y: [lastPrice, ...lowerConfidence],
                        type: 'scatter',
                        mode: 'lines',
                        fill: 'tonexty',
                        fillcolor: 'rgba(59, 130, 246, 0.2)', // Neon blue cone
                        line: {color: 'rgba(59, 130, 246, 0)'},
                        name: 'Confidence Interval'
                    },
                    // Predicted Path (Ghost line)
                    {
                        x: [lastPoint.x, ...futureDates],
                        y: [lastPrice, ...predictedPath],
                        type: 'scatter',
                        mode: 'lines',
                        line: {color: '#3b82f6', width: 2, dash: 'dashdot'},
                        name: 'AI Prediction'
                    }
                ]}
                layout={{
                    autosize: true,
                    margin: { t: 40, r: 20, l: 50, b: 30 },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#64748b' },
                    xaxis: {
                        gridcolor: 'rgba(255,255,255,0.05)',
                        showgrid: true,
                    },
                    yaxis: {
                        gridcolor: 'rgba(255,255,255,0.05)',
                        showgrid: true,
                    },
                    showlegend: false
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
