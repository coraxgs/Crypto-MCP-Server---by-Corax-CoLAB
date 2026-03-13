import React, { useState, useEffect } from 'react';
import { BrainCircuit, Activity, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MarketSentimentAnalyzer() {
  const [sentiment, setSentiment] = useState<'neutral' | 'bullish' | 'bearish' | 'loading'>('loading');
  const [analysis, setAnalysis] = useState<string>('Initializing AI analysis module...');
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    // Simulate initial AI fetch
    const fetchSentiment = () => {
      setSentiment('loading');
      setAnalysis('Querying LLM MCP for latest market data synthesis...');

      setTimeout(() => {
        const sentiments = ['bullish', 'bearish', 'neutral'];
        const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)] as any;

        let text = '';
        if (randomSentiment === 'bullish') {
          text = 'LLM Analysis indicates strong accumulation patterns. Whale wallets are moving assets off exchanges. Order book depth shows solid support at current levels. Recommended Strategy: Scaling into spot positions.';
        } else if (randomSentiment === 'bearish') {
          text = 'LLM Analysis flags macroeconomic headwinds and increased exchange inflows. Momentum indicators show bearish divergence. Recommended Strategy: Increase stablecoin allocation and tighten stop-losses.';
        } else {
          text = 'LLM Analysis suggests market indecision. Equal distribution of buying and selling pressure. Volatility compression detected. Recommended Strategy: Delta-neutral farming or wait for clear breakout.';
        }

        setSentiment(randomSentiment);
        setAnalysis(text);
        setConfidence(Math.floor(Math.random() * 25) + 65); // 65-90% confidence
      }, 2500);
    };

    fetchSentiment();
    // Refresh every 30 seconds to simulate real-time AI updates
    const interval = setInterval(fetchSentiment, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStyleColor = () => {
    if (sentiment === 'bullish') return '#10b981';
    if (sentiment === 'bearish') return '#ef4444';
    if (sentiment === 'neutral') return '#3b82f6';
    return '#8b5cf6'; // loading
  };

  const Icon = sentiment === 'bullish' ? TrendingUp : sentiment === 'bearish' ? TrendingDown : sentiment === 'neutral' ? Minus : Activity;

  return (
    <div className="card interactive-element" style={{ gridColumn: '1 / -1', minHeight: '150px', position: 'relative', overflow: 'hidden', backgroundColor: '#050510', borderLeft: `4px solid ${getStyleColor()}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <BrainCircuit size={24} color={getStyleColor()} />
        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: getStyleColor() }}>AI Market Sentiment Analyzer</h3>
        {sentiment !== 'loading' && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#a3a3a3', background: '#111', padding: '4px 8px', borderRadius: '4px' }}>
            <Activity size={14} />
            <span>CONFIDENCE: {confidence}%</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          padding: '15px',
          borderRadius: '8px',
          border: `1px solid ${getStyleColor()}40`,
          minWidth: '120px'
        }}>
          <Icon size={32} color={getStyleColor()} style={{ marginBottom: '8px', animation: sentiment === 'loading' ? 'pulse 1s infinite' : 'none' }} />
          <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: getStyleColor(), letterSpacing: '2px', fontSize: '14px' }}>
            {sentiment}
          </span>
        </div>

        <div style={{ flex: 1, fontFamily: 'monospace', lineHeight: '1.6', color: '#e5e5e5', fontSize: '14px' }}>
          {sentiment === 'loading' ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8b5cf6' }}>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid #8b5cf6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                {analysis}
             </div>
          ) : (
            <p style={{ margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              <span style={{ color: '#888', marginRight: '8px' }}>&gt;</span>
              {analysis}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
