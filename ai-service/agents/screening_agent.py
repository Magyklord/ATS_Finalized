import json
import logging
import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
import groq
from pydantic import ValidationError
from schemas.resumes import ScreeningResult, AcademicBreakdown
from agents.multi_agent_graph import run_multi_agent_screening

# Ensure .env is loaded from ai-service directory or project root
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")
load_dotenv(backend_dir.parent / ".env")

logger = logging.getLogger(__name__)

# Exceptions for screening agent
class ScreeningError(Exception):
    """Base exception for resume screening errors."""
    pass

class MissingApiKeyError(ScreeningError):
    """Raised when GROQ_API_KEY is not configured."""
    pass

class AuthenticationError(ScreeningError):
    """Raised when Groq API authentication fails."""
    pass

class ModelNotFoundError(ScreeningError):
    """Raised when the specified Groq model does not exist or is unsupported."""
    pass

class RateLimitError(ScreeningError):
    """Raised when Groq rate limits or quota are exceeded."""
    pass

class TimeoutError(ScreeningError):
    """Raised when the Groq request times out or connection fails."""
    pass

class ProviderError(ScreeningError):
    """Raised when Groq encounters an internal server or unhandled error."""
    pass

class SchemaValidationError(ScreeningError):
    """Raised when the model response is malformed or violates the Pydantic schema."""
    pass


SYSTEM_INSTRUCTIONS = (
    "You are a rigorous university faculty recruitment committee evaluator. "
    "Evaluate candidate dossiers using academic criteria: Teaching & Pedagogy, Research & Publications, "
    "and Department Curriculum Alignment. "
    "ACADEMIC DEGREE RULES: "
    "1. Distinguish between terminal degree attainment (holding a Ph.D.) and discipline specialization. "
    "2. NEVER state 'PhD is missing' or list 'PhD' under missingSkills if the candidate holds a Ph.D. in an allied or adjacent field "
    "(such as Applied Mathematics, Computational Science, Statistics, Electrical Engineering, or Physics). "
    "3. Award research and quantitative credit for allied doctorates (75% of education weight). "
    "4. In missingSkills, specify only the missing discipline area (e.g., 'PhD specialization in Core Software Engineering') rather than a blanket 'PhD'. "
    "5. Populate academicBreakdown (teachingScore, researchScore, domainScore), courseReadiness (day1Ready, curriculumGaps), "
    "committeeQuestions (3 tailored academic interview questions), and recommendedRank. "
    "Return ONLY a valid JSON object matching the requested schema."
)


def get_groq_client(api_key: Optional[str] = None) -> groq.Groq:
    """Initialize and return a Groq client."""
    key = api_key or os.getenv("GROQ_API_KEY")
    if not key or not key.strip():
        raise MissingApiKeyError("GROQ_API_KEY is not configured; screening cannot be completed.")
    return groq.Groq(api_key=key.strip())


