import datetime
import logging
from typing import List, Dict, Any, Optional, Set
from bson import ObjectId

from .learning_data import ROLE_SKILL_CATALOG
from ..jobs.job_normalizer import extract_skills_from_text
from ...database.mongodb import (
    get_profiles_collection,
    get_resumes_collection,
    get_applications_collection,
    get_role_skills_collection,
    get_learning_resources_collection,
    get_learning_progress_collection
)

logger = logging.getLogger(__name__)

# Canonical normalization map for skill names
SKILL_ALIASES = {
    "react": "React",
    "react.js": "React",
    "reactjs": "React",
    "react 18": "React",
    "react 19": "React",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "es6": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "html": "HTML & CSS",
    "html5": "HTML5",
    "css": "HTML & CSS",
    "css3": "CSS3",
    "tailwind": "CSS3",
    "tailwind css": "CSS3",
    "node": "Node.js & Express",
    "node.js": "Node.js & Express",
    "nodejs": "Node.js & Express",
    "express": "Node.js & Express",
    "express.js": "Node.js & Express",
    "fastapi": "FastAPI",
    "fast api": "FastAPI",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "python": "Python",
    "python 3": "Python",
    "sql": "SQL",
    "postgresql": "Databases",
    "postgres": "Databases",
    "mongodb": "Databases",
    "nosql": "Databases",
    "docker": "Docker",
    "docker containers": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "git": "Git & GitHub",
    "github": "Git & GitHub",
    "ci/cd": "CI/CD",
    "github actions": "CI/CD",
    "aws": "Cloud Platform",
    "amazon web services": "Cloud Platform",
    "azure": "Cloud Platform",
    "gcp": "Cloud Platform",
    "terraform": "Terraform",
    "tf": "Terraform",
    "pyspark": "Apache Spark",
    "spark": "Apache Spark",
    "apache spark": "Apache Spark",
    "airflow": "Airflow",
    "apache airflow": "Airflow",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "pytorch": "Deep Learning",
    "tensorflow": "Deep Learning",
    "nlp": "NLP & Transformers",
    "transformers": "NLP & Transformers",
    "huggingface": "NLP & Transformers",
    "hugging face": "NLP & Transformers",
    "genai": "LLM / GenAI",
    "generative ai": "LLM / GenAI",
    "llm": "LLM / GenAI",
    "llms": "LLM / GenAI",
    "rag": "LLM / GenAI",
    "mlops": "MLOps",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "pandas": "Pandas & NumPy",
    "numpy": "Pandas & NumPy",
    "wireshark": "Security Tools",
    "nmap": "Security Tools",
    "siem": "SIEM & Incident Response",
    "rest api": "REST APIs",
    "rest apis": "REST APIs",
    "rest": "REST APIs",
}

def normalize_skill_name(skill: str) -> str:
    """Returns canonical normalized skill name."""
    if not skill or not isinstance(skill, str):
        return ""
    clean = skill.strip().lower()
    return SKILL_ALIASES.get(clean, skill.strip())

async def get_candidate_ground_truth_skills(user_id: str) -> Dict[str, Any]:
    """
    Extracts authentic skills and target role from the candidate's profile and uploaded/built resume.
    Ensures zero artificial or random skills are credited.
    """
    profiles_col = get_profiles_collection()
    resumes_col = get_resumes_collection()

    profile = await profiles_col.find_one({"user_id": user_id}) if profiles_col is not None else None
    resume = await resumes_col.find_one({"user_id": user_id}) if resumes_col is not None else None

    user_skills_set: Set[str] = set()
    user_skills_level: Dict[str, str] = {}
    target_role = ""

    # 1. Extract from Candidate Profile
    if profile:
        target_roles_data = profile.get("targetRoles", {})
        if isinstance(target_roles_data, dict):
            target_role = target_roles_data.get("major") or target_roles_data.get("secondary") or ""
        elif isinstance(target_roles_data, str):
            target_role = target_roles_data

        for s in profile.get("skills", []):
            if isinstance(s, dict):
                s_name = s.get("name") or s.get("skill") or ""
                s_level = s.get("level", "Intermediate")
                if s_name:
                    user_skills_set.add(s_name)
                    user_skills_level[normalize_skill_name(s_name).lower()] = s_level
            elif isinstance(s, str) and s.strip():
                user_skills_set.add(s.strip())
                user_skills_level[normalize_skill_name(s.strip()).lower()] = "Intermediate"

    # 2. Extract from Resume Snapshot
    if resume:
        snapshot = resume.get("profile_snapshot", {})
        if not target_role:
            snap_role = snapshot.get("targetRoles", {})
            if isinstance(snap_role, dict):
                target_role = snap_role.get("major") or ""
            elif isinstance(snap_role, str):
                target_role = snap_role

        snap_skills = snapshot.get("skills", [])
        if isinstance(snap_skills, list):
            for s in snap_skills:
                if isinstance(s, str) and s.strip():
                    user_skills_set.add(s.strip())
                    norm_k = normalize_skill_name(s.strip()).lower()
                    if norm_k not in user_skills_level:
                        user_skills_level[norm_k] = "Intermediate"
        elif isinstance(snap_skills, dict):
            for group in ["technical", "soft", "frameworks", "tools"]:
                for s in snap_skills.get(group, []):
                    if isinstance(s, str) and s.strip():
                        user_skills_set.add(s.strip())
                        norm_k = normalize_skill_name(s.strip()).lower()
                        if norm_k not in user_skills_level:
                            user_skills_level[norm_k] = "Intermediate"

    return {
        "target_role": target_role or "Full Stack Developer",
        "skills_set": user_skills_set,
        "skills_map": user_skills_level,
        "has_data": len(user_skills_set) > 0
    }

