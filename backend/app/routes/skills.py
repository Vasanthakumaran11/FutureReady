from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional

from ..schemas.skills import (
    RoleSummaryOut,
    RoleDetailOut,
    SkillGapAnalysisResponse,
    LearningResourceOut,
    ProgressUpdateRequest,
    LearningProgressOut
)
from ..schemas.dashboard import SkillGapOut
from ..services.skills import (
    get_all_roles,
    get_role_details,
    analyze_skill_gaps,
    get_resources_for_skill,
    update_learning_progress,
    get_user_learning_progress
)
from ..services.computation_service import compute_skill_gaps
from .deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills & Learning Resources"])

@router.get("/roles", response_model=List[RoleSummaryOut])
async def list_career_roles():
    """
    Returns the complete catalog of 10 supported career tracks and skills.
    """
    try:
        return await get_all_roles()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch career roles: {str(e)}"
        )

@router.get("/roles/{role_name}", response_model=RoleDetailOut)
async def get_career_role_details(role_name: str):
    """
    Returns required skills, topics, and difficulty levels for a specific career track.
    """
    details = await get_role_details(role_name)
    if not details:
        raise HTTPException(status_code=404, detail="Role not found")
    return details

@router.get("/gap", response_model=SkillGapAnalysisResponse)
async def get_skill_gap_analysis(
    role: Optional[str] = Query(None, description="Target career role name"),
    job_id: Optional[str] = Query(None, description="Optional job ID to prioritize job-specific requirements"),
    current_user: dict = Depends(get_current_user)
):
    """
    Computes complete skill gap analysis comparing candidate's profile/resume skills
    against the target role or job requirements.
    """
    try:
        analysis = await analyze_skill_gaps(
            user_id=current_user["id"],
            target_role=role,
            job_id=job_id
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze skill gaps: {str(e)}"
        )

# Backward-compatible endpoint for existing dashboard/skills widgets
@router.get("/gaps", response_model=List[SkillGapOut])
async def get_legacy_skill_gaps(
    job_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    return await compute_skill_gaps(current_user["id"], job_id=job_id)

@router.get("/{skill_name}/resources", response_model=List[LearningResourceOut])
async def get_skill_learning_resources(
    skill_name: str,
    role: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns curated YouTube courses, tutorials, and practice links for a specific skill.
    """
    try:
        resources = await get_resources_for_skill(
            skill_name=skill_name,
            role=role,
            difficulty=difficulty
        )
        return resources
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch resources for {skill_name}: {str(e)}"
        )

@router.get("/progress", response_model=List[LearningProgressOut])
async def get_candidate_learning_progress(current_user: dict = Depends(get_current_user)):
    """
    Returns all learning progress and completed resource milestones for the authenticated user.
    """
    try:
        return await get_user_learning_progress(current_user["id"])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch learning progress: {str(e)}"
        )

@router.post("/progress", response_model=LearningProgressOut)
async def update_candidate_learning_progress(
    payload: ProgressUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Updates the candidate's learning progress or marks specific resources completed.
    """
    try:
        result = await update_learning_progress(
            user_id=current_user["id"],
            skill_name=payload.skill,
            resource_id=payload.resource_id,
            completed=payload.completed,
            custom_progress=payload.custom_progress
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update progress: {str(e)}"
        )
