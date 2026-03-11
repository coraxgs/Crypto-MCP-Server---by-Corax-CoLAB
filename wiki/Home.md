<img width="1024" height="1024" alt="cryptomcplogo" src="https://github.com/user-attachments/assets/159c6ff1-7831-4c01-a3fb-019ea30f33a6" />

<h1>Crypto MCP Server — by Corax CoLAB - The Future of Edge AI & Blockchain 🚀🪙</h1>

Crypto MCP Server is a local, lightweight dashboard + utility layer that connects Claude Desktop (Local MCP tools) and your local MCP servers on a Raspberry Pi (or other platform with Linux dist). It provides a REST + WebSocket backend that proxies MCP tools (CCXT, CoinGecko, Portfolio, Freqtrade, etc.), stores order logs locally (SQLite), and ships a React frontend dashboard for monitoring and limited control.

> Default project path used in this README: /home/pelle/cryptomcpserver/
The installer script name is now install.sh and should be located at /home/pelle/install.sh. 📁





---

📚 Table of contents

Overview & features

Repository layout

✅ Quick start — automated (install.sh)

Manual install (condensed)

Configuration (.env) & MCP endpoints

🔗 Claude Desktop integration (step-by-step)

Dashboard user manual (what you can do)

REST API examples

SQLite & logs

Systemd & services

Troubleshooting & common errors

Security & best practices

Extending & contribution info

---

✨ Overview & features

Crypto MCP Server provides:

Proxy to local MCP servers via JSON-RPC tools/call.

REST endpoints: /api/ticker, /api/portfolio, /api/order/dry_run, /api/order/execute, /api/orders.

Live updates with Socket.io (ticker, portfolio, orders).

Local order logging in SQLite (orders.db).

React + Vite frontend (portfolio, ticker, order preview/execute, orders log).

A systemd service for backend so it can start at boot.

Designed to integrate with Claude Desktop Local MCP Servers. 🤖

---

📁 Repository layout (what you should have)

/home/pelle/cryptomcpserver/
└─ gui/
   ├─ backend/
   │  ├─ server.js
   │  ├─ package.json
   │  ├─ .env.example
   │  └─ orders.db
   └─ frontend/
      ├─ package.json
      ├─ vite.config.ts
      ├─ index.html
      └─ src/
         ├─ main.tsx
         ├─ App.tsx
         ├─ styles.css
         └─ components/
            ├─ PortfolioPanel.tsx
            ├─ TickerPanel.tsx
            ├─ OrderPanel.tsx
            └─ OrdersLogPanel.tsx