async def get_all_roles() -> List[Dict[str, Any]]:
    """Returns all available career tracks and descriptions."""
    role_skills_col = get_role_skills_collection()
    if role_skills_col is not None:
        docs = await role_skills_col.find({}).to_list(length=50)
        if docs:
            return [
                {
                    "role": d["role"],
                    "description": d.get("description", ""),
                    "skills_count": len(d.get("skills", [])),
                    "skills": [s["name"] for s in d.get("skills", [])]
                }
                for d in docs
            ]
            
    # Fallback to local catalog
    return [
        {
            "role": r["role"],
            "description": r["description"],
            "skills_count": len(r["skills"]),
            "skills": [s["name"] for s in r["skills"]]
        }
        for r in ROLE_SKILL_CATALOG
    ]

async def get_role_details(role_name: str) -> Optional[Dict[str, Any]]:
    """Returns skills and topics for a specific career track."""
    role_skills_col = get_role_skills_collection()
    if role_skills_col is not None:
        doc = await role_skills_col.find_one({"role": {"$regex": f"^{role_name}$", "$options": "i"}})
        if doc:
            doc["id"] = str(doc.get("_id", ""))
            doc.pop("_id", None)
            return doc

    for r in ROLE_SKILL_CATALOG:
        if r["role"].lower() == role_name.lower():
            return dict(r)

    # Default to Full Stack Developer if role not found
    return dict(ROLE_SKILL_CATALOG[0])

