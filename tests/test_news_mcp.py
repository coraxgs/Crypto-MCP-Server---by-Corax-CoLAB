from unittest.mock import patch, MagicMock
from news_mcp import get_latest_news

@patch('news_mcp.requests.get')
def test_get_latest_news(mock_get):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "results": [
            {
                "title": "Bitcoin reaches new high",
                "votes": {"positive": 10, "negative": 1}
            },
            {
                "title": "Market crash",
                "votes": {"positive": 1, "negative": 10}
            }
        ]
    }
    mock_get.return_value = mock_response

    res = get_latest_news()
    assert res["status"] == "success"
    assert len(res["news"]) == 2
    assert res["news"][0]["title"] == "Bitcoin reaches new high"
    assert res["news"][0]["sentiment"] == "bullish"
    assert res["news"][1]["sentiment"] == "bearish"
