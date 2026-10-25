import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI

# Load .env from backend project directory reliably regardless of cwd
backend_dir = Path(__file__).resolve().parent
load_dotenv(backend_dir / ".env")

from fastapi.middleware.cors import CORSMiddleware
from routers.resumes import router as resumes_router

app = FastAPI(
    title="AI ATS Resume Screening Service",
    version="1.0.0",
    description="Resume screening microservice using Groq API. Java remains the system of record."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes_router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "ok", "service": "resume-screening"}
