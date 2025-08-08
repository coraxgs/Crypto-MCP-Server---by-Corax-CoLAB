#!/usr/bin/env python3
"""
portfolio_mcp.py
Aggregates balances (CEX via CCXT + on-chain) and prices (CoinGecko primary, CCXT fallback).
For Crypto MCP Server – Produced by Corax CoLAB
"""
import os
import logging
from typing import Dict, Any, List
import ccxt
from pycoingecko import CoinGeckoAPI
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
import time

load_dotenv(dotenv_path="/home/pelle/cryptomcpserver/.env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio_mcp")

mcp = FastMCP(name="portfolio", stateless_http=True, json_response=True)
cg = CoinGeckoAPI()

_CACHE = {"prices": {}, "timestamp": 0}
CACHE_TTL = int(os.getenv("PORTFOLIO_CACHE_TTL", "30"))

def _get_price_coingecko(symbol: str):
    now = time.time()
    if now - _CACHE["timestamp"] > CACHE_TTL:
        _CACHE["prices"] = {}
        _CACHE["timestamp"] = now
    key = symbol.upper()
    if key in _CACHE["prices"]:
        return _CACHE["prices"][key]
    try:
        coins = cg.get_coins_list()
        mapping = {c["symbol"].upper(): c["id"] for c in coins}
        coin_id = mapping.get(key)
        if coin_id:
            rp = cg.get_price(ids=coin_id, vs_currencies="usd")
            price = rp.get(coin_id, {}).get("usd")
            if price:
                _CACHE["prices"][key] = price
                return price
    except Exception as e:
        logger.debug("CoinGecko lookup failed: %s", e)
    return None

def _get_price_ccxt(exchange, symbol):
    pair = f"{symbol}/USDT"
    try:
        t = exchange.fetch_ticker(pair)
        return t.get("last")
    except Exception:
        return None

@mcp.tool()
def portfolio_value(exchanges: List[str]) -> Dict[str, Any]:
    total_usd = 0.0
    details = []
    for exch in exchanges:
        exch_low = exch.lower()
        if exch_low not in ccxt.exchanges:
            continue
        cls = getattr(ccxt, exch_low)
        opts = {"enableRateLimit": True}
        api_key = os.getenv(f"{exch_low.upper()}_API_KEY")
        api_secret = os.getenv(f"{exch_low.upper()}_API_SECRET")
        if api_key and api_secret:
            opts.update({"apiKey": api_key, "secret": api_secret})
        ex = cls(opts)
        try:
            bal = ex.fetch_balance()
        except Exception as e:
            logger.warning("fetch_balance failed for %s: %s", exch_low, e)
            continue
        for coin, amount in bal.get("total", {}).items():
            if not amount or amount == 0:
                continue
            price = _get_price_coingecko(coin)
            if price is None:
                price = _get_price_ccxt(ex, coin)
            value = amount * (price or 0.0)
            total_usd += value
            details.append({"exchange": exch_low, "asset": coin, "amount": amount, "price_usd": price, "value_usd": value})
    return {"total_usd": total_usd, "details": details, "cache_ttl": CACHE_TTL, "cached_at": _CACHE["timestamp"]}

if __name__ == "__main__":
    print("Starting coingecko_mcp on http://127.0.0.1:7004/mcp — Crypto MCP Server (Corax CoLAB)")
    mcp.run(
        "streamable-http",    # transport kan vara positionellt
        host="127.0.0.1",     # namngiven
        port=7004,            # namngiven
        path="/mcp",          # OBS: inte mount_path utan path
    )
