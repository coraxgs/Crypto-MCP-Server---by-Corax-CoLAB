✅ Quick start — automated (recommended) — install.sh 🎯

Place the provided install.sh into /home/pelle/install.sh (or /home/pelle/cryptomcpserver/install.sh if you prefer). Make it executable and run it as user pelle:

# Save install.sh to /home/pelle/install.sh, then:
cd /home/pelle
chmod +x install.sh
./install.sh

What install.sh does (summary):

Creates directories and writes backend & frontend files (with safe fallback frontend CSS).

Installs Node.js if missing and runs npm install for backend & frontend.

Ensures orders table exists in /home/pelle/cryptomcpserver/gui/backend/orders.db.

Frees port 4000 if occupied, then installs & enables systemd service crypto-mcp-gui.service.

Attempts a production build of the frontend (you can still run dev mode separately).


> After running, check service status and logs:



sudo systemctl status crypto-mcp-gui.service
sudo journalctl -u crypto-mcp-gui.service -f
