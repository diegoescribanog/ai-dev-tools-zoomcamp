from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Dict
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        # Store the current state of the code to send to new connections
        self.current_code: Dict[str, str] = {
            "python": "# Write your Python code here\nprint('Hello World')",
            "javascript": "// Write your JavaScript code here\nconsole.log('Hello World');"
        }

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Send current code to the new user
        await websocket.send_text(json.dumps({"type": "init", "code": self.current_code}))

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str, sender: WebSocket):
        for connection in self.active_connections:
            if connection != sender:
                await connection.send_text(message)

    def update_code(self, language: str, code: str):
        self.current_code[language] = code

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "code_update":
                manager.update_code(message["language"], message["code"])
                # Broadcast the update to other users
                await manager.broadcast(data, websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Serve static files if the directory exists (for production/docker)
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Serve index.html for any path not matched by API or static assets
        # This handles client-side routing
        if full_path.startswith("ws"):
            return # Let websocket handler take care of it
        
        # Check if file exists in static folder (e.g. favicon.ico)
        if os.path.exists(f"static/{full_path}") and full_path != "":
             return FileResponse(f"static/{full_path}")
             
        return FileResponse("static/index.html")
