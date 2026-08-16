import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from bson import ObjectId

from ..schemas.jobs import JobOut, ApplicationCreate, ApplicationUpdate, ApplicationOut, JobSkill
from ..database.mongodb import get_applications_collection, get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="", tags=["Jobs & Applications"])

# Predefined benchmark jobs repository for matching against candidate skills
JOB_CATALOG = [
    {
        "id": "job-1",
        "title": "Backend Software Engineer",
        "company": "Stripe",
        "location": "Bengaluru",
        "workMode": "Hybrid",
        "experience": "0-2 years",
        "salary": "₹18-24 LPA",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "Distributed Systems"],
        "matchReasons": ["Matches your backend target role", "Requires REST API architecture and database indexing"],
        "description": "Build high-throughput billing and payments infrastructure with zero downtime requirements.",
        "source": "Direct"
    },
    {
        "id": "job-2",
        "title": "Full Stack Developer",
        "company": "Razorpay",
        "location": "Bengaluru",
        "workMode": "In-office",
        "experience": "0-1 years",
        "salary": "₹14-20 LPA",
        "skills": ["React", "JavaScript", "Python", "SQL", "Tailwind CSS", "Git"],
        "matchReasons": ["Strong frontend and API design match", "Active hiring team"],
        "description": "Develop merchant dashboard interfaces and core payment gateway integrations.",
        "source": "LinkedIn"
    },
    {
        "id": "job-3",
        "title": "Junior Python Developer",
        "company": "Swiggy",
        "location": "Remote",
        "workMode": "Remote",
        "experience": "Fresher / 0-1 years",
        "salary": "₹12-16 LPA",
        "skills": ["Python", "Django", "PostgreSQL", "REST APIs", "Unit Testing"],
        "matchReasons": ["Entry-level role matched with your Python background"],
        "description": "Maintain logistics microservices and order fulfillment backend pipelines.",
        "source": "Naukri"
    },
    {
        "id": "job-4",
        "title": "Frontend Engineer",
        "company": "Cred",
        "location": "Bengaluru",
        "workMode": "In-office",
        "experience": "1-3 years",
        "salary": "₹20-28 LPA",
        "skills": ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Next.js"],
        "matchReasons": ["Design-first engineering culture"],
        "description": "Craft pixel-perfect user experiences for high-trust financial products.",
        "source": "Direct"
    },
    {
        "id": "job-5",
        "title": "Software Engineer — Platform",
        "company": "Zomato",
        "location": "Gurugram",
        "workMode": "Hybrid",
        "experience": "0-2 years",
        "salary": "₹16-22 LPA",
        "skills": ["Python", "Go", "Docker", "Kubernetes", "Redis", "SQL"],
        "matchReasons": ["High scale platform engineering role"],
        "description": "Scale database access layers and microservices serving millions of daily requests.",
        "source": "LinkedIn"
    }
]

@router.get("/jobs", response_model=List[JobOut])
async def get_jobs(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None
    
    user_skills = set(s.lower() for s in (profile.get("skills", []) if profile else []))
    
    results = []
    for job in JOB_CATALOG:
        job_skills_lower = [s.lower() for s in job["skills"]]
        matched_count = sum(1 for s in job_skills_lower if s in user_skills)
        
        # Calculate real dynamic match score
        total_skills = len(job["skills"])
        if total_skills > 0 and len(user_skills) > 0:
            match_score = min(98, max(35, int((matched_count / total_skills) * 100) + 15))
        else:
            match_score = 40  # baseline interest
            
        skill_chips = []
        for s in job["skills"]:
            if s.lower() in user_skills:
                skill_chips.append(JobSkill(skill=s, status="matched"))
            else:
                skill_chips.append(JobSkill(skill=s, status="missing"))
                
        results.append(JobOut(
            id=job["id"],
            title=job["title"],
            company=job["company"],
            location=job["location"],
            workMode=job["workMode"],
            experience=job["experience"],
            salary=job["salary"],
            matchScore=match_score,
            skills=skill_chips,
            matchReasons=job["matchReasons"],
            description=job["description"],
            source=job["source"],
            breakdown={
                "skills": match_score,
                "experience": 75,
                "roleFit": match_score - 5 if match_score > 5 else match_score,
                "education": 85
            }
        ))
        
    # Sort by match score descending
    results.sort(key=lambda x: x.matchScore, reverse=True)
    return results

@router.get("/jobs/{job_id}", response_model=JobOut)
async def get_job_detail(job_id: str, current_user: dict = Depends(get_current_user)):
    jobs = await get_jobs(current_user=current_user)
    for j in jobs:
        if j.id == job_id:
            return j
            
    raise HTTPException(status_code=404, detail="Job not found")

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
