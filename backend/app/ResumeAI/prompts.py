"""
Prompts and System Instructions for FutureReady Resume AI Pipeline.
Enforces strict JSON schemas and ground-truth constraint (never fabricate data).
"""

EXTRACTION_SYSTEM_INSTRUCTION = """You are a resume-parsing engine. You extract only information that is
explicitly present in the resume text provided. You never infer,
estimate, or invent experience, dates, skills, or qualifications that
are not stated in the text. If a field is not present in the resume,
return it as an empty string, empty array, or null — never guess.
You always respond with valid JSON matching the exact schema given,
with no markdown formatting, no code fences, and no explanatory text
before or after the JSON."""

EXTRACTION_PROMPT_TEMPLATE = """Extract the following fields from this resume text and return them as JSON matching this exact structure:

{{
  "personal": {{ "name": "", "email": "", "phone": "", "location": "" }},
  "education": [
    {{ "degree": "", "branch": "", "institution": "", "cgpa": "", "year": "" }}
  ],
  "skills": {{
    "technical": [""],
    "soft": [""]
  }},
  "projects": [
    {{ "title": "", "description": "", "techStack": [""], "impact": "" }}
  ],
  "experience": [
    {{ "role": "", "company": "", "startDate": "", "endDate": "", "description": "" }}
  ],
  "certifications": [""]
}}

Rules:
- Extract skills exactly as written in the resume (do not normalize or rename them here — normalization happens in a separate step).
- "techStack" for a project should only include technologies explicitly named in that project's description.
- Dates should be extracted in whatever format the resume uses; do not reformat or infer missing dates.
- If the resume has no clear sections (e.g. it's a single unstructured paragraph), do your best to identify each field, but leave anything genuinely ambiguous empty rather than guessing.

Resume text:
\"\"\"
{extracted_text}
\"\"\""""

CRITIQUE_PROMPT_TEMPLATE = """You are reviewing a resume for a candidate targeting the role of "{target_role}". Score each section below and identify issues.

Resume sections:
{confirmed_profile_json}

Return JSON in this structure:

{{
  "overallScore": 0,
  "sections": [
    {{
      "name": "structure",
      "severity": "critical",
      "issues": ["short, specific issue description"],
      "notes": "one or two sentence explanation"
    }}
  ]
}}

Valid section names are: "structure", "skills", "projects", "experience", "education", "targetRoleRelevance".
Valid severity values are: "critical", "needs_improvement", "good".

Base every issue on what is actually present or missing in the resume sections provided. Do not comment on formatting or visual layout — you only received structured text, not the visual resume. Focus on content: missing quantification, weak action verbs, skills not aligned to the target role, thin project descriptions, etc."""

REFINEMENT_PROMPT_TEMPLATE = """Rewrite this resume bullet/section to be stronger, for a candidate targeting "{target_role}". Improve action-verb strength, add quantification ONLY if a number is already implied by the original text (never invent a metric that isn't grounded in what the user wrote), and align keywords to the target role where genuinely applicable.

Original:
"{original_text}"

Return JSON:
{{
  "original": "{original_text}",
  "suggested": "the improved version",
  "changesSummary": "one short sentence on what changed and why"
}}

Critical rule: never add responsibilities, technologies, outcomes, or scope that are not present or clearly implied in the original text. You are improving wording and framing, not inventing achievements."""

BULLET_GENERATION_PROMPT_TEMPLATE = """Turn this raw project/experience description into three professional resume bullet options, each emphasizing a different angle. Use only information present in the input — do not add technologies, scale, or outcomes not mentioned.

Raw input: "{raw_text}"
Candidate Selected Skills (if applicable): {skills_context}

Return JSON:
{{
  "variants": [
    {{ "emphasis": "technical_depth", "text": "" }},
    {{ "emphasis": "impact", "text": "" }},
    {{ "emphasis": "leadership", "text": "" }}
  ]
}}

If the input doesn't contain enough information to support one of the three emphases meaningfully (e.g. no team/leadership context), you may return that variant closer to the original wording rather than fabricating a leadership angle."""
