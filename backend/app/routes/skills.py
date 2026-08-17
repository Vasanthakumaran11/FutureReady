from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from ..schemas.dashboard import SkillGapOut
from ..services.computation_service import compute_skill_gaps
from .deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("/gaps", response_model=List[SkillGapOut])
async def get_skill_gaps(
    job_id: Optional[str] = Query(None, description="Optional job ID to prioritize job-specific requirements"),
    current_user: dict = Depends(get_current_user)
):
    return await compute_skill_gaps(current_user["id"], job_id=job_id)
