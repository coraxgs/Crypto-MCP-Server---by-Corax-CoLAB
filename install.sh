#!/bin/bash
set -euo pipefail

# Setup script for Crypto MCP GUI (backend + frontend + systemd)
# - Creates directories and writes files
# - Installs Node if missing
# - Installs npm deps for backend/frontend (fallback frontend without Tailwind)
# - Initializes SQLite DB (orders table)
# - Kills any process on port 4000 before test-start
# - Enables and restarts systemd service for backend
#
# Run as user 'pelle' (script will sudo for system changes)

USER_HOME="/home/pelle"
BASE="$USER_HOME/cryptomcpserver/gui"
BACKEND="$BASE/backend"
FRONTEND="$BASE/frontend"
SERVICE_NAME="crypto-mcp-gui.service"
SYSTEMD_PATH="/etc/systemd/system/$SERVICE_NAME"

echo "==> Ensure base directories exist"
mkdir -p "$BACKEND"
mkdir -p "$FRONTEND/src/components"

# -------------------------------
# Ensure Node.js exists
# -------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "==> Node.js not found — installing Node.js 20..."
  curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential
else
  echo "==> Node.js found: $(node -v)"
fi

# -------------------------------
# Write backend files (backup existing)
# -------------------------------
echo "==> Writing backend files (backups created if exist)"

# package.json
if [ -f "$BACKEND/package.json" ]; then cp "$BACKEND/package.json" "$BACKEND/package.json.bak"; fi
cat > "$BACKEND/package.json" <<'EOF'
{
  "name": "crypto-mcp-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "sqlite3": "^5.1.6",
    "body-parser": "^1.20.2"
  }
}
EOF

# .env.example
cat > "$BACKEND/.env.example" <<'EOF'
# Backend config for Crypto MCP GUI - copy to .env and edit if needed
MCP_CCXT=http://127.0.0.1:7001/mcp
MCP_PORTFOLIO=http://127.0.0.1:7004/mcp
PORT=4000
EOF

# server.js (careful: valid JS, no escaping issues)
if [ -f "$BACKEND/server.js" ]; then cp "$BACKEND/server.js" "$BACKEND/server.js.bak"; fi
cat > "$BACKEND/server.js" <<'EOF'
/**
 * Crypto MCP GUI backend - server.js
 * - Proxy JSON-RPC calls to local MCP services
 * - Provides REST endpoints for portfolio, ticker, orders
 * - Provides order dry_run + execute (uses ccxt MCP create_order)
 * - Logs orders to SQLite and emits socket.io events
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const MCP_CCXT = process.env.MCP_CCXT || 'http://127.0.0.1:7001/mcp';
const MCP_PORTFOLIO = process.env.MCP_PORTFOLIO || 'http://127.0.0.1:7004/mcp';
const PORT = parseInt(process.env.PORT || '4000', 10);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite DB
const DB_PATH = path.resolve(__dirname, 'orders.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB', err);
    process.exit(1);
  }
});

// Create orders table (safe)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    exchange TEXT,
    symbol TEXT,
    side TEXT,
    type TEXT,
    amount REAL,
    price REAL,
    dry_run INTEGER,
    status TEXT,
    response TEXT
  )`, (err) => {
    if (err) console.error('Error creating orders table:', err);
  });
});

// Helper: call MCP tools via JSON-RPC tools/call
async function callMCP(mcpUrl, toolName, args = {}) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args
    }
  };
  const res = await axios.post(mcpUrl, payload, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json,text/event-stream' },
    timeout: 20000
  });
  if (res.data && res.data.result) {
    const r = res.data.result;
    if (r.structuredContent) return r.structuredContent;
    if (r.content && Array.isArray(r.content) && r.content.length > 0 && r.content[0].text) {
      try {
        return JSON.parse(r.content[0].text);
      } catch (e) {
        return r.content[0].text;
      }
    }
    return r;
  }
  return res.data;
}

/* Routes */

