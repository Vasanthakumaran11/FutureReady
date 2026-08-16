from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class JobSkill(BaseModel):
    skill: str
    status: str = "missing" # "matched", "partial", "missing"

class JobOut(BaseModel):
    id: str
    title: str
    company: str
    location: str
    workMode: str = "Hybrid"
    experience: str = "0-2 years"
    salary: Optional[str] = None
    matchScore: int = 0
    skills: List[JobSkill] = Field(default_factory=list)
    matchReasons: List[str] = Field(default_factory=list)
    description: str = ""
    source: str = "LinkedIn"
    breakdown: Optional[Dict[str, int]] = None

class ApplicationCreate(BaseModel):
    jobId: str
    jobTitle: str
    company: str
    location: str = ""
    matchScore: int = 0
    status: str = "applied" # "saved", "applied", "interviewing", "offer", "rejected"
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class ApplicationOut(BaseModel):
    id: str
    jobId: str
    jobTitle: str
    company: str
    location: str
    matchScore: int
    status: str
    appliedDate: str
    notes: Optional[str] = None
