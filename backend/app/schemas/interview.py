from typing import List, Optional
from pydantic import BaseModel, Field

class DsaTopicOut(BaseModel):
    id: str
    topic: str
    difficulty: str
    solved: int = 0
    total: int = 10
    accuracy: int = 0

class InterviewCategoryOut(BaseModel):
    id: str
    name: str
    description: str
    progress: int = 0
    questionsCount: int = 0
    status: str = "Not started"

class InterviewQuestion(BaseModel):
    id: str
    prompt: str
    type: str = "behavioral"
    userAnswer: Optional[str] = None
    feedback: Optional[str] = None
    score: Optional[int] = None

class InterviewAnswerRequest(BaseModel):
    questionId: str
    answer: str
    category: str

class InterviewFeedbackResponse(BaseModel):
    questionId: str
    feedback: str
    score: int
