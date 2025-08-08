<img width="1024" height="1024" alt="cryptomcplogo" src="https://github.com/user-attachments/assets/159c6ff1-7831-4c01-a3fb-019ea30f33a6" />

<h1>Crypto MCP Server – Produced by Corax CoLAB</h1>
This project runs several local MCP servers (Model Context Protocol) to enable Claude Desktop to:

Fetch price data (CoinGecko)

Trade and read market data (CCXT)

Retrieve on-chain data (web3)

Perform technical analysis (pandas_ta)

Aggregate portfolio value (CoinGecko + CCXT)

Send notifications (Telegram/Discord)

Communicate with Freqtrade via REST API

Installation and usage instructions can be found in install.sh (run as user pelle).

Path: /home/pelle/cryptomcpserver/

<img width="1024" height="1536" alt="cryptomcpinfograph1" src="https://github.com/user-attachments/assets/e0bfce4d-2dc2-4d89-abdf-9594fe5df31d" />

🚀 Full Installation & Run Guide for Crypto MCP Server (on Raspberry Pi 5)
✅ Run these commands in exact order
🧑‍💻 Assumes you're running on a Raspberry Pi 5 as user pelle.
If you're using a different user, change pelle in the systemd service files or run everything as that user.

📁 Create Project Directory and Place Files
Place the files in /home/pelle/cryptomcpserver/ using one of the following:

scp / rsync

git clone

Or manually copy-paste files using nano

bash
Copy
Edit
# Create folder (also done in install.sh, but safe to run)
mkdir -p /home/pelle/cryptomcpserver
cd /home/pelle/cryptomcpserver
Put all files here:

requirements.txt

.env.example

All *.py files

systemd/*.service

install.sh

README.md

🛠️ Make the installer executable and run it
bash
Copy
Edit
cd /home/pelle/cryptomcpserver
chmod +x install.sh
./install.sh
This script:

Installs required system packages

Sets up a Python virtual environment (venv)

Installs all Python dependencies

🔐 Edit the .env file and add your API keys
bash
Copy
Edit
nano /home/pelle/cryptomcpserver/.env
Fill in values such as:

BINANCE_API_KEY

BINANCE_SECRET_KEY

ETH_RPC_URL

TELEGRAM_BOT_TOKEN

TELEGRAM_CHAT_ID

DISCORD_WEBHOOK_URL

FREQTRADE_REST_URL

⚙️ (Optional) Manually install systemd services
Skip if you already ran install.sh

bash
Copy
Edit
sudo cp /home/pelle/cryptomcpserver/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
Enable and start all MCP services:

bash
Copy
Edit
sudo systemctl enable --now coingecko_mcp.service
sudo systemctl enable --now ccxt_mcp.service
sudo systemctl enable --now onchain_mcp.service
sudo systemctl enable --now ta_mcp.service
sudo systemctl enable --now portfolio_mcp.service
sudo systemctl enable --now notifier_mcp.service
sudo systemctl enable --now freqtrade_mcp.service
📡 Check service status
bash
Copy
Edit
sudo systemctl status coingecko_mcp.service
sudo systemctl status ccxt_mcp.service
📖 Live logs (for debugging)
bash
Copy
Edit
sudo journalctl -u coingecko_mcp.service -f
🧪 Test MCP servers manually (without systemd)
Open one terminal:

bash
Copy
Edit
# Activate virtual environment
source /home/pelle/cryptomcpserver/venv/bin/activate

# Start Coingecko MCP manually
python3 /home/pelle/cryptomcpserver/coingecko_mcp.py
Then in another terminal:

bash
Copy
Edit
python3 /home/pelle/cryptomcpserver/ccxt_mcp.py
You should see printed output confirming the MCP servers are running.

🧠 Add MCP servers in Claude Desktop or Claude CLI
Using claude CLI (must be installed):
bash
Copy
Edit
claude mcp add --transport http coingecko http://127.0.0.1:7010/mcp
claude mcp add --transport http ccxt http://127.0.0.1:7001/mcp
claude mcp add --transport http onchain http://127.0.0.1:7002/mcp
claude mcp add --transport http ta http://127.0.0.1:7003/mcp
claude mcp add --transport http portfolio http://127.0.0.1:7004/mcp
claude mcp add --transport http notifier http://127.0.0.1:7005/mcp
claude mcp add --transport http freqtrade http://127.0.0.1:7011/mcp
Or manually via:
Developer → Edit Config → claude_desktop_config.json

🤖 Example Prompts to Use in Claude
Try the following in Claude:

text
Copy
Edit
Call coingecko.price coin_id='bitcoin' vs_currency='usd'.

Call ccxt.get_ticker exchange='binance' symbol='BTC/USDT'.

Call ta.compute_indicators exchange='binance' symbol='ADA/USDT' timeframe='1h'.

Call portfolio.portfolio_value exchanges=['binance'].

Call freqtrade.status.

Call notifier.send_telegram message='Test from Crypto MCP Server'.

<img width="1024" height="1024" alt="cryptomcppic" src="https://github.com/user-attachments/assets/9e8f5a08-cbc9-42e3-aed2-d53fcc6d0083" />
