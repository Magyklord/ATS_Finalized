# Agentic AI-Based Recruitment and Resume Shortlisting System

An AI-assisted recruitment platform designed to support university faculty recruitment by organizing job postings, candidate applications, resumes, and screening results in one system.

## 1. Project Overview

The project aims to streamline the initial recruitment and resume-shortlisting process. Recruiters can create job postings, register candidates, upload resumes, and review screening results.

The planned AI component will analyze resumes against job requirements and provide match scores, matched skills, supporting evidence, and explanations to help recruiters evaluate candidates.

**Important:** AI screening is intended to support human decision-making. Final recruitment and shortlisting decisions remain with the authorized recruiter or recruitment committee.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Frontend tooling | Vite |
| Backend | Java, Spring Boot |
| REST APIs | Spring Web |
| Database access | Spring Data JPA, Hibernate |
| Database | PostgreSQL |
| Validation | Jakarta Bean Validation |
| Build tool | Maven |
| AI service | Python, FastAPI (planned integration) |
| Version control | Git and GitHub |

## 3. Application Architecture

The application is designed around three components:

1. **React frontend:** Provides the user interface for managing jobs and candidates and viewing recruitment information.
2. **Spring Boot backend:** Exposes REST APIs, manages recruitment data, handles resume uploads, and stores screening results.
3. **Python AI service:** Intended to analyze resume content and return structured screening information to the backend.

PostgreSQL stores the application's structured data. Resume files are stored in the backend's local upload directory, while resume metadata is stored in the database.

The Java-to-Python integration and end-to-end AI screening workflow are still under development.

## 4. Backend Structure — `recruitment-system/`

The backend is a Maven-based Spring Boot application.

```text
recruitment-system/
├── pom.xml
├── .gitignore
└── src/
    └── main/
        ├── java/
        │   └── com/recruitment/recruitment_system/
        │       ├── job/
        │       ├── candidate/
        │       ├── resume/
        │       ├── screening/
        │       └── [application entry point]
        └── resources/
            └── application.properties
```

The package names above illustrate the main functional modules; exact filenames and subpackages may vary in the current codebase.

### Main backend files and responsibilities

**Application entry point**
- Starts the Spring Boot application.
- Initializes the application context and configured components.

**Job module**
- `Job.java` — Represents a job posting, including its title, department, and description.
- `JobRepository.java` — Provides database access for job records.
- `JobService.java` — Contains job-management business logic.
- `JobController.java` — Exposes REST endpoints for creating, retrieving, updating, and deleting jobs.

**Candidate module**
- `Candidate.java` — Represents a candidate and their contact information, with an association to a job.
- `CandidateRepository.java` — Provides database access for candidate records.
- `CandidateService.java` — Handles candidate-related business logic.
- `CandidateController.java` — Exposes endpoints for creating and retrieving candidates.

**Resume module**
- `Resume.java` — Stores resume metadata, such as the original filename, storage path, content type, processing status, upload time, and associated candidate.
- `ResumeStatus.java` — Defines resume-processing states: `UPLOADED`, `PROCESSING`, `COMPLETED`, and `FAILED`.
- Resume service and controller classes — Validate supported PDF/DOCX uploads, store files, save metadata, and expose resume-related endpoints.

**Screening module**
- `ScreeningResult.java` — Represents a screening result, including the match score, matched skills, evidence, explanation, screening time, and associated resume.
- `ScreeningResultRepository.java` — Provides database access for screening results.
- `ScreeningResultService.java` — Handles screening-result operations and validation.
- `ScreeningResultController.java` — Exposes endpoints to create and retrieve screening results.

**`application.properties`**
- Configures the Spring application and PostgreSQL connection.
- Uses the `DB_PASSWORD` environment variable for the database password.
- Local configuration must not contain committed credentials.

**`pom.xml`**
- Defines the Maven project, Java version, dependencies, and build configuration.

**`.gitignore`**
- Excludes generated build output, IDE files, local secrets, logs, and uploaded resume files from Git.

## 5. Frontend Structure — `recruitment-frontend/`

The frontend is built with React and Vite.

```text
recruitment-frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── App.jsx
    ├── App.css
    └── index.css
```

