import json
from pathlib import Path
from typing import List, Dict, Any
from rapidfuzz import process, fuzz

TAXONOMY_PATH = Path(__file__).parent / "taxonomy.json"


def load_taxonomy() -> List[str]:
    if not TAXONOMY_PATH.exists():
        return []
    with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


TAXONOMY_LIST = load_taxonomy()


def normalize_skill(skill_raw: str, threshold: float = 85.0) -> Dict[str, Any]:
    """
    Matches raw skill against canonical taxonomy using rapidfuzz.
    If score >= threshold (default 85), returns normalized canonical name.
    If score < threshold, returns raw string without dropping.
    """
    skill_cleaned = skill_raw.strip()
    if not skill_cleaned or not TAXONOMY_LIST:
        return {"raw": skill_raw, "canonical": skill_raw, "normalized": False, "score": 0.0}

    match_result = process.extractOne(
        skill_cleaned, TAXONOMY_LIST, scorer=fuzz.token_sort_ratio
    )

    if match_result:
        matched_canonical, score, _ = match_result
        if score >= threshold:
            return {
                "raw": skill_cleaned,
                "canonical": matched_canonical,
                "normalized": True,
                "score": round(score, 1),
            }

    return {
        "raw": skill_cleaned,
        "canonical": skill_cleaned,
        "normalized": False,
        "score": round(match_result[1], 1) if match_result else 0.0,
    }


def normalize_skills_list(skills: List[str]) -> List[Dict[str, Any]]:
    """
    Normalizes a list of raw skills extracted from resume.
    """
    results = []
    seen = set()
    for s in skills:
        if not s or not s.strip():
            continue
        normalized = normalize_skill(s)
        key = normalized["canonical"].lower()
        if key not in seen:
            seen.add(key)
            results.append(normalized)
    return results
