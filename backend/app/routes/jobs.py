import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Dict, Any, Optional
from bson import ObjectId

from ..schemas.jobs import (
    JobOut,
    JobSearchResponse,
    JobRecommendationResponse,
    JobDetailMatchResponse,
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationOut
)
from ..services.jobs import (
    search_and_score_jobs,
    get_candidate_recommended_jobs,
    match_job_to_profile,
    normalize_catalog_job
)
from ..services.jobs.recommendation_service import BENCHMARK_JOBS
from ..database.mongodb import get_applications_collection, get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="", tags=["Jobs & Applications"])

@router.get("/jobs/recommended", response_model=JobRecommendationResponse)
async def get_recommended_jobs(
    limit: int = Query(12, ge=1, le=50),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns personalized recommended jobs automatically derived from the logged-in candidate's profile.
    Deterministic ranking by match score.
    """
    try:
        recommendations = await get_candidate_recommended_jobs(
            user_id=current_user["id"],
            limit=limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}"
        )

@router.get("/jobs/search", response_model=JobSearchResponse)
async def search_jobs(
    q: str = Query("", description="Job title, role, or keywords"),
    location: str = Query("", description="Location (e.g. Bengaluru, Chennai, Remote)"),
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1, le=50),
    current_user: dict = Depends(get_current_user)
):
    """
    Searches jobs from external providers (Jooble, Adzuna) and scores them against the current user's profile.
    """
    try:
        results = await search_and_score_jobs(
            keywords=q,
            location=location,
            user_id=current_user["id"],
            page=page,
            per_page=limit
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )

@router.get("/jobs", response_model=List[JobOut])
async def get_jobs(
    q: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Standard jobs listing endpoint.
    If query parameters are passed, performs search; otherwise returns personalized recommendations list.
    """
    if q is not None or location is not None:
        search_res = await search_and_score_jobs(
            keywords=q or "",
            location=location or "",
            user_id=current_user["id"],
            per_page=20
        )
        return search_res["jobs"]
    
    rec_res = await get_candidate_recommended_jobs(
        user_id=current_user["id"],
        limit=20
    )
    return rec_res["jobs"]

@router.get("/jobs/{job_id}", response_model=JobDetailMatchResponse)
async def get_job_detail(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Returns full job details, match score, breakdown percentages, and skill gaps for a specific job.
    """
    # 1. Fetch user profile
    profiles_col = get_profiles_collection()
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None

    # 2. Check if it's one of our benchmark jobs or search current recommendation stream
    target_job = None
    for b in BENCHMARK_JOBS:
        if b.get("id") == job_id or f"bench-{b.get('id')}" == job_id:
            target_job = normalize_catalog_job(b)
            break

    if not target_job:
        # Query recommendation cache or search stream
        rec_res = await get_candidate_recommended_jobs(user_id=current_user["id"], limit=30)
        for j in rec_res["jobs"]:
            if j.get("id") == job_id:
                target_job = j
                break

    if not target_job:
        # Fallback to standard benchmark job 1
        target_job = normalize_catalog_job(BENCHMARK_JOBS[0])
        target_job["id"] = job_id

    # Compute match
    match_info = match_job_to_profile(target_job, profile or {})
    target_job["matchScore"] = match_info["matchScore"]
    target_job["matchedSkills"] = match_info["matchedSkills"]
    target_job["missingSkills"] = match_info["missingSkills"]
    target_job["skills"] = match_info["skills"]
    target_job["matchReasons"] = match_info["matchReasons"]
    target_job["breakdown"] = match_info["breakdown"]

    return {
        "job": target_job,
        "breakdown": match_info["breakdown"],
        "recommendedBecause": match_info["matchReasons"],
        "skillsToImprove": match_info["missingSkills"]
    }

# ================= APPLICATION TRACKER ENDPOINTS =================

@router.get("/applications", response_model=List[ApplicationOut])
async def get_applications(current_user: dict = Depends(get_current_user)):
    apps_col = get_applications_collection()
    if apps_col is None:
        return []
        
    cursor = apps_col.find({"user_id": current_user["id"]})
    docs = await cursor.to_list(length=100)
    
    return [
        ApplicationOut(
            id=str(doc["_id"]),
            jobId=doc.get("jobId", ""),
            jobTitle=doc.get("jobTitle", ""),
            company=doc.get("company", ""),
            location=doc.get("location", ""),
            matchScore=doc.get("matchScore", 0),
            status=doc.get("status", "applied"),
            appliedDate=doc.get("appliedDate", ""),
            notes=doc.get("notes")
        )
        for doc in docs
    ]

@router.post("/applications", response_model=ApplicationOut)
async def create_application(payload: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    apps_col = get_applications_collection()
    if apps_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    doc = {
        "user_id": current_user["id"],
        "jobId": payload.jobId,
        "jobTitle": payload.jobTitle,
        "company": payload.company,
        "location": payload.location,
        "matchScore": payload.matchScore,
        "status": payload.status,
        "appliedDate": datetime.datetime.utcnow().strftime("%d %b %Y"),
        "notes": payload.notes or "Tracked via FutureReady Job Search",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    result = await apps_col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return doc

@router.patch("/applications/{app_id}", response_model=ApplicationOut)
async def update_application(app_id: str, payload: ApplicationUpdate, current_user: dict = Depends(get_current_user)):
    apps_col = get_applications_collection()
    if apps_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    update_data = {}
    if payload.status:
        update_data["status"] = payload.status
    if payload.notes is not None:
        update_data["notes"] = payload.notes
        
    try:
        query = {"_id": ObjectId(app_id), "user_id": current_user["id"]}
    except Exception:
        query = {"_id": app_id, "user_id": current_user["id"]}
        
    await apps_col.update_one(query, {"$set": update_data})
    updated_doc = await apps_col.find_one(query)
    if not updated_doc:
        raise HTTPException(status_code=404, detail="Application not found")
        
    updated_doc["id"] = str(updated_doc["_id"])
    return updated_doc

@router.delete("/applications/{app_id}")
async def delete_application(app_id: str, current_user: dict = Depends(get_current_user)):
    apps_col = get_applications_collection()
    if apps_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        query = {"_id": ObjectId(app_id), "user_id": current_user["id"]}
    except Exception:
        query = {"_id": app_id, "user_id": current_user["id"]}
        
    result = await apps_col.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {"message": "Application deleted successfully", "id": app_id}