async def analyze_skill_gaps(
    user_id: str,
    target_role: Optional[str] = None,
    job_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Performs deterministic Skill Gap Analysis comparing Candidate Profile & Resume skills
    against the target role or the specific Job Requirements.
    Strictly ground-truth based (no random or artificial data).
    """
    # 1. Fetch Candidate Ground Truth Skills
    user_ground_truth = await get_candidate_ground_truth_skills(user_id)
    candidate_skills_map = user_ground_truth["skills_map"]

    # Canonical set of all skills candidate actually possesses
    user_canonical_keys: Set[str] = set()
    for s_raw in user_ground_truth["skills_set"]:
        user_canonical_keys.add(s_raw.strip().lower())
        user_canonical_keys.add(normalize_skill_name(s_raw).lower())

    # 2. Determine Requirements (Priority: Target Role if specified -> Selected Job -> Profile Target Role)
    job_context = None
    if target_role:
        role_details = await get_role_details(target_role)
        role_name = role_details.get("role", target_role)
        required_skills = role_details.get("skills", [])
    elif job_id:
        from ..jobs.recommendation_service import BENCHMARK_JOBS, get_candidate_recommended_jobs
        from ..jobs.job_normalizer import normalize_catalog_job

        target_job = None
        # Check benchmark jobs
        for b in BENCHMARK_JOBS:
            if b.get("id") == job_id or f"bench-{b.get('id')}" == job_id:
                target_job = normalize_catalog_job(b)
                break

        # Check applications collection
        if not target_job:
            apps_col = get_applications_collection()
            if apps_col is not None:
                try:
                    app_doc = await apps_col.find_one({"$or": [{"_id": ObjectId(job_id)}, {"jobId": job_id}]})
                except Exception:
                    app_doc = await apps_col.find_one({"jobId": job_id})
                if app_doc:
                    target_job = {
                        "id": job_id,
                        "title": app_doc.get("jobTitle", "Job Opening"),
                        "company": app_doc.get("company", ""),
                        "location": app_doc.get("location", ""),
                        "description": app_doc.get("notes", "")
                    }

        # Check recommendation cache
        if not target_job:
            rec_res = await get_candidate_recommended_jobs(user_id=user_id, limit=30)
            for j in rec_res.get("jobs", []):
                if j.get("id") == job_id:
                    target_job = j
                    break

        if not target_job:
            target_job = normalize_catalog_job(BENCHMARK_JOBS[0])
            target_job["id"] = job_id

        role_name = target_job.get("title", "Engineering Position")
        job_context = {
            "id": job_id,
            "title": target_job.get("title", ""),
            "company": target_job.get("company", ""),
            "location": target_job.get("location", "")
        }

        # Extract REAL required skills for this job
        job_skills = target_job.get("required_skills", [])
        if not job_skills and target_job.get("skills"):
            job_skills = [
                s.get("skill") if isinstance(s, dict) else str(s)
                for s in target_job.get("skills", [])
            ]

        # Extract from title & description text if empty
        if not job_skills:
            combined_text = f"{target_job.get('title', '')} {target_job.get('description', '')}"
            job_skills = extract_skills_from_text(combined_text)

        if not job_skills:
            job_skills = ["Software Engineering", "Problem Solving", "System Architecture", "Git"]

        required_skills = [
            {
                "name": str(s),
                "importance": "High",
                "topics": [f"{s} Core Architecture", f"{s} Best Practices", f"{s} Practical Application"],
                "default_level": "Intermediate"
            }
            for s in job_skills
        ]
    else:
        active_role = user_ground_truth["target_role"] or "Full Stack Developer"
        role_details = await get_role_details(active_role)
        role_name = role_details.get("role", "Full Stack Developer")
        required_skills = role_details.get("skills", [])

    # 3. Fetch User Learning Progress
    progress_col = get_learning_progress_collection()
    user_progress_map: Dict[str, Dict[str, Any]] = {}
    if progress_col is not None:
        user_progress_list = await progress_col.find({"user_id": user_id}).to_list(length=100)
        for p in user_progress_list:
            user_progress_map[normalize_skill_name(p.get("skill", "")).lower()] = p

    # 4. Compare Requirements vs User Skills (Exact canonical matching)
    missing_skills = []
    weak_skills = []
    verified_skills = []

    for req in required_skills:
        req_name = req["name"]
        canonical_req = normalize_skill_name(req_name)
        req_key = canonical_req.lower()

        # Check candidate profile & resume strictly
        user_has_skill = (req_key in user_canonical_keys) or (req_name.strip().lower() in user_canonical_keys)
        current_level = candidate_skills_map.get(req_key, "Intermediate") if user_has_skill else "Missing"

        progress_record = user_progress_map.get(req_key, {})
        skill_progress = progress_record.get("progress", 0)
        skill_status = progress_record.get("status", "completed" if skill_progress >= 100 else ("in_progress" if skill_progress > 0 else "not_started"))

        skill_item = {
            "id": f"gap-{canonical_req.replace(' ', '-').replace('&', 'and').lower()}",
            "skill": canonical_req,
            "original_name": req_name,
            "importance": req.get("importance", "High"),
            "topics": req.get("topics", []),
            "currentLevel": current_level,
            "targetLevel": req.get("default_level", "Intermediate"),
            "progress": skill_progress,
            "status": skill_status,
            "requirement": f"Key technical requirement for {role_name}",
            "whyItMatters": f"Essential for {role_name} performance and interview evaluation."
        }

        if user_has_skill:
            if current_level.lower() == "beginner" and req.get("default_level", "Intermediate").lower() in ["intermediate", "advanced"]:
                skill_item["evidence"] = f"Marked as {current_level} in your resume / profile"
                skill_item["priority"] = "medium"
                weak_skills.append(skill_item)
            else:
                skill_item["evidence"] = f"Verified in candidate profile & resume ({current_level})"
                skill_item["priority"] = "low"
                verified_skills.append(skill_item)
        else:
            skill_item["evidence"] = "Missing from candidate profile and resume"
            skill_item["priority"] = "high"
            missing_skills.append(skill_item)

    # 5. Compute Readiness Score Strictly from Verified Skills
    total_reqs = len(required_skills)
    if total_reqs > 0 and user_ground_truth["has_data"]:
        verified_weight = len(verified_skills) * 1.0
        weak_weight = len(weak_skills) * 0.5
        readiness_score = int(min(100, ((verified_weight + weak_weight) / total_reqs) * 100))
    else:
        readiness_score = 0

    return {
        "targetRole": role_name,
        "jobContext": job_context,
        "overallReadiness": readiness_score,
        "totalRequirements": total_reqs,
        "missingSkillsCount": len(missing_skills),
        "weakSkillsCount": len(weak_skills),
        "verifiedSkillsCount": len(verified_skills),
        "missingSkills": missing_skills,
        "weakSkills": weak_skills,
        "verifiedSkills": verified_skills,
        "allGaps": missing_skills + weak_skills + verified_skills
    }

async def get_resources_for_skill(
    skill_name: str,
    role: Optional[str] = None,
    difficulty: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieves curated learning resources (YouTube tutorials, documentation) for a skill.
    """
    canonical_skill = normalize_skill_name(skill_name)
    learning_res_col = get_learning_resources_collection()

    results: List[Dict[str, Any]] = []

    if learning_res_col is not None:
        query: Dict[str, Any] = {
            "skill": {"$regex": f"^{canonical_skill}$", "$options": "i"}
        }
        if role:
            query["role"] = {"$regex": f"^{role}$", "$options": "i"}
        if difficulty:
            query["difficulty"] = difficulty

        docs = await learning_res_col.find(query).to_list(length=20)
        if docs:
            for d in docs:
                results.append({
                    "id": str(d.get("_id", "")),
                    "skill": d.get("skill", canonical_skill),
                    "role": d.get("role", role or ""),
                    "title": d.get("title", ""),
                    "description": d.get("description", ""),
                    "platform": d.get("platform", "YouTube"),
                    "url": d.get("url", ""),
                    "difficulty": d.get("difficulty", "Beginner"),
                    "topic": d.get("topic", ""),
                    "type": d.get("type", "video")
                })
            return results

    # Fallback to local catalog
    for r_entry in ROLE_SKILL_CATALOG:
        for s_entry in r_entry["skills"]:
            if normalize_skill_name(s_entry["name"]).lower() == canonical_skill.lower():
                for res in s_entry.get("resources", []):
                    results.append({
                        "id": f"res-{len(results)+1}",
                        "skill": canonical_skill,
                        "role": r_entry["role"],
                        "title": res["title"],
                        "description": res.get("description", ""),
                        "platform": res.get("platform", "YouTube"),
                        "url": res["url"],
                        "difficulty": res.get("difficulty", "Beginner"),
                        "topic": res.get("topic", ""),
                        "type": res.get("type", "video")
                    })

    # Standardized YouTube search resource
    if not results:
        query_formatted = canonical_skill.replace(' ', '+')
        results.append({
            "id": f"res-gen-1",
            "skill": canonical_skill,
            "role": role or "Software Engineering",
            "title": f"{canonical_skill} Full Course & Practical Tutorial",
            "description": f"Comprehensive guide to {canonical_skill} fundamentals, practical coding patterns, and real-world project applications.",
            "platform": "YouTube",
            "url": f"https://www.youtube.com/results?search_query={query_formatted}+full+course+freeCodeCamp",
            "difficulty": difficulty or "Beginner",
            "topic": f"{canonical_skill} Core Principles & Architecture",
            "type": "video"
        })

    return results

async def update_learning_progress(
    user_id: str,
    skill_name: str,
    resource_id: Optional[str] = None,
    completed: bool = True,
    custom_progress: Optional[int] = None
) -> Dict[str, Any]:
    """
    Updates and persists candidate learning progress for a specific skill in MongoDB.
    """
    progress_col = get_learning_progress_collection()
    if progress_col is None:
        raise ValueError("Database connection unavailable")

    canonical_skill = normalize_skill_name(skill_name)
    query = {"user_id": user_id, "skill": canonical_skill}

    existing = await progress_col.find_one(query)
    completed_resources = existing.get("completed_resources", []) if existing else []

    if resource_id:
        if completed and resource_id not in completed_resources:
            completed_resources.append(resource_id)
        elif not completed and resource_id in completed_resources:
            completed_resources.remove(resource_id)

    # Compute progress %
    if custom_progress is not None:
        progress_val = max(0, min(100, custom_progress))
    else:
        resources = await get_resources_for_skill(canonical_skill)
        total_res = max(1, len(resources))
        progress_val = int(min(100, (len(completed_resources) / total_res) * 100))

    status = "completed" if progress_val >= 100 else ("in_progress" if progress_val > 0 else "not_started")

    doc = {
        "user_id": user_id,
        "skill": canonical_skill,
        "progress": progress_val,
        "completed_resources": completed_resources,
        "status": status,
        "last_updated": datetime.datetime.utcnow().isoformat()
    }

    await progress_col.update_one(query, {"$set": doc}, upsert=True)
    return doc

async def get_user_learning_progress(user_id: str) -> List[Dict[str, Any]]:
    """Returns all learning progress records for the user."""
    progress_col = get_learning_progress_collection()
    if progress_col is None:
        return []

    docs = await progress_col.find({"user_id": user_id}).to_list(length=100)
    return [
        {
            "id": str(d.get("_id", "")),
            "skill": d.get("skill", ""),
            "progress": d.get("progress", 0),
            "completed_resources": d.get("completed_resources", []),
            "status": d.get("status", "not_started"),
            "last_updated": d.get("last_updated", "")
        }
        for d in docs
    ]
