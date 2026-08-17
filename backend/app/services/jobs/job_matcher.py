import re
from typing import Dict, Any, List, Set, Tuple

# Configurable scoring factor weights (total 100%)
SCORING_WEIGHTS = {
    "skill_match": 0.50,
    "role_fit": 0.20,
    "experience": 0.15,
    "location": 0.10,
    "education": 0.05
}

def normalize_skill_name(s: str) -> str:
    """Standardizes skill string for case-insensitive and punctuation-invariant comparison."""
    if not s:
        return ""
    cleaned = s.strip().lower()
    # Normalize common variations
    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node.js",
        "nodejs": "node.js",
        "vue.js": "vue.js",
        "vuejs": "vue.js",
        "golang": "go",
        "restful apis": "rest apis",
        "rest api": "rest apis",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "k8s": "kubernetes",
        "aws cloud": "aws",
        "google cloud": "google cloud platform",
        "gcp": "google cloud platform"
    }
    return replacements.get(cleaned, cleaned)

def calculate_skill_alignment(
    job_required_skills: List[str],
    candidate_skills: List[str]
) -> Tuple[int, List[str], List[str]]:
    """
    Compares candidate skills against job required skills.
    Returns (skill_score_0_to_100, matched_skills, missing_skills).
    """
    if not job_required_skills:
        # If job has no explicit tech skills extracted, neutral baseline
        return 70, candidate_skills[:4], []

    candidate_norm_map = {normalize_skill_name(s): s for s in candidate_skills if s}
    candidate_norm_set = set(candidate_norm_map.keys())

    matched_skills = []
    missing_skills = []

    for req in job_required_skills:
        req_norm = normalize_skill_name(req)
        if req_norm in candidate_norm_set:
            matched_skills.append(req)
        else:
            missing_skills.append(req)

    total_req = len(job_required_skills)
    matched_count = len(matched_skills)
    
    if total_req > 0:
        raw_ratio = matched_count / total_req
        # Scale to 0-100 with baseline consideration for candidate having strong tech skills
        skill_score = int(raw_ratio * 100)
    else:
        skill_score = 60

    return min(100, max(0, skill_score)), matched_skills, missing_skills

def calculate_role_fit(target_role: str, job_title: str) -> int:
    """
    Calculates token-based keyword overlap between candidate target role and job title.
    """
    if not target_role or not job_title:
        return 65  # Default moderate fit

    role_words = set(re.findall(r"\w+", target_role.lower()))
    title_words = set(re.findall(r"\w+", job_title.lower()))

    # Ignore generic filler words
    stop_words = {"developer", "engineer", "software", "specialist", "junior", "senior", "lead", "associate"}
    role_core = role_words - stop_words
    title_core = title_words - stop_words

    if role_words.issubset(title_words) or title_words.issubset(role_words):
        return 98

    # Core term match (e.g. 'backend' or 'frontend' or 'full stack' or 'python')
    if role_core and title_core and (role_core & title_core):
        return 90
    
    overlap = len(role_words & title_words)
    if overlap >= 2:
        return 85
    elif overlap == 1:
        return 70

    return 45

def calculate_experience_fit(candidate_exp: str, job_exp: str) -> int:
    """
    Compares candidate experience level with job requirements.
    """
    cand_exp = (candidate_exp or "0-1").lower()
    job_e = (job_exp or "").lower()

    if "fresher" in job_e or "0-1" in job_e or "0-2" in job_e:
        return 95 if ("0-1" in cand_exp or "fresher" in cand_exp or "1-2" in cand_exp) else 80
    elif "2-4" in job_e or "2+" in job_e:
        return 90 if ("2-4" in cand_exp or "3+" in cand_exp) else 75
    elif "3-5" in job_e or "senior" in job_e or "5+" in job_e:
        return 90 if ("3-5" in cand_exp or "5+" in cand_exp) else 60

    return 80

