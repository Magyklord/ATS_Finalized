# Agentic AI-Based Recruitment and Resume Shortlisting System (FacultyHire)

An enterprise-grade, multi-agent AI-assisted recruitment platform designed for university faculty hiring. The system features:
- **Java Spring Boot System of Record:** Permanent database persistence, candidate registry, and job management.
- **Python FastAPI + LangGraph Multi-Agent AI Microservice:** Autonomous 4-agent resume evaluation pipeline with strict JSON schema validation.
- **React 18 + Vite Frontend Portal:** Batch ZIP resume uploads, single candidate screening, queue orchestration, and 1-click database registration.
- **Zero-Friction Portability:** Runs seamlessly on any Windows, macOS, or Linux device. If PostgreSQL is running, it connects automatically; if PostgreSQL is not installed, it falls back to an embedded in-memory database with zero crashes!

---

## 1. Project Directory Structure

The repository is organized into a clean, standard mono-repo layout with no nested spaces:

```text
AI_RecruitmentService/
├── requirements.txt            # Root Python dependencies (run pip install from here!)
├── package.json                # Root frontend scripts (run npm install/dev from here!)
├── .env.example                # Root environment template
├── start_all.bat               # 1-Click launcher for Windows
├── start_all.sh                # 1-Click launcher for Linux / macOS
│
├── ai-service/                 # Python FastAPI AI Microservice (Port 8001)
│   ├── agents/
│   │   ├── multi_agent_graph.py# LangGraph 4-agent state pipeline
│   │   └── screening_agent.py  # LLM client, structured outputs & schema validation
│   ├── routers/
│   │   └── resumes.py          # Single, batch ZIP, and text screening endpoints
│   ├── schemas/
│   │   └── resumes.py          # Pydantic schemas (ScreeningResultResponse, etc.)
│   ├── services/
│   │   └── document_phaser.py  # PyMuPDF (PDF) & python-docx extraction engine
│   ├── tests/                  # 18 passing automated unit & integration tests
│   ├── main.py                 # FastAPI application entry point
│   ├── pytest.ini              # Pytest configuration
│   └── requirements.txt        # Service-level dependencies
│
├── frontend/                   # React 18 + Vite Web Application (Port 5173)
│   ├── src/
│   │   ├── App.jsx             # Dashboard, Jobs, Candidates, & Batch AI Screening UI
│   │   ├── App.css             # Enterprise styling
│   │   └── main.jsx
│   ├── vite.config.js          # Reverse proxy: /api -> 8080, /api/v1 -> 8001
│   └── package.json            # React frontend dependencies
│
├── pom.xml                     # Java Spring Boot Maven configuration (Java 17 LTS baseline)
├── mvnw / mvnw.cmd             # Maven wrappers
└── src/                        # Java Spring Boot source code (Port 8080)
    ├── main/java/com/recruitment/recruitment_system/
    │   ├── candidate/          # Candidate entity, repository, service, controller
    │   ├── job/                # Job entity, repository, service, controller
    │   ├── resume/             # File storage & metadata management
    │   ├── screening/          # Screening result persistence
    │   └── RecruitmentSystemApplication.java
    └── main/resources/
        ├── application.properties    # PostgreSQL configuration (default password: varun2006)
        └── application-h2.properties # Automatic in-memory database fallback profile
```

---

## 2. Quick Start on Any Device (1-Click)

### Windows
Double-click `start_all.bat` or run from Command Prompt:
```cmd
start_all.bat
```

**What `start_all.bat` automatically handles:**
1. **First-Time Setup:** Checks if Python `.venv` or React `node_modules` are missing and installs them automatically.
2. **JDK Detection:** Searches for installed JDKs (Adoptium, Temurin, Oracle, Corretto, Microsoft) and configures `JAVA_HOME`.
3. **Database Detection:**
   - If **PostgreSQL is running on port 5432**: connects to PostgreSQL and creates `recruitment_db` if needed.
   - If **PostgreSQL is NOT installed or stopped**: automatically starts with the embedded H2 database (PostgreSQL mode) so everything works with zero manual database configuration!
