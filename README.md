<div align="center">
  <img width="800" alt="cryptomcplogo" src="https://github.com/user-attachments/assets/159c6ff1-7831-4c01-a3fb-019ea30f33a6" style="border-radius: 12px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);" />

  <h1>Crypto MCP Server <br> <span style="font-size: 0.6em; color: #10b981;">by Corax CoLAB - The Future of Edge AI & Blockchain 🚀🪙</span></h1>

  <p>
    <img src="https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000" />
    <img src="https://img.shields.io/badge/python->=3.10-blue.svg" />
    <img src="https://img.shields.io/badge/node->=20.x-green.svg" />
    <img src="https://img.shields.io/badge/React-Vite-61dafb.svg" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </p>

  <p><em>The ultimate AI-driven command center for your local crypto operations.</em></p>
</div>

---

**Crypto MCP Server** is a local, lightweight dashboard + utility layer that connects **Claude Desktop (Local MCP tools)** and your local MCP servers on a Raspberry Pi (or other platforms with a Linux distro). It provides a REST + WebSocket backend that proxies MCP tools (CCXT, CoinGecko, Portfolio, Freqtrade, etc.), stores order logs locally (SQLite), and ships a **cyberpunk-themed React frontend dashboard** for monitoring and advanced AI-driven control.

> 📁 **Default project path used in this README:** `/home/pelle/cryptomcpserver/`
> 🎯 **Installer script:** `install.sh` (located at `/home/pelle/install.sh`)

---

## 🌌 New AI Capabilities & Interactive Elements

The Crypto MCP Server now features advanced interactive elements and real-time AI capabilities embedded directly into the UI:

*   🤖 **Oracle Copilot:** An interactive, voice-activated AI terminal (`OracleCopilot.tsx`) that analyzes commands, executes dry runs, and queries TA/On-chain MCPs. Features real-time voice recognition and a sleek CRT terminal UI.
*   🌊 **Whale Sonar Sweep:** Dynamic visual tracking of large on-chain movements.
*   🌦️ **Global Weather System:** An interactive background system that reacts to the current market sentiment (Bull, Bear, Neutral), altering the entire visual environment.
*   ⚛️ **Quantum Risk Map:** Real-time visual topography of your portfolio's risk exposure.
*   🌀 **Arbitrage Wormhole & Algo Grid Architect:** Interactive components for visualizing cross-exchange opportunities and algorithmic trading grids.
*   ✨ **Cyberpunk UI Polish:** The entire dashboard is wrapped in a dark, glowing aesthetic with glassmorphism, animated CRT scanlines, and reactive hover states.

---

## 📚 Table of contents

