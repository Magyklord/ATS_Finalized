import os
import shutil
from pathlib import Path
import pymupdf

class TenPageReportBuilder:
    def __init__(self, output_path: str):
        self.output_path = output_path
        self.doc = pymupdf.open()
        self.width = 595.28  # A4 width in pt
        self.height = 841.89 # A4 height in pt
        self.margin_x = 44.0
        self.content_w = self.width - (2 * self.margin_x) # 507.28 pt
        self.total_pages = 10

    def create_page(self, page_num: int, chapter_title: str):
        page = self.doc.new_page(width=self.width, height=self.height)
        
        # Header (Pages 2-10)
        if page_num > 1:
            page.insert_text(
                (self.margin_x, 32),
                f"FacultyHire Engineering Report  |  {chapter_title}",
                fontsize=8.0,
                fontname="helv",
                color=(0.35, 0.42, 0.52)
            )
            page.draw_line(
                pymupdf.Point(self.margin_x, 38),
                pymupdf.Point(self.margin_x + self.content_w, 38),
                color=(0.82, 0.86, 0.90), width=0.6
            )

        # Footer (All Pages)
        footer_y = self.height - 28.0
        page.draw_line(
            pymupdf.Point(self.margin_x, footer_y - 8),
            pymupdf.Point(self.margin_x + self.content_w, footer_y - 8),
            color=(0.82, 0.86, 0.90), width=0.6
        )
        page.insert_text(
            (self.margin_x, footer_y + 4),
            "FacultyHire: University Faculty Screening System  •  Confidential Search Committee Dossier",
            fontsize=7.5,
            fontname="helv",
            color=(0.45, 0.52, 0.60)
        )
        page_str = f"Page {page_num} of {self.total_pages}"
        page.insert_text(
            (self.width - self.margin_x - 55, footer_y + 4),
            page_str,
            fontsize=7.5,
            fontname="helv",
            color=(0.45, 0.52, 0.60)
        )
        return page

    # --- UI Component Helpers ---
    def draw_section_title(self, page, y: float, title: str) -> float:
        bar_rect = pymupdf.Rect(self.margin_x, y + 2, self.margin_x + 4, y + 18)
        page.draw_rect(bar_rect, color=None, fill=(0.10, 0.21, 0.36))
        page.insert_text(
            (self.margin_x + 12, y + 15),
            title,
            fontsize=12.5,
            fontname="helv",
            color=(0.10, 0.21, 0.36)
        )
        line_y = y + 23
        page.draw_line(
            pymupdf.Point(self.margin_x, line_y),
            pymupdf.Point(self.margin_x + self.content_w, line_y),
            color=(0.85, 0.88, 0.92), width=0.8
        )
        return line_y + 12

    def draw_subheading(self, page, y: float, title: str) -> float:
        page.insert_text(
            (self.margin_x, y + 11),
            title,
            fontsize=10.0,
            fontname="helv",
            color=(0.15, 0.30, 0.48)
        )
        return y + 18

    def draw_p(self, page, y: float, text: str, font_size: float = 8.6, line_h: float = 12.5, color=(0.18, 0.22, 0.28)) -> float:
        tbox = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + 180)
        res = page.insert_textbox(
            tbox,
            text,
            fontsize=font_size,
            fontname="helv",
            color=color,
            lineheight=line_h
        )
        used_h = 180.0 - res if res >= 0 else 30.0
        return y + used_h + 8.0

    def draw_bullet(self, page, y: float, bold_prefix: str, text: str, line_h: float = 12.0) -> float:
        bullet_mark = "•"
        page.insert_text((self.margin_x + 4, y + 9), bullet_mark, fontsize=10, fontname="helv", color=(0.15, 0.35, 0.60))
        full_text = f"{bold_prefix}: {text}"
        tbox = pymupdf.Rect(self.margin_x + 16, y, self.margin_x + self.content_w, y + 80)
        res = page.insert_textbox(
            tbox,
            full_text,
            fontsize=8.5,
            fontname="helv",
            color=(0.18, 0.22, 0.28),
            lineheight=line_h
        )
        used_h = 80.0 - res if res >= 0 else 18.0
        return y + used_h + 4.0

    def draw_callout_box(self, page, y: float, title: str, text: str, height: float, tag: str = "CASE STUDY") -> float:
        c_rect = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + height)
        page.draw_rect(c_rect, color=(0.80, 0.85, 0.92), fill=(0.95, 0.97, 1.0))
        # Left accent stripe
        page.draw_rect(
            pymupdf.Rect(self.margin_x, y, self.margin_x + 4, y + height),
            color=None, fill=(0.10, 0.30, 0.58)
        )
        page.insert_text(
            (self.margin_x + 14, y + 14),
            f"[{tag}]  {title}",
            fontsize=8.5,
            fontname="helv",
            color=(0.10, 0.30, 0.58)
        )
        tbox = pymupdf.Rect(self.margin_x + 14, y + 22, self.margin_x + self.content_w - 12, y + height - 6)
        page.insert_textbox(
            tbox,
            text,
            fontsize=8.2,
            fontname="helv",
            color=(0.18, 0.22, 0.28),
            lineheight=11.2
        )
        return y + height + 10.0

    def draw_table(self, page, y: float, headers: list, rows: list, col_ratios: list, row_h: float = 18.0) -> float:
        col_widths = [r * self.content_w for r in col_ratios]
        
        # Header
        h_rect = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + row_h)
        page.draw_rect(h_rect, color=None, fill=(0.10, 0.21, 0.36))
        cur_x = self.margin_x
        for i, h in enumerate(headers):
            page.insert_text((cur_x + 6, y + 12), h, fontsize=8.0, fontname="helv", color=(1.0, 1.0, 1.0))
            cur_x += col_widths[i]
        
        y += row_h

        # Rows
        for r_idx, row in enumerate(rows):
            fill_c = (0.97, 0.98, 0.99) if r_idx % 2 == 1 else (1.0, 1.0, 1.0)
            r_rect = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + row_h)
            page.draw_rect(r_rect, color=(0.86, 0.89, 0.93), fill=fill_c)
            cur_x = self.margin_x
            for c_idx, cell in enumerate(row):
                page.insert_text((cur_x + 6, y + 12), str(cell)[:55], fontsize=7.8, fontname="helv", color=(0.18, 0.22, 0.28))
                cur_x += col_widths[c_idx]
            y += row_h
        
        return y + 10.0

    def draw_code_box(self, page, y: float, lines: list, caption: str = "") -> float:
        line_h = 11.5
        box_h = len(lines) * line_h + (24.0 if caption else 14.0)
        box_rect = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + box_h)
        page.draw_rect(box_rect, color=(0.78, 0.82, 0.88), fill=(0.95, 0.96, 0.98))
        
        if caption:
            page.insert_text((self.margin_x + 10, y + 12), caption, fontsize=7.5, fontname="helv", color=(0.35, 0.40, 0.50))
            cy = y + 22
        else:
            cy = y + 12

        for line in lines:
            page.insert_text((self.margin_x + 12, cy), line, fontsize=7.5, fontname="cour", color=(0.10, 0.14, 0.20))
            cy += line_h

        return y + box_h + 10.0

    # =========================================================================
    # PAGE 1: TITLE & COVER EXECUTIVE DOSSIER
    # =========================================================================
    def build_page_1(self):
        page = self.create_page(1, "Executive Project Dossier")
        y = 52.0

        # Hero Banner
        banner_h = 160.0
        b_rect = pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + banner_h)
        page.draw_rect(b_rect, color=None, fill=(0.10, 0.21, 0.36))
        # Gold accent bar
        page.draw_rect(pymupdf.Rect(self.margin_x, y, self.margin_x + self.content_w, y + 4), color=None, fill=(0.85, 0.65, 0.15))

        page.insert_text((self.margin_x + 22, y + 42), "FACULTYHIRE", fontsize=24, fontname="helv", color=(1.0, 1.0, 1.0))
        page.insert_text((self.margin_x + 22, y + 66), "Intelligent Academic Faculty Recruitment & Screening System", fontsize=11.5, fontname="helv", color=(0.85, 0.90, 0.98))
        page.insert_text(
            (self.margin_x + 22, y + 84),
            "Comprehensive Technical Architecture, Multi-Agent Cognitive Pipelines, Mathematical Evaluation Models, and Oral Defense Dossier",
            fontsize=8.0, fontname="helv", color=(0.70, 0.78, 0.88)
        )

        # Meta pills inside banner
        meta_rect = pymupdf.Rect(self.margin_x + 22, y + 102, self.margin_x + self.content_w - 22, y + 144)
        page.draw_rect(meta_rect, color=(0.20, 0.32, 0.48), fill=(0.14, 0.25, 0.42))
        
        pills = [
            ("PROJECT TYPE", "Professional Training"),
            ("ARCHITECTURE", "Polyglot Microservices"),
            ("PRIMARY STACK", "Java 17 + Python 3.10"),
            ("TEST SUITE", "22 / 22 Passed (100%)")
        ]
        px = self.margin_x + 32
        for k, v in pills:
            page.insert_text((px, y + 118), k, fontsize=7.0, fontname="helv", color=(0.85, 0.70, 0.25))
            page.insert_text((px, y + 132), v, fontsize=8.0, fontname="helv", color=(1.0, 1.0, 1.0))
            px += 114

        y += banner_h + 16.0

        # Executive Abstract
        y = self.draw_section_title(page, y, "Executive Abstract")
        abstract_text = (
            "FacultyHire is an enterprise-grade recruitment intelligence platform engineered specifically for university faculty "
            "search committees, department chairs, and academic deans. While traditional applicant tracking systems (ATS) rely on "
            "simplistic keyword matching tailored for corporate industry hires, FacultyHire addresses the multi-faceted complexities "
            "of academic evaluation. The system incorporates an allied-doctorate crediting matrix that honors interdisciplinary "
            "quantitative terminal degrees, formulates a calibrated Three-Pillar Academic Composite Score (Teaching 40%, Research 35%, "
            "Domain 25%), and automatically produces committee-ready probing interview questions. Architected as a decoupled polyglot "
            "microservice ecosystem, FacultyHire combines an enterprise Java Spring Boot 3 System of Record with an asynchronous "
            "Python FastAPI cognitive engine, operating seamlessly in both cloud-accelerated (Groq LPU) and 100% air-gapped on-premise "
            "(Ollama + deterministic fallback) environments."
        )
        y = self.draw_p(page, y, abstract_text, font_size=8.4, line_h=12.2)

        # Table of Contents
        y = self.draw_section_title(page, y, "Table of Contents")
        toc_rows = [
            ["Chapter 1", "Introduction, Problem Domain & Academic Recruiting Needs", "Page 2"],
            ["Chapter 2", "System Architecture & Polyglot Microservices Topology", "Page 3"],
            ["Chapter 3", "Core Subsystem Deep Dive (Part I: Java Spring Boot Backend)", "Page 4"],
            ["Chapter 4", "Core Subsystem Deep Dive (Part II: Python AI Microservice)", "Page 5"],
            ["Chapter 5", "Autonomous Multi-Agent Cognitive Architecture (LangGraph)", "Page 6"],
            ["Chapter 6", "Academic Recruiter Evaluation Framework & Mathematical Models", "Page 7"],
            ["Chapter 7", "Frontend Architecture & Progressive Disclosure UI/UX", "Page 8"],
            ["Chapter 8", "Verification, Testing, Security & Operational Launchers", "Page 9"],
            ["Chapter 9", "Project Presentation, Oral Defense Guide & Future Roadmap", "Page 10"]
        ]
        self.draw_table(page, y, ["Section", "Chapter Title & Scope", "Page"], toc_rows, [0.18, 0.70, 0.12], row_h=17.0)

    # =========================================================================
    # PAGE 2: CHAPTER 1 — PROBLEM DOMAIN & CASE STUDY
    # =========================================================================
    def build_page_2(self):
        page = self.create_page(2, "Chapter 1: Domain Analysis & Faculty Recruitment")
        y = 52.0

        y = self.draw_section_title(page, y, "1. Domain Analysis & Higher Education Recruitment Challenges")
        y = self.draw_p(
            page, y,
            "University faculty hiring is one of the most critical long-term investment decisions made by academic institutions. "
            "Unlike corporate roles where candidates are hired for immediate commercial output, academic appointments involve multi-year "
            "commitments spanning teaching, peer-reviewed scholarship, graduate mentorship, and departmental governance. Applying corporate "
            "ATS tools to academic dossiers leads to systematic misclassification and missed opportunities."
        )

        y = self.draw_subheading(page, y, "1.1 Critical Vulnerabilities in Industry Corporate ATS Systems")
        y = self.draw_bullet(page, y, "Literal Keyword Blindness", "Corporate ATS tools perform verbatim string matching. Candidates holding doctorates in allied quantitative disciplines (e.g., Applied Mathematics, Physics, Electrical Engineering) are erroneously flagged as lacking required Ph.D. credentials when applying for Computer Science or Software Engineering faculty positions.")
        y = self.draw_bullet(page, y, "Reductionist Single-Score Metric", "Reducing a faculty candidate's 15-page dossier to an arbitrary single match percentage obscures their instructional competence, publication rigor, and syllabus readiness.")
        y = self.draw_bullet(page, y, "Absence of Committee Probing Tools", "Search committees require structured interview questions addressing candidate gaps, research agenda transition, and ABET accreditation support, which corporate tools do not provide.")
        y = self.draw_bullet(page, y, "Air-Gapped Compliance & Privacy", "Higher education institutions frequently enforce strict data governance policies preventing the transmission of unredacted candidate dossiers to third-party public cloud LLM endpoints.")

        y = self.draw_subheading(page, y, "1.2 Benchmark Audit: The Dr. Marcus Vance Case Study")
        case_text = (
            "Candidate Profile: Dr. Marcus Vance holds a Ph.D. in Applied Mathematics & Computational Science from Georgia Tech, "
            "applying for an Associate Professor of Software Engineering position. His portfolio includes 8 peer-reviewed publications "
            "in SIAM and IEEE journals, 5 years of university teaching (Discrete Math, Optimization), and ABET readiness documentation.\n\n"
            "Corporate ATS Evaluation: The legacy system parsed his education section strictly for 'Ph.D. in Computer Science'. Because "
            "his doctorate was in Applied Mathematics, it assigned a 0% education score and listed 'Ph.D. Missing' under missing skills, "
            "recommending immediate rejection.\n\n"
            "FacultyHire Evaluation: FacultyHire recognizes his terminal degree under the 4-Tier Education Matrix, crediting 75% for allied "
            "quantitative rigor. It isolates specific syllabus gaps ('Ph.D. specialization in core Software Engineering') rather than claiming "
            "a doctorate is missing, calculates a balanced composite score of 72.5%, and formulates 3 tailored committee interview questions."
        )
        y = self.draw_callout_box(page, y, "Empirical Benchmark: Legacy ATS vs. FacultyHire", case_text, height=138.0, tag="AUDIT CASE STUDY")

        y = self.draw_subheading(page, y, "1.3 Design Objectives of FacultyHire")
        y = self.draw_bullet(page, y, "Tripartite Alignment", "Explicitly separate and measure Teaching & Pedagogy, Research Scholarship, and Departmental Domain fit.")
        y = self.draw_bullet(page, y, "Evidence-Grounded Parsing", "Zero tolerance for hallucination; all evaluations must quote verbatim evidence directly from the candidate resume.")
        y = self.draw_bullet(page, y, "Dual-Engine Resilience", "Seamless operation across both high-throughput cloud LPUs and 100% offline air-gapped environments.")

    # =========================================================================
    # PAGE 3: CHAPTER 2 — ARCHITECTURE & TOPOLOGY
    # =========================================================================
    def build_page_3(self):
        page = self.create_page(3, "Chapter 2: Polyglot Microservices Topology")
        y = 52.0

        y = self.draw_section_title(page, y, "2. System Architecture & Polyglot Microservices Topology")
        y = self.draw_p(
            page, y,
            "FacultyHire is architected upon the System of Record (SoR) enterprise pattern. Long-term transactional state management "
            "and candidate records are strictly isolated from high-latency AI screening workloads, ensuring system reliability, "
            "clean separation of concerns, and independent horizontal scalability."
        )

        y = self.draw_subheading(page, y, "2.1 Microservices Topology & Inter-Service Boundary Map")
        topo_lines = [
            "+-----------------------------------------------------------------------------------------------+",
            "|                          React 18 + Vite Web Portal (Port 5173)                               |",
            "|     - Dynamic Progress Stepper       - Executive Glanceable Card     - Dossier Drawer         |",
            "+-----------------------------------------------+-----------------------------------------------+",
            "                        | /api/* (Proxy)        | /api/v1/* (Proxy)                             ",
            "                        v                       v                                               ",
            "+---------------------------------------+   +---------------------------------------------------+",
            "|   Java Spring Boot 3 Core Backend     |   |       Python FastAPI AI Microservice (Port 8001)  |",
            "|   (System of Record - Port 8080)      |   |   - Document Extraction (pypdf, python-docx, zip) |",
            "|   - Job & Candidate Management CRUD   |   |   - Execution Mode Router (ANALYZER_BACKEND)      |",
            "|   - Screening Result Archive Entity   |   |   +-----------------------+-----------------------+   |",
            "|   - Spring Data JPA / Hibernate       |   |   | Online: LangGraph DAG | Offline: Ollama Local |   |",
            "|   +-----------------------------------+   |   | (Groq LPU Inference)  | (Deterministic Fall)  |   |",
            "|   | PostgreSQL 15+ / Embedded H2 DB   |   |   +-----------------------+-----------------------+   |",
            "+---+-----------------------------------+---+---------------------------------------------------+"
        ]
        y = self.draw_code_box(page, y, topo_lines, "Figure 2.1: Polyglot Microservices Architecture Topology")

        y = self.draw_subheading(page, y, "2.2 Service Port Allocation & Protocol Specification")
        port_rows = [
            ["5173", "React + Vite SPA", "HTTP / Browser", "User interface, progressive disclosure, reverse proxy"],
            ["8080", "Spring Boot Core", "REST / JSON", "Authoritative System of Record for jobs, applicants, history"],
            ["8001", "FastAPI AI Service", "REST / Multipart", "Document parsing, multi-agent evaluation, scoring synthesis"],
            ["5432", "PostgreSQL DB", "JDBC Protocol", "Persistent production storage for candidates and audit trails"],
            ["11434", "Ollama Daemon", "HTTP / REST", "Local air-gapped LLM inference on host machine (LLaMA 3.2)"]
        ]
        y = self.draw_table(page, y, ["Port", "Service / Component", "Protocol", "Architectural Role"], port_rows, [0.12, 0.28, 0.22, 0.38], row_h=18.0)

        y = self.draw_subheading(page, y, "2.3 Reverse Proxy & Failure Isolation Strategy")
        y = self.draw_p(
            page, y,
            "The Vite development gateway acts as a unified reverse proxy. Frontend client requests targeting '/api/*' route directly "
            "to Spring Boot (8080), while requests targeting '/api/v1/*' route to the Python microservice (8001). If the Python AI service "
            "is temporarily occupied or spinning up, the frontend gracefully falls back to cached evaluation records in Spring Boot, "
            "preventing recruiter downtime."
        )

    # =========================================================================
    # PAGE 4: CHAPTER 3 — JAVA SPRING BOOT CORE BACKEND
    # =========================================================================
    def build_page_4(self):
        page = self.create_page(4, "Chapter 3: Enterprise Java Spring Boot Backend")
        y = 52.0

        y = self.draw_section_title(page, y, "3. Core Subsystem Deep Dive (Part I: Java Spring Boot Backend)")
        y = self.draw_p(
            page, y,
            "The enterprise core backend is developed with Java 17 and Spring Boot 3.x. Operating as the authoritative System of Record, "
            "it manages transactional state, candidate entity lifecycles, and longitudinal screening archives with ACID guarantees."
        )

        y = self.draw_subheading(page, y, "3.1 Relational Domain Model & Entity Architecture")
        y = self.draw_bullet(page, y, "Job Entity (Job.java)", "Models academic openings including Job Title, Department, Description, Required Competencies, and Salary Range with JPA validation annotations.")
        y = self.draw_bullet(page, y, "Candidate Entity (Candidate.java)", "Tracks applicant identity, contact email, telephone, associated Job requisition foreign key, and recruitment review stage.")
        y = self.draw_bullet(page, y, "Resume Entity (Resume.java)", "Maintains document storage pointers, original file names, upload timestamps, and parsed text associations.")
        y = self.draw_bullet(page, y, "ScreeningResult Entity (ScreeningResult.java)", "Persists candidate evaluation scores, matched competencies, JSON evidence citations, and committee explanation summaries.")

        y = self.draw_subheading(page, y, "3.2 Dual-Database Persistence Strategy (PostgreSQL vs. Embedded H2)")
        y = self.draw_p(
            page, y,
            "To support both enterprise production deployments and zero-config portability across arbitrary machines, the backend "
            "implements a dual-profile configuration engine:"
        )
        db_rows = [
            ["PostgreSQL (Production)", "application.properties", "jdbc:postgresql://localhost:5432/recruitment_db", "Persistent high-volume production storage; requires local PostgreSQL installation."],
            ["H2 (Air-Gapped / Portable)", "application-h2.properties", "jdbc:h2:mem:recruitment_db;MODE=PostgreSQL", "Embedded in-memory database with zero installation, zero passwords, and zero setup."]
        ]
        y = self.draw_table(page, y, ["Profile", "Config File", "JDBC Connection URL", "Operational Behavior"], db_rows, [0.25, 0.22, 0.25, 0.28], row_h=22.0)

        y = self.draw_subheading(page, y, "3.3 RESTful Controller & Endpoint Catalog")
        api_rows = [
            ["GET /api/jobs", "JobController", "List all faculty job postings"],
            ["POST /api/jobs", "JobController", "Create a new faculty job requisition"],
            ["GET /api/candidates", "CandidateController", "Retrieve all candidates across departments"],
            ["POST /api/candidates/jobs/{id}", "CandidateController", "Enroll a candidate for a specific requisition"],
            ["GET /api/screening-results/candidates/{id}", "ScreeningResultController", "Fetch candidate historical screening dossiers"],
            ["POST /api/screening-results/candidates/{id}", "ScreeningResultController", "Persist newly synthesized screening evaluation"]
        ]
        self.draw_table(page, y, ["Endpoint", "Controller", "Functionality & Scope"], api_rows, [0.42, 0.28, 0.30], row_h=17.0)

    # =========================================================================
    # PAGE 5: CHAPTER 4 — PYTHON AI MICROSERVICE
    # =========================================================================
    def build_page_5(self):
        page = self.create_page(5, "Chapter 4: Cognitive AI Microservice & Engine")
        y = 52.0

        y = self.draw_section_title(page, y, "4. Core Subsystem Deep Dive (Part II: Python AI Microservice)")
        y = self.draw_p(
            page, y,
            "Developed with Python 3.10 and FastAPI, the AI microservice acts as the high-throughput cognitive engine of FacultyHire. "
            "It is responsible for document ingestion, unstructured text extraction, multi-agent orchestration, and scoring calibration."
        )

        y = self.draw_subheading(page, y, "4.1 Document Ingestion & Text Extraction Pipeline")
        y = self.draw_bullet(page, y, "PDF Extraction (pypdf / pymupdf)", "Extracts text from complex multi-column academic CVs, maintaining paragraph flow and tabular publication structures without OCR overhead.")
        y = self.draw_bullet(page, y, "Word Document Parsing (python-docx)", "Traverses the OpenXML DOM tree to extract biographical narratives, course listings, and research statements.")
        y = self.draw_bullet(page, y, "Bulk ZIP Batch Extraction", "Accepts compressed ZIP archives containing dozens of candidate resumes, unpacking and screening candidates concurrently.")

        y = self.draw_subheading(page, y, "4.2 High-Speed Online Screener (Groq LPU Acceleration)")
        y = self.draw_p(
            page, y,
            "When connected online, the microservice interfaces with Groq's Language Processing Units (LPUs) executing open-weights models "
            "(LLaMA-3.3-70B and GPT-OSS). By enforcing strict Pydantic v2 JSON Schemas and using greedy decoding (temperature 0.0), the service "
            "consistently delivers verified academic dossiers in under 1.5 seconds, eliminating the latency common in public cloud APIs."
        )

        y = self.draw_subheading(page, y, "4.3 Air-Gapped Dual-Tier Offline Analyzer (offline_analyzer.py)")
        y = self.draw_p(
            page, y,
            "When internet access is unavailable or institutional data security mandates on-premise execution, the microservice "
            "activates its dual-tier air-gapped engine:"
        )
        off_rows = [
            ["Tier 1: Local Ollama", "Local Daemon (Port 11434)", "LLaMA 3.2 3B/1B", "Fast local CPU inference tuned with num_thread: 10, num_ctx: 2048, and num_predict: 500."],
            ["Tier 2: Rule Engine", "Deterministic Heuristics", "Pure Python (<5ms)", "Instantaneous mathematical scoring, degree matrix lookup, and committee probing question formulation."]
        ]
        y = self.draw_table(page, y, ["Engine Tier", "Host Architecture", "Model / Method", "Performance & Operational Characteristics"], off_rows, [0.25, 0.25, 0.22, 0.28], row_h=22.0)

        y = self.draw_callout_box(
            page, y,
            "Zero-Latency Offline Fallback Guarantee",
            "The offline analyzer uses an aggressive 0.5s connection socket timeout for Ollama. If Ollama is inactive or uninstalled, the service automatically fails fast and executes the deterministic academic engine, guaranteeing the recruiter receives an instant (<5ms) dossier without hangs.",
            height=60.0,
            tag="PERFORMANCE"
        )

    # =========================================================================
    # PAGE 6: CHAPTER 5 — LANGGRAPH MULTI-AGENT ARCHITECTURE
    # =========================================================================
    def build_page_6(self):
        page = self.create_page(6, "Chapter 5: LangGraph Multi-Agent Architecture")
        y = 52.0

        y = self.draw_section_title(page, y, "5. Autonomous Multi-Agent Cognitive Architecture (LangGraph)")
        y = self.draw_p(
            page, y,
            "Monolithic prompt engineering fails when evaluating complex academic dossiers because a single prompt struggles to extract "
            "publications, evaluate criteria, synthesize evidence, and formulate interview questions simultaneously. FacultyHire decomposes "
            "screening into a 4-agent stateful directed acyclic graph (DAG) compiled with LangGraph."
        )

        y = self.draw_subheading(page, y, "5.1 The 4 Cognitive Agent Nodes")
        y = self.draw_bullet(page, y, "Agent 1: Candidate Profile Extractor", "Parses the unstructured resume text into a structured Pydantic ResumeProfile object: extracts candidate name, terminal degrees, awarding universities, experience, publications, and certifications.")
        y = self.draw_bullet(page, y, "Agent 2: Criteria & Rubric Analyzer", "Deconstructs the faculty job description into a structured evaluation rubric of 3 to 6 qualification criteria, distinguishing mandatory requirements from preferred qualifications.")
        y = self.draw_bullet(page, y, "Agent 3: Evidence Evaluator (Anti-Hallucination)", "Cross-references candidate credentials against each rubric criterion. Requires verbatim quotation from the resume text for resumeEvidence. Flagged as 'Not evident' if missing.")
        y = self.draw_bullet(page, y, "Agent 4: Scoring & Synthesis Agent", "Calibrates the composite score, computes Three-Pillar sub-scores, recommends academic rank, and generates 3 tailored search committee probing interview questions.")

        y = self.draw_subheading(page, y, "5.2 StateGraph Flow Diagram & State Schema")
        graph_lines = [
            "  [ START ] ---> ( Agent 1: Profile Extractor ) ---> ( Agent 2: Criteria Analyzer ) ",
            "                                                              |                     ",
            "  [  END  ] <--- ( Agent 4: Scoring & Synthesis ) <--- ( Agent 3: Evidence Evaluator )"
        ]
        y = self.draw_code_box(page, y, graph_lines, "Figure 5.1: LangGraph MultiAgentScreeningState Execution Pipeline")

        y = self.draw_subheading(page, y, "5.3 MultiAgentScreeningState Data Schema")
        state_rows = [
            ["resume_text / job_desc", "str", "Input", "Raw document string and requisition text passed from API router"],
            ["profile", "Dict[str, Any]", "Agent 1", "Structured candidate profile (degrees, institutions, publications)"],
            ["rubric", "List[Dict]", "Agent 2", "Decomposed evaluation rubric with mandatory and preferred criteria"],
            ["evidence / matched_skills", "List[Dict]", "Agent 3", "Verbatim quoted citations and competency match / gap lists"],
            ["committee_questions", "List[str]", "Agent 4", "Exactly three tailored probing questions for the hiring committee"],
            ["academic_breakdown", "Dict[str, float]", "Agent 4", "Sub-scores for Teaching (40%), Research (35%), and Domain (25%)"]
        ]
        self.draw_table(page, y, ["State Key", "Type", "Producer", "Description & Payload"], state_rows, [0.28, 0.18, 0.14, 0.40], row_h=17.0)

    # =========================================================================
    # PAGE 7: CHAPTER 6 — ACADEMIC EVALUATION FRAMEWORK
    # =========================================================================
    def build_page_7(self):
        page = self.create_page(7, "Chapter 6: Academic Scoring Models & Logic")
        y = 52.0

        y = self.draw_section_title(page, y, "6. Academic Recruiter Evaluation Framework & Mathematical Models")
        y = self.draw_p(
            page, y,
            "FacultyHire rejects generic keyword match percentages in favor of formalized mathematical models that reflect how university "
            "search committees, department chairs, and provosts evaluate academic dossiers."
        )

        y = self.draw_subheading(page, y, "6.1 The 4-Tier Education Crediting Matrix")
        y = self.draw_p(
            page, y,
            "Rather than treating degree matching as a binary match, FacultyHire applies an academic discipline-adjacency matrix:"
        )
        tier_rows = [
            ["Tier 1: Direct Discipline Ph.D.", "Ph.D. in CS, Software Engineering", "100%", "Full qualification met; eligible for standard tenure-track."],
            ["Tier 2: Allied STEM Doctorate", "Ph.D. in Applied Math, EE, Physics", "75%", "Quantitative & research credit awarded; curriculum gaps noted."],
            ["Tier 3: Terminal Master's Degree", "M.S. in CS/SE with 5+ yrs teaching", "60%", "Teaching-track competency met; lacks terminal research Ph.D."],
            ["Tier 4: Related Bachelor's Only", "B.S. in Computer Science or related", "30%", "Prerequisites absent for professorial appointment."]
        ]
        y = self.draw_table(page, y, ["Education Tier", "Qualifying Attainment", "Credit", "Committee Interpretation"], tier_rows, [0.30, 0.30, 0.12, 0.28], row_h=18.0)

        y = self.draw_subheading(page, y, "6.2 The Three-Pillar Academic Composite Formula")
        formula_box = [
            "Composite Academic Score = (0.40 * S_teaching) + (0.35 * S_research) + (0.25 * S_domain)",
            "",
            "Where:",
            "  S_teaching : Instruction history, course development, student mentoring, ABET accreditation",
            "  S_research : Peer-reviewed journal publications (IEEE, ACM, SIAM), terminal degree, grants",
            "  S_domain   : Direct alignment with departmental undergraduate curriculum & core discipline"
        ]
        y = self.draw_code_box(page, y, formula_box, "Equation 6.1: Three-Pillar Composite Mathematical Formulation")

        y = self.draw_subheading(page, y, "6.3 Search Committee Probing Interview Pack Generation")
        y = self.draw_p(
            page, y,
            "For every evaluated dossier, the engine formulates three tailored, probing questions addressing:"
        )
        y = self.draw_bullet(page, y, "Scholarly Translation", "How candidate will translate their established research agenda into competitive external grant funding and publications aligned with department priorities.")
        y = self.draw_bullet(page, y, "Pedagogical Delivery", "How candidate structures pedagogy, lab instruction, and capstone mentoring to bridge discipline gaps for undergraduate students.")
        y = self.draw_bullet(page, y, "Departmental Stewardship", "Experiences with ABET accreditation readiness, syllabus governance, and diversity in student mentoring.")

    # =========================================================================
    # PAGE 8: CHAPTER 7 — FRONTEND ARCHITECTURE & PROGRESSIVE DISCLOSURE
    # =========================================================================
    def build_page_8(self):
        page = self.create_page(8, "Chapter 7: Frontend Architecture & UI/UX")
        y = 52.0

        y = self.draw_section_title(page, y, "7. Frontend Architecture & Progressive Disclosure UI/UX")
        y = self.draw_p(
            page, y,
            "Developed with React 18, Vite, and modular CSS, the frontend is engineered specifically for faculty search committees. "
            "It prioritizes high-density information architecture, zero cognitive fatigue, and adherence to academic review norms."
        )

        y = self.draw_subheading(page, y, "7.1 Cognitive Load Management: Progressive Disclosure Pattern")
        y = self.draw_p(
            page, y,
            "Presenting dozens of criteria, citations, and metrics simultaneously overwhelms reviewers. FacultyHire implements "
            "a two-tier progressive disclosure pattern:"
        )
        y = self.draw_bullet(page, y, "Tier 1: Glanceable Executive Card", "Top-level summary presenting the composite match score circle (0-100), color-coded qualification recommendation badge (Strong Recommend, Interview, Review, Reject), and Three-Pillar horizontal balance meters (Teaching / Research / Domain).")
        y = self.draw_bullet(page, y, "Tier 2: Progressive Disclosure Dossier Drawer", "Collapsible accordion container kept closed by default. Expanding the drawer reveals detailed tabs for in-depth committee review.")

        y = self.draw_subheading(page, y, "7.2 Two-Tab Reviewer Tools Drawer Layout")
        drawer_rows = [
            ["Tab 1: Sub-Scores & Evidence", "Direct Competencies Matched, Discipline Gaps, Education & Experience timeline, and Verbatim Evidence quotation cards with assessment notes."],
            ["Tab 2: Committee Interview Pack", "Three tailored search committee probing questions formatted in distinct numbered cards, accompanied by a single-click 'Copy All Questions' clipboard utility."]
        ]
        y = self.draw_table(page, y, ["Reviewer Tool Tab", "Contents, Tools & Purpose"], drawer_rows, [0.35, 0.65], row_h=24.0)

        y = self.draw_subheading(page, y, "7.3 Multi-Stage Dynamic Progress Stepper")
        y = self.draw_p(
            page, y,
            "Because deep academic analysis requires multiple reasoning steps, the UI renders an animated progress stepper indicating "
            "real-time screening progression across 4 distinct phases:"
        )
        stepper_steps = [
            "  Phase 1 (15%): Uploading and Parsing Academic Resume File (pypdf/docx)               ",
            "  Phase 2 (40%): Extracting Credentials and Matching Against Department Rubric         ",
            "  Phase 3 (75%): Synthesizing Three-Pillar Scores & Verbatim Evidence Citations        ",
            "  Phase 4 (100%): Calibrating Faculty Appointment Rank and Interview Pack               "
        ]
        y = self.draw_code_box(page, y, stepper_steps, "Figure 7.1: Multi-Stage Screening Progress Stepper Phases")

        y = self.draw_subheading(page, y, "7.4 Strict Accessibility & Zero-Emoji Typography")
        y = self.draw_p(
            page, y,
            "In compliance with institutional design standards, the frontend enforces a strict zero-emoji policy across all JSX components "
            "and CSS stylesheets. All visual indicators utilize clean typography, semantic badges, and SVG vector icons."
        )

    # =========================================================================
    # PAGE 9: CHAPTER 8 — VERIFICATION, TESTING & OPERATIONS
    # =========================================================================
    def build_page_9(self):
        page = self.create_page(9, "Chapter 8: Verification, Security & Operations")
        y = 52.0

        y = self.draw_section_title(page, y, "8. Verification, Testing, Security & Operational Launchers")
        y = self.draw_p(
            page, y,
            "FacultyHire is backed by an automated test suite, robust process lifecycle management, and hardened air-gapped security boundaries."
        )

        y = self.draw_subheading(page, y, "8.1 Automated Test Suite Analysis (Pytest 22 / 22 Passed)")
        y = self.draw_p(
            page, y,
            "The Python microservice includes comprehensive unit, mock, and integration tests with a 100% pass rate:"
        )
        test_rows = [
            ["test_endpoint_validation.py", "2 Tests", "Validates rejection of unsupported files and multipart payload boundaries."],
            ["test_groq_screening.py", "15 Tests", "Tests PDF/DOCX extraction, mocked Groq responses, error handling, rate limits, schema failures, and ZIP batches."],
            ["test_health.py", "1 Test", "Verifies service health-check endpoint on port 8001."],
            ["test_offline_analyzer.py", "4 Tests", "Verifies deterministic offline screening, allied doctorate scoring, and fast Ollama socket fallback."]
        ]
        y = self.draw_table(page, y, ["Test Suite File", "Volume", "Scope & Verification Details"], test_rows, [0.32, 0.15, 0.53], row_h=18.0)

        y = self.draw_subheading(page, y, "8.2 Turn-Key Launcher Orchestration & Port Conflict Resolution")
        y = self.draw_p(
            page, y,
            "The system includes turnkey Windows batch launchers featuring automated PowerShell zombie process termination:"
        )
        y = self.draw_bullet(page, y, "start_all.bat (Standard Online)", "Automatically checks and frees ports 8001, 8080, and 5173; boots Python AI Microservice (Groq mode), Java Backend (JAR/Maven), and React Frontend in synchronized windows.")
        y = self.draw_bullet(page, y, "start_all_offline.bat (100% Air-Gapped)", "Initializes the Ollama local daemon, launches Python in local mode (ANALYZER_BACKEND=offline), boots Spring Boot with embedded H2 fallback, and starts the frontend.")

        y = self.draw_subheading(page, y, "8.3 Data Security, Air-Gapped Privacy & Boundary Controls")
        sec_box = [
            "  * Local System Boundary: Documents parsed in temporary directories; scrubbed immediately upon request completion.",
            "  * Air-Gapped Guarantees: When ANALYZER_BACKEND=offline, zero external HTTP calls are initiated; 100% local CPU processing.",
            "  * Credential Protection: API keys and database credentials managed strictly via .env files excluded from Git tracking."
        ]
        self.draw_code_box(page, y, sec_box, "Security & Compliance Invariants")

    # =========================================================================
    # PAGE 10: CHAPTER 9 — DEFENSE GUIDE & FUTURE ROADMAP
    # =========================================================================
    def build_page_10(self):
        page = self.create_page(10, "Chapter 9: Defense Guide & Project Roadmap")
        y = 52.0

        y = self.draw_section_title(page, y, "9. Project Presentation, Oral Defense Guide & Future Roadmap")
        y = self.draw_p(
            page, y,
            "This guide provides structured presentation narratives and answers to anticipated viva / defense examination questions."
        )

        y = self.draw_subheading(page, y, "9.1 One-Minute Executive Pitch")
        pitch_text = (
            "\"Most commercial recruitment platforms treat university professors like corporate programmers, discarding interdisciplinary "
            "candidates over literal keyword mismatches. FacultyHire was engineered specifically for university search committees. "
            "It evaluates candidates across Teaching, Research, and Domain alignment using an academic Three-Pillar model, honors allied "
            "quantitative doctorates, and equips search committees with tailored probing interview questions. Built with Java Spring Boot 3 "
            "and Python FastAPI, it operates with equal fidelity in high-throughput cloud environments and 100% air-gapped university networks.\""
        )
        y = self.draw_callout_box(page, y, "One-Minute Presentation Script", pitch_text, height=72.0, tag="ORAL DEFENSE")

        y = self.draw_subheading(page, y, "9.2 Anticipated Viva Defense Questions & Model Answers")
        y = self.draw_bullet(page, y, "Q1: Why combine Java and Python instead of building purely in one language?", "Answer: Enterprise systems require distinct tools for distinct workloads. Java Spring Boot provides robust transactional data persistence, ACID guarantees, and audit logging as the System of Record. Python provides world-class NLP, LangGraph orchestration, and document extraction. Decoupling them into microservices allows each to scale independently.")
        y = self.draw_bullet(page, y, "Q2: How do you prevent the AI from hallucinating qualifications?", "Answer: In our LangGraph pipeline, Agent 3 is explicitly constrained to extract verbatim quotations from the resume text for every evaluated criterion. If evidence is absent, it must report 'Not evident'. Furthermore, inference runs with greedy decoding (temperature 0.0) and rigid JSON schemas.")
        y = self.draw_bullet(page, y, "Q3: What happens if a user runs this on a computer without PostgreSQL?", "Answer: The Java backend includes a dual-database profile. Launching with '--spring.profiles.active=h2' automatically activates our embedded in-memory H2 database, allowing full operation with zero database installation or password setup.")

        y = self.draw_subheading(page, y, "9.3 Future Roadmap & Architectural Extensions")
        y = self.draw_bullet(page, y, "Blind Evaluation Mode", "Automated redaction of candidate names, genders, and demographic markers to eliminate cognitive bias during initial screening stages.")
        y = self.draw_bullet(page, y, "Institutional LMS Integration", "Exporting committee interview dossiers directly into campus platforms (Canvas, Blackboard, Workday HigherEd).")

        y = self.draw_subheading(page, y, "9.4 Conclusion")
        y = self.draw_p(
            page, y,
            "FacultyHire demonstrates a production-grade, polyglot software engineering architecture that solves a concrete, domain-specific "
            "challenge in higher education recruitment. Through its dual-engine AI pipeline, academic evaluation models, and resilient "
            "offline capabilities, it bridges the gap between academic hiring needs and automated recruitment technology."
        )

    def generate(self):
        print("Building 10-page master technical report...")
        self.build_page_1()
        self.build_page_2()
        self.build_page_3()
        self.build_page_4()
        self.build_page_5()
        self.build_page_6()
        self.build_page_7()
        self.build_page_8()
        self.build_page_9()
        self.build_page_10()

        assert len(self.doc) == self.total_pages, f"Expected {self.total_pages} pages, but generated {len(self.doc)}"
        self.doc.save(self.output_path)
        print(f"Successfully generated exactly {len(self.doc)} pages at: {self.output_path}")

        # Copy to artifact path
        artifact_dest = r"C:\Users\varun\.gemini\antigravity\brain\6fd73c24-5339-4b8d-8cf9-0a7ad93efd93\FacultyHire_Comprehensive_Report.pdf"
        shutil.copy2(self.output_path, artifact_dest)
        print(f"Successfully copied to artifact directory: {artifact_dest}")

if __name__ == "__main__":
    out_file = r"C:\Users\varun\OneDrive\Desktop\PT project\ATS_Finalized\FacultyHire_Comprehensive_Report.pdf"
    builder = TenPageReportBuilder(out_file)
    builder.generate()
