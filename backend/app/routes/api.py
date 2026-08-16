from fastapi import APIRouter

from .health import router as health_router
from .auth import router as auth_router
from .profile import router as profile_router
from .resume import router as resume_router
from .jobs import router as jobs_router
from .interview import router as interview_router
from .dashboard import router as dashboard_router
from .skills import router as skills_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="", tags=["Health"])
api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(resume_router)
api_router.include_router(jobs_router)
api_router.include_router(interview_router)
api_router.include_router(dashboard_router)
api_router.include_router(skills_router)
