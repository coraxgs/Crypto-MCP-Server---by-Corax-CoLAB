🗄 SQLite & logs

DB file: /home/pelle/cryptomcpserver/gui/backend/orders.db

Inspect last 10 orders:

sqlite3 /home/pelle/cryptomcpserver/gui/backend/orders.db \
  "SELECT id,created_at,exchange,symbol,side,amount,price,status FROM orders ORDER BY created_at DESC LIMIT 10;"

Check backend logs:

sudo journalctl -u crypto-mcp-gui.service -f
