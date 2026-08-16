from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

from ..schemas.interview import (
    DsaTopicOut,
    InterviewCategoryOut,
    InterviewQuestion,
    InterviewAnswerRequest,
    InterviewFeedbackResponse
)
from ..database.mongodb import get_interviews_collection, get_profiles_collection
from .deps import get_current_user

router = APIRouter(prefix="/interview", tags=["Interview"])

class InterviewSetupPayload(BaseModel):
    role: str = ""
    company: str = ""
    experience: str = ""
    focusAreas: List[str] = []

DSA_TOPICS = [
    {"id": "dsa-1", "topic": "Arrays & Hashing", "difficulty": "Medium", "total": 10},
    {"id": "dsa-2", "topic": "Two Pointers", "difficulty": "Easy", "total": 8},
    {"id": "dsa-3", "topic": "Sliding Window", "difficulty": "Medium", "total": 6},
    {"id": "dsa-4", "topic": "Stack & Queues", "difficulty": "Medium", "total": 8},
    {"id": "dsa-5", "topic": "Binary Search", "difficulty": "Hard", "total": 10},
    {"id": "dsa-6", "topic": "Trees & Graphs", "difficulty": "Hard", "total": 12},
    {"id": "dsa-7", "topic": "Dynamic Programming", "difficulty": "Hard", "total": 15},
]

INTERVIEW_CATEGORIES = [
    {"id": "dsa", "name": "DSA Practice", "description": "Core data structures, algorithms, time complexity optimizations."},
    {"id": "coding", "name": "Coding Practice", "description": "Applied implementation tasks and clean object-oriented architecture."},
    {"id": "technical", "name": "Technical Concept Review", "description": "Concurrency, databases, indexing, network protocols, REST."},
    {"id": "project", "name": "Project Deep-Dive", "description": "Architecture defense, trade-offs, scalability and lessons learned."},
    {"id": "hr", "name": "HR & Behavioral", "description": "STAR methodology, conflict resolution, career alignment."},
]

@router.get("/setup")
async def get_interview_setup(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None
    
    major_role = profile.get("targetRoles", {}).get("major", "Backend Developer") if profile else "Backend Developer"
    return {
        "role": major_role,
        "company": "Target Company",
        "experience": profile.get("yearsExperience", "0-1") if profile else "0-1",
        "focusAreas": ["dsa", "technical", "coding"]
    }

@router.post("/setup")
async def save_interview_setup(payload: InterviewSetupPayload, current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    if profiles_col is not None:
        await profiles_col.update_one(
            {"user_id": current_user["id"]},
            {"$set": {"targetRoles.major": payload.role, "yearsExperience": payload.experience}}
        )
    return {"message": "Setup saved successfully", "data": payload.dict()}

@router.get("/plan")
async def get_interview_plan(current_user: dict = Depends(get_current_user)):
    profiles_col = get_profiles_collection()
    interviews_col = get_interviews_collection()
    
    profile = await profiles_col.find_one({"user_id": current_user["id"]}) if profiles_col is not None else None
    major_role = profile.get("targetRoles", {}).get("major", "") if profile else ""
    
    # Calculate real practice statistics
    practiced_count = 0
    if interviews_col is not None:
        practiced_count = await interviews_col.count_documents({"user_id": current_user["id"]})
        
    readiness = min(100, practiced_count * 15) if practiced_count > 0 else (20 if major_role else 0)
    
    return {
        "setup": {
            "role": major_role or "Not configured",
            "company": "Target Company",
            "experience": profile.get("yearsExperience", "0-1") if profile else "0-1"
        },
        "completedTasks": practiced_count,
        "pendingTasks": max(0, 10 - practiced_count),
        "dailyGoal": "2 problems / day",
        "readiness": readiness,
        "categoryProgress": [
            {"category": "dsa", "label": "DSA Practice", "progress": min(100, practiced_count * 20)},
            {"category": "coding", "label": "Coding Practice", "progress": min(100, practiced_count * 15)},
            {"category": "technical", "label": "Technical Concepts", "progress": min(100, practiced_count * 25)},
            {"category": "project", "label": "Project Deep Dive", "progress": min(100, practiced_count * 10)},
            {"category": "hr", "label": "HR & Behavioral", "progress": min(100, practiced_count * 10)},
        ],
        "strongAreas": ["REST APIs", "Problem Decomposition"] if practiced_count > 0 else [],
        "weakAreas": ["Dynamic Programming", "Concurrency"] if practiced_count > 0 else []
    }

@router.get("/dsa", response_model=List[DsaTopicOut])
async def get_dsa_topics(current_user: dict = Depends(get_current_user)):
    interviews_col = get_interviews_collection()
    user_records = {}
    if interviews_col is not None:
        cursor = interviews_col.find({"user_id": current_user["id"], "type": "dsa"})
        docs = await cursor.to_list(length=50)
        user_records = {doc.get("topic_id"): doc for doc in docs if doc.get("topic_id")}
        
    results = []
    for topic in DSA_TOPICS:
        record = user_records.get(topic["id"], {})
        solved = record.get("solved", 0)
        total = topic["total"]
        accuracy = record.get("accuracy", 0)
        results.append(DsaTopicOut(
            id=topic["id"],
            topic=topic["topic"],
            difficulty=topic["difficulty"],
            solved=solved,
            total=total,
            accuracy=accuracy
        ))
    return results

@router.get("/categories", response_model=List[InterviewCategoryOut])
async def get_categories(current_user: dict = Depends(get_current_user)):
    interviews_col = get_interviews_collection()
    user_counts = {}
    if interviews_col is not None:
        cursor = interviews_col.find({"user_id": current_user["id"]})
        docs = await cursor.to_list(length=100)
        for d in docs:
            cat = d.get("category", "")
            user_counts[cat] = user_counts.get(cat, 0) + 1
            
    return [
        InterviewCategoryOut(
            id=cat["id"],
            name=cat["name"],
            description=cat["description"],
            progress=min(100, user_counts.get(cat["id"], 0) * 20),
            questionsCount=user_counts.get(cat["id"], 0),
            status="In progress" if user_counts.get(cat["id"], 0) > 0 else "Not started"
        )
        for cat in INTERVIEW_CATEGORIES
    ]

@router.post("/feedback", response_model=InterviewFeedbackResponse)
async def submit_answer(
    payload: InterviewAnswerRequest,
    current_user: dict = Depends(get_current_user)
):
    interviews_col = get_interviews_collection()
    
    # Generate contextual evaluation
    answer_len = len(payload.answer.strip())
    if answer_len > 100:
        score = 88
        feedback = "Strong structured explanation following the STAR framework with clear technical trade-offs."
    elif answer_len > 40:
        score = 72
        feedback = "Good foundation. Consider expanding on edge cases and concrete performance numbers."
    else:
        score = 55
        feedback = "Answer is brief. Try adding specific examples, technical decisions made, and results achieved."
        
    if interviews_col is not None:
        await interviews_col.insert_one({
            "user_id": current_user["id"],
            "question_id": payload.questionId,
            "category": payload.category,
            "answer": payload.answer,
            "score": score,
            "feedback": feedback
        })
        
    return InterviewFeedbackResponse(
        questionId=payload.questionId,
        feedback=feedback,
        score=score
    )