// GET /api/portfolio
app.get('/api/portfolio', async (req, res) => {
  const exchanges = (req.query.exchanges || 'binance').split(',').map(s => s.trim());
  try {
    const result = await callMCP(MCP_PORTFOLIO, 'portfolio_value', exchanges);
    res.json({ ok: true, data: result });
  } catch (err) {
    console.error('portfolio error', err.message || err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

// GET /api/ticker
app.get('/api/ticker', async (req, res) => {
  const { exchange = 'binance', symbol = 'BTC/USDT' } = req.query;
  try {
    const result = await callMCP(MCP_CCXT, 'get_ticker', { exchange, symbol });
    res.json({ ok: true, data: result });
  } catch (err) {
    console.error('ticker error', err.message || err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

// POST /api/order/dry_run
app.post('/api/order/dry_run', async (req, res) => {
  const { exchange, symbol, side, type, amount, price, params } = req.body || {};
  if (!exchange || !symbol || !side || !type || !amount) {
    return res.status(400).json({ ok:false, error: 'Missing required fields' });
  }
  try {
    const ticker = await callMCP(MCP_CCXT, 'get_ticker', { exchange, symbol });
    const marketPrice = ticker && (ticker.last || ticker.close) ? (ticker.last || ticker.close) : null;
    const usedPrice = (price !== undefined && price !== null) ? price : marketPrice;
    const estimatedCost = (usedPrice && amount) ? (parseFloat(usedPrice) * parseFloat(amount)) : null;

    const preview = {
      exchange, symbol, side, type, amount, price: usedPrice, estimatedCost,
      note: 'This is a simulation. Confirm to execute.',
      params: params || {}
    };

    const stmt = db.prepare('INSERT INTO orders (exchange,symbol,side,type,amount,price,dry_run,status,response) VALUES (?,?,?,?,?,?,?,?,?)');
    stmt.run(exchange, symbol, side, type, amount, usedPrice, 1, 'preview', JSON.stringify(preview));
    stmt.finalize();

    res.json({ ok:true, data: preview });
  } catch (err) {
    console.error('dry_run error', err.message || err);
    res.status(500).json({ ok:false, error: String(err.message || err) });
  }
});

// POST /api/order/execute
app.post('/api/order/execute', async (req, res) => {
  const { exchange, symbol, side, type, amount, price, execute, params } = req.body || {};
  if (!exchange || !symbol || !side || !type || !amount) {
    return res.status(400).json({ ok:false, error: 'Missing required fields' });
  }
  try {
    if (!execute) {
      return res.status(400).json({ ok:false, error: 'execute flag not set. Set execute=true to place live order.' });
    }

    // Build exchange-specific params safely (simple placeholder; extend per-exchange)
    const exchangeKey = (exchange || '').toLowerCase();
    let exchangeParams = Object.assign({}, (params && typeof params === 'object') ? params : {});

    const orderArgs = {
      exchange,
      symbol,
      side,
      type,
      amount: Number(amount),
      price: price !== undefined && price !== null ? Number(price) : null,
      params: exchangeParams
    };

    const orderResp = await callMCP(MCP_CCXT, 'create_order', orderArgs);

    const stmt = db.prepare('INSERT INTO orders (exchange,symbol,side,type,amount,price,dry_run,status,response) VALUES (?,?,?,?,?,?,?,?)');
    stmt.run(exchange, symbol, side, type, amount, price || null, 0, 'placed', JSON.stringify(orderResp));
    stmt.finalize();

    io.emit('order_placed', { exchange, symbol, side, amount, price, response: orderResp });

    res.json({ ok:true, data: orderResp });
  } catch (err) {
    console.error('execute order error', err.message || err);
    const stmt = db.prepare('INSERT INTO orders (exchange,symbol,side,type,amount,price,dry_run,status,response) VALUES (?,?,?,?,?,?,?,?)');
    stmt.run(exchange, symbol, side, type, amount, price || null, 0, 'error', String(err.message || err));
    stmt.finalize();

    res.status(500).json({ ok:false, error: String(err.message || err) });
  }
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 200', [], (err, rows) => {
    if (err) return res.status(500).json({ ok:false, error: err.message });
    res.json({ ok:true, data: rows });
  });
});

/* Socket.io + periodic polling */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Helper to call and emit
async function callAndEmit(mcpUrl, toolName, args, eventName) {
  try {
    const data = await callMCP(mcpUrl, toolName, args);
    io.emit(eventName, data);
  } catch (e) {
    console.error('emit error', e && e.message ? e.message : e);
  }
}

// Polling intervals
setInterval(() => callAndEmit(MCP_PORTFOLIO, 'portfolio_value', ['binance'], 'portfolio'), 30000);
setInterval(() => callAndEmit(MCP_CCXT, 'get_ticker', { exchange: 'binance', symbol: 'BTC/USDT' }, 'ticker'), 5000);

// Start server and handle errors (EADDRINUSE will be surfaced)
server.listen(PORT, () => {
  console.log('Crypto MCP GUI backend listening on http://127.0.0.1:' + PORT);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful handlers
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
  process.exit(1);
});
EOF

# -------------------------------
# Write systemd service file
# -------------------------------
echo "==> Installing systemd service ($SERVICE_NAME)"
sudo tee "$SYSTEMD_PATH" > /dev/null <<EOF
[Unit]
Description=Crypto MCP GUI Backend - Crypto MCP Server (Corax CoLAB)
After=network.target

[Service]
Type=simple
User=pelle
WorkingDirectory=$BACKEND
Environment=NODE_ENV=production
Environment=PORT=4000
ExecStart=/usr/bin/node $BACKEND/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# -------------------------------
# Frontend files (fallback, no tailwind)
# -------------------------------
echo "==> Writing frontend files (fallback without Tailwind)"

if [ -f "$FRONTEND/package.json" ]; then cp "$FRONTEND/package.json" "$FRONTEND/package.json.bak"; fi
cat > "$FRONTEND/package.json" <<'EOF'
{
  "name": "crypto-mcp-frontend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5174"
  },
  "dependencies": {
    "plotly.js-basic-dist": "^2.29.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
EOF

cat > "$FRONTEND/vite.config.ts" <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:4000'
    }
  }
})
EOF

cat > "$FRONTEND/index.html" <<'EOF'
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crypto MCP Server – Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > "$FRONTEND/src/main.tsx" <<'EOF'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
EOF

cat > "$FRONTEND/src/App.tsx" <<'EOF'
import React from 'react'
import PortfolioPanel from './components/PortfolioPanel'
import TickerPanel from './components/TickerPanel'
import OrderPanel from './components/OrderPanel'
import OrdersLogPanel from './components/OrdersLogPanel'

export default function App() {
  return (
    <div className="main-grid">
      <div style={{padding:18}}>
        <h1>Crypto MCP Server — by Corax CoLAB</h1>
        <PortfolioPanel />
        <TickerPanel />
      </div>
      <aside style={{padding:18}}>
        <OrderPanel />
        <OrdersLogPanel />
      </aside>
    </div>
  )
}
EOF

cat > "$FRONTEND/src/styles.css" <<'EOF'
/* Minimal fallback CSS */
:root{--bg:#f8fafc;--card:#fff;--muted:#94a3b8;--primary:#0ea5a4;--shadow:0 6px 18px rgba(16,42,67,0.06);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
*{box-sizing:border-box}html,body,#root{height:100%;margin:0;background:var(--bg);color:#0f172a}
.card{background:var(--card);padding:14px;border-radius:10px;box-shadow:var(--shadow);margin-bottom:12px}
.small-muted{color:var(--muted);font-size:12px}
.btn-primary{background:var(--primary);color:white;padding:8px 12px;border-radius:8px;border:none}
.table{width:100%;border-collapse:collapse;font-size:13px}
.table th,.table td{padding:8px 6px;text-align:left;border-bottom:1px solid #f1f5f9}
.orders-scroll{max-height:320px;overflow:auto;display:block}
EOF

cat > "$FRONTEND/src/components/PortfolioPanel.tsx" <<'EOF'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Plotly from 'plotly.js-basic-dist'

export default function PortfolioPanel() {
  const [details, setDetails] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    fetch('/api/portfolio?exchanges=binance').then(r=>r.json()).then(j=>{
      if (j.ok && j.data) {
        setDetails(j.data.details || [])
        setTotal(j.data.total_usd || 0)
      }
    }).catch(console.error)

    const socket = io()
    socket.on('portfolio', (data:any) => {
      if (data) {
        setTotal(data.total_usd || 0)
        setDetails(data.details || [])
      }
    })
    return ()=>{ socket.disconnect() }
  }, [])

  useEffect(() => {
    const assets = details.slice(0, 12)
    const x = assets.map(a=>a.asset)
    const y = assets.map(a=>a.value_usd || 0)
    const data = [{ x, y, type: 'bar', marker:{color:'#0ea5a4'} }]
    Plotly.newPlot('portfolio-chart', data, {height:300, margin:{t:20,b:40}})
  }, [details])

  return (
    <div className="card">
      <h3>Portfolio</h3>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:22,fontWeight:700}}>{ total ? total.toFixed(2) : '—' } USD</div>
        <div className="small-muted">Live</div>
      </div>
      <div id="portfolio-chart" style={{width:'100%',height:300}} />
      <table className="table"><thead><tr><th>Asset</th><th>Amount</th><th>Value</th></tr></thead>
        <tbody>
          {details.map((d,i)=>(<tr key={i}><td>{d.asset}</td><td>{Number(d.amount).toFixed(6)}</td><td>{d.value_usd ? d.value_usd.toFixed(2) : '—'}</td></tr>))}
        </tbody>
      </table>
    </div>
  )
}
EOF

cat > "$FRONTEND/src/components/TickerPanel.tsx" <<'EOF'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function TickerPanel(){
  const [ticker, setTicker] = useState<any>(null)

  useEffect(() => {
    fetch('/api/ticker?exchange=binance&symbol=BTC/USDT').then(r=>r.json()).then(j=>{
      if (j.ok) setTicker(j.data)
    }).catch(console.error)

    const socket = io()
    socket.on('ticker', (data:any) => setTicker(data))
    return ()=>{ socket.disconnect() }
  }, [])

  return (
    <div className="card">
      <h3>BTC / USDT (Binance)</h3>
      {ticker ? (<div>
        <div style={{display:'flex',gap:12}}>
          <div><small className="small-muted">Last</small><div style={{fontSize:18}}>{ticker.last ?? ticker.close ?? '—'}</div></div>
          <div><small className="small-muted">Bid</small><div>{ticker.bid ?? '—'}</div></div>
          <div><small className="small-muted">Ask</small><div>{ticker.ask ?? '—'}</div></div>
        </div>
        <pre style={{background:'#f1f5f9',padding:8,borderRadius:6}}>{JSON.stringify(ticker, null, 2)}</pre>
      </div>) : <div>Loading…</div>}
    </div>
  )
}
EOF

cat > "$FRONTEND/src/components/OrderPanel.tsx" <<'EOF'
import React, { useState } from 'react'

export default function OrderPanel(){
  const [exchange,setExchange]=useState('binance')
  const [symbol,setSymbol]=useState('BTC/USDT')
  const [side,setSide]=useState('buy')
  const [type,setType]=useState('market')
  const [amount,setAmount]=useState<number>(0.001)
  const [price,setPrice]=useState<number|null>(null)
  const [preview,setPreview]=useState<any>(null)
  const [result,setResult]=useState<any>(null)

  async function previewOrder(){
    const resp = await fetch('/api/order/dry_run', {method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({exchange,symbol,side,type,amount,price})})
    const j = await resp.json()
    if (j.ok) setPreview(j.data); else alert(j.error)
  }

  async function placeOrder(){
    if (!confirm('Place live order?')) return
    const resp = await fetch('/api/order/execute', {method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({exchange,symbol,side,type,amount,price,execute:true})})
    const j = await resp.json()
    if (j.ok) { setResult(j.data); alert('Order placed') } else alert(j.error)
  }

  return (
    <div className="card">
      <h3>Order / Trade</h3>
      <div style={{display:'grid',gap:8}}>
        <input value={exchange} onChange={e=>setExchange(e.target.value)} />
        <input value={symbol} onChange={e=>setSymbol(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <select value={side} onChange={e=>setSide(e.target.value)}><option>buy</option><option>sell</option></select>
          <select value={type} onChange={e=>setType(e.target.value)}><option>market</option><option>limit</option></select>
        </div>
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        {type==='limit' && <input type="number" value={price ?? ''} onChange={e=>setPrice(Number(e.target.value))} />}
        <div style={{display:'flex',gap:8}}>
          <button className="btn-primary" onClick={previewOrder}>Preview</button>
          <button onClick={placeOrder}>Place</button>
        </div>
        {preview && <pre style={{background:'#f1f5f9',padding:8}}>{JSON.stringify(preview,null,2)}</pre>}
        {result && <pre style={{background:'#e6ffea',padding:8}}>{JSON.stringify(result,null,2)}</pre>}
      </div>
    </div>
  )
}
EOF

cat > "$FRONTEND/src/components/OrdersLogPanel.tsx" <<'EOF'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function OrdersLogPanel(){
  const [orders,setOrders]=useState<any[]>([])
  useEffect(()=>{
    fetch('/api/orders').then(r=>r.json()).then(j=>{ if (j.ok) setOrders(j.data || []) })
    const socket = io()
    socket.on('order_placed', (d:any)=> setOrders(prev => [{...d, created_at: new Date().toISOString()}, ...prev].slice(0,200)) )
    return ()=>{ socket.disconnect() }
  },[])
  return (
    <div className="card">
      <h3>Orders log</h3>
      <div className="orders-scroll">
        <table className="table"><thead><tr><th>Time</th><th>Exchange</th><th>Symbol</th><th>Side</th><th>Amt</th><th>Status</th></tr></thead>
          <tbody>{orders.map((o,i)=>(<tr key={i}><td>{o.created_at || o.createdAt}</td><td>{o.exchange}</td><td>{o.symbol}</td><td>{o.side}</td><td>{o.amount}</td><td>{o.status}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}
EOF

# Remove leftover tailwind/postcss config if present
rm -f "$FRONTEND/postcss.config.cjs" "$FRONTEND/tailwind.config.cjs"

# -------------------------------
# Install backend deps
# -------------------------------
echo "==> Installing backend dependencies..."
cd "$BACKEND"
rm -rf node_modules package-lock.json || true
npm install --no-audit --no-fund

# -------------------------------
# Install frontend deps
# -------------------------------
echo "==> Installing frontend dependencies..."
cd "$FRONTEND"
rm -rf node_modules package-lock.json || true
npm install --no-audit --no-fund

# -------------------------------
# Initialize DB table (ensures orders table exists)
# -------------------------------
echo "==> Ensuring orders table exists (DB init)..."
node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('$BACKEND/orders.db');
db.serialize(function(){
  db.run(\`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    exchange TEXT,
    symbol TEXT,
    side TEXT,
    type TEXT,
    amount REAL,
    price REAL,
    dry_run INTEGER,
    status TEXT,
    response TEXT
  )\`, function(err){
    if (err) { console.error('DB create error:', err); process.exit(1); }
    console.log('DB table ensured.');
    db.close();
  });
});
"

# -------------------------------
# Free port 4000 if used
# -------------------------------
echo "==> Checking port 4000"
if sudo lsof -i :4000 >/dev/null 2>&1; then
  echo "Port 4000 is in use; attempting to kill occupying processes..."
  sudo lsof -t -i :4000 | xargs -r sudo kill -9 || true
  sleep 1
fi

# -------------------------------
# Start service via systemd
# -------------------------------
echo "==> Reloading systemd and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable --now "$SERVICE_NAME" || true
sudo systemctl restart "$SERVICE_NAME" || true

# Wait a moment and show status
sleep 1
echo "==> Service status:"
sudo systemctl status "$SERVICE_NAME" --no-pager -l

# -------------------------------
# Build frontend for production (optional)
# -------------------------------
echo "==> Building frontend (production build)..."
cd "$FRONTEND"
npm run build || echo "Frontend build failed - you can run 'npm run dev' for development."

echo "==> Setup finished. Summary:"
echo " - Backend files: $BACKEND"
echo " - Frontend files: $FRONTEND"
echo " - Systemd service: $SYSTEMD_PATH"
echo "Check backend logs with: sudo journalctl -u $SERVICE_NAME -f"
echo "Open frontend dev (for live reload): cd $FRONTEND && npm run dev -- --host"
echo ""