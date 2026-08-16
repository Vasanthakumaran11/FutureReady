from fastapi import APIRouter, Depends
from typing import List

from ..schemas.dashboard import SkillGapOut
from ..services.computation_service import compute_skill_gaps
from .deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("/gaps", response_model=List[SkillGapOut])
async def get_skill_gaps(current_user: dict = Depends(get_current_user)):
    return await compute_skill_gaps(current_user["id"])
