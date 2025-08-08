#!/usr/bin/env python3
"""
notifier_mcp.py
Send notifications to Telegram and Discord for Crypto MCP Server – Produced by Corax CoLAB
"""
import os
import logging
import requests
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="/home/pelle/cryptomcpserver/.env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("notifier_mcp")

# Initialize FastMCP server
mcp = FastMCP(name="notifier", stateless_http=True, json_response=True)

# Load credentials from environment
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT = os.getenv("TELEGRAM_CHAT_ID")
DISCORD_WEBHOOK = os.getenv("DISCORD_WEBHOOK_URL")

@mcp.tool()
def ping() -> str:
    """Health check endpoint"""
    return "notifier_mcp alive — Crypto MCP Server (Corax CoLAB)"

@mcp.tool()
def send_telegram(message: str) -> dict:
    """Send a message to a Telegram bot"""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT:
        raise RuntimeError("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env")
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    r = requests.post(url, json={"chat_id": TELEGRAM_CHAT, "text": message})
    return {"status": r.status_code, "result": r.json()}

@mcp.tool()
def send_discord(message: str) -> dict:
    """Send a message to a Discord webhook"""
    if not DISCORD_WEBHOOK:
        raise RuntimeError("DISCORD_WEBHOOK_URL is missing in .env")
    r = requests.post(DISCORD_WEBHOOK, json={"content": message})
    return {"status": r.status_code, "result_text": r.text}

if __name__ == "__main__":
    print("Starting coingecko_mcp on http://127.0.0.1:7005/mcp — Crypto MCP Server (Corax CoLAB)")
    mcp.run(
        "streamable-http",    # transport kan vara positionellt
        host="127.0.0.1",     # namngiven
        port=7005,            # namngiven
        path="/mcp",          # OBS: inte mount_path utan path
    )
