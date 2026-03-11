🧰 Systemd service (backend)

Service file: /etc/systemd/system/crypto-mcp-gui.service

Minimal example (install.sh writes this for you):

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

Enable & start:

sudo systemctl daemon-reload
sudo systemctl enable --now crypto-mcp-gui.service
sudo systemctl status crypto-mcp-gui.service
