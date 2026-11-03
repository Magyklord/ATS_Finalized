# Agentic AI-Based Recruitment and Resume Shortlisting System (FacultyHire)

An enterprise-grade, multi-agent AI-assisted recruitment platform designed specifically for university faculty hiring and academic search committees. The system features:

- **Java Spring Boot System of Record (Port 8080):** Permanent PostgreSQL/H2 database persistence, candidate registry, job postings management, and cascade-protected CRUD endpoints.
- **Python FastAPI + LangGraph AI Microservice (Port 8001):** Dual-tier architecture supporting both **Primary Cloud Screening** (Groq API, `openai/gpt-oss-20b`) and **100% Offline / Air-Gapped Screening** (Local Ollama `llama3.2:3b` + Instant Deterministic Academic Engine).
- **Academic Recruiter Framework:** Discipline-aware degree alignment (75% transfer credit for allied STEM doctorates), Three-Pillar Academic Scoring (Teaching, Research, Domain Alignment), Day-1 Course Teaching Readiness Matrix, and search committee interview prompts.
- **React 18 + Vite Frontend Portal (Port 5173):** Progressive Disclosure Academic Dossier (Glanceable Tier 1 Card + Collapsible Tier 2 Search Committee Tools), animated 4-phase progress stepper, bulk ZIP uploads, and database synchronization with **strictly zero emojis**.
- **Automated Zombie Port Protection:** Startup scripts auto-detect and terminate conflicting processes on ports 8080, 8001, and 5173 before launching.

---

## 1. Project Directory Structure

```text
ATS_Finalized/
├── .env.example                    # Environment template with cloud & offline configs
├── start_all.bat                   # 1-Click launcher (Primary Cloud / Groq Mode)
├── start_all_offline.bat           # 1-Click launcher (100% Offline / Air-Gapped Mode)
├── package.json                    # Root scripts
├── pom.xml                         # Java Spring Boot Maven configuration (Java 17/21/25 LTS)
├── mvnw / mvnw.cmd                 # Maven wrappers
│
├── ai-service/                     # Python FastAPI AI Microservice (Port 8001)
│   ├── agents/
│   │   ├── multi_agent_graph.py    # LangGraph 4-agent state pipeline
│   │   ├── screening_agent.py      # Groq cloud client & academic evaluation rules
│   │   └── offline_analyzer.py     # Local Ollama runner + deterministic academic engine
│   ├── routers/
│   │   └── resumes.py              # Single upload, batch ZIP, and text screening endpoints
│   ├── schemas/
│   │   └── resumes.py              # Pydantic schemas (Three-Pillar Breakdown, Courses, etc.)
│   ├── services/
│   │   └── document_phaser.py      # PyMuPDF (PDF) & python-docx extraction engine
│   ├── tests/                      # 22 passing automated unit & integration tests
│   │   ├── test_endpoint_validation.py
│   │   ├── test_groq_screening.py
│   │   ├── test_health.py
│   │   └── test_offline_analyzer.py
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Microservice Python dependencies
│   └── pytest.ini                  # Pytest configuration
│
├── frontend/                       # React 18 + Vite Web Application (Port 5173)
│   ├── src/
│   │   ├── App.jsx                 # Dashboard, Jobs, Candidates, Progressive Dossier UI
│   │   ├── App.css                 # Enterprise styling & academic balance meters
│   │   └── main.jsx
│   ├── vite.config.js              # Reverse proxy: /api -> 8080, /api/v1 -> 8001
│   └── package.json                # Frontend dependencies
│
├── scripts/                        # Dedicated service launcher scripts
│   ├── start_ai.bat                # Starts Python AI Service (Cloud Groq mode)
│   ├── start_ai_offline.bat        # Starts Python AI Service (Offline Ollama/Local mode)
│   ├── start_backend.bat           # Starts Java Spring Boot backend (Fast JAR execution)
│   └── start_frontend.bat          # Starts React Vite development server
│
├── src/                            # Java Spring Boot source code (Port 8080)
│   ├── main/java/com/recruitment/recruitment_system/
│   │   ├── controller/             # Candidate, Job, Resume, Screening, and Exception handlers
│   │   ├── model/                  # JPA entities (Candidate, Job, Resume, ScreeningResult)
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── service/                # Business logic & cascade deletion services
│   │   └── RecruitmentSystemApplication.java
│   └── main/resources/
│       └── application.properties  # PostgreSQL configuration (jdbc:postgresql://localhost:5432/recruitment_db)
│
└── target/                         # Precompiled fat JAR (recruitment-system-0.0.1-SNAPSHOT.jar)
```

---

## 2. Quick Start (1-Click Launchers)

### Mode A: Standard Online Mode (Primary Groq Cloud Analyzer)
Double-click `start_all.bat` or run from terminal:
```cmd
start_all.bat
```
- **Primary AI:** Groq Cloud API (`openai/gpt-oss-20b`) with optimized sub-2-second latency.
- **Backend:** Java Spring Boot connects to PostgreSQL (or embedded fallback).
- **Frontend:** React portal opens at `http://localhost:5173`.

### Mode B: 100% Offline / Air-Gapped Mode (No Internet Required)
Double-click `start_all_offline.bat` or run from terminal:
```cmd
start_all_offline.bat
```
- **Offline AI:** Automatically checks for local Ollama (`llama3.2:3b`). If Ollama is offline or uninstalled, seamlessly utilizes the built-in deterministic academic engine (<20ms response time).
- **Zero External Network Requests:** Completely functional without an internet connection.

