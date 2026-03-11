🖥 Dashboard — what you can do (user manual)

Portfolio: view aggregated balances & USD value (updated via portfolio MCP).

Ticker: live market data (via ccxt MCP).

Order / Trade:

Preview (dry_run): calculates estimated cost and logs a preview to orders.db.

Confirm → Place order: sends create_order to CCXT MCP (backend requires execute:true).


Orders log: shows previews and executed orders (real-time updates via socket.io).

Export / logs: export orders or check orders.db.


Safety: Always test with testnet keys. The UI requires confirmation to execute live orders.
