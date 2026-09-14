"""
Thin wrapper around the Gemini API (google-generativeai).

All AI features go through here so there is exactly one place that knows
about API keys, prompts, and error handling. If GEMINI_API_KEY isn't set,
functions raise GeminiNotConfigured, and the views turn that into a clean
4xx response instead of a crash - so the rest of the app still works
without an AI key.
"""
import json
from django.conf import settings


class GeminiNotConfigured(Exception):
    pass


class GeminiRequestError(Exception):
    pass


def _get_model():
    if not settings.GEMINI_API_KEY:
        raise GeminiNotConfigured(
            'GEMINI_API_KEY is not set. Add it to backend/.env to enable AI features.'
        )
    import google.generativeai as genai

    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel(settings.GEMINI_MODEL)


def _generate(prompt: str, json_mode: bool = False) -> str:
    model = _get_model()
    try:
        config = {'response_mime_type': 'application/json'} if json_mode else None
        response = model.generate_content(prompt, generation_config=config)
        return (response.text or '').strip()
    except Exception as exc:  # pragma: no cover - network/SDK errors
        raise GeminiRequestError(str(exc)) from exc


def _safe_json(raw: str, fallback):
    cleaned = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
    try:
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        return fallback


def analyze_resume(resume_text: str, jd_text: str) -> dict:
    prompt = f"""You are an expert ATS resume reviewer and career coach.
Compare the RESUME to the JOB DESCRIPTION and respond with ONLY a JSON object
(no markdown fences) with this exact shape:
{{
  "summary": "2-3 sentence overall assessment",
  "strengths": ["short bullet", "..."],
  "weaknesses": ["short bullet", "..."],
  "suggestions": ["specific, actionable improvement", "..."]
}}
Keep each list to at most 5 concise items.

RESUME:
{resume_text[:6000]}

JOB DESCRIPTION:
{jd_text[:4000]}
"""
    raw = _generate(prompt, json_mode=True)
    return _safe_json(raw, {
        'summary': raw or 'AI analysis unavailable.',
        'strengths': [], 'weaknesses': [], 'suggestions': [],
    })


def improve_bullet_point(bullet_text: str, role_context: str = '') -> str:
    prompt = f"""Rewrite this resume bullet point to be more impactful for ATS and
recruiters: use a strong action verb, quantify impact where plausible, and
keep it to a single line under 220 characters. Return ONLY the rewritten
bullet point text, nothing else - no quotes, no markdown.

Role context: {role_context or 'not specified'}
Original bullet: {bullet_text}
"""
    return _generate(prompt).strip().strip('"')


def generate_professional_summary(resume_text: str, target_role: str = '') -> str:
    prompt = f"""Write a concise, ATS-friendly professional summary (3-4 sentences,
first person implied but no "I"/"me") for a resume, based on the candidate's
background below. Target role: {target_role or 'their current field'}.
Return ONLY the summary text.

RESUME BACKGROUND:
{resume_text[:5000]}
"""
    return _generate(prompt).strip()


def generate_interview_questions(resume_text: str, jd_text: str, count: int = 8) -> list[str]:
    prompt = f"""Based on this resume and job description, generate {count} likely
interview questions a candidate should prepare for - mix behavioral and
technical/role-specific. Respond with ONLY a JSON array of strings.

RESUME:
{resume_text[:4000]}

JOB DESCRIPTION:
{jd_text[:3000]}
"""
    raw = _generate(prompt, json_mode=True)
    result = _safe_json(raw, [])
    return result if isinstance(result, list) else []


def generate_cover_letter(resume_text: str, jd_text: str, company: str = '', tone: str = 'professional') -> str:
    prompt = f"""Write a {tone} cover letter (3-4 short paragraphs) for the job
described below, based on the candidate's resume. Address it generically if
no hiring manager name is available. Company: {company or '(unspecified)'}.
Return ONLY the letter body text, no markdown.

RESUME:
{resume_text[:5000]}

JOB DESCRIPTION:
{jd_text[:3000]}
"""
    return _generate(prompt).strip()