### Main frontend files

- `src/App.jsx` — Contains the main application layout, navigation, dashboard, job-management page, candidate-management page, and AI-screening placeholder.
- `src/App.css` — Defines application-specific styling, including the sidebar, dashboard, forms, tables, and page layouts.
- `src/index.css` — Provides global CSS rules and base styling.
- `vite.config.js` — Configures Vite and proxies frontend `/api` requests to the Spring Boot backend running locally on port `8080`.
- `package.json` — Defines frontend dependencies and development scripts.
- `index.html` — Provides the HTML entry point for the React application.

The current frontend supports listing and creating jobs and candidates. Resume-upload controls and the complete screening-results interface remain to be implemented.

## 6. Current REST API Endpoints

The backend currently exposes the following endpoints.

### Jobs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs` | Retrieve all jobs |
| GET | `/api/jobs/{id}` | Retrieve a job by ID |
| PUT | `/api/jobs/{id}` | Update a job |
| DELETE | `/api/jobs/{id}` | Delete a job |

### Candidates

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/candidates/jobs/{jobId}` | Create a candidate associated with a job |
| GET | `/api/candidates` | Retrieve candidates |
| GET | `/api/candidates/{id}` | Retrieve a candidate by ID |

### Resumes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/candidates/{candidateId}/resume` | Upload a resume using multipart form data with the field name `file` |
| GET | `/api/resumes/{id}` | Retrieve resume metadata |

### Screening results

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/screening-results/resumes/{resumeId}` | Create a screening result for a resume |
| GET | `/api/screening-results` | Retrieve screening results |
| GET | `/api/screening-results/resumes/{resumeId}` | Retrieve screening results for a resume |

The screening-result API is implemented, but integration with the Python AI service is not yet complete. Check the current controller implementation for exact request and response formats.

## 7. Local Setup

### Prerequisites

- Java version compatible with the backend project
- Maven, or the included Maven wrapper if available
- Node.js and npm
- PostgreSQL
- IntelliJ IDEA or another suitable IDE

### Start the backend

1. Create a PostgreSQL database named `recruitment_db`.
2. Configure the PostgreSQL username and database URL in `application.properties`.
3. Set the `DB_PASSWORD` environment variable in your run configuration.
4. From the backend directory, run:

```bash
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run` if the Maven wrapper is available. Otherwise, run the application through IntelliJ or use an installed Maven version.

The backend is configured to run locally on port `8080` unless changed.

### Start the frontend

From the frontend directory, run:

```bash
npm install
npm run dev
```

Vite typically starts the frontend at:

`http://localhost:5173`

The Vite development proxy forwards `/api` requests to the backend at `http://localhost:8080`.

## 8. AI Service Integration

The planned Python service will be responsible for AI-assisted resume analysis. Its interface should be agreed upon by the frontend/backend and AI-service developers before integration.

The expected screening information includes:

- Match score
- Matched skills
- Supporting evidence from the resume
- Explanation of the match

The team should define a consistent request/response schema, error-handling behavior, and processing-status updates before connecting the AI service to the Java backend.

## 9. Security and Privacy

- Do not commit database passwords, API keys, tokens, or other secrets.
- Keep `DB_PASSWORD` in a local environment or run configuration.
- Do not commit uploaded resumes or other candidate documents.
- Treat resumes and candidate contact information as confidential personal data.
- Restrict access to candidate information and screening results appropriately.
- AI-generated scores and explanations should be reviewed by a human; they should not automatically determine hiring outcomes.

## 10. Development Status

- Job-management APIs: implemented.
- Candidate-management APIs: implemented.
- Resume upload and metadata storage: implemented in the backend.
- Screening-result storage and retrieval APIs: implemented.
- React job and candidate pages: implemented.
- Resume-upload frontend: pending.
- Python AI service integration: pending.
- Complete AI-screening results interface: pending.

This README describes the project at its current development stage and should be updated as the implementation evolves.

## 11. Team Collaboration

The project uses a modular architecture so the frontend, Java backend, and Python AI service can be developed independently against agreed API contracts.

Before integrating new components, document the expected endpoint paths, request formats, response fields, error responses, and processing states so that all components remain compatible.