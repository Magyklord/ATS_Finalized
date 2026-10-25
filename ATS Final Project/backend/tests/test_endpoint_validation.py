from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_rejects_unsupported_extension():
    response = client.post(
        "/api/v1/screen-resume",
        data={"job_id":"1", "job_title":"Engineer", "job_description":"Python"},
        files={"file":("resume.txt", b"some content", "text/plain")},
    )
    assert response.status_code == 415

def test_required_fields_validation():
    response = client.post(
        "/api/v1/screen-resume",
        data={"job_id":"1"},
        files={"file":("resume.pdf", b"sample", "application/pdf")},
    )
    assert response.status_code == 422
