#!/usr/bin/env python3
"""
ccxt_mcp.py
CCXT MCP server for Crypto MCP Server – Produced by Corax CoLAB
Exposes: get_ticker, fetch_ohlcv, fetch_balance, create_order, cancel_order, fetch_open_orders
Run via systemd or: python3 ccxt_mcp.py
"""
import os
import logging
from typing import Optional, List, Dict, Any
import ccxt
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

load_dotenv(dotenv_path="/home/pelle/cryptomcpserver/.env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ccxt_mcp")

mcp = FastMCP(name="ccxt", stateless_http=True, json_response=True)

def _make_exchange(exchange_id: str) -> ccxt.Exchange:
    exchange_id = exchange_id.lower()
    if exchange_id not in ccxt.exchanges:
        raise ValueError(f"Unsupported exchange: {exchange_id}")
    cls = getattr(ccxt, exchange_id)
    api_key = os.getenv(f"{exchange_id.upper()}_API_KEY")
    api_secret = os.getenv(f"{exchange_id.upper()}_API_SECRET")
    opts = {"enableRateLimit": True}
    if api_key and api_secret:
        opts.update({"apiKey": api_key, "secret": api_secret})
    # Some exchanges require extra options for testnet; handle externally if needed
    return cls(opts)

@mcp.tool()
def ping() -> str:
    return "ccxt_mcp alive — Crypto MCP Server (Corax CoLAB)"

@mcp.tool()
def get_ticker(exchange: str, symbol: str) -> dict:
    ex = _make_exchange(exchange)
    ticker = ex.fetch_ticker(symbol)
    return ticker

@mcp.tool()
def fetch_ohlcv(exchange: str, symbol: str, timeframe: str = "1h", limit: int = 200) -> List[List[Any]]:
    ex = _make_exchange(exchange)
    ohlcv = ex.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    return ohlcv

@mcp.tool()
def fetch_balance(exchange: str) -> dict:
    ex = _make_exchange(exchange)
    balance = ex.fetch_balance()
    return balance

@mcp.tool()
def create_order(exchange: str, symbol: str, side: str, type: str, amount: float, price: Optional[float] = None, params: Optional[dict] = None) -> dict:
    ex = _make_exchange(exchange)
    params = params or {}
    if type == "market":
        order = ex.create_order(symbol, type, side, amount, None, params)
    else:
        order = ex.create_order(symbol, type, side, amount, price, params)
    return order

@mcp.tool()
def cancel_order(exchange: str, order_id: str, symbol: Optional[str] = None) -> dict:
    ex = _make_exchange(exchange)
    res = ex.cancel_order(order_id, symbol) if symbol else ex.cancel_order(order_id)
    return res

@mcp.tool()
def fetch_open_orders(exchange: str, symbol: Optional[str] = None) -> list:
    ex = _make_exchange(exchange)
    if symbol:
        return ex.fetch_open_orders(symbol)
    return ex.fetch_open_orders()

if __name__ == "__main__":
    print("Starting ccxt_mcp on http://127.0.0.1:7001/mcp — Crypto MCP Server – Produced by Corax CoLAB")
    mcp.run(transport="streamable-http", host="127.0.0.1", port=7001, mount_path="/mcp")