---

## 3. Academic Recruiter & Evaluation Architecture

Unlike corporate ATS platforms that rely on rigid keyword matching, FacultyHire evaluates candidates using the standard three dimensions of academic tenure and promotion:

### 1. Three-Pillar Academic Scoring
- **Teaching & Pedagogy Score (0–100):** Classroom experience, class size scale, thesis mentorship, ABET accreditation readiness, and curriculum development.
- **Research & Scholarship Score (0–100):** Peer-reviewed journal publications, citation potential, grant writing, dissertation rigor, and ORCID verification.
- **Domain Specialization Alignment (0–100):** Direct curriculum and research fit against the department's specific vacancy.
- **Calibrated Composite Score:** Balanced multi-factor evaluation ($35\%$ Teaching + $35\%$ Research + $30\%$ Domain).

### 2. Discipline-Aware Degree Recognition (Techniques A & B)
- **Eliminates False Negative "Missing PhD" Reports:** Distinguishes between degree level (holding a doctorate) and field specialization.
- **Allied Field Transfer Credit:** When evaluating candidates from allied STEM disciplines (e.g. Applied Mathematics, Computational Science, Statistics, Electrical Engineering, Physics) applying for Computing/SE roles, the system awards **75% education transfer credit** for quantitative, mathematical, and algorithmic rigor.
- **Academic Rank Calibration:** Automatically benchmarks applied rank against qualifications (e.g. suggesting *Assistant Professor (Tenure-Track)* or *Senior Teaching Professor* when a candidate has tenure but is transitioning disciplines).

### 3. Course Teaching Feasibility Matrix
Search committees receive a clear breakdown of curriculum readiness:
- **Day-1 Ready to Teach:** Foundational courses the applicant can instruct immediately (e.g. *Discrete Structures, Analysis of Algorithms, Numerical Methods, Intro Programming*).
- **Curriculum Gaps:** Advanced specialty courses requiring syllabus development (e.g. *Cloud Computing, Enterprise Software Architecture*).

### 4. Search Committee Probing Interview Questions
Generates three tailored academic interview questions per candidate for use during preliminary search committee screening calls, complete with a 1-click clipboard copy utility.

---

## 4. UI/UX: Progressive Disclosure & Progress Stepper

- **Strict Zero-Emoji Standard:** Professional interface using typography, semantic badges, and SVG vectors.
- **Active 4-Phase Progress Stepper:** Dynamic progress bar showing active evaluation milestones:
  1. *Extracting academic credentials, doctoral rigor, and citations*
  2. *Evaluating teaching tenure, ABET readiness, and thesis mentorship*
  3. *Benchmarking against faculty rank requirements and curriculum gaps*
  4. *Synthesizing academic dossier and committee interview questions*
- **Tier 1 (Glanceable Executive Card):** Candidate summary, calibrated match score, recommended action pill, and horizontal Three-Pillar visual balance meters.
- **Tier 2 (Progressive Disclosure Dossier):** Collapsible drawer with three tabs:
  - `Sub-Scores & Evidence`: Detailed breakdown and direct CV citations.
  - `Course Teaching Readiness`: Day-1 ready tags vs. curriculum development areas.
  - `Committee Interview Pack`: Probing interview questions with clipboard export.

---

## 5. Automated Tests

Run the full pytest suite in `ai-service`:
```bash
cd ai-service
.venv\Scripts\python.exe -m pytest -v
```

### Test Suite: 22 / 22 Passed (100%)
- `tests/test_endpoint_validation.py`: Rejection of unsupported file formats and input validation.
- `tests/test_groq_screening.py`: Mocked screening, batch ZIP extraction, numeric job ID mapping, rate limit handling, timeout resilience, schema validation, and temporary file cleanup.
- `tests/test_health.py`: Microservice health check.
- `tests/test_offline_analyzer.py`: Deterministic offline academic engine, offline backend environment routing, automated cloud-to-offline fallback, and offline text endpoints.

---

## 6. Manual Setup & Individual Services

### Python AI Microservice (Port 8001)
```bash
cd ai-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# Start in Cloud Groq mode:
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# Or start in Offline Local mode:
set ANALYZER_BACKEND=local
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### Java Spring Boot Backend (Port 8080)
```bash
# Starts via pre-packaged fat JAR (starts in under 2 seconds):
java -jar target\recruitment-system-0.0.1-SNAPSHOT.jar

# Or run via Maven:
mvnw.cmd spring-boot:run
```

### React + Vite Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## 7. Security & Configuration Notes

- **Environment Template (`.env.example`):**
  ```dotenv
  GROQ_API_KEY=your_groq_api_key_here
  GROQ_MODEL=openai/gpt-oss-20b
  MAX_RESUME_SIZE_MB=10

  ANALYZER_BACKEND=groq   # Options: 'groq', 'local', 'auto'
  OLLAMA_HOST=http://127.0.0.1:11434
  LOCAL_LLM_MODEL=llama3.2:3b
  LOCAL_LLM_TIMEOUT=60.0
  ```
- **Database:** PostgreSQL on port 5432 (`recruitment_db`).
- **Git Security:** `.env` and all credential files are excluded in `.gitignore` and never committed to version control.
