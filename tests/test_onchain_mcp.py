import pytest
from unittest.mock import patch, MagicMock
from onchain_mcp import eth_balance, gas_price

@patch('onchain_mcp._get_web3')
def test_eth_balance(mock_get_web3):
    mock_w3 = MagicMock()
    mock_w3.eth.get_balance.return_value = 1000000000000000000 # 1 ETH in Wei
    mock_w3.from_wei.return_value = 1.0
    mock_get_web3.return_value = mock_w3

    result = eth_balance("0x1234")
    assert result["balance_wei"] == "1000000000000000000"
    assert result["balance_eth"] == "1.0"
    assert result["address"] == "0x1234"

@patch('onchain_mcp._get_web3')
def test_gas_price(mock_get_web3):
    mock_w3 = MagicMock()
    mock_w3.eth.gas_price = 20000000000 # 20 Gwei
    mock_w3.from_wei.return_value = 20.0
    mock_get_web3.return_value = mock_w3

    result = gas_price()
    assert result["gas_price_wei"] == "20000000000"
    assert result["gas_price_gwei"] == "20.0"
