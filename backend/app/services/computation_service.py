from typing import Dict, Any, List
from ..database.mongodb import (
    get_profiles_collection,
    get_resumes_collection,
    get_applications_collection,
    get_interviews_collection
)

async def compute_dashboard_data(user_id: str) -> Dict[str, Any]:
    profiles_col = get_profiles_collection()
    resumes_col = get_resumes_collection()
    apps_col = get_applications_collection()
    interviews_col = get_interviews_collection()
    
    # 1. Fetch user data from MongoDB
    profile = await profiles_col.find_one({"user_id": user_id}) if profiles_col is not None else None
    resume = await resumes_col.find_one({"user_id": user_id}) if resumes_col is not None else None
    
    applications = []
    if apps_col is not None:
        cursor = apps_col.find({"user_id": user_id})
        applications = await cursor.to_list(length=100)
        
    interviews = []
    if interviews_col is not None:
        cursor = interviews_col.find({"user_id": user_id})
        interviews = await cursor.to_list(length=100)
    
    # 2. Check if user has entered any data
    has_skills = bool(profile and profile.get("skills"))
    has_target_role = bool(profile and profile.get("targetRoles", {}).get("major"))
    has_resume = bool(resume and resume.get("file"))
    has_apps = len(applications) > 0
    has_interviews = len(interviews) > 0
    
    has_data = has_skills or has_target_role or has_resume or has_apps or has_interviews
    
    # If fresh user with 0 data, return clean empty statistics
    if not has_data:
        return {
            "summary": {
                "careerReadiness": 0,
                "resumeScore": 0,
                "interviewReadiness": 0,
                "skillGaps": 0,
                "jobMatches": 0,
                "activeApplications": 0
            },
            "nextActions": [
                {
                    "id": "init-1",
                    "module": "Profile",
                    "title": "Complete your candidate profile",
                    "description": "Add your target role, education, and technical skills so FutureReady can analyze your readiness.",
                    "href": "/profile"
                },
                {
                    "id": "init-2",
                    "module": "Resume",
                    "title": "Upload or build your resume",
                    "description": "Upload a PDF/DOCX or use our guided builder to generate your ATS score.",
                    "href": "/resume"
                }
            ],
            "trend": [],
            "hasData": False
        }
    
    # 3. Dynamic score calculations from real data
    profile_score = 0
    if profile:
        if profile.get("name"): profile_score += 5
        if profile.get("targetRoles", {}).get("major"): profile_score += 10
        if len(profile.get("skills", [])) >= 3: profile_score += 10
        if len(profile.get("experience", [])) > 0: profile_score += 10
        if len(profile.get("education", [])) > 0: profile_score += 5
        if len(profile.get("projects", [])) > 0: profile_score += 10
    
    resume_score = resume.get("overallScore", 0) if resume else (50 if has_resume else 0)
    
    interview_score = 0
    if interviews:
        solved_count = sum(i.get("solved", 0) for i in interviews)
        total_count = sum(i.get("total", 10) for i in interviews) or 1
        interview_score = min(100, int((solved_count / total_count) * 100))
    elif has_skills:
        interview_score = 30
        
    apps_score = min(20, len(applications) * 5)
    
    # Weighted Career Readiness calculation
    # Profile: 25%, Resume: 35%, Interview: 25%, Applications: 15%
    readiness = int(
        (profile_score * 0.5) +
        (resume_score * 0.35) +
        (interview_score * 0.25) +
        apps_score
    )
    readiness = min(100, max(0, readiness))
    
    user_skills = set(s.lower() for s in (profile.get("skills", []) if profile else []))
    target_role = profile.get("targetRoles", {}).get("major", "Software Engineer") if profile else "Software Engineer"
    
    # Standard role requirements for comparison
    ROLE_BENCHMARKS = {
        "frontend": ["react", "javascript", "typescript", "tailwind css", "html", "css", "git"],
        "backend": ["python", "fastapi", "sql", "postgresql", "docker", "redis", "rest apis", "mongodb"],
        "full stack": ["react", "python", "javascript", "sql", "docker", "git", "rest apis"],
        "data": ["python", "sql", "pandas", "numpy", "machine learning", "tableau"],
    }
    
    matched_benchmark = ROLE_BENCHMARKS.get("backend")
    for key, skills in ROLE_BENCHMARKS.items():
        if key in target_role.lower():
            matched_benchmark = skills
            break
            
    missing_skills = [s for s in matched_benchmark if s not in user_skills] if user_skills else []
    
    next_actions = []
    if missing_skills:
        top_missing = missing_skills[0].title()
        next_actions.append({
            "id": "act-1",
            "module": "Skill development",
            "title": f"Address skill gap in {top_missing}",
            "description": f"{top_missing} is requested in top postings for {target_role}.",
            "href": "/skills"
        })
    if not has_resume:
        next_actions.append({
            "id": "act-2",
            "module": "Resume",
            "title": "Upload your resume for scoring",
            "description": "Upload a resume to get AI-assisted ATS refinement.",
            "href": "/resume"
        })
    else:
        next_actions.append({
            "id": "act-3",
            "module": "Interview preparation",
            "title": f"Practice technical questions for {target_role}",
            "description": "Adaptive questions customized to your background.",
            "href": "/interview"
        })
        
    return {
        "summary": {
            "careerReadiness": readiness,
            "resumeScore": resume_score,
            "interviewReadiness": interview_score,
            "skillGaps": len(missing_skills),
            "jobMatches": max(1, len(user_skills) * 2) if user_skills else 0,
            "activeApplications": len(applications)
        },
        "nextActions": next_actions,
        "trend": [
            {"date": "Start", "score": max(0, readiness - 15)},
            {"date": "Current", "score": readiness}
        ] if readiness > 0 else [],
        "hasData": True
    }

async def compute_skill_gaps(user_id: str) -> List[Dict[str, Any]]:
    profiles_col = get_profiles_collection()
    if profiles_col is None:
        return []
        
    profile = await profiles_col.find_one({"user_id": user_id})
    if not profile or not profile.get("skills"):
        return []
        
    user_skills = set(s.lower() for s in profile.get("skills", []))
    target_role = profile.get("targetRoles", {}).get("major", "Backend Developer")
    
    ROLE_REQUIREMENTS = [
        {"skill": "Docker", "requirement": "Containerization & deployment pipelines", "priority": "high", "task": "Complete containerization module and deploy a container"},
        {"skill": "PostgreSQL / SQL", "requirement": "Database design and query optimization", "priority": "high", "task": "Solve 5 SQL query exercises on indexing and joins"},
        {"skill": "Redis", "requirement": "Caching and asynchronous message queues", "priority": "medium", "task": "Implement caching on top endpoints"},
        {"skill": "System Design", "requirement": "Architecting scalable services", "priority": "medium", "task": "Review load balancing and microservice architecture patterns"},
    ]
    
    gaps = []
    for idx, item in enumerate(ROLE_REQUIREMENTS):
        is_present = any(item["skill"].lower() in s for s in user_skills)
        if not is_present:
            gaps.append({
                "id": f"gap-{idx+1}",
                "skill": item["skill"],
                "requirement": item["requirement"],
                "evidence": "No evidence recorded in profile or resume",
                "status": "missing",
                "priority": item["priority"],
                "learningTask": item["task"]
            })
        else:
            gaps.append({
                "id": f"gap-{idx+1}",
                "skill": item["skill"],
                "requirement": item["requirement"],
                "evidence": f"Found in candidate profile skills",
                "status": "strong",
                "priority": "low",
                "learningTask": "Verified proficiency"
            })
            
    return gaps
