# AI ATS Resume Screening Microservice (Groq Integration)

This FastAPI microservice receives a real PDF or DOCX resume, extracts text with reliable whitespace and newlines, and uses the **Groq API** (`openai/gpt-oss-20b` or another configured model) to perform structured screening against faculty job postings.

The Java Spring Boot backend remains the system of record for PostgreSQL data, candidate records, and persistence.

---

## 1. Quick Start (Windows PowerShell)

### Prerequisites
- Python 3.10+ installed
- A Groq API key (sign up at [console.groq.com](https://console.groq.com/keys))

### Step 1: Navigate to Backend
```powershell
cd "ATS Final Project\backend"
```

### Step 2: Create and Activate Virtual Environment
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Edit `.env` to include your Groq credentials:
```dotenv
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
MAX_RESUME_SIZE_MB=10
```

### Step 5: Start the Service
```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

- **Health Check:** `http://127.0.0.1:8001/health`
- **Swagger Docs:** `http://127.0.0.1:8001/docs`

---

## 2. API Endpoints

### `GET /health`
Returns service status.
```json
{
  "status": "ok",
  "service": "resume-screening"
}
```

### `POST /api/v1/screen-resume`
Accepts `multipart/form-data`:
- `file`: PDF or DOCX resume (max size configured via `MAX_RESUME_SIZE_MB`, defaults to 10 MB)
- `job_id`: string (e.g. `"JOB-101"`)
- `job_title`: string (e.g. `"Assistant Professor - Computer Science"`)
- `job_description`: string (job requirements, responsibilities, qualifications)
- `required_skills`: JSON array of strings (e.g. `'["Python", "Machine Learning", "Ph.D."]'`)

#### Example cURL Command:
```bash
curl -X POST http://127.0.0.1:8001/api/v1/screen-resume \
  -F "file=@candidate_resume.pdf" \
  -F "job_id=JOB-101" \
  -F "job_title=Assistant Professor - Computer Science" \
  -F "job_description=Tenure-track faculty position. Requires Ph.D. in CS, teaching excellence, and research in AI/ML." \
  -F 'required_skills=["Python","Machine Learning","Teaching","Ph.D."]'
```

---

## 3. Running Automated Tests

Run the full pytest suite with verbose output:
```powershell
pytest -v
```

All 16 unit and integration tests run with mocked Groq calls, validating:
- Service health endpoint
- Missing / invalid API key error handling (HTTP 503 / 502)
- Rate limiting and quota handling (HTTP 429)
- Connection timeout handling (HTTP 504)
- Model errors & schema validation failures (HTTP 502)
- Real PDF and DOCX text extraction with valid newlines
- Temporary file cleanup on Windows
