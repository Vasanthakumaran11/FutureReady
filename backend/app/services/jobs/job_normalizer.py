import re
import json
import os
import hashlib
from typing import Dict, Any, List, Set

# Load tech taxonomy for skill extraction from job text
TAXONOMY_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ResumeAI", "taxonomy.json")

def load_skill_taxonomy() -> List[str]:
    try:
        if os.path.exists(TAXONOMY_PATH):
            with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    
    # Fallback basic list
    return [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "SQL",
        "React", "Next.js", "Vue.js", "Angular", "Node.js", "FastAPI", "Django", "Flask",
        "Express.js", "Spring Boot", "REST APIs", "GraphQL", "PostgreSQL", "MongoDB", "MySQL",
        "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "CI/CD", "Linux",
        "Tailwind CSS", "HTML5", "CSS3", "PyTorch", "TensorFlow", "Pandas", "NumPy"
    ]

SKILL_VOCABULARY = load_skill_taxonomy()

# Precompile skill word-boundary regex patterns for fast accurate extraction
SKILL_PATTERNS = []
for skill in SKILL_VOCABULARY:
    escaped = re.escape(skill)
    # Match as full word boundary (handling symbols like C++, C#, .NET, Node.js)
    if skill.endswith("+") or skill.endswith("#"):
        pattern = re.compile(rf"(?:\b|\s|^){escaped}(?:\b|\s|$|,|\.)", re.IGNORECASE)
    else:
        pattern = re.compile(rf"\b{escaped}\b", re.IGNORECASE)
    SKILL_PATTERNS.append((skill, pattern))

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts tech skills from title and description using the controlled taxonomy vocabulary.
    Case-insensitive, avoids false positives.
    """
    if not text:
        return []

    found_skills: Set[str] = set()
    for canonical_name, pattern in SKILL_PATTERNS:
        if pattern.search(text):
            found_skills.add(canonical_name)

    return sorted(list(found_skills))

def clean_html(raw_html: str) -> str:
    """Removes HTML tags and cleans whitespace from job descriptions."""
    if not raw_html:
        return ""
    clean_text = re.sub(r"<[^>]+>", " ", raw_html)
    clean_text = re.sub(r"&[a-z]+;", " ", clean_text)
    clean_text = re.sub(r"\s+", " ", clean_text)
    return clean_text.strip()

def generate_job_id(source: str, source_id: str, title: str, company: str) -> str:
    """Generates a stable, unique identifier for a job listing."""
    if source_id:
        return f"{source.lower()}-{source_id}"
    raw = f"{source}:{title}:{company}"
    hash_str = hashlib.md5(raw.encode("utf-8")).hexdigest()[:10]
    return f"{source.lower()}-{hash_str}"

def normalize_jooble_job(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms a Jooble API item into the common FutureReady Job dictionary.
    Jooble item keys: id, title, location, snippet, salary, source, type, link, company, updated
    """
    raw_title = item.get("title", "").strip()
    title = clean_html(raw_title)
    company = item.get("company", "").strip() or "Hiring Company"
    location = item.get("location", "").strip() or "India"
    description = clean_html(item.get("snippet", ""))
    source_url = item.get("link", "")
    source_id = str(item.get("id", ""))
    
    salary = item.get("salary", "").strip() or None
    employment_type = item.get("type", "").strip() or "Full-time"
    
    # Infer workMode from title, location, description
    combined_text = f"{title} {location} {description}".lower()
    if "remote" in combined_text or "work from home" in combined_text:
        work_mode = "Remote"
    elif "hybrid" in combined_text:
        work_mode = "Hybrid"
    else:
        work_mode = "In-office"

    # Infer experience if mentioned
    experience = "0-2 years"
    if "fresher" in combined_text or "intern" in combined_text or "entry" in combined_text:
        experience = "Fresher / 0-1 years"
    elif "senior" in combined_text or "lead" in combined_text:
        experience = "3-5+ years"
    elif "mid" in combined_text or "2+" in combined_text or "3+" in combined_text:
        experience = "2-4 years"

    # Extract required skills
    required_skills = extract_skills_from_text(f"{title} {description}")

    return {
        "id": generate_job_id("jooble", source_id, title, company),
        "title": title,
        "company": company,
        "location": location,
        "workMode": work_mode,
        "experience": experience,
        "salary": salary,
        "description": description,
        "source": "Jooble",
        "sourceUrl": source_url,
        "required_skills": required_skills,
        "posted_at": item.get("updated", "")
    }

