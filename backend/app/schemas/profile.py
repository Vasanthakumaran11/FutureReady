from typing import List, Optional
from pydantic import BaseModel, Field

class EducationItem(BaseModel):
    degree: str = ""
    field: str = ""
    institution: str = ""
    year: str = ""

class ExperienceItem(BaseModel):
    role: str = ""
    company: str = ""
    duration: str = ""
    highlights: str = ""

class ProjectItem(BaseModel):
    title: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    liveUrl: Optional[str] = None
    repoUrl: Optional[str] = None

class TargetRoles(BaseModel):
    major: str = ""
    secondary: str = ""

class ProfileSchema(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    workMode: str = "Hybrid"
    yearsExperience: str = "0-1"
    targetRoles: TargetRoles = Field(default_factory=TargetRoles)
    skills: List[str] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
