🔁 REST API examples (curl)

Ticker:


curl "http://127.0.0.1:4000/api/ticker?exchange=binance&symbol=BTC/USDT"

Portfolio:


curl "http://127.0.0.1:4000/api/portfolio?exchanges=binance"

Preview order (dry_run):


curl -s -X POST http://127.0.0.1:4000/api/order/dry_run \
  -H 'Content-Type: application/json' \
  -d '{"exchange":"binance","symbol":"BTC/USDT","side":"buy","type":"market","amount":0.001}' | jq

Execute order:


curl -s -X POST http://127.0.0.1:4000/api/order/execute \
  -H 'Content-Type: application/json' \
  -d '{"exchange":"binance","symbol":"BTC/USDT","side":"buy","type":"market","amount":0.001,"execute":true}' | jq

Orders list:


curl http://127.0.0.1:4000/api/orders | jq
