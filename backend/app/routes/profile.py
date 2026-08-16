import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from ..schemas.profile import ProfileSchema
from ..database.mongodb import get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileSchema)
async def get_profile(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    if profiles_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    profile = await profiles_col.find_one({"user_id": current_user["id"]})
    if not profile:
        # Return base profile with user's registered name and email
        return {
            "name": current_user.get("name", ""),
            "email": current_user.get("email", ""),
            "phone": "",
            "location": "",
            "workMode": "Hybrid",
            "yearsExperience": "0-1",
            "targetRoles": {"major": "", "secondary": ""},
            "skills": [],
            "education": [],
            "experience": [],
            "projects": [],
            "certifications": []
        }
        
    return profile

@router.put("", response_model=ProfileSchema)
async def update_profile(payload: ProfileSchema, current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    if profiles_col is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    profile_data = payload.dict()
    profile_data["user_id"] = current_user["id"]
    profile_data["updated_at"] = datetime.datetime.utcnow().isoformat()
    
    await profiles_col.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_data},
        upsert=True
    )
    
    return profile_data
