import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, Rewind, Settings } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, Rewind, Settings } from 'lucide-react';
import Plotly from 'plotly.js-basic-dist';
import { callMcpEndpoint } from '../../api_mcp';

export default function BacktestArenaPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [strategy, setStrategy] = useState('Corax-AI-V1');


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


  const totalProfit = useMemo(() => {
    const visibleData = historicalData.slice(0, Math.max(1, Math.floor((progress / 100) * historicalData.length)));
    return visibleData.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  }, [progress, historicalData]);

  // Handle Playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + speed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Render Chart
  useEffect(() => {
    const visibleIndex = Math.max(1, Math.floor((progress / 100) * historicalData.length));
    const visibleData = historicalData.slice(0, visibleIndex);

    const trace1 = {
      x: visibleData.map(d => d.date),
      close: visibleData.map(d => d.close),
      high: visibleData.map(d => d.high),
      low: visibleData.map(d => d.low),
      open: visibleData.map(d => d.open),
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y',
      increasing: {line: {color: '#10b981'}},
      decreasing: {line: {color: '#ef4444'}}
    };

    const buyMarkers = visibleData.filter(d => d.trade === 'BUY');
    const sellMarkers = visibleData.filter(d => d.trade === 'SELL');

    const traceBuys = {
      x: buyMarkers.map(d => d.date),
      y: buyMarkers.map(d => d.low - 500),
      mode: 'markers',
      type: 'scatter',
      marker: { symbol: 'triangle-up', size: 10, color: '#10b981', line: {width: 2, color: '#fff'} },
      name: 'BUY'
    };

    const traceSells = {
      x: sellMarkers.map(d => d.date),
      y: sellMarkers.map(d => d.high + 500),
      mode: 'markers',
      type: 'scatter',
      marker: { symbol: 'triangle-down', size: 10, color: '#ef4444', line: {width: 2, color: '#fff'} },
      name: 'SELL'
    };

    const layout = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#888' },
      margin: { t: 20, b: 30, l: 40, r: 20 },
      xaxis: { gridcolor: 'rgba(255,255,255,0.05)', rangeslider: { visible: false } },
      yaxis: { gridcolor: 'rgba(255,255,255,0.05)' },
      showlegend: false
    };

    Plotly.react('backtest-chart', [trace1, traceBuys, traceSells] as any, layout as any, {displayModeBar: false});
  }, [progress, historicalData]);

  return (
    <div className="card interactive-element" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #8b5cf6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6' }}>
          Time-Machine Backtesting Arena
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            aria-label="Select Strategy"
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}
          >
            <option>Corax-AI-V1</option>
            <option>Mean-Reversion-Alpha</option>
            <option>Momentum-Burst</option>
          </select>
          <button aria-label="Settings" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Settings size={16} color="#888" />
          </button>
        </div>
      </div>

      {/* Stats Overlay */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Simulated PNL</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: totalProfit >= 0 ? '#10b981' : '#ef4444' }}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} USD
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Win Rate</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>68.4%</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Max Drawdown</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>-4.2%</div>
        </div>
      </div>

      {/* Chart Container */}
      <div id="backtest-chart" style={{ width: '100%', height: '250px' }}></div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          aria-label="Rewind to start"
          onClick={() => setProgress(0)}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '5px' }}
        >
          <Rewind size={20} />
        </button>

        <button
          aria-label={isPlaying ? "Pause backtest" : "Play backtest"}
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: isPlaying ? '#ef4444' : '#10b981',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 10px ${isPlaying ? '#ef4444' : '#10b981'}`
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '3px' }} />}
        </button>

        <button
          aria-label={`Increase playback speed (currently ${speed}x)`}
          onClick={() => setSpeed(s => s >= 5 ? 1 : s + 2)}
          style={{ background: 'none', border: 'none', color: speed > 1 ? '#3b82f6' : '#888', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', gap: '2px' }}
        >
          <FastForward size={20} /> <span style={{fontSize: '10px', fontFamily: 'monospace'}}>{speed}x</span>
        </button>

        {/* Timeline Slider */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            aria-label="Playback progress"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              setProgress(Number(e.target.value));
              setIsPlaying(false);
            }}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#8b5cf6' }}
          />
        </div>

        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#888', width: '40px', textAlign: 'right' }}>
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
}
