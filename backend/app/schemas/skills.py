from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SkillItem(BaseModel):
    name: str
    importance: str = "High"
    topics: List[str] = Field(default_factory=list)
    default_level: str = "Beginner"

class RoleSummaryOut(BaseModel):
    role: str
    description: str = ""
    skills_count: int = 0
    skills: List[str] = Field(default_factory=list)

class RoleDetailOut(BaseModel):
    id: Optional[str] = None
    role: str
    description: str = ""
    skills: List[SkillItem] = Field(default_factory=list)

class SkillGapItem(BaseModel):
    id: str
    skill: str
    original_name: Optional[str] = None
    importance: str = "High"
    topics: List[str] = Field(default_factory=list)
    currentLevel: str = "Missing" # "Beginner", "Intermediate", "Advanced", "Missing"
    targetLevel: str = "Intermediate"
    progress: int = 0
    status: str = "not_started" # "not_started", "in_progress", "completed"
    requirement: str
    evidence: str
    priority: str = "high" # "high", "medium", "low"
    whyItMatters: str = ""

class JobContextSummary(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str] = None

class SkillGapAnalysisResponse(BaseModel):
    targetRole: str
    jobContext: Optional[JobContextSummary] = None
    overallReadiness: int = 0
    totalRequirements: int = 0
    missingSkillsCount: int = 0
    weakSkillsCount: int = 0
    verifiedSkillsCount: int = 0
    missingSkills: List[SkillGapItem] = Field(default_factory=list)
    weakSkills: List[SkillGapItem] = Field(default_factory=list)
    verifiedSkills: List[SkillGapItem] = Field(default_factory=list)
    allGaps: List[SkillGapItem] = Field(default_factory=list)

class LearningResourceOut(BaseModel):
    id: str
    skill: str
    role: Optional[str] = None
    title: str
    description: str = ""
    platform: str = "YouTube"
    url: str
    difficulty: str = "Beginner" # "Beginner", "Intermediate", "Advanced"
    topic: str = ""
    type: str = "video" # "video", "documentation", "course", "practice"

class ProgressUpdateRequest(BaseModel):
    skill: str
    resource_id: Optional[str] = None
    completed: bool = True
    custom_progress: Optional[int] = None

class LearningProgressOut(BaseModel):
    id: Optional[str] = None
    skill: str
    progress: int = 0
    completed_resources: List[str] = Field(default_factory=list)
    status: str = "not_started"
    last_updated: Optional[str] = None
