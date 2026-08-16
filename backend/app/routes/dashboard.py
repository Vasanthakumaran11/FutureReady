from fastapi import APIRouter, Depends
from typing import List

from ..schemas.dashboard import DashboardSummaryOut, SkillGapOut
from ..services.computation_service import compute_dashboard_data, compute_skill_gaps
from .deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    data = await compute_dashboard_data(current_user["id"])
    return data

@router.get("/gaps", response_model=List[SkillGapOut])
async def get_gaps(current_user: dict = Depends(get_current_user)):
    gaps = await compute_skill_gaps(current_user["id"])
    return gaps
