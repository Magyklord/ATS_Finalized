# AI ATS Resume Screening Microservice (LangGraph + Groq Integration)

This FastAPI microservice receives real PDF or DOCX resumes (individually or in batch ZIP archives), extracts text with reliable whitespace and newlines, and uses an autonomous **LangGraph 4-Agent pipeline** powered by Groq (`openai/gpt-oss-20b`) to perform structured screening against faculty job postings.

The Java Spring Boot backend remains the system of record for PostgreSQL data, candidate records, and persistence.

---

## 1. Quick Start

### Prerequisites
- Python 3.10+ installed
- A Groq API key (sign up at [console.groq.com](https://console.groq.com/keys))

### Step 1: Navigate to AI Service Directory
```bash
cd ai-service
```

### Step 2: Create and Activate Virtual Environment
```bash
python -m venv .venv

# Windows:
.\.venv\Scripts\activate

# Linux/macOS:
source .venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```
*(Note: `requirements.txt` is also accessible directly from the repository root)*

### Step 4: Configure Environment Variables
Create `.env` (or place it at the root folder):
```dotenv
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
MAX_RESUME_SIZE_MB=10
```

### Step 5: Start the Microservice
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

- **Health Check:** `http://127.0.0.1:8001/health`
- **Swagger Interactive Docs:** `http://127.0.0.1:8001/docs`

---

## 2. API Endpoints

### `GET /health`
Returns service status.

### `POST /api/v1/screen-resume`
Screens an individual uploaded resume (`multipart/form-data`):
- `file`: PDF or DOCX resume
- `job_id`: numeric string (e.g. `"1"`)
- `job_title`: string (e.g. `"Assistant Professor - Computer Science"`)
- `job_description`: string (job requirements, responsibilities, qualifications)
- `required_skills`: JSON array of strings (e.g. `'["Python", "Machine Learning", "Ph.D."]'`)

### `POST /api/v1/screen-resume/upload-zip`
Uploads a `.zip` archive containing multiple PDF/DOCX resumes, automatically unzips, parses text, and returns candidates ready for batch or one-by-one screening.

### `POST /api/v1/screen-resume/screen-text`
Screens extracted resume text directly using numeric `job_id`.

---

## 3. Running Automated Tests

Run the full pytest suite with verbose output:
```bash
python -m pytest -v
```

All 18 unit and integration tests run with mocked calls, validating:
- Service health endpoint
- Missing / invalid API key error handling (HTTP 503 / 502)
- Rate limiting and quota handling (HTTP 429)
- Connection timeout handling (HTTP 504)
- Model errors & schema validation failures (HTTP 502)
- Real PDF and DOCX text extraction with valid newlines
- Batch ZIP archive extraction and error recovery
- Numeric job ID handling
- Temporary file cleanup on Windows
