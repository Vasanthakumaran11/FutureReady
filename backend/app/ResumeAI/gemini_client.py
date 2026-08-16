import os
import json
import re
from typing import Dict, Any, Optional
import google.generativeai as genai

from .prompts import (
    EXTRACTION_SYSTEM_INSTRUCTION,
    EXTRACTION_PROMPT_TEMPLATE,
    CRITIQUE_PROMPT_TEMPLATE,
    REFINEMENT_PROMPT_TEMPLATE,
    BULLET_GENERATION_PROMPT_TEMPLATE,
)
from .skill_normalizer import normalize_skills_list


class GeminiServiceError(Exception):
    def __init__(self, error_code: str, message: str, status_code: int = 502):
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def get_gemini_model(system_instruction: Optional[str] = None):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiServiceError(
            "extraction_service_unavailable",
            "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to backend/.env.",
        )
    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

    kwargs = {}
    if system_instruction:
        kwargs["system_instruction"] = system_instruction

    return genai.GenerativeModel(model_name=model_name, **kwargs)


def clean_json_response(raw_text: str) -> str:
    """Strips markdown code blocks and extracts root JSON object."""
    cleaned = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()

    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        cleaned = cleaned[first_brace : last_brace + 1].strip()

    return cleaned


async def generate_json_response(
    prompt: str, system_instruction: Optional[str] = None, retry_count: int = 1
) -> Dict[str, Any]:
    """
    Executes Gemini completion with JSON response formatting,
    retrying with a stricter prompt on parse failure.
    """
    try:
        model = get_gemini_model(system_instruction=system_instruction)
    except GeminiServiceError:
        raise
    except Exception as e:
        raise GeminiServiceError(
            "extraction_service_unavailable", f"Could not initialize Gemini: {str(e)}"
        )

    generation_config = genai.GenerationConfig(
        response_mime_type="application/json", temperature=0.1
    )

    current_prompt = prompt
    for attempt in range(retry_count + 1):
        try:
            response = await model.generate_content_async(
                current_prompt, generation_config=generation_config
            )
            response_text = response.text
            cleaned_json_text = clean_json_response(response_text)
            parsed = json.loads(cleaned_json_text)
            return parsed
        except json.JSONDecodeError:
            if attempt < retry_count:
                current_prompt = (
                    prompt + "\n\nCRITICAL: Your previous response was not valid JSON. "
                    "Return ONLY raw, valid JSON with no markdown formatting or commentary."
                )
            else:
                raise GeminiServiceError(
                    "extraction_parse_failed",
                    "The model returned a malformed response. Please try the guided builder instead.",
                )
        except Exception as e:
            raise GeminiServiceError(
                "extraction_service_unavailable", f"Gemini API request failed: {str(e)}"
            )


async def extract_resume_fields(extracted_text: str) -> Dict[str, Any]:
    """
    Path A: Extracts structured candidate fields from raw resume text
    and applies deterministic skill taxonomy normalization.
    """
    prompt = EXTRACTION_PROMPT_TEMPLATE.format(extracted_text=extracted_text)
    data = await generate_json_response(
        prompt=prompt, system_instruction=EXTRACTION_SYSTEM_INSTRUCTION
    )

    raw_technical = data.get("skills", {}).get("technical", [])
    raw_soft = data.get("skills", {}).get("soft", [])

    normalized_technical = normalize_skills_list(raw_technical)
    normalized_soft = normalize_skills_list(raw_soft)

    data["skills_normalized"] = {
        "technical": normalized_technical,
        "soft": normalized_soft,
        "canonical_list": [s["canonical"] for s in normalized_technical],
    }

    return data


async def analyze_resume(confirmed_profile: Dict[str, Any], target_role: str) -> Dict[str, Any]:
    """
    Critique: Section-by-section scoring against target role.
    """
    confirmed_json_str = json.dumps(confirmed_profile, indent=2)
    prompt = CRITIQUE_PROMPT_TEMPLATE.format(
        target_role=target_role or "Software Engineer",
        confirmed_profile_json=confirmed_json_str,
    )
    raw_critique = await generate_json_response(prompt=prompt)

    sections_list = []
    issues_list = []

    overall_score = raw_critique.get("overallScore", 75)
    raw_sections = raw_critique.get("sections", [])

    section_score_map = {"good": 90, "needs_improvement": 68, "critical": 45}

    for idx, sec in enumerate(raw_sections):
        sec_name = sec.get("name", f"Section {idx+1}")
        severity = sec.get("severity", "needs_improvement")
        sec_score = section_score_map.get(severity, 70)

        sections_list.append(
            {
                "section": sec_name.title(),
                "score": sec_score,
                "note": sec.get("notes", f"Evaluated for {target_role}."),
            }
        )

        for issue_text in sec.get("issues", []):
            issues_list.append(
                {
                    "id": f"issue-{len(issues_list)+1}",
                    "severity": severity,
                    "section": sec_name.title(),
                    "message": issue_text,
                    "recommendation": f"Refine this section in the builder to align with {target_role} benchmarks.",
                }
            )

    if not sections_list:
        sections_list = [
            {"section": "Structure", "score": 85, "note": "Clear single-column layout."},
            {"section": "Skills", "score": 75, "note": f"Aligned with {target_role}."},
            {"section": "Projects", "score": 70, "note": "Add quantifiable impact."},
            {"section": "Experience", "score": 80, "note": "Strong action verbs."},
        ]

    return {
        "overallScore": overall_score or 78,
        "targetRole": target_role or "Software Engineer",
        "sections": sections_list,
        "issues": issues_list,
        "raw_critique": raw_critique,
    }


async def refine_bullet(original_text: str, target_role: str) -> Dict[str, Any]:
    """
    Refinement: Single-bullet rewrite for diff comparison (Accept / Reject / Edit).
    """
    prompt = REFINEMENT_PROMPT_TEMPLATE.format(
        target_role=target_role or "Software Engineer", original_text=original_text
    )
    return await generate_json_response(prompt=prompt)


async def generate_bullet_variants(
    raw_text: str, skills: Optional[list] = None
) -> Dict[str, Any]:
    """
    Path B: Generates 3 variant bullets (technical depth, impact, leadership) from raw input.
    """
    skills_context = ", ".join(skills) if skills else "General software engineering skills"
    prompt = BULLET_GENERATION_PROMPT_TEMPLATE.format(
        raw_text=raw_text, skills_context=skills_context
    )
    return await generate_json_response(prompt=prompt)
