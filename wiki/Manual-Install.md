🛠 Manual install (condensed)

If you prefer to do everything yourself:

1. Install system deps:



sudo apt update
sudo apt install -y curl build-essential ca-certificates git

2. Install Node.js (if needed):



curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v

3. Backend:



cd /home/pelle/cryptomcpserver/gui/backend
# place server.js and package.json here, then:
npm install
cp .env.example .env
# edit .env if needed

4. Frontend (dev):



cd /home/pelle/cryptomcpserver/gui/frontend
npm install
npm run dev -- --host   # open http://PI_IP:5173 on your laptop

5. Systemd (backend):



# Create /etc/systemd/system/crypto-mcp-gui.service (see below)
sudo systemctl daemon-reload
sudo systemctl enable --now crypto-mcp-gui.service
