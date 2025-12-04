import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    # Just a basic test to see if app is up (though we don't have http endpoints except ws)
    # We can test if WS endpoint exists
    with client.websocket_connect("/ws") as websocket:
        data = websocket.receive_json()
        assert data["type"] == "init"
        assert "python" in data["code"]

def test_websocket_broadcast():
    with client.websocket_connect("/ws") as websocket1:
        with client.websocket_connect("/ws") as websocket2:
            # Initial state
            data1 = websocket1.receive_json()
            data2 = websocket2.receive_json()
            
            # Send update from client 1
            websocket1.send_json({
                "type": "code_update",
                "language": "python",
                "code": "print('New Code')"
            })
            
            # Client 2 should receive it
            data = websocket2.receive_json()
            assert data["type"] == "code_update"
            assert data["code"] == "print('New Code')"
