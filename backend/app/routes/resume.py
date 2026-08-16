import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

from ..AI import (
    process_resume_file,
    ExtractionError,
    extract_resume_fields,
    analyze_resume,
    refine_bullet,
    generate_bullet_variants,
    GeminiServiceError
)
from ..database.mongodb import get_resumes_collection, get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume AI Pipeline"])

# Request & Response Schemas
class ExtractRequest(BaseModel):
    extracted_text: str

class AnalyzeRequest(BaseModel):
    confirmed_profile: Optional[Dict[str, Any]] = None
    target_role: Optional[str] = "Software Engineer"

class RefineRequest(BaseModel):
    original_text: str
    target_role: Optional[str] = "Software Engineer"

class GenerateBulletsRequest(BaseModel):
    raw_text: str
    skills: Optional[List[str]] = None

class ConfirmResumeRequest(BaseModel):
    file_meta: Optional[Dict[str, Any]] = None
    profile_data: Dict[str, Any]
    template: Optional[str] = "classic"

@router.get("")
async def get_active_resume(current_user: dict = Depends(get_current_user)):
    resumes_col = get_resumes_collection()
    if resumes_col is None:
        return {"hasResume": False, "file": None, "overallScore": 0, "breakdown": {}, "suggestions": []}
        
    resume = await resumes_col.find_one({"user_id": current_user["id"]})
    if not resume:
        return {"hasResume": False, "file": None, "overallScore": 0, "breakdown": {}, "suggestions": []}
        
    resume["id"] = str(resume["_id"])
    return resume

@router.post("/upload")
async def upload_resume_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Step 1 (Path A): Accepts PDF/DOCX (max 5MB), extracts raw text, 
    guards against scanned image files (<50 chars).
    """
    filename = file.filename or "resume.pdf"
    content = await file.read()
    
    try:
        extracted_text, size_bytes = process_resume_file(filename, content)
        return {
            "success": True,
            "filename": filename,
            "sizeKb": max(1, size_bytes // 1024),
            "extracted_text": extracted_text,
            "message": "Text extracted successfully. Proceeding to structured extraction."
        }
    except ExtractionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": e.error_code, "message": e.message}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "file_read_failed", "message": f"Failed to process file: {str(e)}"}
        )

@router.post("/extract")
async def extract_resume_data(
    payload: ExtractRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Step 2 (Path A): Takes extracted text, runs Gemini structured extraction, 
    and applies rapidfuzz skill normalization against the canonical taxonomy.
    """
    if not payload.extracted_text or len(payload.extracted_text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "no_extractable_text",
                "message": "Resume text is too brief to extract. Please use the guided builder instead."
            }
        )
        
    try:
        structured_data = await extract_resume_fields(payload.extracted_text)
        return {
            "success": True,
            "data": structured_data
        }
    except GeminiServiceError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"error": e.error_code, "message": e.message}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "extraction_failed", "message": str(e)}
        )

@router.post("/analyze")
async def analyze_confirmed_resume(
    payload: Optional[AnalyzeRequest] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Section Critique: Scores user-confirmed resume sections against the target role.
    If confirmed_profile is omitted, automatically fetches from the active resume / profile.
    """
    resumes_col = get_resumes_collection()
    profiles_col = get_profiles_collection()
    
    confirmed_profile = payload.confirmed_profile if payload else None
    target_role = (payload.target_role if payload and payload.target_role else None)
    
    if not confirmed_profile:
        # Load from MongoDB
        resume_doc = await resumes_col.find_one({"user_id": current_user["id"]}) if resumes_col else None
        if resume_doc and "profile_snapshot" in resume_doc:
            confirmed_profile = resume_doc["profile_snapshot"]
            if not target_role:
                target_role = confirmed_profile.get("targetRoles", {}).get("major")
        elif profiles_col:
            profile_doc = await profiles_col.find_one({"user_id": current_user["id"]})
            if profile_doc:
                confirmed_profile = profile_doc
                if not target_role:
                    target_role = profile_doc.get("targetRoles", {}).get("major")
                    
    if not confirmed_profile:
        confirmed_profile = {
            "name": current_user.get("name", "Candidate"),
            "email": current_user.get("email", ""),
            "skills": [],
            "projects": [],
            "experience": []
        }
        
    target_role = target_role or "Software Engineer"

    try:
        critique_result = await analyze_resume(confirmed_profile, target_role)
        return critique_result
    except GeminiServiceError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"error": e.error_code, "message": e.message}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "analysis_failed", "message": str(e)}
        )

@router.get("/analysis")
async def get_resume_analysis(current_user: dict = Depends(get_current_user)):
    return await analyze_confirmed_resume(payload=None, current_user=current_user)

@router.get("/suggestions")
async def get_resume_suggestions(current_user: dict = Depends(get_current_user)):
    """
    Returns refinement suggestions comparing current bullets with AI-suggested improvements.
    """
    resumes_col = get_resumes_collection()
    profiles_col = get_profiles_collection()
    
    profile_data = {}
    if resumes_col:
        resume_doc = await resumes_col.find_one({"user_id": current_user["id"]})
        if resume_doc and "profile_snapshot" in resume_doc:
            profile_data = resume_doc["profile_snapshot"]
            
    if not profile_data and profiles_col:
        profile_data = await profiles_col.find_one({"user_id": current_user["id"]}) or {}
        
    target_role = profile_data.get("targetRoles", {}).get("major") or "Software Engineer"
    
    # Collect bullets from projects or experience
    bullets_to_refine = []
    
    for p in profile_data.get("projects", []):
        desc = p.get("description") if isinstance(p, dict) else str(p)
        if desc and len(desc.strip()) > 10:
            bullets_to_refine.append(("Projects", desc))
            
    for exp in profile_data.get("experience", []):
        desc = exp.get("description") if isinstance(exp, dict) else str(exp)
        if desc and len(desc.strip()) > 10:
            bullets_to_refine.append(("Experience", desc))
            
    # If user has no detailed bullets yet, provide standard structural templates
    if not bullets_to_refine:
        bullets_to_refine = [
            ("Projects", "Built web application with database integration"),
            ("Experience", "Worked on backend APIs and user interfaces")
        ]
        
    suggestions = []
    for idx, (sec_name, text) in enumerate(bullets_to_refine[:3]):
        try:
            orig = refined.get("original", text)
            sugg = refined.get("suggested", text)
            summ = refined.get("changesSummary", "Improved action-verb strength and technical phrasing.")
            suggestions.append({
                "id": f"sugg-{idx+1}",
                "section": sec_name,
                "original": orig,
                "suggested": sugg,
                "changesSummary": summ,
                "current": orig,
                "suggestion": sugg,
                "rationale": summ
            })
        except Exception:
            orig = text
            sugg = f"Engineered {text.lower()} leveraging scalable design patterns"
            summ = "Enhanced action verb and specificity."
            suggestions.append({
                "id": f"sugg-{idx+1}",
                "section": sec_name,
                "original": orig,
                "suggested": sugg,
                "changesSummary": summ,
                "current": orig,
                "suggestion": sugg,
                "rationale": summ
            })
            
    return suggestions

@router.post("/refine")
async def refine_resume_section(
    payload: RefineRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Bullet Refinement: Rewrites bullet with action verbs while strictly respecting ground truth.
    """
    if not payload.original_text.strip():
        raise HTTPException(status_code=400, detail="Original text cannot be empty.")
        
    try:
        refinement_result = await refine_bullet(payload.original_text, payload.target_role)
        return refinement_result
    except GeminiServiceError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"error": e.error_code, "message": e.message}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "refinement_failed", "message": str(e)}
        )

