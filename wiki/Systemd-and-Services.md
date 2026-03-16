🧰 Systemd and Services

The Crypto MCP Server includes multiple systemd services for both the backend proxy and individual Python MCP tools.

## Available Systemd Services

*   `crypto-mcp-gui.service` — Runs the Node.js Express backend proxy and serves the React dashboard.
*   `ccxt_mcp.service` — Exchange trading & market data integration.
*   `coingecko_mcp.service` — Live crypto market data & news fetching.
*   `freqtrade_mcp.service` — Freqtrade bot integration.
*   `notifier_mcp.service` — Alerts and notifications.
*   `onchain_mcp.service` — On-chain data fetching via Web3.
*   `portfolio_mcp.service` — Portfolio tracking & aggregation.
*   `ta_mcp.service` — Technical analysis metrics.

## Example: GUI Backend Service File

Service file: `/etc/systemd/system/crypto-mcp-gui.service`

Minimal example (`install.sh` writes this for you):

```ini
[Unit]
Description=Crypto MCP GUI Backend - Crypto MCP Server (Corax CoLAB - The Future of Edge AI & Blockchain)
After=network.target

[Service]
Type=simple
User=pelle
WorkingDirectory=/home/pelle/cryptomcpserver/gui/backend
Environment=NODE_ENV=production
Environment=PORT=4000
ExecStart=/usr/bin/node /home/pelle/cryptomcpserver/gui/backend/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Enable & Start a Service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now crypto-mcp-gui.service
sudo systemctl status crypto-mcp-gui.service
```