- [Overview & features](#overview--features)
- [Repository layout](#-repository-layout-what-you-should-have)
- [✅ Quick start — automated (install.sh)](#-quick-start--automated-recommended--installsh-)
- [Manual install (condensed)](#-manual-install-condensed)
- [Configuration (.env) & MCP endpoints](#-configuration-env-backend)
- [🔗 Claude Desktop integration (step-by-step)](#-claude-desktop-integration-detailed-)
- [Dashboard user manual](#-dashboard--what-you-can-do-user-manual)
- [REST API examples](#-rest-api-examples-curl)
- [SQLite & logs](#-sqlite--logs)
- [Systemd & services](#-systemd-service-backend)
- [Troubleshooting & common errors](#️-troubleshooting--common-errors)
- [Security & best practices](#-security--best-practices)

---

## 📁 Repository layout (what you should have)

```text
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
            ├─ OrdersLogPanel.tsx
            └─ features/         # Advanced AI & Visual Components
```

---

## ✅ Quick start — automated (recommended) — install.sh 🎯

Place the provided `install.sh` into `/home/pelle/install.sh` (or `/home/pelle/cryptomcpserver/install.sh` if you prefer). Make it executable and run it as user `pelle`:

```bash
# Save install.sh to /home/pelle/install.sh, then:
cd /home/pelle
chmod +x install.sh
./install.sh
```

**What install.sh does (summary):**
1. Creates directories and writes backend & frontend files.
2. Installs Node.js if missing and runs `npm install` for backend & frontend.
3. Ensures the `orders` table exists in `/home/pelle/cryptomcpserver/gui/backend/orders.db`.
4. Frees port 4000 if occupied, then installs & enables the systemd service `crypto-mcp-gui.service`.
5. Attempts a production build of the frontend.

> After running, check service status and logs:
```bash
sudo systemctl status crypto-mcp-gui.service
sudo journalctl -u crypto-mcp-gui.service -f
```

---

## 🛠 Manual install (condensed)

If you prefer to do everything yourself:

1. **Install system deps:**
   ```bash
   sudo apt update
   sudo apt install -y curl build-essential ca-certificates git
   ```

2. **Install Node.js (if needed):**
   ```bash
   curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   node -v
   ```

3. **Backend:**
   ```bash
   cd /home/pelle/cryptomcpserver/gui/backend
   npm install
   cp .env.example .env
   # edit .env if needed
   ```

4. **Frontend (dev):**
   ```bash
   cd /home/pelle/cryptomcpserver/gui/frontend
   npm install
   npm run dev -- --host   # open http://PI_IP:5173 on your laptop
   ```

5. **Systemd (backend):**
   ```bash
   # Create /etc/systemd/system/crypto-mcp-gui.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now crypto-mcp-gui.service
   ```

---

## ⚙️ Configuration: .env (backend)

Copy and edit `/home/pelle/cryptomcpserver/gui/backend/.env.example` → `.env`:

```env
MCP_CCXT=http://127.0.0.1:7001/mcp
MCP_PORTFOLIO=http://127.0.0.1:7004/mcp
PORT=4000
```

*   `MCP_CCXT` — CCXT MCP endpoint (for get_ticker, create_order, etc.)
*   `MCP_PORTFOLIO` — optional portfolio aggregator MCP
*   `PORT` — backend port (default 4000)

---

## 🔗 Claude Desktop integration (detailed) 🧩

### Overview
Claude Desktop supports Local MCP Servers (HTTP JSON-RPC endpoints). Add your MCP endpoints in Claude Desktop so Claude can call the tools exposed by those MCPs (e.g., `get_ticker`, `create_order`).

### Add MCP servers in Claude Desktop (step-by-step)
1. Open Claude Desktop app.
2. Open App Settings / Preferences.
3. Find Local MCP Servers.
4. Click `+` (Add) — fill fields one by one:
   *   **Name:** `ccxt`
   *   **Description:** `CCXT MCP – exchange trading & market data`
   *   **Transport:** `http`
   *   **Endpoint:** `http://127.0.0.1:7001/mcp` (if Claude runs on Pi) or `http://<pi-ip>:7001/mcp` (if Claude runs on laptop)
5. Save. Repeat for other MCPs (`coingecko`, `portfolio`, `freqtrade`, `octobot`, `hummingbot`, `superalgos`, `llm`) with their respective ports.

### Example endpoints to add
*   `http://127.0.0.1:7001/mcp` — ccxt MCP
*   `http://127.0.0.1:7010/mcp` — coingecko MCP
*   `http://127.0.0.1:7004/mcp` — portfolio MCP
*   `http://127.0.0.1:7015/mcp` — llm MCP (Open Source AI functionality)

---

## 🖥 Dashboard — what you can do (user manual)

*   📊 **Portfolio:** View aggregated balances & USD value (updated via portfolio MCP).
*   📈 **Ticker:** Live market data (via ccxt MCP).
*   🛒 **Order / Trade:**
    *   **Preview (dry_run):** Calculates estimated cost and logs a preview to orders.db.
    *   **Confirm → Place order:** Sends create_order to CCXT MCP (backend requires `execute:true`).
*   📜 **Orders log:** Shows previews and executed orders (real-time updates via socket.io).
*   🤖 **AI Copilot:** Voice-activated command center for insights and analysis.

> ⚠️ **Safety:** Always test with testnet keys. The UI requires confirmation to execute live orders.

---

## 🔁 REST API examples (curl)

**Ticker:**
```bash
curl "http://127.0.0.1:4000/api/ticker?exchange=binance&symbol=BTC/USDT"
```

**Portfolio:**
```bash
curl "http://127.0.0.1:4000/api/portfolio?exchanges=binance"
```

**Execute order:**
```bash
curl -s -X POST http://127.0.0.1:4000/api/order/execute \
  -H 'Content-Type: application/json' \
  -d '{"exchange":"binance","symbol":"BTC/USDT","side":"buy","type":"market","amount":0.001,"execute":true}' | jq
```

---

## 🗄 SQLite & logs

**DB file:** `/home/pelle/cryptomcpserver/gui/backend/orders.db`

**Inspect last 10 orders:**
```bash
sqlite3 /home/pelle/cryptomcpserver/gui/backend/orders.db \
  "SELECT id,created_at,exchange,symbol,side,amount,price,status FROM orders ORDER BY created_at DESC LIMIT 10;"
```

**Check backend logs:**
```bash
sudo journalctl -u crypto-mcp-gui.service -f
```

---

## ⚠️ Troubleshooting & common errors

*   **Service crashes on start** → check `journalctl -u crypto-mcp-gui.service -n 200`. Common issues: missing npm dependencies, syntax errors, or port 4000 already in use.
*   **EADDRINUSE (port 4000 occupied)** → find and kill the process:
    ```bash
    sudo lsof -i :4000
    sudo kill -9 <PID>
    ```
*   **Claude cannot call MCP** → ensure Claude can reach the Pi (use LAN IP or SSH tunnel), and that you added the MCP via the `+` button.

---

## 🔒 Security & best practices

*   Use testnet keys while testing.
*   Keep API keys out of repo — store them in the MCP server config or in secure `.env` not committed.
*   Restrict access to MCP endpoints to LAN only (UFW rules) or use VPN/SSH tunnels.
*   For remote exposure: use an authenticated reverse proxy (NGINX + TLS + basic auth) — **do not open trading endpoints publicly without robust auth.**

---

<div align="center">
  <img width="800" alt="cryptomcpinfograph1" src="https://github.com/user-attachments/assets/e0bfce4d-2dc2-4d89-abdf-9594fe5df31d" style="border-radius: 12px; margin-bottom: 20px;" />
  <img width="800" alt="cryptomcppic" src="https://github.com/user-attachments/assets/9e8f5a08-cbc9-42e3-aed2-d53fcc6d0083" style="border-radius: 12px;" />
</div>

---

## 🌍 The Corax CoLAB Ecosystem

This product is proudly brought to you by **Corax CoLAB**, the architects behind cyber-physical systems that secure your future in an increasingly regulated and resource-constrained world.

We unite:
- **Edge AI & Autonomous Systems** 🤖
- **Blockchain & Web3 Innovation** ⛓️
- **Zero Trust Security (Post-Quantum Cryptography ready)** 🛡️
- **Sustainability & Compliance-as-Code** 🌱

Find out more at [Corax CoLAB](https://coraxcolab.com/crypto-mcp-server/).
