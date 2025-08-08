#!/usr/bin/env python3
"""
onchain_mcp.py
On-chain MCP server (Ethereum family) for Crypto MCP Server – Produced by Corax CoLAB
Exposes: eth_balance, erc20_balance, tx_info
"""
import os
import logging
from typing import Optional
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware import geth_poa_middleware

load_dotenv(dotenv_path="/home/pelle/cryptomcpserver/.env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("onchain_mcp")

mcp = FastMCP(name="onchain", stateless_http=True, json_response=True)

def _get_web3(rpc_url: Optional[str] = None) -> Web3:
    rpc_url = rpc_url or os.getenv("ETH_RPC_URL")
    if not rpc_url:
        raise RuntimeError("ETH_RPC_URL måste vara satt i .env")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    try:
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    except Exception:
        pass
    if not w3.is_connected():
        raise RuntimeError(f"Kan inte koppla till RPC: {rpc_url}")
    return w3

@mcp.tool()
def eth_balance(address: str, rpc_url: Optional[str] = None) -> dict:
    w3 = _get_web3(rpc_url)
    wei = w3.eth.get_balance(address)
    eth = w3.from_wei(wei, "ether")
    return {"address": address, "balance_wei": str(wei), "balance_eth": str(eth)}

ERC20_ABI = [
    {"constant":True,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
    {"constant":True,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
    {"constant":True,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},
]

@mcp.tool()
def erc20_balance(address: str, contract_address: str, rpc_url: Optional[str] = None) -> dict:
    w3 = _get_web3(rpc_url)
    contract = w3.eth.contract(address=w3.to_checksum_address(contract_address), abi=ERC20_ABI)
    balance = contract.functions.balanceOf(w3.to_checksum_address(address)).call()
    try:
        decimals = contract.functions.decimals().call()
    except Exception:
        decimals = 18
    human = balance / (10 ** decimals)
    return {"address": address, "contract": contract_address, "balance_raw": str(balance), "balance": human, "decimals": decimals}

@mcp.tool()
def tx_info(txhash: str, rpc_url: Optional[str] = None) -> dict:
    w3 = _get_web3(rpc_url)
    tx = w3.eth.get_transaction(txhash)
    receipt = w3.eth.get_transaction_receipt(txhash)
    return {"tx": dict(tx), "receipt": dict(receipt)}

if __name__ == "__main__":
    print("Starting onchain_mcp on http://127.0.0.1:7002/mcp — Crypto MCP Server (Corax CoLAB)")
    # transport, bind (address:port), mount_path
    mcp.run("streamable-http")
