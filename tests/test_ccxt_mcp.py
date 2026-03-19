import pytest
from unittest.mock import patch, MagicMock
from ccxt_mcp import get_ticker, create_order

@patch('ccxt_mcp._make_exchange')
def test_get_ticker(mock_make_exchange):
    mock_exchange = MagicMock()
    mock_exchange.fetch_ticker.return_value = {"last": 50000.0, "symbol": "BTC/USDT"}
    mock_make_exchange.return_value = mock_exchange

    ticker = get_ticker("binance", "BTC/USDT")
    assert ticker["last"] == 50000.0
    assert ticker["symbol"] == "BTC/USDT"

@patch('ccxt_mcp.requests.post')
@patch('ccxt_mcp._make_exchange')
def test_create_order_pending_flow(mock_make_exchange, mock_post):
    mock_exchange = MagicMock()
    mock_exchange.fetch_ticker.return_value = {"last": 100.0}
    mock_make_exchange.return_value = mock_exchange

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_post.return_value = mock_response

    import os
    os.environ["ALLOWED_PAIRS"] = "BTC/USDT,SOL/USDT"
    import ccxt_mcp
    ccxt_mcp.ALLOWED_PAIRS = ["BTC/USDT", "SOL/USDT"]

    res = ccxt_mcp.create_order("binance", "SOL/USDT", "buy", "market", 1.0, None)

    assert "status" in res
    assert res["status"] == "pending_approval"
    mock_post.assert_called_once()

@patch('ccxt_mcp.requests.post')
def test_log_reasoning(mock_post):
    import ccxt_mcp
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_post.return_value = mock_response

    res = ccxt_mcp.log_reasoning("test_trade_id_123", "AI found a 5% dip and buying volume increasing.")

    assert res["status"] == "success"
    mock_post.assert_called_once()
    args, kwargs = mock_post.call_args
    assert "explanation" in kwargs["json"]
    assert kwargs["json"]["explanation"] == "AI found a 5% dip and buying volume increasing."
    assert "trade_id" in kwargs["json"]
    assert kwargs["json"]["trade_id"] == "test_trade_id_123"
