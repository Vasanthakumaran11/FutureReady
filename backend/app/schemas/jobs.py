from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class JobSkill(BaseModel):
    skill: str
    status: str = "missing"  # "matched", "partial", "missing"

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
    matchedSkills: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    matchReasons: List[str] = Field(default_factory=list)
    description: str = ""
    source: str = "Direct"
    sourceUrl: Optional[str] = None
    breakdown: Optional[Dict[str, int]] = None
    posted_at: Optional[str] = None

class JobSearchResponse(BaseModel):
    jobs: List[JobOut]
    total: int = 0
    sources: List[str] = Field(default_factory=list)
    query: Optional[Dict[str, Any]] = None

class ProfileSummary(BaseModel):
    target_role: str = ""
    location: str = ""
    skills_count: int = 0
    top_skills: List[str] = Field(default_factory=list)

class JobRecommendationResponse(BaseModel):
    jobs: List[JobOut]
    total: int = 0
    sources: List[str] = Field(default_factory=list)
    profile_summary: Optional[ProfileSummary] = None

class JobDetailMatchResponse(BaseModel):
    job: JobOut
    breakdown: Dict[str, int]
    recommendedBecause: List[str] = Field(default_factory=list)
    skillsToImprove: List[str] = Field(default_factory=list)

class ApplicationCreate(BaseModel):
    jobId: str
    jobTitle: str
    company: str
    location: str = ""
    matchScore: int = 0
    status: str = "applied"  # "saved", "applied", "interviewing", "offer", "rejected"
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
