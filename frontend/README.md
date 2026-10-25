# FacultyHire Recruitment Portal Frontend

Modern React 18 + Vite frontend for managing faculty job postings, candidate registries, and AI resume screening.

---

## 1. Quick Start

### Step 1: Install Dependencies
From the repository root or from this directory:
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```

The web application will start at `http://localhost:5173`.

---

## 2. API Proxy Routing

Vite automatically proxies backend API requests:
- `/api` $\rightarrow$ `http://127.0.0.1:8080` (Java Spring Boot Backend)
- `/api/v1` $\rightarrow$ `http://127.0.0.1:8001` (Python FastAPI AI Microservice)

---

## 3. Features
- **Job Management:** Create, view, update, and manage faculty job postings with numeric IDs.
- **Candidate Management:** Register candidates and track interview and shortlisting statuses.
- **Single Resume Screening:** Upload PDF or DOCX resumes and view real-time score, skills, and evidence.
- **Batch ZIP Upload & Queue:** Upload a `.zip` file of multiple resumes and screen all candidates simultaneously or individually.
- **1-Click Registration:** Save screening results and candidate records straight into PostgreSQL via the Java backend.
- **White-Labeled Enterprise UI:** Clean corporate branding without vendor watermarks.
