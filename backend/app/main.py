import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.api import api_router

# Load environment variables from .env file
load_dotenv()

PROJECT_NAME = os.getenv("PROJECT_NAME", "FutureReady API")
API_V1_STR = os.getenv("API_V1_STR", "/api/v1")

# Parse CORS origins
cors_origins_raw = os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000", "http://localhost:5173"]')
try:
    origins = json.loads(cors_origins_raw)
except Exception:
    origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app = FastAPI(
    title=PROJECT_NAME,
    openapi_url=f"{API_V1_STR}/openapi.json",
    docs_url=f"{API_V1_STR}/docs",
    redoc_url=f"{API_V1_STR}/redoc",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=API_V1_STR)


@app.get("/")
def root():
    """Root endpoint welcoming API consumers."""
    return {
        "message": f"Welcome to {PROJECT_NAME}",
        "docs": f"{API_V1_STR}/docs",
        "health": f"{API_V1_STR}/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