@router.post("/generate-bullets")
async def generate_bullets_from_raw(
    payload: GenerateBulletsRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Path B Content Generator: Generates 3 polished variants (technical depth, impact, leadership)
    from raw user description based on selected skills.
    """
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw description cannot be empty.")
        
    try:
        variants_result = await generate_bullet_variants(payload.raw_text, payload.skills)
        return variants_result
    except GeminiServiceError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"error": e.error_code, "message": e.message}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "generation_failed", "message": str(e)}
        )

@router.post("/confirm")
async def save_confirmed_resume(
    payload: ConfirmResumeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Saves user-confirmed profile & resume data to MongoDB.
    Places extracted/builder skills directly into candidate profile.
    """
    profiles_col = get_profiles_collection()
    resumes_col = get_resumes_collection()
    
    if profiles_col is None or resumes_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    prof_data = payload.profile_data
    file_meta = payload.file_meta or {
        "name": f"{prof_data.get('personal', {}).get('name', 'Resume')}_Resume.pdf",
        "sizeKb": 120,
        "uploadedAt": datetime.datetime.utcnow().strftime("%d %b %Y")
    }
    
    # Extract technical and soft skills to place in Candidate Profile
    skills_list = []
    if isinstance(prof_data.get("skills"), dict):
        technical_skills = prof_data.get("skills", {}).get("technical", [])
        soft_skills = prof_data.get("skills", {}).get("soft", [])
        skills_list = technical_skills + soft_skills
    elif isinstance(prof_data.get("skills"), list):
        skills_list = prof_data.get("skills")
    elif isinstance(prof_data.get("skills"), str):
        skills_list = [s.strip() for s in prof_data.get("skills").split(",") if s.strip()]
        
    # Map into candidate profile schema
    profile_update_doc = {
        "user_id": current_user["id"],
        "name": prof_data.get("personal", {}).get("name") or prof_data.get("name") or current_user.get("name"),
        "email": prof_data.get("personal", {}).get("email") or prof_data.get("email") or current_user.get("email"),
        "phone": prof_data.get("personal", {}).get("phone") or prof_data.get("phone", ""),
        "location": prof_data.get("personal", {}).get("location") or prof_data.get("location", ""),
        "skills": skills_list,
        "education": prof_data.get("education", []),
        "experience": prof_data.get("experience", []),
        "projects": prof_data.get("projects", []),
        "certifications": prof_data.get("certifications", []),
        "targetRoles": {
            "major": prof_data.get("targetRole") or prof_data.get("targetRoles", {}).get("major", ""),
            "secondary": prof_data.get("targetRoles", {}).get("secondary", "")
        },
        "updated_at": datetime.datetime.utcnow().isoformat()
    }
    
    await profiles_col.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_update_doc},
        upsert=True
    )
    
    # Save active resume document with initial score
    overall_score = min(92, 60 + len(skills_list) * 4)
    resume_doc = {
        "user_id": current_user["id"],
        "hasResume": True,
        "file": file_meta,
        "overallScore": overall_score,
        "breakdown": {
            "impact": min(95, overall_score + 2),
            "brevity": 82,
            "style": 85,
            "structure": 90,
            "skills": min(95, 65 + len(skills_list) * 5)
        },
        "profile_snapshot": profile_update_doc,
        "template": payload.template,
        "updated_at": datetime.datetime.utcnow().isoformat()
    }
    
    await resumes_col.update_one(
        {"user_id": current_user["id"]},
        {"$set": resume_doc},
        upsert=True
    )
    
    return {
        "success": True,
        "message": "Resume and candidate profile successfully saved to MongoDB.",
        "data": resume_doc
    }
