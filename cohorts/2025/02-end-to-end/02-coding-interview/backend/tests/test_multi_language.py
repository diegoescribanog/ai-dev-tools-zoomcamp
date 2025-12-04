import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_multi_language_state():
    with client.websocket_connect("/ws") as websocket1:
        # Initial state should have both languages
        data = websocket1.receive_json()
        assert data["type"] == "init"
        assert "python" in data["code"]
        assert "javascript" in data["code"]
        
        # Update Python code
        websocket1.send_json({
            "type": "code_update",
            "language": "python",
            "code": "print('Updated Python')"
        })
        
        # Update JS code
        websocket1.send_json({
            "type": "code_update",
            "language": "javascript",
            "code": "console.log('Updated JS')"
        })
        
        # Connect new client, should receive updated state for both
        with client.websocket_connect("/ws") as websocket2:
            data2 = websocket2.receive_json()
            assert data2["code"]["python"] == "print('Updated Python')"
            assert data2["code"]["javascript"] == "console.log('Updated JS')"
