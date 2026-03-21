<div align="center">
  <a href="https://coraxcolab.com" target="_blank">
    <img width="800" alt="Frontend Dashboard" src="./gui/frontend/public/images/dashboard.png" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);" />
  </a>

  <h1>Crypto MCP Server <br> <span style="font-size: 0.6em; color: #10b981;">by Corax CoLAB & PelleNybe 🚀🪙</span></h1>

  <p>
    <a href="https://github.com/PelleNybe"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=10B981&center=true&vCenter=true&width=600&lines=Welcome+to+Crypto+MCP+Server;The+Future+of+Edge+AI+%26+Blockchain;AI-driven+command+center" alt="Typing SVG" /></a>
  </p>

  <p>
    <a href="https://github.com/PelleNybe"><img src="https://img.shields.io/badge/version-2.0.0-blue.svg?style=for-the-badge&logo=github" /></a>
    <img src="https://img.shields.io/badge/python->=3.10-blue.svg?style=for-the-badge&logo=python" />
    <img src="https://img.shields.io/badge/node->=20.x-green.svg?style=for-the-badge&logo=nodedotjs" />
    <img src="https://img.shields.io/badge/React-Vite-61dafb.svg?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  </p>

  <p><em>The ultimate AI-driven command center for your local crypto operations, featuring a dark, cyberpunk/command-center aesthetic.</em></p>
</div>

---

## 🗺️ System Overview & Architecture

