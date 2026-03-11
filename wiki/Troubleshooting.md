⚠️ Troubleshooting & common errors

Service crashes on start → check journalctl -u crypto-mcp-gui.service -n 200. Common issues: missing npm dependencies, syntax errors, or port 4000 already in use.

EADDRINUSE (port 4000 occupied) → find and kill the process:


sudo lsof -i :4000
sudo kill -9 <PID>

MCP JSON-RPC validation errors → use the tools/call wrapper as shown in the CURL examples.

Claude cannot call MCP → ensure Claude can reach the Pi (use LAN IP or SSH tunnel), and that you added the MCP via the + button.
