import json
import pymupdf as fitz
from fastapi.testclient import TestClient
from main import app
from schemas.resumes import ScreeningResult

client = TestClient(app)

# Generate a sample faculty resume PDF in memory
doc = fitz.open()
page = doc.new_page()
resume_text = """
Dr. Marcus Vance
Email: marcus.vance@academic.edu
Phone: (555) 019-2834

EDUCATION:
- Ph.D. in Computer Science, Stanford University, 2021
- M.S. in Software Engineering, Carnegie Mellon University, 2017
- B.S. in Computer Science, UC Berkeley, 2015

RESEARCH INTERESTS:
Distributed Systems, Artificial Intelligence, Machine Learning, Cloud Computing

ACADEMIC & TEACHING EXPERIENCE:
- Postdoctoral Fellow, MIT CSAIL (2021 - Present)
  Taught undergraduate course 'Introduction to Machine Learning' (CS 189).
  Mentored 6 graduate students in AI systems research.
- Graduate Teaching Assistant, Stanford University (2018 - 2021)
  Conducted recitations and lab sessions for Advanced Algorithms and Operating Systems.

PUBLICATIONS:
- Vance, M., et al. (2023). "Scalable Distributed Training on Heterogeneous Accelerators." OSDI 2023.
- Vance, M. & Smith, K. (2022). "Fault-Tolerant Consensus in Agent Networks." NeurIPS 2022.

SKILLS:
Python, PyTorch, C++, Distributed Systems, Cloud Architecture, Teaching, Research
"""
page.insert_text((50, 72), resume_text)
pdf_bytes = doc.tobytes()
doc.close()

faculty_job = {
    "job_id": "JOB-FACULTY-2026-01",
    "job_title": "Assistant Professor of Computer Science",
    "job_description": (
        "The Department of Computer Science invites applications for a tenure-track Assistant Professor position. "
        "Candidates must hold a Ph.D. in Computer Science or related field by start date. "
        "Demonstrated excellence in research in AI/ML or Distributed Systems and strong commitment to undergraduate teaching required."
    ),
    "required_skills": json.dumps(["Python", "Machine Learning", "Distributed Systems", "Teaching", "Ph.D."])
}

print("Executing live screening request via Groq API...")
response = client.post(
    "/api/v1/screen-resume",
    data=faculty_job,
    files={"file": ("dr_marcus_vance_cv.pdf", pdf_bytes, "application/pdf")}
)

print("HTTP Status Code:", response.status_code)
if response.status_code == 200:
    data = response.json()
    print("\n--- Live Groq Screening Result ---")
    print("Status:", data.get("status"))
    print("Job ID:", data.get("jobId"))
    print("Match Score:", data.get("matchScore"))
    print("Matched Skills:", data.get("matchedSkills"))
    print("Missing Skills:", data.get("missingSkills"))
    print("Candidate Name:", data.get("profile", {}).get("name"))
    print("Candidate Email:", data.get("profile", {}).get("email"))
    print("Education Count:", len(data.get("profile", {}).get("education", [])))
    print("Experience Count:", len(data.get("profile", {}).get("experience", [])))
    print("Explanation:", data.get("explanation")[:180] + "...")
    print("Evidence Items:", len(data.get("evidence", [])))

    # Schema validation
    validated = ScreeningResult.model_validate(data)
    print("\nPydantic Validation SUCCESSFUL: Validated model type is", type(validated).__name__)
else:
    print("Response Body:", response.text)