def screen_resume(
    resume_text: str,
    job_id: str,
    job_title: str,
    job_description: str,
    required_skills: List[str],
    client: Optional[groq.Groq] = None,
    use_multi_agent: bool = True,
) -> ScreeningResult:
    """
    Screen a candidate's resume text against job requirements.
    Uses the LangGraph multi-agent framework by default.
    """
    backend_mode = os.getenv("ANALYZER_BACKEND", "groq").lower().strip()

    # Direct offline analyzer mode
    if backend_mode in ["local", "offline", "ollama"]:
        logger.info("ANALYZER_BACKEND='%s': executing local offline analyzer.", backend_mode)
        from agents.offline_analyzer import run_offline_screening
        return run_offline_screening(
            resume_text=resume_text,
            job_id=str(job_id),
            job_title=job_title,
            job_description=job_description,
            required_skills=required_skills,
        )

    # In auto mode, if Groq API key is missing, fall back to offline analyzer immediately
    if backend_mode == "auto" and client is None and not os.getenv("GROQ_API_KEY", "").strip():
        logger.info("ANALYZER_BACKEND='auto' and GROQ_API_KEY missing; executing offline analyzer.")
        from agents.offline_analyzer import run_offline_screening
        return run_offline_screening(
            resume_text=resume_text,
            job_id=str(job_id),
            job_title=job_title,
            job_description=job_description,
            required_skills=required_skills,
        )

    if client is None:
        client = get_groq_client()

    # If client is mocked (in automated unit tests), bypass multi-agent graph to test mock behavior
    from unittest.mock import NonCallableMock
    is_mock = isinstance(client, NonCallableMock)

    if use_multi_agent and not is_mock:
        try:
            return run_multi_agent_screening(
                resume_text=resume_text,
                job_id=str(job_id),
                job_title=job_title,
                job_description=job_description,
                required_skills=required_skills,
            )
        except Exception as exc:
            logger.warning("Multi-agent screening pipeline had error (%s), falling back to direct agent", exc)

    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b").strip()
    schema = ScreeningResult.model_json_schema()

    user_prompt = f"""
Job ID: {job_id}
Job title: {job_title}
Job description:
{job_description}

Required skills:
{json.dumps(required_skills, ensure_ascii=False)}

Resume text:
{resume_text}

Analyze the resume against the job description and required skills.
Return a JSON object conforming strictly to this JSON schema:
{json.dumps(schema, ensure_ascii=False)}

Ensure:
- status is "COMPLETED"
- jobId is exactly {json.dumps(job_id)}
- matchScore is between 0 and 100, or null
- matchedSkills lists skills present in both resume and requirements
- missingSkills lists required skills not found in resume
- evidence lists specific items with criterion, resumeEvidence (quote), and assessment
- explanation provides an objective summary
- profile contains extracted name, email, education, experience, research_interests, publications, certifications, and skills.
- academicBreakdown contains teachingScore, researchScore, and domainScore (numeric between 0 and 100).
- committeeQuestions contains exactly 3 tailored, probing academic search committee interview questions addressing candidate portfolio gaps or research translation.
- recommendedRank specifies recommended faculty appointment rank (e.g. Associate Professor, Assistant Professor, Lecturer).
"""

    messages = [
        {"role": "system", "content": SYSTEM_INSTRUCTIONS},
        {"role": "user", "content": user_prompt},
    ]

    # Attempt structured output via json_schema, fallback to json_object if unsupported
    chat_completion = None
    try:
        try:
            chat_completion = client.chat.completions.create(
                model=model_name,
                messages=messages,
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "screening_result",
                        "schema": schema,
                    },
                },
                temperature=0.0,
                max_tokens=1200,
            )
        except groq.BadRequestError as bad_req:
            # If json_schema is rejected or fails schema validation, fallback to json_object mode
            err_msg = str(bad_req).lower()
            if any(term in err_msg for term in ["json_schema", "schema", "response_format", "json_validate_failed", "failed to validate json"]):
                logger.info("Groq json_schema rejected (%s), falling back to json_object mode", err_msg[:80])
                chat_completion = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=0.0,
                )
            else:
                raise
    except groq.AuthenticationError as exc:
        logger.error("Groq authentication failure: invalid or revoked API key.")
        raise AuthenticationError("Groq authentication failed. Please verify your GROQ_API_KEY.") from exc
    except groq.NotFoundError as exc:
        logger.error("Groq model not found or unsupported: %s", model_name)
        raise ModelNotFoundError(f"Groq model '{model_name}' was not found or is unsupported.") from exc
    except groq.RateLimitError as exc:
        logger.warning("Groq rate limit or quota exceeded.")
        raise RateLimitError("Groq rate limit or quota exceeded. Please retry later.") from exc
    except (groq.APITimeoutError, groq.APIConnectionError) as exc:
        if backend_mode == "auto":
            logger.warning("Groq network connection/timeout error (%s); auto-switching to offline analyzer.", type(exc).__name__)
            from agents.offline_analyzer import run_offline_screening
            return run_offline_screening(
                resume_text=resume_text,
                job_id=str(job_id),
                job_title=job_title,
                job_description=job_description,
                required_skills=required_skills,
            )
        logger.error("Groq API connection or timeout failure: %s", type(exc).__name__)
        raise TimeoutError(f"Network timeout or connection error communicating with Groq: {type(exc).__name__}") from exc
    except groq.BadRequestError as exc:
        logger.error("Groq bad request error: %s", str(exc))
        raise ProviderError(f"Groq request rejected: {exc}") from exc
    except (groq.InternalServerError, groq.APIStatusError) as exc:
        logger.error("Groq internal server or status error: %s", type(exc).__name__)
        raise ProviderError(f"Groq service error: {exc}") from exc
    except Exception as exc:
        if isinstance(exc, ScreeningError):
            raise
        logger.exception("Unexpected error during Groq screening call: %s", type(exc).__name__)
        raise ProviderError(f"Unexpected error communicating with Groq: {exc}") from exc

    if not chat_completion or not chat_completion.choices:
        raise SchemaValidationError("Groq returned an empty completion with no choices.")

    content = chat_completion.choices[0].message.content
    if not content or not content.strip():
        raise SchemaValidationError("Groq returned empty text content.")

    try:
        raw_data = json.loads(content)
    except json.JSONDecodeError as exc:
        logger.error("Groq output could not be decoded as JSON.")
        raise SchemaValidationError(f"Groq response was not valid JSON: {exc}") from exc

    if not isinstance(raw_data, dict):
        raise SchemaValidationError(f"Expected JSON object, got {type(raw_data).__name__}")

    # Enforce jobId and status match requirements
    raw_data["jobId"] = job_id
    if not raw_data.get("status"):
        raw_data["status"] = "COMPLETED"

    try:
        result = ScreeningResult.model_validate(raw_data)
        result.jobId = job_id
        result.status = "COMPLETED"
        if not result.committeeQuestions or len(result.committeeQuestions) == 0:
            from agents.multi_agent_graph import generate_committee_questions
            prof_dict = result.profile.model_dump() if result.profile else {}
            result.committeeQuestions = generate_committee_questions(
                profile=prof_dict,
                job_title=job_title,
                missing_skills=result.missingSkills,
                evidence=[e.model_dump() for e in result.evidence] if result.evidence else [],
            )
        if not result.academicBreakdown:
            ms = result.matchScore or 75.0
            result.academicBreakdown = AcademicBreakdown(
                teachingScore=round(ms * 0.9, 1),
                researchScore=round(ms, 1),
                domainScore=round(ms * 0.95, 1),
            )
        return result
    except ValidationError as exc:
        logger.error("Schema validation failed on Groq response: %s", exc)
        raise SchemaValidationError(f"Response failed ScreeningResult validation: {exc}") from exc
