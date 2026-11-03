import os
import pytest
from fastapi.testclient import TestClient

from main import app
from schemas.resumes import ScreeningResult
from agents.offline_analyzer import screen_with_deterministic_engine, run_offline_screening
from agents.screening_agent import screen_resume

client = TestClient(app)

SAMPLE_RESUME = """
Dr. Alan Turing
Email: alan.turing@cambridge.ac.uk
Phone: +44-123-456789

Education:
Ph.D. in Mathematics from Cambridge University, 1938
Bachelor of Science from King's College

Experience:
Assistant Professor in Mathematics (1948-1954)
Cryptanalyst at Government Code and Cypher School (1939-1945)
Over 8 years higher education teaching experience; ABET readiness

Skills:
Algorithms, Theoretical Computer Science, Machine Learning, Python, Cryptanalysis

Publications:
On Computable Numbers, with an Application to the Entscheidungsproblem (1936)
Computing Machinery and Intelligence (1950)
"""

JOB_TITLE = "Assistant Professor - Artificial Intelligence & Theoretical CS"
JOB_DESC = "Seeking candidates with a Ph.D. in Computer Science or Mathematics. Must have strong background in Algorithms, Machine Learning, and Python teaching experience."
SKILLS = ["Algorithms", "Machine Learning", "Python", "Teaching"]


def test_deterministic_offline_screening():
    result = screen_with_deterministic_engine(
        resume_text=SAMPLE_RESUME,
        job_id="JOB-OFFLINE-1",
        job_title=JOB_TITLE,
        job_description=JOB_DESC,
        required_skills=SKILLS,
    )

    assert isinstance(result, ScreeningResult)
    assert result.status == "COMPLETED"
    assert result.jobId == "JOB-OFFLINE-1"
    assert result.matchScore is not None
    assert 50.0 <= result.matchScore <= 100.0
    assert "Algorithms" in result.matchedSkills
    assert "Machine Learning" in result.matchedSkills
    assert "Python" in result.matchedSkills
    assert len(result.evidence) >= 1
    assert "Alan Turing" in result.profile.name
    assert "alan.turing@cambridge.ac.uk" in result.profile.email
    assert any("Ph.D" in e.degree for e in result.profile.education)
    assert result.academicBreakdown is not None
    assert result.academicBreakdown.teachingScore is not None
    assert result.academicBreakdown.researchScore is not None
    assert len(result.committeeQuestions) >= 1


def test_offline_mode_via_backend_env(monkeypatch):
    monkeypatch.setenv("ANALYZER_BACKEND", "local")
    monkeypatch.setenv("GROQ_API_KEY", "")
    monkeypatch.setenv("OLLAMA_HOST", "http://127.0.0.1:1")

    result = screen_resume(
        resume_text=SAMPLE_RESUME,
        job_id="JOB-OFFLINE-2",
        job_title=JOB_TITLE,
        job_description=JOB_DESC,
        required_skills=SKILLS,
    )

    assert isinstance(result, ScreeningResult)
    assert result.jobId == "JOB-OFFLINE-2"
    assert result.matchScore is not None
    assert len(result.matchedSkills) > 0


def test_auto_mode_without_groq_key_falls_back(monkeypatch):
    monkeypatch.setenv("ANALYZER_BACKEND", "auto")
    monkeypatch.setenv("GROQ_API_KEY", "")
    monkeypatch.setenv("OLLAMA_HOST", "http://127.0.0.1:1")

    result = screen_resume(
        resume_text=SAMPLE_RESUME,
        job_id="JOB-OFFLINE-3",
        job_title=JOB_TITLE,
        job_description=JOB_DESC,
        required_skills=SKILLS,
    )

    assert isinstance(result, ScreeningResult)
    assert result.jobId == "JOB-OFFLINE-3"
    assert result.matchScore >= 50.0


def test_screen_text_endpoint_offline(monkeypatch):
    monkeypatch.setenv("ANALYZER_BACKEND", "offline")
    monkeypatch.setenv("GROQ_API_KEY", "")
    monkeypatch.setenv("OLLAMA_HOST", "http://127.0.0.1:1")

    payload = {
        "job_id": "JOB-OFFLINE-4",
        "job_title": JOB_TITLE,
        "job_description": JOB_DESC,
        "required_skills": SKILLS,
        "resume_text": SAMPLE_RESUME,
    }

    response = client.post("/api/v1/screen-resume/screen-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert data["jobId"] == "JOB-OFFLINE-4"
    assert data["matchScore"] is not None
    assert "Python" in data["matchedSkills"]
