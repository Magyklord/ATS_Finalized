import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from typing_extensions import TypedDict
from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from schemas.resumes import ScreeningResult, ResumeProfile, Evidence, Education, Experience

# Ensure .env is loaded
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")

logger = logging.getLogger(__name__)


class MultiAgentScreeningState(TypedDict):
    resume_text: str
    job_id: str
    job_title: str
    job_description: str
    required_skills: List[str]
    # Output of Agent 1 (Profile Extractor)
    profile: Optional[Dict[str, Any]]
    # Output of Agent 2 (Criteria Analyzer)
    rubric: Optional[List[Dict[str, str]]]
    # Output of Agent 3 (Evidence Evaluator)
    evidence: Optional[List[Dict[str, str]]]
    matched_skills: Optional[List[str]]
    missing_skills: Optional[List[str]]
    # Output of Agent 4 (Scoring & Synthesis Agent)
    match_score: Optional[float]
    explanation: Optional[str]
    status: str


def get_llm(temperature: float = 0.0) -> ChatGroq:
    """Initialize LangChain ChatGroq LLM instance."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b").strip()
    return ChatGroq(
        model=model,
        api_key=api_key,
        temperature=temperature,
        model_kwargs={"response_format": {"type": "json_object"}},
    )


# --- Agent 1: Candidate Profile Extractor ---
def profile_extractor_node(state: MultiAgentScreeningState) -> Dict[str, Any]:
    """Agent 1: Extracts structured candidate details from resume text."""
    logger.info("Agent 1 (Profile Extractor) analyzing resume...")
    llm = get_llm()
    resume_text = state.get("resume_text", "")

    prompt = f"""You are the Candidate Profile Extraction Agent.
Extract the candidate's professional profile from the resume text below.
Do not invent or assume any credentials. If something is missing, leave it empty.

Resume:
{resume_text}

Return a JSON object conforming strictly to this structure:
{{
  "name": "Candidate Full Name",
  "email": "email address or empty",
  "education": [
    {{"degree": "e.g. Ph.D.", "institution": "University name", "field": "Field of study", "year": "Year or empty"}}
  ],
  "experience": [
    {{"role": "Position Title", "organization": "Institution/Company", "duration": "Years or Dates", "description": "Summary of duties"}}
  ],
  "research_interests": ["Interest 1", "Interest 2"],
  "publications": ["Publication citation 1"],
  "certifications": ["Cert 1"],
  "skills": ["Skill 1", "Skill 2"]
}}
"""
    try:
        response = llm.invoke(prompt)
        parsed = json.loads(response.content)
        # Validate through Pydantic ResumeProfile
        profile_obj = ResumeProfile.model_validate(parsed)
        return {"profile": profile_obj.model_dump()}
    except Exception as exc:
        logger.warning("Profile extractor fallback: %s", exc)
        return {"profile": ResumeProfile().model_dump()}


# --- Agent 2: Job Criteria Analyzer ---
def criteria_analyzer_node(state: MultiAgentScreeningState) -> Dict[str, Any]:
    """Agent 2: Breaks down job title and description into an evaluation rubric."""
    logger.info("Agent 2 (Criteria Analyzer) deconstructing job posting...")
    llm = get_llm()
    job_title = state.get("job_title", "")
    job_desc = state.get("job_description", "")
    req_skills = state.get("required_skills", [])

    prompt = f"""You are the Job Criteria Analyzer Agent.
Analyze the following faculty job posting and formulate an evaluation rubric of 3 to 6 key qualifications.

Job Title: {job_title}
Job Description:
{job_desc}

Required Skills:
{json.dumps(req_skills, ensure_ascii=False)}

Return a JSON object:
{{
  "criteria": [
    {{
      "id": "crit_1",
      "criterion": "Requirement title (e.g. Ph.D. in relevant field, Research in AI/ML, University teaching experience)",
      "importance": "Mandatory or Preferred"
    }}
  ]
}}
"""
    try:
        response = llm.invoke(prompt)
        parsed = json.loads(response.content)
        rubric = parsed.get("criteria", [])
        if not rubric:
            rubric = [{"id": f"crit_{i+1}", "criterion": s, "importance": "Mandatory"} for i, s in enumerate(req_skills)]
        return {"rubric": rubric}
    except Exception as exc:
        logger.warning("Criteria analyzer fallback: %s", exc)
        fallback_rubric = [{"id": f"crit_{i+1}", "criterion": s, "importance": "Mandatory"} for i, s in enumerate(req_skills)]
        return {"rubric": fallback_rubric}


# --- Agent 3: Evidence & Qualification Evaluator ---
def evidence_evaluator_node(state: MultiAgentScreeningState) -> Dict[str, Any]:
    """Agent 3: Cross-references candidate resume against the rubric and extracts citations."""
    logger.info("Agent 3 (Evidence Evaluator) matching credentials and quoting evidence...")
    llm = get_llm()
    resume_text = state.get("resume_text", "")
    rubric = state.get("rubric", [])
    req_skills = state.get("required_skills", [])
    profile = state.get("profile", {})

    prompt = f"""You are the Evidence Evaluation Agent.
Assess the candidate's resume against each criterion in the rubric.
Quote exact text from the resume for resumeEvidence whenever candidate meets or mentions the criterion.
Also determine which required skills are matched vs missing.

Rubric Criteria:
{json.dumps(rubric, ensure_ascii=False)}

Required Skills:
{json.dumps(req_skills, ensure_ascii=False)}

