🔗 Claude Desktop integration (detailed) 🧩

Overview

Claude Desktop supports Local MCP Servers (HTTP JSON-RPC endpoints). Add your MCP endpoints in Claude Desktop so Claude can call the tools exposed by those MCPs (e.g., get_ticker, create_order).

Add MCP servers in Claude Desktop (step-by-step)

1. Open Claude Desktop app.


2. Open App Settings / Preferences.


3. Find Local MCP Servers.


4. Click + (Add) — fill fields one by one (do not paste a JSON array):

Name: ccxt

Description: CCXT MCP – exchange trading & market data

Transport: http

Endpoint: http://127.0.0.1:7001/mcp (if Claude runs on Pi) or http://<pi-ip>:7001/mcp (if Claude runs on laptop)

Save.



5. Repeat for other MCPs (coingecko, portfolio, freqtrade) with their ports.



Example endpoints to add

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

Test MCP from the Pi (curl examples)

Ping:

curl -s -X POST http://127.0.0.1:7001/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json,text/event-stream' \
  -d '{
    "jsonrpc":"2.0","id":1,"method":"tools/call",
    "params":{"name":"ping","arguments":{}}
  }'

get_ticker:

curl -s -X POST http://127.0.0.1:7001/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json,text/event-stream' \
  -d '{
    "jsonrpc":"2.0","id":2,"method":"tools/call",
    "params":{"name":"get_ticker","arguments":{"exchange":"binance","symbol":"BTC/USDT"}}
  }'

If you see Not Acceptable: Client must accept both application/json and text/event-stream → add the Accept header exactly as shown.

How Claude uses the MCP tools

After adding Local MCP Servers via the UI, Claude Desktop will expose those tools when you compose prompts or use tool invocation features. Use tool name get_ticker, create_order etc., and Claude will call the MCP endpoint using the JSON-RPC tools/call pattern.


Troubleshooting Claude <-> MCP

"No servers added" → ensure you pressed + and saved; restart Claude Desktop if UI doesn’t update.

Claude cannot reach MCP → use Pi LAN IP and open the port in Pi firewall (ufw), or use SSH port forwarding.

Validation errors → use the JSON-RPC wrapper (method: "tools/call" / params: { name, arguments }).

Security → never expose MCP endpoints that can place live trades to the public internet without TLS + auth.