def calculate_location_fit(candidate_loc: str, job_loc: str, work_mode: str) -> int:
    """
    Calculates location and work mode alignment.
    """
    if work_mode == "Remote":
        return 98  # Remote is location-agnostic
    
    c_loc = (candidate_loc or "").strip().lower()
    j_loc = (job_loc or "").strip().lower()

    if not c_loc or not j_loc:
        return 80  # Baseline

    if c_loc in j_loc or j_loc in c_loc:
        return 95

    # Check common tech hubs in India
    tech_hubs = {"bengaluru", "bangalore", "hyderabad", "chennai", "pune", "mumbai", "delhi", "gurugram", "noida"}
    if (c_loc in tech_hubs) and (j_loc in tech_hubs):
        return 75

    return 60

def match_job_to_profile(
    job: Dict[str, Any],
    profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates a candidate profile against a job listing.
    Returns:
      match_score (int 0-100)
      matched_skills (List[str])
      missing_skills (List[str])
      skills_with_status (List[Dict[str, str]])
      match_reasons (List[str])
      breakdown (Dict[str, int])
    """
    # 1. Candidate Info
    candidate_skills = profile.get("skills", []) if profile else []
    target_role_info = profile.get("targetRoles", {}) if profile else {}
    target_role = ""
    if isinstance(target_role_info, dict):
        target_role = target_role_info.get("major", "") or target_role_info.get("secondary", "")
    elif isinstance(target_role_info, str):
        target_role = target_role_info
        
    candidate_exp = profile.get("yearsExperience", "0-1") if profile else "0-1"
    candidate_loc = profile.get("location", "") if profile else ""
    education_items = profile.get("education", []) if profile else []

    # 2. Compute sub-scores
    skill_score, matched_skills, missing_skills = calculate_skill_alignment(
        job.get("required_skills", []),
        candidate_skills
    )
    role_score = calculate_role_fit(target_role, job.get("title", ""))
    exp_score = calculate_experience_fit(candidate_exp, job.get("experience", ""))
    loc_score = calculate_location_fit(candidate_loc, job.get("location", ""), job.get("workMode", "In-office"))
    edu_score = 85 if education_items else 70

    # 3. Weighted Composite Score
    composite_score = int(
        (skill_score * SCORING_WEIGHTS["skill_match"]) +
        (role_score * SCORING_WEIGHTS["role_fit"]) +
        (exp_score * SCORING_WEIGHTS["experience"]) +
        (loc_score * SCORING_WEIGHTS["location"]) +
        (edu_score * SCORING_WEIGHTS["education"])
    )
    
    # Bound between 30 and 99 for realism
    final_score = min(98, max(35, composite_score))

    # 4. Generate structured skill chips
    skill_chips = []
    # Add matched skills first
    for s in matched_skills:
        skill_chips.append({"skill": s, "status": "matched"})
    # Add missing skills
    for s in missing_skills:
        skill_chips.append({"skill": s, "status": "missing"})
        
    # If no required skills were listed in the job, show candidate skills as matched
    if not skill_chips and candidate_skills:
        for s in candidate_skills[:5]:
            skill_chips.append({"skill": s, "status": "matched"})

    # 5. Generate human-readable match reasons
    match_reasons = []
    if matched_skills:
        match_reasons.append(f"Strong match for {', '.join(matched_skills[:3])}")
    if role_score >= 80:
        match_reasons.append(f"Aligns with your target {target_role or 'engineering'} career track")
    if job.get("workMode") == "Remote":
        match_reasons.append("Remote flexibility available")
    elif loc_score >= 90 and candidate_loc:
        match_reasons.append(f"Located in your preferred hub ({job.get('location')})")
    if exp_score >= 85:
        match_reasons.append("Experience requirements align with your current profile")

    if not match_reasons:
        match_reasons.append("Matches your engineering background and foundational tech stack")

    breakdown = {
        "skillMatch": skill_score,
        "roleMatch": role_score,
        "experienceMatch": exp_score,
        "locationMatch": loc_score,
        "semanticRelevance": int((skill_score + role_score) / 2)
    }

    return {
        "matchScore": final_score,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "skills": skill_chips,
        "matchReasons": match_reasons,
        "breakdown": breakdown
    }