def normalize_adzuna_job(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms an Adzuna API item into the common FutureReady Job dictionary.
    Adzuna item keys: id, title, description, company.display_name, location.display_name,
    salary_min, salary_max, contract_time, redirect_url, created
    """
    raw_title = item.get("title", "").strip()
    title = clean_html(raw_title)
    
    company_dict = item.get("company", {})
    company = company_dict.get("display_name", "").strip() if isinstance(company_dict, dict) else "Hiring Company"
    if not company:
        company = "Hiring Company"
        
    loc_dict = item.get("location", {})
    location = loc_dict.get("display_name", "").strip() if isinstance(loc_dict, dict) else "India"
    if not location:
        location = "India"
        
    description = clean_html(item.get("description", ""))
    source_url = item.get("redirect_url", "")
    source_id = str(item.get("id", ""))

    # Format salary if min/max available
    salary_min = item.get("salary_min")
    salary_max = item.get("salary_max")
    salary = None
    if salary_min and salary_max:
        if salary_min == salary_max:
            salary = f"₹{int(salary_min):,}"
        else:
            salary = f"₹{int(salary_min):,} - ₹{int(salary_max):,}"
    elif salary_min:
        salary = f"From ₹{int(salary_min):,}"

    # Contract time / type
    contract_time = item.get("contract_time", "")
    employment_type = "Full-time"
    if contract_time == "part_time":
        employment_type = "Part-time"
    elif contract_time == "contract":
        employment_type = "Contract"

    # Infer workMode
    combined_text = f"{title} {location} {description}".lower()
    if "remote" in combined_text or "work from home" in combined_text:
        work_mode = "Remote"
    elif "hybrid" in combined_text:
        work_mode = "Hybrid"
    else:
        work_mode = "In-office"

    # Infer experience
    experience = "0-2 years"
    if "fresher" in combined_text or "intern" in combined_text or "entry" in combined_text:
        experience = "Fresher / 0-1 years"
    elif "senior" in combined_text or "lead" in combined_text:
        experience = "3-5+ years"
    elif "mid" in combined_text or "2+" in combined_text or "3+" in combined_text:
        experience = "2-4 years"

    # Extract required skills
    required_skills = extract_skills_from_text(f"{title} {description}")

    return {
        "id": generate_job_id("adzuna", source_id, title, company),
        "title": title,
        "company": company,
        "location": location,
        "workMode": work_mode,
        "experience": experience,
        "salary": salary,
        "description": description,
        "source": "Adzuna",
        "sourceUrl": source_url,
        "required_skills": required_skills,
        "posted_at": item.get("created", "")
    }

def normalize_catalog_job(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms an internal catalog/benchmark job item into the common FutureReady Job dictionary.
    """
    skills = item.get("skills", [])
    if not skills:
        skills = extract_skills_from_text(f"{item.get('title', '')} {item.get('description', '')}")

    return {
        "id": item.get("id", ""),
        "title": item.get("title", ""),
        "company": item.get("company", ""),
        "location": item.get("location", "Bengaluru"),
        "workMode": item.get("workMode", "Hybrid"),
        "experience": item.get("experience", "0-2 years"),
        "salary": item.get("salary"),
        "description": item.get("description", ""),
        "source": item.get("source", "Direct"),
        "sourceUrl": item.get("sourceUrl", "https://careers.google.com"),
        "required_skills": skills,
        "posted_at": ""
    }
