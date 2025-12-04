# Homework Answers

## Question 1: Initial Implementation

**Question:** Ask AI to implement both frontend and backend - in one prompt. What's the initial prompt you gave to AI to start the implementation?

**Answer:** "Create a real-time collaborative coding platform with Python FastAPI backend and React frontend. Use WebSockets for real-time updates."

**Explanation:**
I chose **FastAPI** for the backend because it has excellent support for **WebSockets** out of the box and is highly performant (built on Starlette). For the frontend, **React** is the industry standard for building interactive UIs.
- **WebSockets**: Used for real-time bi-directional communication. When one user types, the `code_update` event is sent to the server, which broadcasts it to all other connected clients.
- **State Management**: The server keeps the "current state" of the code in memory (`ConnectionManager.current_code`) so new users get the latest code immediately upon joining.

---

## Question 2: Integration Tests

**Question:** Ask AI to write integration tests that check that the interaction between client and server works. What's the terminal command you use for executing tests?

**Answer:** `PYTHONPATH=. uv run pytest`

**Explanation:**
Integration tests ensure that the WebSocket communication works as expected.
- **Test Framework**: Used `pytest` with `TestClient` from FastAPI.
- **Scenario**: The test simulates two clients connecting to the WebSocket endpoint. It verifies that when Client A sends a message, Client B receives the exact same message.
- **PYTHONPATH**: We set `PYTHONPATH=.` to ensure the test runner can import the `main` module correctly from the current directory.
- **Test Results**: All 3 tests pass, including multi-language state persistence tests.

---

## Question 3: Running Both Client and Server

**Question:** Now let's make it possible to run both client and server at the same time. Use `concurrently` for that. What's the command you have in `package.json` for `npm dev` for running both?

**Answer:** `concurrently "cd backend && uv run uvicorn main:app --reload --port 8000" "cd frontend && npm run dev"`

**Explanation:**
`concurrently` is a Node.js tool that allows running multiple commands in parallel in the same terminal window.
- **Backend Command**: `uv run uvicorn main:app --reload --port 8000` starts the FastAPI server with hot-reloading enabled.
- **Frontend Command**: `npm run dev` starts the Vite development server.
- This setup is convenient for development as it provides a single entry point to start the entire stack.

---

## Question 4: Syntax Highlighting

**Question:** Let's now add support for syntax highlighting for JavaScript and Python. Which library did AI use for it?

**Answer:** `@monaco-editor/react`

**Explanation:**
I used **Monaco Editor**, which is the code editor that powers VS Code.
- **Why Monaco?**: It provides a rich editing experience with built-in syntax highlighting for dozens of languages (including Python and JavaScript), code completion, and minimap.
- **React Wrapper**: `@monaco-editor/react` is a lightweight wrapper that makes it easy to use Monaco in a React application.
- **Multi-Language Support**: The editor seamlessly switches between Python and JavaScript syntax highlighting based on the selected language.

---

## Question 5: Code Execution

**Question:** Now let's add code execution. For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser. Which library did AI use for compiling Python to WASM?

**Answer:** `pyodide`

**Explanation:**
For security and simplicity, I used **Pyodide**, which is a port of CPython to WebAssembly (WASM).
- **Client-Side Execution**: The Python code runs entirely in the user's browser. This means we don't need to sandbox code execution on our server, eliminating a huge class of security vulnerabilities (like remote code execution).
- **Performance**: Once loaded, WASM execution is near-native speed.
- **Implementation**: The `Output` component loads Pyodide from a CDN and uses `pyodide.runPythonAsync(code)` to execute the user's code, capturing stdout to display in the UI.
- **JavaScript Support**: For JavaScript execution, I use native browser execution with `console.log` interception for output capture.

---

## Question 6: Containerization

**Question:** Now let's containerize our application. Ask AI to help you create a Dockerfile for the application. Put both backend and frontend in one container. What's the base image you used for your Dockerfile?

**Answer:** `python:3.12-slim` (Multi-stage build)

**Explanation:**
I used a **multi-stage Docker build** to create a single, optimized container image.
1. **Build Stage (Node.js)**: Uses `node:20-slim` to install frontend dependencies and build the React app (`npm run build`). This produces static HTML/CSS/JS files.
2. **Final Stage (Python)**: Uses `python:3.12-slim`. It installs the Python dependencies using `uv`.
3. **Integration**: The static files from the build stage are copied into the Python image. FastAPI is configured to serve these static files, effectively hosting the frontend itself.
- This approach simplifies deployment as we only need to manage a single container.

---

## Question 7: Deployment

**Question:** Now let's deploy it. Choose a service to deploy your application. Which service did you use for deployment?

**Answer:** Render / Railway / Google Cloud Run / AWS App Runner

**Explanation:**
The application is containerized, so it can be deployed to any platform that supports Docker.
- **Port**: The container exposes port 8000.
- **Environment**: No complex environment variables are needed for this basic version.
- **Deployment Options**: 
  - **Render**: Simple git-based deployment with automatic builds
  - **Railway**: Easy Docker deployment with built-in CI/CD
  - **Google Cloud Run**: Serverless container platform with auto-scaling
  - **AWS App Runner**: Fully managed container service
