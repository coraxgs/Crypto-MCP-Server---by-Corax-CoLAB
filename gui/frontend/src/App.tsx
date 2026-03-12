import React, { useState, useEffect } from 'react'
import PortfolioPanel from './components/PortfolioPanel'
import TickerPanel from './components/TickerPanel'
import OrderPanel from './components/OrderPanel'
import OrdersLogPanel from './components/OrdersLogPanel'
import OracleCopilot from './components/features/OracleCopilot'
import RiskRadarPanel from './components/features/RiskRadarPanel'
import BacktestArenaPanel from './components/features/BacktestArenaPanel';
import NeuralNetLiquidity from './components/features/NeuralNetLiquidity';
import HolographicOrderBook from './components/features/HolographicOrderBook';
import PredictiveTrajectoryChart from './components/features/PredictiveTrajectoryChart';
import OrbitalPortfolio from './components/features/OrbitalPortfolio';
import SentimentWeatherSystem from './components/features/SentimentWeatherSystem';
import { getAuthToken, setAuthToken } from './auth'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleAuthError = () => setIsAuthenticated(false);
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthToken(password);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #000 100%)' }}>
        <form onSubmit={handleLogin} className="card" style={{ width: 350, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid #334155', boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center'}}>
            <div style={{width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981'}}></div>
            <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>SYSTEM AUTHENTICATION</h3>
          </div>
          <p className="small-muted" style={{textAlign: 'center', fontFamily: 'monospace'}}>Corax CoLAB - Edge AI Protocol</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ACCESS_KEY"
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid #334155', background: 'rgba(0,0,0,0.5)', color: '#10b981', fontFamily: 'monospace', outline: 'none', transition: 'border 0.3s' }}
            onFocus={(e) => e.target.style.border = '1px solid #10b981'}
            onBlur={(e) => e.target.style.border = '1px solid #334155'}
          />
          <button type="submit" className="btn-primary" style={{fontFamily: 'monospace', letterSpacing: '2px'}}>INITIALIZE LINK</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#020205' }}>
      <SentimentWeatherSystem />
      {/* Background grid effect */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="main-grid" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <PortfolioPanel />
          <OrbitalPortfolio />
          <NeuralNetLiquidity />
          <BacktestArenaPanel />
        </div>

        {/* Right Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TickerPanel />
          <PredictiveTrajectoryChart />
          <HolographicOrderBook />
          <RiskRadarPanel />
          <OrderPanel />
          <OrdersLogPanel />
        </aside>
      </div>

      {/* Feature 3: The Oracle Co-Pilot */}
      <OracleCopilot />

    </div>
  )
}
