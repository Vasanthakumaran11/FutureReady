from fastapi import APIRouter
from .health import router as health_router

api_router = APIRouter()

# Include health routes
api_router.include_router(health_router, prefix="", tags=["Health"])

# Additional feature routes can be registered here:
# api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_router.include_router(user_router, prefix="/users", tags=["Users"])
