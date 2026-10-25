import pymupdf as fitz
from docx import Document

def extract_text_from_pdf(file_path: str) -> str:
    with open(file_path, "rb") as fp:
        pdf_bytes = fp.read()
    
    chunks = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text = page.get_text()
            if text:
                chunks.append(text)
    return "\n".join(chunks).strip()

def extract_text_from_docx(file_path: str) -> str:
    with open(file_path, "rb") as fp:
        document = Document(fp)
    chunks = [p.text for p in document.paragraphs if p.text]
    return "\n".join(chunks).strip()

def extract_resume_text(file_path: str) -> str:
    lower = file_path.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if lower.endswith(".docx"):
        return extract_text_from_docx(file_path)
    raise ValueError("Unsupported file format. Only PDF and DOCX are allowed.")
