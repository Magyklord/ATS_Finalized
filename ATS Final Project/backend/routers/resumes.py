import io
import json
import logging
import os
import tempfile
import zipfile
from typing import List, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
import pymupdf as fitz
from docx import Document

from agents.screening_agent import (
    AuthenticationError,
    MissingApiKeyError,
    ModelNotFoundError,
    ProviderError,
    RateLimitError,
    SchemaValidationError,
    ScreeningError,
    TimeoutError,
    screen_resume,
)
from schemas.resumes import ScreeningResult
from services.document_phaser import extract_resume_text

router = APIRouter(prefix="/screen-resume", tags=["resume screening"])
logger = logging.getLogger(__name__)

ALLOWED_TYPES = {".pdf", ".docx"}


class ScreenTextRequest(BaseModel):
    job_id: str
    job_title: str
    job_description: str
    required_skills: List[str] = Field(default_factory=list)
    resume_text: str


def get_max_file_bytes() -> int:
    try:
        mb = int(os.getenv("MAX_RESUME_SIZE_MB", "10"))
    except ValueError:
        mb = 10
    return mb * 1024 * 1024


@router.post("", response_model=ScreeningResult)
async def screen_resume_endpoint(
    file: UploadFile = File(...),
    job_id: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    required_skills: Optional[str] = Form(default=None),
):
    filename = (file.filename or "").strip()
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Only PDF and DOCX resume files are supported.")
    if not job_id.strip() or not job_title.strip() or not job_description.strip():
        raise HTTPException(status_code=422, detail="job_id, job_title, and job_description are required.")

    skills = []
    if required_skills:
        try:
            parsed = json.loads(required_skills)
            if not isinstance(parsed, list) or not all(isinstance(x, str) for x in parsed):
                raise ValueError
            skills = [x.strip() for x in parsed if x.strip()]
        except (json.JSONDecodeError, ValueError):
            raise HTTPException(status_code=422, detail="required_skills must be a JSON array of strings.")

    temp_path = None
    max_file_bytes = get_max_file_bytes()

    try:
        size = 0
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
            temp_path = temp.name
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk == b"":
                    size += len(chunk)
                    if size > max_file_bytes:
                        raise HTTPException(status_code=413, detail="Resume exceeds the configured file size limit.")
                    temp.write(chunk)
                else:
                    break
        if size == 0:
            raise HTTPException(status_code=400, detail="Uploaded resume is empty.")

        try:
            text = extract_resume_text(temp_path)
        except Exception as exc:
            exc_name = type(exc).__name__
            del exc
            import gc
            gc.collect()
            logger.info("Resume extraction failed (%s)", exc_name)
            raise HTTPException(status_code=400, detail="Could not read the resume. Check that the file is a valid PDF or DOCX.")
        
        if not text.strip():
            raise HTTPException(status_code=422, detail="No readable text was found. Scanned resumes require OCR.")

        try:
            return screen_resume(text, str(job_id).strip(), job_title.strip(), job_description.strip(), skills)
        except MissingApiKeyError as exc:
            logger.warning("Screening unavailable: %s", str(exc))
            raise HTTPException(status_code=503, detail=str(exc))
        except AuthenticationError as exc:
            logger.error("Authentication error: %s", str(exc))
            raise HTTPException(status_code=502, detail=str(exc))
        except ModelNotFoundError as exc:
            logger.error("Model not found: %s", str(exc))
            raise HTTPException(status_code=502, detail=str(exc))
        except RateLimitError as exc:
            logger.warning("Rate limit exceeded: %s", str(exc))
            raise HTTPException(status_code=429, detail=str(exc))
        except TimeoutError as exc:
            logger.warning("Timeout during screening: %s", str(exc))
            raise HTTPException(status_code=504, detail=str(exc))
        except SchemaValidationError as exc:
            logger.error("Schema validation failed: %s", str(exc))
            raise HTTPException(status_code=502, detail=str(exc))
        except ProviderError as exc:
            logger.error("Provider error: %s", str(exc))
            raise HTTPException(status_code=502, detail=str(exc))
        except Exception:
            logger.exception("Unexpected screening failure")
            raise HTTPException(status_code=502, detail="Resume screening provider failed. Please retry later.")
    finally:
        await file.close()
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                import gc
                gc.collect()
                try:
                    os.remove(temp_path)
                except OSError as err:
                    logger.warning("Temporary resume file cleanup failed: %s", err)


