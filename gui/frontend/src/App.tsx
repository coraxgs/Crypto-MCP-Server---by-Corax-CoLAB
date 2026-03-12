import React, { useState, useEffect } from 'react'
import PortfolioPanel from './components/PortfolioPanel'
import TickerPanel from './components/TickerPanel'
import OrderPanel from './components/OrderPanel'
import OrdersLogPanel from './components/OrdersLogPanel'
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form onSubmit={handleLogin} className="card" style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ margin: 0 }}>Login Required</h3>
          <p className="small-muted">Enter dashboard password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: 'transparent', color: 'white' }}
          />
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PortfolioPanel />
        <TickerPanel />
      </div>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <OrderPanel />
        <OrdersLogPanel />
      </aside>
    </div>
  )
}
