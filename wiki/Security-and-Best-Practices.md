🔒 Security & best practices

Use testnet keys while testing.

Keep API keys out of repo — store them in the MCP server config or in secure .env not committed.

Restrict access to MCP endpoints to LAN only (UFW rules) or use VPN/SSH tunnels.

For remote exposure: use an authenticated reverse proxy (NGINX + TLS + basic auth) — do not open trading endpoints publicly without robust auth.
