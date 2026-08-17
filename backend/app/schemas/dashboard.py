from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class SummaryMetrics(BaseModel):
    careerReadiness: int = 0
    resumeScore: int = 0
    interviewReadiness: int = 0
    skillGaps: int = 0
    jobMatches: int = 0
    activeApplications: int = 0

class NextAction(BaseModel):
    id: str
    module: str
    title: str
    description: str
    href: str

class ReadinessTrendPoint(BaseModel):
    date: str = ""
    score: int = 0
    week: str = ""
    readiness: int = 0

class DashboardSummaryOut(BaseModel):
    summary: SummaryMetrics
    nextActions: List[NextAction] = Field(default_factory=list)
    trend: List[ReadinessTrendPoint] = Field(default_factory=list)
    hasData: bool = False

class SkillGapOut(BaseModel):
    id: str
    skill: str
    requirement: str
    evidence: str
    status: str # "strong", "moderate", "missing"
    priority: str # "high", "medium", "low"
    learningTask: str
    required: int = 100
    current: int = 0
