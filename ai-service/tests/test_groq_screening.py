import io
import json
from unittest.mock import MagicMock, patch
import fitz
import groq
import pytest
from docx import Document
from fastapi.testclient import TestClient
from main import app
from schemas.resumes import ScreeningResult
from services.document_phaser import extract_resume_text, extract_text_from_pdf, extract_text_from_docx

client = TestClient(app)

SAMPLE_VALID_SCREENING_PAYLOAD = {
    "status": "COMPLETED",
    "jobId": "JOB-101",
    "matchScore": 88.5,
    "matchedSkills": ["Python", "Machine Learning"],
    "missingSkills": ["Cloud Architecture"],
    "evidence": [
        {
            "criterion": "Python proficiency",
            "resumeEvidence": "5 years Python development in AI",
            "assessment": "Strong match"
        }
    ],
    "explanation": "Candidate has strong academic and research credentials.",
    "profile": {
        "name": "Dr. Jane Doe",
        "email": "jane.doe@university.edu",
        "education": [
            {
                "degree": "Ph.D.",
                "institution": "Tech University",
                "field": "Computer Science",
                "year": "2022"
            }
        ],
        "experience": [
            {
                "role": "Postdoctoral Researcher",
                "organization": "AI Lab",
                "duration": "2022-2025",
                "description": "Research in NLP and ML"
            }
        ],
        "research_interests": ["Machine Learning", "NLP"],
        "publications": ["Doe et al., 2024, NeurIPS"],
        "certifications": ["AWS Certified ML"],
        "skills": ["Python", "PyTorch", "FastAPI"]
    }
}


def make_sample_pdf(text: str = "Dr. Jane Doe\nPh.D. in Computer Science\nSkills: Python, Machine Learning") -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 72), text)
    data = doc.tobytes()
    doc.close()
    return data


def make_sample_docx(paragraphs: list[str] = None) -> bytes:
    if paragraphs is None:
        paragraphs = ["Dr. Jane Doe", "Ph.D. in Computer Science", "Skills: Python, Machine Learning"]
    doc = Document()
    for p in paragraphs:
        doc.add_paragraph(p)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def test_pdf_extraction_contains_real_newlines():
    pdf_bytes = make_sample_pdf("Line One\nLine Two\nLine Three")
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(pdf_bytes)
        f_path = f.name
    try:
        text = extract_resume_text(f_path)
        assert "Line One" in text
        assert "Line Two" in text
        # Must not contain escaped literal backslash-n
        assert "\\n" not in text
        assert "\n" in text
    finally:
        if os.path.exists(f_path):
            os.remove(f_path)


def test_docx_extraction_contains_real_newlines():
    docx_bytes = make_sample_docx(["Line One", "Line Two"])
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        f.write(docx_bytes)
        f_path = f.name
    try:
        text = extract_resume_text(f_path)
        assert "Line One" in text
        assert "Line Two" in text
        assert "\\n" not in text
        assert "\n" in text
    finally:
        if os.path.exists(f_path):
            os.remove(f_path)


def test_missing_api_key(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "")
    pdf_bytes = make_sample_pdf()
    response = client.post(
        "/api/v1/screen-resume",
        data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
    )
    assert response.status_code == 503
    assert "GROQ_API_KEY is not configured" in response.json()["detail"]


def test_successful_screening_mocked_groq():
    pdf_bytes = make_sample_pdf()
    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps(SAMPLE_VALID_SCREENING_PAYLOAD)
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_completion
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={
                "job_id": "JOB-101",
                "job_title": "Assistant Professor - CSE",
                "job_description": "PhD in CSE required",
                "required_skills": json.dumps(["Python", "Machine Learning"]),
            },
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "COMPLETED"
        assert data["jobId"] == "JOB-101"
        assert data["matchScore"] == 88.5
        assert "Python" in data["matchedSkills"]
        assert len(data["evidence"]) >= 1
        assert data["profile"]["name"] == "Dr. Jane Doe"
        # Validate against Pydantic schema
        validated = ScreeningResult.model_validate(data)
        assert validated.jobId == "JOB-101"


def test_invalid_credentials_error():
    pdf_bytes = make_sample_pdf()
    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = groq.AuthenticationError(
            message="Invalid API key",
            response=MagicMock(status_code=401),
            body={"error": {"message": "Invalid API key"}},
        )
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 502
        assert "Groq authentication failed" in response.json()["detail"]


