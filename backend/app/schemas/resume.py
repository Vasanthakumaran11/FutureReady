from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ResumeFileMeta(BaseModel):
    name: str
    sizeKb: int
    uploadedAt: str

class ResumeSuggestion(BaseModel):
    id: str
    section: str
    current: str
    suggestion: str
    rationale: str

class ResumeAnalysisResponse(BaseModel):
    hasResume: bool = False
    file: Optional[ResumeFileMeta] = None
    overallScore: int = 0
    breakdown: Dict[str, int] = Field(default_factory=dict)
    suggestions: List[ResumeSuggestion] = Field(default_factory=list)

class ResumeCreateRequest(BaseModel):
    values: Dict[str, Any] = Field(default_factory=dict)
    template: str = "classic"
