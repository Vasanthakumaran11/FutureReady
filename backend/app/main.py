import os
import json
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.mongodb import connect_to_mongo, close_mongo_connection
from .routes.api import api_router

# Load environment variables
load_dotenv()

PROJECT_NAME = os.getenv("PROJECT_NAME", "FutureReady API")
API_V1_STR = os.getenv("API_V1_STR", "/api/v1")

# Parse CORS origins
cors_origins_raw = os.getenv(
    "BACKEND_CORS_ORIGINS",
    '["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080"]'
)
try:
    origins = json.loads(cors_origins_raw)
except Exception:
    origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    try:
        from .services.skills import seed_skill_database
        await seed_skill_database()
    except Exception as e:
        print(f"Notice: Skill database seeding skipped/failed: {e}")
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title=PROJECT_NAME,
    openapi_url=f"{API_V1_STR}/openapi.json",
    docs_url=f"{API_V1_STR}/docs",
    redoc_url=f"{API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-Session-Token"],
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
