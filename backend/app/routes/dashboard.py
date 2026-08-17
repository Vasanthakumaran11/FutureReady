from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from ..schemas.dashboard import DashboardSummaryOut, SkillGapOut
from ..services.computation_service import compute_dashboard_data, compute_skill_gaps
from .deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    data = await compute_dashboard_data(current_user["id"])
    return data

@router.get("/gaps", response_model=List[SkillGapOut])
async def get_gaps(
    job_id: Optional[str] = Query(None, description="Optional job ID to prioritize skill gaps"),
    current_user: dict = Depends(get_current_user)
):
    gaps = await compute_skill_gaps(current_user["id"], job_id=job_id)
    return gaps
