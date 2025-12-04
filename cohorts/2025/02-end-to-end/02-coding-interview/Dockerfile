# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Stage 2: Setup Backend and Serve
FROM python:3.12-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy backend requirements
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-install-project

# Copy backend code
COPY backend/ .

# Copy frontend build to static folder
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose port
EXPOSE 8000

# Run application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
