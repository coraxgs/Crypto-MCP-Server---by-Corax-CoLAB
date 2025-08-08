#!/usr/bin/env python3
"""
ta_mcp.py
Technical analysis MCP server for Crypto MCP Server – Produced by Corax CoLAB
Exposes: compute_indicators (RSI, MACD, SMA50, BB)
"""
import os
import logging
from typing import Dict, Any
import pandas as pd
import pandas_ta as ta
import ccxt
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

load_dotenv(dotenv_path="/home/pelle/cryptomcpserver/.env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ta_mcp")

mcp = FastMCP(name="ta", stateless_http=True, json_response=True)

def _fetch_ohlcv(exchange_id: str, symbol: str, timeframe: str, limit: int = 200):
    exchange_id = exchange_id.lower()
    if exchange_id not in ccxt.exchanges:
        raise ValueError(f"Unsupported exchange: {exchange_id}")
    cls = getattr(ccxt, exchange_id)
    ex = cls({"enableRateLimit": True})
    data = ex.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(data, columns=["ts", "open", "high", "low", "close", "volume"])
    df["ts"] = pd.to_datetime(df["ts"], unit="ms")
    df.set_index("ts", inplace=True)
    return df

@mcp.tool()
def compute_indicators(exchange: str, symbol: str, timeframe: str = "1h", limit: int = 200) -> Dict[str, Any]:
    df = _fetch_ohlcv(exchange, symbol, timeframe, limit)
    df["rsi"] = ta.rsi(df["close"], length=14)
    macd = ta.macd(df["close"])
    df["macd"] = macd["MACD_12_26_9"]
    df["macd_signal"] = macd["MACDs_12_26_9"]
    df["sma50"] = ta.sma(df["close"], length=50)
    bb = ta.bbands(df["close"])
    df["bb_lower"] = bb["BBL_20_2.0"]
    df["bb_upper"] = bb["BBU_20_2.0"]

    last = df.iloc[-1].to_dict()
    rsi = last.get("rsi")
    macd_hist = last.get("macd") - last.get("macd_signal") if (last.get("macd") is not None and last.get("macd_signal") is not None) else None
    signal = "hold"
    if rsi and rsi < 30 and macd_hist and macd_hist > 0:
        signal = "buy"
    elif rsi and rsi > 70 and macd_hist and macd_hist < 0:
        signal = "sell"
    return {"symbol": symbol, "timeframe": timeframe, "rsi": rsi, "macd_hist": macd_hist, "sma50": last.get("sma50"), "bb_lower": last.get("bb_lower"), "bb_upper": last.get("bb_upper"), "signal": signal }

if __name__ == "__main__":
    print("Starting coingecko_mcp on http://127.0.0.1:7003/mcp — Crypto MCP Server (Corax CoLAB)")
    mcp.run(
        "streamable-http",    # transport kan vara positionellt
        host="127.0.0.1",     # namngiven
        port=7003,            # namngiven
        path="/mcp",          # OBS: inte mount_path utan path
    )