@router.post("/upload-zip")
async def upload_zip_endpoint(file: UploadFile = File(...)):
    """
    Accepts a .zip archive, extracts all .pdf and .docx resumes in-memory,
    and returns a structured manifest of candidates and resume texts.
    """
    filename = (file.filename or "").strip()
    if not filename.lower().endswith(".zip"):
        raise HTTPException(status_code=415, detail="Only .zip files are supported for batch resume uploads.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded ZIP file is empty.")

    extracted_resumes = []
    try:
        with zipfile.ZipFile(io.BytesIO(content), "r") as z:
            for entry in z.namelist():
                # Skip directories and macOS hidden resource files
                if entry.endswith("/") or "__MACOSX" in entry or os.path.basename(entry).startswith("."):
                    continue
                ext = os.path.splitext(entry)[1].lower()
                if ext not in {".pdf", ".docx"}:
                    continue

                raw_bytes = z.read(entry)
                if not raw_bytes:
                    continue

                text = ""
                try:
                    if ext == ".pdf":
                        with fitz.open(stream=raw_bytes, filetype="pdf") as doc:
                            chunks = [page.get_text() for page in doc if page.get_text()]
                            text = "\n".join(chunks).strip()
                    elif ext == ".docx":
                        doc = Document(io.BytesIO(raw_bytes))
                        chunks = [p.text for p in doc.paragraphs if p.text]
                        text = "\n".join(chunks).strip()
                except Exception as parse_err:
                    logger.warning("Failed to extract text from %s: %s", entry, parse_err)

                # Determine candidate name from file name or first non-empty line
                base_name = os.path.splitext(os.path.basename(entry))[0]
                cleaned_name = base_name.replace("_", " ").replace("-", " ").title()
                if text:
                    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
                    if lines:
                        candidate_candidate = lines[0]
                        if 3 <= len(candidate_candidate) <= 50 and not any(c in candidate_candidate for c in ["@", "http", "/", "\\", "{", "}"]):
                            cleaned_name = candidate_candidate

                extracted_resumes.append({
                    "id": f"res_{len(extracted_resumes) + 1}",
                    "fileName": os.path.basename(entry),
                    "candidateName": cleaned_name,
                    "text": text,
                    "sizeKb": round(len(raw_bytes) / 1024, 1),
                    "status": "READY" if text else "UNREADABLE",
                })
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Corrupted or invalid ZIP archive.")

    if not extracted_resumes:
        raise HTTPException(status_code=422, detail="No readable .pdf or .docx resumes found in the ZIP archive.")

    return {
        "total": len(extracted_resumes),
        "resumes": extracted_resumes,
    }


@router.post("/screen-text", response_model=ScreeningResult)
def screen_text_endpoint(payload: ScreenTextRequest):
    """
    Screens an already extracted candidate resume text against job requirements.
    Uses the LangGraph multi-agent pipeline.
    """
    if not payload.job_id.strip() or not payload.job_title.strip() or not payload.job_description.strip():
        raise HTTPException(status_code=422, detail="job_id, job_title, and job_description are required.")
    if not payload.resume_text.strip():
        raise HTTPException(status_code=422, detail="resume_text cannot be empty.")

    try:
        return screen_resume(
            resume_text=payload.resume_text.strip(),
            job_id=str(payload.job_id).strip(),
            job_title=payload.job_title.strip(),
            job_description=payload.job_description.strip(),
            required_skills=payload.required_skills,
        )
    except MissingApiKeyError as exc:
        logger.warning("Screening unavailable: %s", str(exc))
        raise HTTPException(status_code=503, detail=str(exc))
    except AuthenticationError as exc:
        logger.error("Authentication error: %s", str(exc))
        raise HTTPException(status_code=502, detail=str(exc))
    except ModelNotFoundError as exc:
        logger.error("Model not found: %s", str(exc))
        raise HTTPException(status_code=502, detail=str(exc))
    except RateLimitError as exc:
        logger.warning("Rate limit exceeded: %s", str(exc))
        raise HTTPException(status_code=429, detail=str(exc))
    except TimeoutError as exc:
        logger.warning("Timeout during screening: %s", str(exc))
        raise HTTPException(status_code=504, detail=str(exc))
    except SchemaValidationError as exc:
        logger.error("Schema validation failed: %s", str(exc))
        raise HTTPException(status_code=502, detail=str(exc))
    except ProviderError as exc:
        logger.error("Provider error: %s", str(exc))
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception:
        logger.exception("Unexpected screening failure")
        raise HTTPException(status_code=502, detail="Resume screening provider failed. Please retry later.")
