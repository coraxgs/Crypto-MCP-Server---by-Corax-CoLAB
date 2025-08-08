#!/bin/bash
# install.sh — installs Crypto MCP Server – Produced by Corax CoLAB
# Run as: chmod +x install.sh && ./install.sh
set -euo pipefail

BASE="/home/pelle/cryptomcpserver"
VENV="$BASE/venv"

echo "==> Installing Crypto MCP Server in $BASE"

# 1) System update and required packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip build-essential git curl jq

# 2) Create folder and virtual environment
mkdir -p "$BASE"
cd "$BASE"
python3 -m venv "$VENV"

# 3) Activate virtual environment and install Python packages
source "$VENV/bin/activate"
pip install --upgrade pip setuptools wheel
pip install -r "$BASE/requirements.txt"

# 4) Create .env from example if it doesn't exist
if [ ! -f "$BASE/.env" ]; then
  if [ -f "$BASE/.env.example" ]; then
    cp "$BASE/.env.example" "$BASE/.env"
    echo "INFO: .env created from .env.example. Edit $BASE/.env and fill in your API keys before starting the services."
  else
    echo "WARNING: No .env.example found. Create $BASE/.env manually."
  fi
fi

# 5) Copy systemd service files (from systemd/ if available)
if [ -d "$BASE/systemd" ]; then
  echo "Copying systemd service files..."
  sudo cp "$BASE/systemd/"*.service /etc/systemd/system/ || true
  sudo systemctl daemon-reload
  # Try enabling known services
  for svc in ccxt_mcp coingecko_mcp onchain_mcp ta_mcp portfolio_mcp notifier_mcp freqtrade_mcp; do
    if [ -f "/etc/systemd/system/${svc}.service" ]; then
      sudo systemctl enable --now ${svc}.service || true
    fi
  done
fi

echo "==> Installation complete. Edit $BASE/.env and fill in your API keys."
echo "Start/stop services using: sudo systemctl start|stop|status <service>"
echo "Example status command: sudo systemctl status ccxt_mcp.service"