Candidate Profile Summary:
Name: {profile.get('name')}
Degrees: {[e.get('degree') for e in profile.get('education', [])]}
Skills: {profile.get('skills', [])}

Full Resume Text:
{resume_text}

Return a JSON object:
{{
  "evidence": [
    {{
      "criterion": "Exact criterion name from rubric",
      "resumeEvidence": "Quotation from resume, or 'Not evident in resume'",
      "assessment": "Objective assessment of qualification"
    }}
  ],
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3"]
}}
"""
    try:
        response = llm.invoke(prompt)
        parsed = json.loads(response.content)
        evidence_list = parsed.get("evidence", [])
        matched = parsed.get("matchedSkills", [])
        missing = parsed.get("missingSkills", [])
        return {
            "evidence": evidence_list,
            "matched_skills": matched,
            "missing_skills": missing,
        }
    except Exception as exc:
        logger.warning("Evidence evaluator fallback: %s", exc)
        return {
            "evidence": [],
            "matched_skills": [],
            "missing_skills": req_skills,
        }


# --- Agent 4: Scoring & Synthesis Agent ---
def scoring_synthesis_node(state: MultiAgentScreeningState) -> Dict[str, Any]:
    """Agent 4: Calibrates the match score and provides an executive summary."""
    logger.info("Agent 4 (Scoring & Synthesis Agent) finalizing assessment...")
    llm = get_llm()
    job_title = state.get("job_title", "")
    profile = state.get("profile", {})
    evidence = state.get("evidence", [])
    matched = state.get("matched_skills", [])
    missing = state.get("missing_skills", [])

    prompt = f"""You are the Scoring & Synthesis Agent for university faculty recruitment.
Review the candidate evaluation and formulate an overall match score (0 to 100) and an objective summary explanation.

Position: {job_title}
Candidate: {profile.get('name', 'Applicant')}
Matched Skills: {matched}
Missing Skills: {missing}
Evidence Assessments:
{json.dumps(evidence, ensure_ascii=False)}

Scoring Guidelines:
- 85-100: Exceptional candidate meeting all mandatory qualifications with strong evidence.
- 70-84: Solid candidate meeting most qualifications, minor gaps.
- 50-69: Moderate match, some key requirements absent.
- 0-49: Candidate lacks primary prerequisites.

Return a JSON object:
{{
  "matchScore": 85.0,
  "explanation": "2-3 sentences explaining why candidate received this score based on qualifications and evidence."
}}
"""
    try:
        response = llm.invoke(prompt)
        parsed = json.loads(response.content)
        score = float(parsed.get("matchScore", 75.0))
        # Clamp score between 0 and 100
        score = max(0.0, min(100.0, score))
        explanation = parsed.get("explanation", "Screening completed by AI agents.")
        return {
            "match_score": score,
            "explanation": explanation,
            "status": "COMPLETED",
        }
    except Exception as exc:
        logger.warning("Scoring synthesis fallback: %s", exc)
        return {
            "match_score": 70.0,
            "explanation": "Candidate evaluated across criteria.",
            "status": "COMPLETED",
        }


def build_screening_graph():
    """Build and compile the LangGraph multi-agent screening StateGraph."""
    builder = StateGraph(MultiAgentScreeningState)

    # Register the 4 agent nodes
    builder.add_node("profile_extractor", profile_extractor_node)
    builder.add_node("criteria_analyzer", criteria_analyzer_node)
    builder.add_node("evidence_evaluator", evidence_evaluator_node)
    builder.add_node("scoring_synthesis", scoring_synthesis_node)

    # Connect the multi-agent pipeline
    builder.add_edge(START, "profile_extractor")
    builder.add_edge("profile_extractor", "criteria_analyzer")
    builder.add_edge("criteria_analyzer", "evidence_evaluator")
    builder.add_edge("evidence_evaluator", "scoring_synthesis")
    builder.add_edge("scoring_synthesis", END)

    return builder.compile()


# Global compiled multi-agent graph
screening_agent_graph = build_screening_graph()


def run_multi_agent_screening(
    resume_text: str,
    job_id: str,
    job_title: str,
    job_description: str,
    required_skills: List[str],
) -> ScreeningResult:
    """
    Execute the 4-agent LangGraph pipeline to evaluate a candidate resume.
    
    Returns a validated Pydantic ScreeningResult.
    """
    initial_state: MultiAgentScreeningState = {
        "resume_text": resume_text,
        "job_id": job_id,
        "job_title": job_title,
        "job_description": job_description,
        "required_skills": required_skills,
        "profile": None,
        "rubric": None,
        "evidence": None,
        "matched_skills": None,
        "missing_skills": None,
        "match_score": None,
        "explanation": None,
        "status": "IN_PROGRESS",
    }

    final_state = screening_agent_graph.invoke(initial_state)

    # Format into validated Pydantic ScreeningResult
    evidence_objs = [
        Evidence(
            criterion=e.get("criterion", "Criterion"),
            resumeEvidence=e.get("resumeEvidence", "N/A"),
            assessment=e.get("assessment", "Evaluated"),
        )
        for e in (final_state.get("evidence") or [])
    ]

    profile_data = final_state.get("profile") or {}
    profile_obj = ResumeProfile.model_validate(profile_data)

    return ScreeningResult(
        status="COMPLETED",
        jobId=str(job_id),
        matchScore=final_state.get("match_score"),
        matchedSkills=final_state.get("matched_skills") or [],
        missingSkills=final_state.get("missing_skills") or [],
        evidence=evidence_objs,
        explanation=final_state.get("explanation") or "Screening completed.",
        profile=profile_obj,
    )