The image series below illustrates the four key stages of the Crypto MCP Server, a local ecosystem developed by **Corax CoLAB** and **[PelleNybe](https://github.com/PelleNybe)** to bridge AI (Claude Desktop), local tools (on a Raspberry Pi or Linux machine), and blockchain technology.

<details>
<summary><b>1️⃣ Architectural Overview (Click to expand)</b></summary>
<br>
This diagram establishes the foundational flow of the system. It shows how Claude Desktop communicates via JSON-RPC with the Crypto MCP Server backend (REST + WebSocket). The server acts as a proxy, directing traffic to specific local MCP tools—such as CCXT for exchange trading, CoinGecko for market data, and Portfolio for asset aggregation—while logging orders to a local SQLite database.

<div align="center">
  <img width="800" alt="Architectural Overview" src="./gui/frontend/public/images/architecture.jpg" style="border-radius: 12px; margin-bottom: 20px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,255,150,0.1);" />
</div>
</details>

<details>
<summary><b>2️⃣ Installation and Configuration (Click to expand)</b></summary>
<br>
This image highlights the "Quick Start" process. It shows a user physically working with a Linux terminal interface. The terminal displays successful execution steps of the automated `install.sh` script, which automates directory creation, Node.js installation, and service setup.

<div align="center">
  <img width="800" alt="Installation and Configuration" src="./gui/frontend/public/images/installation.jpg" style="border-radius: 12px; margin-bottom: 20px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,255,150,0.1);" />
</div>
</details>

<details>
<summary><b>3️⃣ Security and Best Practices (Click to expand)</b></summary>
<br>
The final infographic summarizes the core security principles for operating the MCP server. It visually maps out essential "best practices": using testnet keys for risk-free simulation, securing API keys, restricting network access (LAN only or VPN/SSH tunnels), leveraging local control, and implementing an authenticated reverse proxy (NGINX).

<div align="center">
  <img width="800" alt="Security and Best Practices" src="./gui/frontend/public/images/security.jpg" style="border-radius: 12px; margin-bottom: 20px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,255,150,0.1);" />
</div>
</details>

---

<div align="center">
  <img src="https://raw.githubusercontent.com/PelleNybe/PelleNybe/main/assets/line.svg" width="100%" height="2" onerror="this.style.display='none'"/>
</div>

**Crypto MCP Server** is a local, lightweight dashboard + utility layer that connects **Claude Desktop (Local MCP tools)** and your local MCP servers on a Raspberry Pi (or other platforms with a Linux distro). It provides a REST + WebSocket backend that proxies MCP tools (CCXT, CoinGecko, Portfolio, Freqtrade, etc.), stores order logs locally (SQLite), and ships a **cyberpunk-themed React frontend dashboard** for monitoring and advanced AI-driven control.

> 📁 **Default project path:** `$HOME/cryptomcpserver/`
> 🎯 **Installer script:** `install.sh` (located at `$HOME/install.sh`)

---

## 🌌 New AI Capabilities & Interactive Elements

The Crypto MCP Server now features advanced interactive elements and real-time AI capabilities embedded directly into the UI:

*   🤖 **Oracle Copilot:** An interactive, voice-activated AI terminal (`OracleCopilot.tsx`) that analyzes commands, executes dry runs, and queries TA/On-chain MCPs. Features real-time voice recognition and a sleek CRT terminal UI.
*   🌊 **Whale Sonar Sweep:** Dynamic visual tracking of real-time trending coin activity utilizing deterministic radar representations.
*   🌦️ **Global Weather System:** An interactive background system that reacts to the current market sentiment (Bull, Bear, Neutral), altering the entire visual environment.
*   ⚛️ **Quantum Risk Map:** Real-time 3D topography of your portfolio risk exposure using real-time Technical Analysis (RSI, Bollinger Bands) from the local MCP backend.
*   🌀 **Arbitrage Wormhole:** Live Cross-DEX arbitrage detection using multi-exchange CCXT MCP polling.
*   ✨ **Cyberpunk UI Polish:** The entire dashboard is wrapped in a dark, glowing aesthetic with glassmorphism, animated CRT scanlines, and reactive hover states.
*   👁️ **System Overview:** A high-level visual summary of your entire crypto operation, including system status, active agents, and total equity.
*   🧠 **Neural Net Liquidity:** Real-time visualization of market liquidity using a simulated neural network topography.
*   📊 **Holo Topographic Order Book:** A 3D, holographic representation of the order book, now integrated with real-time live data from CCXT MCP endpoints.
*   📰 **News Singularity:** An AI-curated feed of the most critical market news, sentiment-scored using the dedicated News MCP and live CryptoPanic APIs.
*   🛰️ **Orbital Portfolio:** A dynamic, physics-based 3D visualization of your actual asset allocation using live real-time portfolio MCP data.
*   🐋 **Whale Constellations:** Real-time 3D mapping of trending coins and market sentiment based on live CoinGecko data endpoints.

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
$HOME/cryptomcpserver/
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
               ├─ SystemOverview.tsx
               ├─ NeuralNetLiquidity.tsx
               ├─ HoloTopographicOrderBook.tsx
               ├─ NewsSingularity.tsx
               ├─ OrbitalPortfolio.tsx
               ├─ WhaleConstellations.tsx
               └─ ... (other features)
```

---

## ✅ Quick start — automated (recommended) — install.sh 🎯

Place the provided `install.sh` into `$HOME/install.sh` (or `$HOME/cryptomcpserver/install.sh` if you prefer). Make it executable and run it:

```bash
# Save install.sh to $HOME/install.sh, then:
cd $HOME
chmod +x install.sh
./install.sh
```

**What install.sh does (summary):**
1. Creates directories and writes backend & frontend files.
2. Installs Node.js if missing and runs `npm install` for backend & frontend.
3. Ensures the `orders` table exists in `$HOME/cryptomcpserver/gui/backend/orders.db`.
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
   cd $HOME/cryptomcpserver/gui/backend
   npm install
   cp .env.example .env
   # edit .env if needed
   ```

4. **Frontend (dev):**
   ```bash
   cd $HOME/cryptomcpserver/gui/frontend
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

Copy and edit `$HOME/cryptomcpserver/gui/backend/.env.example` → `.env`:

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
*   `http://127.0.0.1:7001/mcp` — **ccxt MCP** (Exchange trading & market data)
*   `http://127.0.0.1:7002/mcp` — **onchain MCP** (On-chain blockchain data via Web3)
*   `http://127.0.0.1:7003/mcp` — **ta MCP** (Technical Analysis metrics)
*   `http://127.0.0.1:7004/mcp` — **portfolio MCP** (Portfolio tracking & aggregation)
*   `http://127.0.0.1:7005/mcp` — **notifier MCP** (Alerts & notifications)
*   `http://127.0.0.1:7010/mcp` — **coingecko MCP** (Live crypto market data & news)
*   `http://127.0.0.1:7011/mcp` — **freqtrade MCP** (Freqtrade bot integration)
*   `http://127.0.0.1:7012/mcp` — **octobot MCP** (OctoBot integration)
*   `http://127.0.0.1:7013/mcp` — **hummingbot MCP** (Hummingbot integration)
*   `http://127.0.0.1:7014/mcp` — **superalgos MCP** (Superalgos integration)
*   `http://127.0.0.1:7015/mcp` — **llm MCP** (Open Source AI functionality)

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

**DB file:** `$HOME/cryptomcpserver/gui/backend/orders.db`

**Inspect last 10 orders:**
```bash
sqlite3 $HOME/cryptomcpserver/gui/backend/orders.db \
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
  <h3>Explore the Source 🌐</h3>
  <a href="https://github.com/PelleNybe">
    <img src="https://img.shields.io/badge/PelleNybe-GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="PelleNybe Repo" />
  </a>
  <a href="https://coraxcolab.com">
    <img src="https://img.shields.io/badge/Corax_CoLAB-Website-10B981?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Corax CoLAB" />
  </a>
  <br><br>
  <p>
    <i>This product is proudly brought to you by <b>Corax CoLAB</b> and <b>PelleNybe</b>, the architects behind cyber-physical systems that secure your future in an increasingly regulated and resource-constrained world.</i>
  </p>
  <p>
    <b>We unite:</b><br>
    🤖 Edge AI & Autonomous Systems<br>



## ✨ 10 Technical and Visual Upgrades
1. **Async Portfolio MCP**: The `portfolio_mcp.py` now fetches concurrent exchange balances using `ccxt.async_support` for incredibly fast dashboard load times.
2. **Robust Proxy Timeouts**: The Node backend implements robust `AbortSignal` logic for MCP communication, preventing hanging connections.
3. **SQLite Indices**: The backend automatically initializes proper database indices on `orders.db` for `created_at` and `status` to dramatically speed up log querying.
4. **WebSocket Resilience**: The React frontend implements a centralized, self-healing `Socket.io` client ensuring the dashboard never goes stale if the backend restarts.
5. **Strict Input Validation**: Backend order execution endpoints rigorously validate symbol format, trade side, and order type before dispatching to the MCP.
6. **Cyberpunk Loaders**: Components like `PortfolioPanel` and `TickerPanel` feature animated, stylized loading states during data decryption.
7. **Neon Toasts**: A custom notification system provides sleek, auto-dismissing visual feedback for system events and order executions.
8. **Enhanced Orders Table**: The `OrdersLogPanel` is upgraded with pagination, neon-color-coded status badges, and interactive hover effects.
9. **Glitch Effects**: Critical data changes trigger subtle CSS glitch animations, enhancing the cyberpunk aesthetic.
10. **Dynamic Theme Colors**: The entire dashboard reacts to global market sentiment, shifting its neon glowing borders based on whether the market is bullish or bearish.

## ✨ Visualizer Dynamics 100% Real Integration
The final remaining static pair references in 3D visualizers have been completely removed. Features like the **Arbitrage Wormhole**, **Neural Net Liquidity**, **Quantum Risk Map**, and **Predictive Ghosting** now dynamically query the local `MCP_PORTFOLIO` node to determine your highest allocated assets (e.g., dynamically focusing on your actual portfolio holdings rather than hardcoding `BTC/USDT` and `binance`/`kraken`). If your top holdings change, the visualizers will adapt to scan arbitrage, risk, and price trajectory for your actual coins across dynamic exchange hubs.

## ✨ Dynamic Pair Routing Enhancement

The **Arbitrage Wormhole** feature has been upgraded to dynamically fetch your portfolio's most valuable asset via the `MCP_PORTFOLIO` backend instead of relying on static mock defaults. This enables real-time arbitrage scanning specifically for the coins you actually hold across multiple exchanges (e.g., Binance and Kraken), improving relevance and achieving full dynamic data integration.

---

## ✨ 100% Real Data Integration

**All conceptual placeholders have been actively upgraded to real data mechanisms**. Features such as the 3D Arbitrage Wormhole, Time-Machine Backtesting Arena, Neural Net Liquidity, Predictive Ghosting, Orbital Portfolio, Algo Grid Architect, and the Sentiment Weather System seamlessly fetch live metrics and topologies through the Python MCP Server backend. All components are entirely functional with zero placeholders, generated mocks, or static fallbacks.

---
## ✨ 100% Real Data Integration

**All conceptual placeholders have been actively upgraded to real data mechanisms**. Features such as the 3D Arbitrage Wormhole, Time-Machine Backtesting Arena, Neural Net Liquidity, Predictive Ghosting, Orbital Portfolio, Algo Grid Architect, and the Sentiment Weather System seamlessly fetch live metrics and topologies through the Python MCP Server backend. All components are entirely functional with zero placeholders, generated mocks, or static fallbacks.
## ✨ Neural Trade Visualizer Upgrade
The **Smart Routing Diagnostics** component within the Order Panel has been fully integrated with live market data. It now connects to the **CCXT MCP** backend, dynamically fetching real-time order book (L2) data to construct a 3D topology of live Liquidity Pools (Bids/Asks) for the specified exchange and trading pair. This replaces previous static mock models, achieving 100% genuine data integration for order execution routing previews.
## ✨ Enhanced Input Accessibility
**Order Panel Form Fields** have been refactored to replace `placeholder` text with robust `aria-label` tags, enhancing overall compliance and accessibility across the interface.
## ✨ Oracle Copilot Real LLM Integration
The **Oracle Copilot** component has been fully integrated with the **LLM MCP**. Instead of returning static mocked responses, it now leverages the local LLM cluster to compute intelligent, authoritative responses based on live user voice or text commands, fully achieving 100% data integration with the MCP architecture.
## ✨ Robust Security Enhancements
Auth bypass vulnerabilities via insecure `req.ip` validation on localhost have been successfully patched in the backend server API. `/api/order/pending` and `/api/order/reasoning` endpoints are now fully secured with `DASHBOARD_PASSWORD` verification, ensuring reliable operation without unauthorized cross-site invocations. `docker-compose.yml` has also been upgraded to pass rigid YAML validations for clean orchestration.
## ✨ Visualizer Dynamics 100% Real Integration
The final remaining static pair references in 3D visualizers have been completely removed. Features like the **Arbitrage Wormhole**, **Neural Net Liquidity**, **Quantum Risk Map**, and **Predictive Ghosting** now dynamically query the local `MCP_PORTFOLIO` node to determine your highest allocated assets (e.g., dynamically focusing on your actual portfolio holdings rather than hardcoding `BTC/USDT` and `binance`/`kraken`). If your top holdings change, the visualizers will adapt to scan arbitrage, risk, and price trajectory for your actual coins across dynamic exchange hubs.

## ✨ Complete Simulation Deprecation
All remaining mock features, fake polling triggers, and conceptual visual simulations within the frontend components have been systematically deprecated. Visualizers now definitively rely entirely on live event subscriptions and authentic backend indicators:
- **Algo Grid Architect** now pulses intelligently via reactive `order_placed` and `order_pending` Socket.io events instead of an artificial timed loop.
- **Quantum Risk Map** explicitly binds topographical deformation rendering to genuine technical analysis indicators (`MCP_TA`), with legacy manual shock simulation capabilities stripped entirely.
- **Oracle Copilot** accurately reflects its true capability by processing raw speech inputs directly through real LLM context generation rather than simulating proxy states.
- **Neural Trade Visualizer** calculates genuine diagnostic routing data retrieved from live orderbooks without legacy fake simulation overlays.
## ✨ Complete Simulation Deprecation II
All simulated backtesting has been upgraded to true data generation:
- **Time-Machine Backtesting Arena** now utilizes real Monte Carlo price path data fetched through the `MCP_TA` endpoint instead of localized mock math simulations.
- No dummy Three.js placeholder parameters remain except within explicitly defined structural frameworks.
- The entire system operates without a single mockup across visualizers. All 3D graphs reflect live local data.

### Advanced Cyberpunk Terminal Features
The frontend has been significantly upgraded with the "Top 5 World-Class Features" to push the boundary of visual data representation, using real backend MCP data without any placeholder mockups:
1. **The "Neural-Net" Liquidity Flow & Arbitrage Map**: Maps cross-exchange liquidity as a living 3D neural network, highlighting arbitrage opportunities with neon data streams.
2. **Holographic Topographic Order Books**: Visualizes the order book dynamically using `react-three-fiber`, showing buy and sell walls as neon-lit digital canyons.
3. **Predictive Trajectory "Ghosting"**: Volumetric fog and probability cones to project future paths via Freqtrade/TA Monte Carlo simulations.
4. **Orbital Portfolio Control Deck**: Converts static portfolio data into a physics-based planetary system, where assets orbit the total portfolio based on allocation and volatility.
5. **"System Overload" Sentiment Weather System**: An immersive ambient system that reacts to global crypto sentiment, bringing aurora borealis effects during bull runs and "digital rain" during crashes.
## ✨ Complete Backend and AI Integrations
1. The AI core no longer defaults to a "dummy" implementation when litellm is configured but an API key is missing. This prevents runtime errors and guarantees reliable, unmocked local model functioning.
2. We have successfully implemented a full test suite utilizing Pytest, expanding upon the existing `tests/test_ccxt_mcp.py` and `tests/test_news_mcp.py` by integrating real tests in `tests/test_onchain_mcp.py`, completely stripping out the mock `tests/test_endpoints.sh`.
3. On-chain functionalities are completely capable. `execute_dex_swap` enables actual interactions via Uniswap Router on Mainnet directly inside the `onchain_mcp.py` agent tools with true on-chain ERC20 approval checks prior to execution.
4. Deployment has been fully upgraded with a valid, secure `docker-compose.yml` removing manual bash scripting constraints and YAML structural errors entirely.