def test_unsupported_model_error():
    pdf_bytes = make_sample_pdf()
    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = groq.NotFoundError(
            message="Model non-existent-model not found",
            response=MagicMock(status_code=404),
            body={"error": {"message": "Model not found"}},
        )
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 502
        assert "unsupported" in response.json()["detail"] or "not found" in response.json()["detail"]


def test_rate_limit_error():
    pdf_bytes = make_sample_pdf()
    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = groq.RateLimitError(
            message="Rate limit reached",
            response=MagicMock(status_code=429),
            body={"error": {"message": "Rate limit reached"}},
        )
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 429
        assert "rate limit" in response.json()["detail"].lower()


def test_timeout_error():
    pdf_bytes = make_sample_pdf()
    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = groq.APITimeoutError(
            request=MagicMock()
        )
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 504
        assert "timeout" in response.json()["detail"].lower()


def test_malformed_json_from_model():
    pdf_bytes = make_sample_pdf()
    mock_choice = MagicMock()
    mock_choice.message.content = "This is plain text and definitely not JSON."
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_completion
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 502
        assert "valid JSON" in response.json()["detail"] or "schema" in response.json()["detail"]


def test_schema_validation_failure_from_model():
    pdf_bytes = make_sample_pdf()
    # Missing required profile, matchScore out of range
    bad_payload = {
        "status": "COMPLETED",
        "jobId": "JOB-101",
        "matchScore": 999.0,  # Invalid: le=100
        "explanation": "Score invalid",
        "profile": {}
    }
    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps(bad_payload)
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_completion
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 502
        assert "validation" in response.json()["detail"].lower()


def test_empty_uploaded_file_rejected():
    response = client.post(
        "/api/v1/screen-resume",
        data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
        files={"file": ("empty.pdf", b"", "application/pdf")},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_scanned_or_empty_text_pdf_rejected():
    # PDF with blank page (no text)
    doc = fitz.open()
    doc.new_page()
    blank_pdf = doc.tobytes()
    doc.close()

    response = client.post(
        "/api/v1/screen-resume",
        data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
        files={"file": ("blank.pdf", blank_pdf, "application/pdf")},
    )
    assert response.status_code == 422
    assert "No readable text was found" in response.json()["detail"]


def test_temporary_file_cleanup_on_request():
    pdf_bytes = make_sample_pdf()
    created_temp_files = []
    real_named_temp = __import__("tempfile").NamedTemporaryFile

    def tracking_temp_file(*args, **kwargs):
        temp = real_named_temp(*args, **kwargs)
        created_temp_files.append(temp.name)
        return temp

    with patch("routers.resumes.tempfile.NamedTemporaryFile", side_effect=tracking_temp_file):
        response = client.post(
            "/api/v1/screen-resume",
            data={"job_id": "JOB-101", "job_title": "Professor", "job_description": "Faculty role"},
            files={"file": ("blank.pdf", b"corrupt binary data not pdf", "application/pdf")},
        )
        # Check that the created temp file was unlinked/deleted
        import os
        assert len(created_temp_files) == 1
        assert not os.path.exists(created_temp_files[0])


def test_batch_zip_upload_and_extraction():
    import zipfile
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        pdf_1 = make_sample_pdf("Dr. Alice Morgan\nPh.D. in Computer Science")
        pdf_2 = make_sample_pdf("Dr. Bob Johnson\nPh.D. in Data Science")
        zf.writestr("alice.pdf", pdf_1)
        zf.writestr("bob.pdf", pdf_2)
    zip_data = zip_buf.getvalue()

    response = client.post(
        "/api/v1/screen-resume/upload-zip",
        files={"file": ("batch.zip", zip_data, "application/zip")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    names = [r["candidateName"] for r in data["resumes"]]
    assert any("Alice" in n for n in names)
    assert any("Bob" in n for n in names)


def test_screen_text_endpoint_numeric_id():
    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps(SAMPLE_VALID_SCREENING_PAYLOAD)
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    with patch("agents.screening_agent.get_groq_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_completion
        mock_get_client.return_value = mock_client

        response = client.post(
            "/api/v1/screen-resume/screen-text",
            json={
                "job_id": "1",  # Purely numeric job ID
                "job_title": "Assistant Professor",
                "job_description": "Ph.D. required",
                "required_skills": ["Python", "Machine Learning"],
                "resume_text": "Dr. Jane Doe\nPh.D. in Computer Science",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["jobId"] == "1"
        assert data["status"] == "COMPLETED"