4. **Launches All 3 Services:**
   - **Terminal 1:** Python AI Microservice (`http://127.0.0.1:8001/docs`)
   - **Terminal 2:** Java Spring Boot Backend (`http://127.0.0.1:8080`)
   - **Terminal 3:** React Web Portal (`http://localhost:5173`)
5. Opens `http://localhost:5173` in your default browser.

### Linux / macOS
```bash
chmod +x start_all.sh
./start_all.sh
```

---

## 3. Manual Step-by-Step Setup

If you prefer starting services manually or configuring each component individually:

### Step 1: Python AI Microservice (Port 8001)
You can now install dependencies directly from the **root folder**:
```bash
# 1. Create and activate a virtual environment
python -m venv ai-service/.venv

# Windows:
ai-service\.venv\Scripts\activate
# Linux/macOS:
source ai-service/.venv/bin/activate

# 2. Install dependencies (accessible from root or ai-service/)
pip install -r requirements.txt

# 3. Configure .env (create .env at root or inside ai-service/)
# GROQ_API_KEY=your_groq_api_key_here
# GROQ_MODEL=openai/gpt-oss-20b

# 4. Start the service
cd ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### Step 2: Java Spring Boot Backend (Port 8080)
From the repository root:
```bash
# Option A: With PostgreSQL (port 5432 running)
# Windows:
set DB_PASSWORD=your_password
mvnw.cmd spring-boot:run

# Linux/macOS:
export DB_PASSWORD=your_password
./mvnw spring-boot:run

# Option B: Without PostgreSQL (using automatic in-memory H2 database)
# Windows:
mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=h2

# Linux/macOS:
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=h2
```

### Step 3: React Frontend (Port 5173)
You can run frontend commands directly from the **root folder** or from `frontend/`:
```bash
# From root folder:
npm install
npm run dev

# Or from frontend/ folder:
cd frontend
npm install
npm run dev
```

---

## 4. Multi-Agent AI Screening Pipeline

The AI microservice implements an autonomous **LangGraph 4-Agent State Machine**:

```mermaid
flowchart LR
    A["Resume (PDF / DOCX)"] --> B["1. Profile Extractor"]
    B --> C["2. Criteria Analyzer"]
    C --> D["3. Evidence Evaluator"]
    D --> E["4. Scoring Synthesis"]
    E --> F["Structured Result (JSON)"]
```

1. **Profile Extractor Agent:** Parses raw resume text to extract candidate name, contact information, academic degrees, research specializations, and years of experience.
2. **Criteria Analyzer Agent:** Evaluates candidate credentials against the job posting description and required competencies, categorizing skills into `matched_skills` and `missing_skills`.
3. **Evidence Evaluator Agent:** Gathers direct citations, publications, and specific project references from the resume that validate claimed qualifications.
4. **Scoring & Synthesis Agent:** Computes a calibrated match score ($0-100\%$), provides an executive recommendation, and outlines key strengths and evaluation notes.

---

## 5. Automated Tests

Run the test suite in `ai-service`:
```bash
cd ai-service
python -m pytest -v
```

### Test Results: 18 / 18 Passed
- `tests/test_endpoint_validation.py`: Rejection of unsupported files and payload validation.
- `tests/test_groq_screening.py`: Mocked multi-agent screening, batch ZIP extraction, text screening by numeric job ID, rate-limit 429 errors, network timeouts, malformed JSON recovery, and temporary file cleanup.
- `tests/test_health.py`: Microservice health check.

---

## 6. Security & Database Notes

- **Database Credentials:** Password defaults to `varun2006` if not provided, or can be set via `DB_PASSWORD`.
- **API Keys:** Store your `GROQ_API_KEY` in `.env` (at root or inside `ai-service/`). `.env` is ignored by Git and never committed.
- **Port Mapping:**
  - `8001`: Python AI Microservice
  - `8080`: Java Spring Boot Backend
  - `5173`: React Frontend Web Portal
