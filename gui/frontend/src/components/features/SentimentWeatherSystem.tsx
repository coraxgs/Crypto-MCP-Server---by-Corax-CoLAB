import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type Sentiment = 'neutral' | 'bullish' | 'bearish';

export default function SentimentWeatherSystem() {
  const [sentiment, setSentiment] = useState<Sentiment>('neutral');
  const [volatilityInfo, setVolatilityInfo] = useState({ text: 'Awaiting Market Data...', percent: 0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const socket = io(socketUrl);

    // We derive sentiment from the live ticker stream's 24h percentage change
    socket.on('ticker', (data) => {
        setIsConnected(true);
        if (data && data.percentage !== undefined) {
            const pct = data.percentage;
            setVolatilityInfo({ text: `${data.symbol} 24h:`, percent: pct });

            // Highly simplistic sentiment engine based on major asset (e.g. BTC) volatility
            if (pct > 5) {
                setSentiment('bullish');
            } else if (pct < -5) {
                setSentiment('bearish');
            } else {
                setSentiment('neutral');
            }
        }
    });

    socket.on('connect_error', () => {
        setIsConnected(false);
        setVolatilityInfo({ text: 'OFFLINE - MOCK SENTIMENT', percent: 0 });
    });

    socket.on('disconnect', () => {
        setIsConnected(false);
        setVolatilityInfo({ text: 'OFFLINE - MOCK SENTIMENT', percent: 0 });
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 9999, // Moved to left to avoid Oracle Copilot
        background: 'rgba(0,0,0,0.8)', border: '1px solid #334155', padding: '10px 15px', borderRadius: '4px',
        display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(5px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>Global Sentiment AI: {isConnected ? '(LIVE)' : '(MOCK)'}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                {volatilityInfo.text} <span style={{ color: volatilityInfo.percent >= 0 ? '#10b981' : '#ef4444' }}>{volatilityInfo.percent.toFixed(2)}%</span>
            </div>
        </div>
        <div style={{
            fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', textTransform: 'uppercase',
            color: sentiment === 'bullish' ? '#10b981' : sentiment === 'bearish' ? '#ef4444' : '#3b82f6',
            textShadow: `0 0 10px ${sentiment === 'bullish' ? '#10b981' : sentiment === 'bearish' ? '#ef4444' : '#3b82f6'}`,
            marginLeft: '10px', borderLeft: '1px solid #334155', paddingLeft: '10px'
        }}>
            {sentiment === 'bullish' ? 'EUPHORIA (BULL)' : sentiment === 'bearish' ? 'FEAR/OVERLOAD (BEAR)' : 'STABLE (NEUTRAL)'}
        </div>
      </div>

      {/* Weather Layer: Rendered behind the main grid but in front of base background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
      }}>
        {/* BULL MARKET: Aurora Borealis Effect */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            opacity: sentiment === 'bullish' ? 1 : 0,
            transition: 'opacity 5s ease-in-out',
            filter: 'blur(50px)'
        }}></div>

        {/* Particles for Bull Market */}
        {sentiment === 'bullish' && Array.from({ length: 50 }).map((_, i) => (
            <div key={`bull-${i}`} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                bottom: `-10px`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                background: '#10b981',
                borderRadius: '50%',
                opacity: Math.random() * 0.5 + 0.1,
                boxShadow: '0 0 10px #10b981',
                animation: `floatUp ${Math.random() * 10 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
            }}></div>
        ))}

        {/* BEAR MARKET: Digital Matrix Rain & Red Glitch */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.05), transparent 30%)',
            opacity: sentiment === 'bearish' ? 1 : 0,
            transition: 'opacity 3s ease-in-out',
            boxShadow: sentiment === 'bearish' ? 'inset 0 0 100px rgba(239, 68, 68, 0.2)' : 'none'
        }}></div>

        {/* Rain for Bear Market */}
        {sentiment === 'bearish' && Array.from({ length: 100 }).map((_, i) => (
            <div key={`bear-${i}`} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                width: '1px',
                height: `${Math.random() * 30 + 10}px`,
                background: 'linear-gradient(to bottom, transparent, rgba(239, 68, 68, 0.8))',
                opacity: Math.random() * 0.8 + 0.2,
                animation: `rainDown ${Math.random() * 2 + 0.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
            }}></div>
        ))}

        {/* Lightning Flash (Occasional during bear) */}
        {sentiment === 'bearish' && (
             <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: '#ef4444',
                animation: 'lightning 8s infinite'
            }}></div>
        )}

      </div>

      <style>{`
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes rainDown {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes lightning {
            0%, 95%, 98%, 100% { opacity: 0; }
            96%, 99% { opacity: 0.1; }
            97% { opacity: 0.05; }
        }
      `}</style>
    </>
  );
}
