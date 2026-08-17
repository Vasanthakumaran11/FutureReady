import re
from typing import List, Dict, Any, Set

def normalize_text_for_comparison(text: str) -> str:
    """Lowercases, removes special characters, and strips whitespace for similarity comparison."""
    if not text:
        return ""
    cleaned = re.sub(r"[^\w\s]", "", text.lower())
    return re.sub(r"\s+", " ", cleaned).strip()

def are_jobs_duplicate(job_a: Dict[str, Any], job_b: Dict[str, Any]) -> bool:
    """
    Conservative duplicate test between two jobs.
    Two jobs are considered duplicate if:
    1. Exact same source URL, OR
    2. Normalized Title matches AND Normalized Company matches AND locations overlap.
    """
    # 1. URL check
    url_a = (job_a.get("sourceUrl") or "").strip().rstrip("/")
    url_b = (job_b.get("sourceUrl") or "").strip().rstrip("/")
    if url_a and url_b and url_a == url_b:
        return True

    # 2. Title + Company + Location check
    title_a = normalize_text_for_comparison(job_a.get("title", ""))
    title_b = normalize_text_for_comparison(job_b.get("title", ""))
    if not title_a or not title_b or title_a != title_b:
        return False

    comp_a = normalize_text_for_comparison(job_a.get("company", ""))
    comp_b = normalize_text_for_comparison(job_b.get("company", ""))
    if not comp_a or not comp_b or comp_a != comp_b:
        return False

    loc_a = normalize_text_for_comparison(job_a.get("location", ""))
    loc_b = normalize_text_for_comparison(job_b.get("location", ""))
    
    # If locations are identical or one contains the other, consider duplicate
    if loc_a == loc_b or (loc_a and loc_b and (loc_a in loc_b or loc_b in loc_a)):
        return True

    return False

def deduplicate_jobs(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Conservatively filters out duplicate job postings while preserving maximum metadata.
    """
    unique_jobs: List[Dict[str, Any]] = []
    seen_keys: Set[str] = set()

    for job in jobs:
        title_comp_key = f"{normalize_text_for_comparison(job.get('title', ''))}::{normalize_text_for_comparison(job.get('company', ''))}::{normalize_text_for_comparison(job.get('location', ''))}"
        
        if title_comp_key in seen_keys:
            continue
        
        # Check against existing items
        is_dup = False
        for existing in unique_jobs:
            if are_jobs_duplicate(job, existing):
                is_dup = True
                # Merge required skills if new one has more
                existing_skills = set(existing.get("required_skills", []))
                for s in job.get("required_skills", []):
                    if s not in existing_skills:
                        existing["required_skills"].append(s)
                break
        
        if not is_dup:
            seen_keys.add(title_comp_key)
            unique_jobs.append(job)

    return unique_jobs
