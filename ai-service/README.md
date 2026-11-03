# AI ATS Resume Screening Microservice (LangGraph + Groq + Offline Local LLM)

This FastAPI microservice receives PDF or DOCX resumes (individually or in batch ZIP archives), extracts text with reliable whitespace and formatting preservation, and performs structured academic faculty evaluations against job postings.

The service supports two primary execution modes:
1. **Primary Cloud Mode:** High-speed cloud evaluation via Groq API (`openai/gpt-oss-20b`) with sub-2-second latency.
2. **Offline Air-Gapped Mode:** Zero-network local evaluation via Ollama (`llama3.2:3b`) with instant deterministic rule-based safety engine fallback (<20ms).

---

## 1. Quick Start

### Step 1: Navigate and Setup Virtual Environment
```bash
cd ai-service
python -m venv .venv

# Windows:
.\.venv\Scripts\activate

# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Configure Environment (.env)
```dotenv
# Cloud Primary (Groq)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
MAX_RESUME_SIZE_MB=10

# Backend Mode: 'groq' (default), 'local' (offline), or 'auto' (fallback on network loss)
ANALYZER_BACKEND=groq

# Local Offline Engine (Ollama)
OLLAMA_HOST=http://127.0.0.1:11434
LOCAL_LLM_MODEL=llama3.2:3b
LOCAL_LLM_TIMEOUT=60.0
```

### Step 3: Launch Service
```bash
# Standard Online Launch:
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# Or use dedicated batch scripts:
# scripts\start_ai.bat          (Cloud Groq mode)
# scripts\start_ai_offline.bat  (Local Ollama / Offline mode)
```

- **Health Check:** `http://127.0.0.1:8001/health`
- **Interactive Swagger Docs:** `http://127.0.0.1:8001/docs`

---

## 2. Academic Recruiter Features

- **Three-Pillar Scoring:** Produces individual ratings for `teachingScore`, `researchScore`, and `domainScore`, plus an overall weighted score.
- **Discipline-Aware Degree Alignment:** Recognizes terminal doctoral degrees in allied STEM fields (Applied Math, Computational Science, Physics, EE) and awards 75% transfer credit instead of reporting false-negative "missing PhD" errors.
- **Course Teaching Feasibility:** Returns lists of `day1Ready` foundational courses and `curriculumGaps`.
- **Search Committee Probing Questions:** Generates 3 tailored interview questions per candidate.

---

## 3. Automated Tests

Run the full pytest suite:
```bash
python -m pytest -v
```

**22 / 22 Tests Passing:**
- `tests/test_endpoint_validation.py`: Input schema validation and unsupported file rejections.
- `tests/test_groq_screening.py`: Mocked multi-agent screening, rate limit handling, network timeout handling, and temporary file cleanups.
- `tests/test_health.py`: Service health endpoint.
- `tests/test_offline_analyzer.py`: Deterministic academic engine, offline backend routing, automated network fallback, and offline text screening.
