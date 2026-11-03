from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class Education(BaseModel):
    degree: str = ""
    institution: str = ""
    field: str = ""
    year: str = ""

class Experience(BaseModel):
    role: str = ""
    organization: str = ""
    duration: str = ""
    description: str = ""

class ResumeProfile(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str = ""
    email: str = ""
    education: List[Education] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    research_interests: List[str] = Field(default_factory=list)
    publications: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)

# Keep the old class name import-compatible.
resumeprofile = ResumeProfile

class Evidence(BaseModel):
    criterion: str
    resumeEvidence: str
    assessment: str

class AcademicBreakdown(BaseModel):
    teachingScore: Optional[float] = Field(default=None, ge=0, le=100)
    researchScore: Optional[float] = Field(default=None, ge=0, le=100)
    domainScore: Optional[float] = Field(default=None, ge=0, le=100)

class CourseReadiness(BaseModel):
    day1Ready: List[str] = Field(default_factory=list)
    curriculumGaps: List[str] = Field(default_factory=list)

class ScreeningResult(BaseModel):
    status: str = "COMPLETED"
    jobId: str
    matchScore: Optional[float] = Field(default=None, ge=0, le=100)
    matchedSkills: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    evidence: List[Evidence] = Field(default_factory=list)
    explanation: str
    profile: ResumeProfile
    academicBreakdown: Optional[AcademicBreakdown] = None
    courseReadiness: Optional[CourseReadiness] = None
    committeeQuestions: List[str] = Field(default_factory=list)
    recommendedRank: Optional[str] = None
