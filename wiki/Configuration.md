⚙️ Configuration: .env (backend)

Copy and edit /home/pelle/cryptomcpserver/gui/backend/.env.example → .env:

MCP_CCXT=http://127.0.0.1:7001/mcp
MCP_PORTFOLIO=http://127.0.0.1:7004/mcp
PORT=4000

MCP_CCXT — CCXT MCP endpoint (for get_ticker, create_order, etc.)

MCP_PORTFOLIO — optional portfolio aggregator MCP

PORT — backend port (default 4000)
