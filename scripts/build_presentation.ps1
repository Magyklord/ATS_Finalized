# ==============================================================================
# FacultyHire Presentation Builder Script
# Updates existing PPTX with accurate project details and adds 4 output frames
# ==============================================================================

$srcPath = "C:\Users\varun\.gemini\antigravity\brain\6fd73c24-5339-4b8d-8cf9-0a7ad93efd93\.user_uploaded\media_1793762017362_f979e533.pptx"
$dstPath = "C:\Users\varun\OneDrive\Desktop\PT project\ATS_Finalized\Agentic_AI_Recruitment_Presentation.pptx"
$artifactPath = "C:\Users\varun\.gemini\antigravity\brain\6fd73c24-5339-4b8d-8cf9-0a7ad93efd93\Agentic_AI_Recruitment_Presentation.pptx"

Write-Host "Initializing PowerPoint COM..."
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($srcPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)

Write-Host "Base Presentation has $($pres.Slides.Count) slides."

# Helper function to find a shape by name pattern
function Get-ShapeByName($slide, $namePattern) {
    foreach ($sh in $slide.Shapes) {
        if ($sh.Name -like "*$namePattern*") {
            return $sh
        }
    }
    return $null
}

# --- SLIDE 2: AGENDA ---
Write-Host "Updating Slide 2: Agenda..."
$s2 = $pres.Slides.Item(2)
$s2Content = Get-ShapeByName $s2 "Content Placeholder"
if ($s2Content) {
    $s2Text = @"
1. Certificate
2. Abstract
3. Introduction and Problem Domain
4. Objectives (Academic Triad and Resilient Architecture)
5. System Architecture and Inter-Service Communication Flow
6. Module Implementation (Core Backend, LangGraph AI, Evaluation Framework)
7. Project Demonstration and Output Showcases (UI and Search Committee Tools)
8. Results and Discussions (Latency, Benchmark Case Study and Pytest Suite)
9. Conclusion and Future Scope
10. References
"@
    $s2Content.TextFrame.TextRange.Text = $s2Text
    $s2Content.TextFrame.TextRange.Font.Size = 13
}

# --- SLIDE 4: ABSTRACT ---
Write-Host "Updating Slide 4: Abstract..."
$s4 = $pres.Slides.Item(4)
$s4Content = Get-ShapeByName $s4 "Content Placeholder"
if ($s4Content) {
    $s4Text = @"
Traditional Applicant Tracking Systems (ATS) rely on rigid keyword matching, failing to evaluate complex academic qualifications like teaching pedagogy, publication impact, research grants, and allied doctorates. To overcome these limitations, we propose an Agentic AI-Based Recruitment Platform built on a collaborative multi-agent architecture (Java Spring Boot + Python FastAPI).

Autonomous specialized agents handle subtasks: parsing CVs, verifying terminal degree eligibility via a 4-Tier Education Crediting Matrix, and evaluating candidates across a Three-Pillar Academic Composite Model (Teaching 40%, Research 35%, Domain 25%). Operating seamlessly across both cloud LPUs (Groq sub-1.5s) and 100% offline air-gapped campus environments (Ollama + deterministic fallback <5ms), the system delivers transparent, evidence-backed candidate evaluations and tailored search committee interview questions while preserving full human-in-the-loop oversight for university hiring panels.
"@
    $s4Content.TextFrame.TextRange.Text = $s4Text
    $s4Content.TextFrame.TextRange.Font.Size = 11.5
}

# --- SLIDE 5: INTRODUCTION ---
Write-Host "Updating Slide 5: Introduction..."
$s5 = $pres.Slides.Item(5)
$s5Content = Get-ShapeByName $s5 "Content Placeholder"
if ($s5Content) {
    $s5Text = @"
* High-Stakes Faculty Hiring: Faculty recruitment is a multi-dimensional process evaluating candidates across instructional competence, scholarly publication rigor, departmental curriculum alignment, and institutional governance.

* Critical Flaws in Conventional ATS: Standard corporate applicant tracking tools rely on verbatim keyword matching. Candidates holding doctorates in allied quantitative disciplines (e.g. Applied Mathematics, Physics, Electrical Engineering) are erroneously flagged as 'Ph.D. Missing' when applying for Computer Science or Software Engineering positions.

* The FacultyHire Solution: FacultyHire resolves this by combining conventional recruitment management (System of Record) with an intelligent multi-agent AI screening workflow. It extracts multi-format CV credentials, evaluates applicants against departmental rubrics, and generates structured screening dossiers.

* Explainable Decision Support: The system eliminates black-box scoring by displaying comparative Three-Pillar balance meters, quoting verbatim evidence directly from candidate resumes, and equipping search committees with tailored probing interview questions.
"@
    $s5Content.TextFrame.TextRange.Text = $s5Text
    $s5Content.TextFrame.TextRange.Font.Size = 11.5
}

# --- SLIDE 6: OBJECTIVES (Bulleted) ---
Write-Host "Updating Slide 6: Objectives (Bulleted)..."
$s6 = $pres.Slides.Item(6)
$s6Content = Get-ShapeByName $s6 "Content Placeholder"
if ($s6Content) {
    $s6Text = @"
* Implement Multi-Agent Orchestration: Deploy a 4-agent LangGraph directed state graph (Profile Extractor -> Rubric Analyzer -> Evidence Evaluator -> Scoring & Synthesis) to coordinate candidate evaluations autonomously.

* Ensure Evidence Grounding & Anti-Hallucination: Constrain evaluation agents to quote verbatim text directly from candidate resumes for every evaluated criterion, eliminating speculative qualifications.

* Execute Three-Pillar Academic Evaluation: Quantify faculty suitability across calibrated sub-scores: Teaching & Pedagogy (40%), Research Scholarship (35%), and Departmental Curriculum Fit (25%).

* Honor Allied STEM Doctorates: Implement a 4-Tier Education Crediting Matrix that credits quantitative rigor in allied fields (Applied Math, Computational Science, EE, Physics) at 75% with targeted gap identification.

* Build a Resilient Hybrid Architecture: Establish seamless REST communication between a robust Java Spring Boot backend (PostgreSQL/H2 System of Record) and a high-performance Python FastAPI AI microservice.
"@
    $s6Content.TextFrame.TextRange.Text = $s6Text
    $s6Content.TextFrame.TextRange.Font.Size = 11
}

# --- SLIDE 7: OBJECTIVES (Paragraph Style) ---
Write-Host "Updating Slide 7: Objectives (Paragraph Style)..."
$s7 = $pres.Slides.Item(7)
$s7Content = Get-ShapeByName $s7 "Content Placeholder"
if ($s7Content) {
    $s7Text = @"
The primary objective of FacultyHire is to develop an integrated recruitment management platform tailored for university faculty search committees. The platform centralizes job requisition authoring, candidate registration, resume ingestion, and permanent screening archive management through a decoupled microservice architecture.

Another core engineering objective is to automate the extraction and deep academic analysis of candidate credentials from multi-format CVs (PDF, DOCX, and bulk ZIP archives) using Python document processing. By deploying a 4-agent LangGraph workflow, the system evaluates candidates against departmental rubrics, verifies terminal degrees, and calculates calibrated three-pillar sub-scores.

The project also aims to provide qualitative decision-support artifacts, notably generating tailored search committee probing questions and progressive-disclosure dossiers. Finally, the system guarantees 100% air-gapped on-premise execution via local LLMs and zero-config embedded H2 database fallbacks, ensuring total data privacy while preserving human-in-the-loop governance.
"@
    $s7Content.TextFrame.TextRange.Text = $s7Text
    $s7Content.TextFrame.TextRange.Font.Size = 11.5
}

# --- SLIDE 9: SYSTEM ARCHITECTURE OVERVIEW ---
Write-Host "Updating Slide 9: Architecture Overview..."
$s9 = $pres.Slides.Item(9)
$s9Content = Get-ShapeByName $s9 "Content Placeholder"
if ($s9Content) {
    $s9Text = @"
FacultyHire follows a hybrid three-tier polyglot microservice architecture consisting of a React 18 user portal, an enterprise Java Spring Boot 3 backend, and a Python FastAPI AI cognitive microservice:

* Java Spring Boot Backend (Port 8080): Operates as the immutable System of Record (SoR) managing job requisitions, candidate profiles, and permanent screening result archives via Spring Data JPA and Hibernate. Supports PostgreSQL 15+ for production and embedded H2 in-memory mode for zero-config portable execution without database passwords.

* Python FastAPI AI Service (Port 8001): High-throughput asynchronous cognitive engine managing document extraction (pypdf, python-docx, zip), LangGraph multi-agent orchestration, Groq LPU cloud inference, and the air-gapped offline analyzer.

* React 18 + Vite Web Portal (Port 5173): Client interface providing dynamic multi-phase progress tracking, glanceable executive scorecards, and progressive disclosure dossier drawers. Built-in reverse proxy routes '/api/*' to Spring Boot and '/api/v1/*' to FastAPI.

This decoupled separation allows application lifecycle management and AI screening workloads to scale independently.
"@
    $s9Content.TextFrame.TextRange.Text = $s9Text
    $s9Content.TextFrame.TextRange.Font.Size = 11
}

# --- SLIDE 10: COMMUNICATION FLOW ---
Write-Host "Updating Slide 10: Communication Flow..."
$s10 = $pres.Slides.Item(10)
$s10Content = Get-ShapeByName $s10 "Content Placeholder"
if ($s10Content) {
    $s10Text = @"
1. Recruitment Initiation: The search committee interacts with the React frontend to create faculty job postings, set required competencies, and submit candidate resumes (single or bulk ZIP).

2. Direct Cognitive Screening: The frontend initiates screening by sending a multipart POST request directly to the Python FastAPI microservice (/api/v1/screen-resume). The service validates inputs, extracts document text, and routes to the active engine (LangGraph over Groq LPU or the offline Ollama/deterministic analyzer).

3. Structured Evaluation Synthesis: The AI service returns a validated Pydantic ScreeningResult containing composite match score, Three-Pillar sub-scores, verbatim evidence citations, and 3 tailored committee interview questions.

4. Audit Persistence to System of Record: The React client renders the glanceable card and dossier drawer, and automatically issues REST calls to the Java backend (/api/candidates and /api/screening-results) to permanently save the candidate and screening audit trail in PostgreSQL/H2.

5. Failure Resilience: If the live AI service is unreachable, the frontend seamlessly falls back to cached database results, ensuring zero recruiter disruption.
"@
    $s10Content.TextFrame.TextRange.Text = $s10Text
    $s10Content.TextFrame.TextRange.Font.Size = 11
}

# --- SLIDE 11: MODULE IMPLEMENTATION (Part 1) ---
Write-Host "Updating Slide 11: Module Implementation (Part 1)..."
$s11 = $pres.Slides.Item(11)
$s11Content = Get-ShapeByName $s11 "Content Placeholder"
if ($s11Content) {
    $s11Text = @"
Module 1: Enterprise System of Record & Persistence Layer (Java Spring Boot 3 + PostgreSQL/H2)
* Implements the authoritative System of Record (SoR) pattern ensuring transactional integrity and ACID compliance.
* Manages relational domain entities: Job (requisitions, salary, competencies), Candidate (contact, stage), Resume (storage pointers, metadata), and ScreeningResult (scores, matched skills, JSON evidence).
* Dual-Database Strategy: Configured for production PostgreSQL (Port 5432) with automatic fallback to an embedded in-memory H2 database for zero-config portable deployments.

Module 2: Cognitive Ingestion & Autonomous Multi-Agent Pipeline (Python FastAPI + LangGraph)
* High-throughput document parsing supporting multi-column PDF (pypdf/pymupdf), Word (python-docx), and bulk ZIP batches.
* LangGraph 4-Agent Directed Acyclic Graph:
  - Agent 1 (Profile Extractor): Extracts candidate name, degrees, institutions, experience, and publications.
  - Agent 2 (Criteria Analyzer): Deconstructs job description into mandatory vs preferred academic rubrics.
  - Agent 3 (Evidence Evaluator): Enforces verbatim CV quote extraction for every evaluated criterion.
  - Agent 4 (Scoring Synthesis): Calibrates composite score, computes Three-Pillars, and recommends rank.
"@
    $s11Content.TextFrame.TextRange.Text = $s11Text
    $s11Content.TextFrame.TextRange.Font.Size = 10.5
}

# --- SLIDE 12: MODULE IMPLEMENTATION (Part 2) ---
Write-Host "Updating Slide 12: Module Implementation (Part 2)..."
$s12 = $pres.Slides.Item(12)
$s12Content = Get-ShapeByName $s12 "Content Placeholder"
if ($s12Content) {
    $s12Text = @"
Module 3: Academic Recruiter Evaluation Framework (Domain Models & Crediting)
* 4-Tier Education Crediting Matrix: Eliminates keyword rejection of allied doctorates (credits Applied Math, Computational Science, Physics, EE at 75% for CS/SE positions) while flagging specific curriculum gaps.
* Three-Pillar Academic Composite Formula: Formalized as Composite = 0.40 * S_teaching + 0.35 * S_research + 0.25 * S_domain, balancing instructional pedagogy, publication impact, and syllabus fit.
* Recommended Faculty Appointment Rank: Evaluates candidate tenure and scholarship to recommend appropriate rank (Associate Professor, Assistant Professor Tenure-Track, or Senior Lecturer).

Module 4: Progressive Disclosure Dossier & Committee Tools (React 18 + Modular CSS)
* Tier 1 Glanceable Executive Card: Score circle (0-100), color-coded recommendation badge (Strong Recommend, Interview, Review, Reject), and horizontal Three-Pillar balance meters.
* Tier 2 Reviewer Tools Drawer: Collapsible two-tab dossier containing Sub-Scores & Verbatim Evidence, and Search Committee Interview Pack with 1-click clipboard copy utility.
* Multi-Stage Dynamic Progress Stepper: Visualizes screening progression across 4 real-time animated phases.
"@
    $s12Content.TextFrame.TextRange.Text = $s12Text
    $s12Content.TextFrame.TextRange.Font.Size = 10.5
}

# ==============================================================================
# INSERT 4 OUTPUT FRAME SLIDES AFTER SLIDE 12
# ==============================================================================
Write-Host "Creating 4 Project Output Frame Slides..."

function Setup-FrameSlide($slide, $titleText, $frameText, $cardText) {
    foreach ($sh in $slide.Shapes) {
        if ($sh.Name -like "*Title*") {
            $sh.TextFrame.TextRange.Text = $titleText
            $sh.TextFrame.TextRange.Font.Size = 19
        }
        if ($sh.Name -like "*Content*") {
            $sh.Delete()
        }
    }

    # Frame Shape (Left Side)
    $frame = $slide.Shapes.AddShape(1, 36, 110, 425, 365)
    $frame.Fill.Solid()
    $frame.Fill.ForeColor.RGB = 0xFCFAF8
    $frame.Line.DashStyle = 4
    $frame.Line.ForeColor.RGB = 0xB8A394
    $frame.Line.Weight = 2
    $frame.TextFrame.TextRange.Text = "`r`n`r`n`r`n`r`n[ INSERT PROJECT OUTPUT SCREENSHOT HERE ]`r`n`r`n" + $frameText
    $frame.TextFrame.TextRange.Font.Size = 12
    $frame.TextFrame.TextRange.Font.Bold = 1
    $frame.TextFrame.TextRange.Font.Color.RGB = 0x604020
    $frame.TextFrame.HorizontalAnchor = 2

    # Description Card (Right Side)
    $card = $slide.Shapes.AddShape(1, 475, 110, 210, 365)
    $card.Fill.Solid()
    $card.Fill.ForeColor.RGB = 0xF9F5F1
    $card.Line.ForeColor.RGB = 0xE1D5CB
    $card.Line.Weight = 1
    $card.TextFrame.TextRange.Text = $cardText
    $card.TextFrame.TextRange.Font.Size = 10
    $card.TextFrame.TextRange.Font.Color.RGB = 0x282015
}

$out1 = $pres.Slides.Item(12).Duplicate()
$out2 = $pres.Slides.Item(13).Duplicate()
$out3 = $pres.Slides.Item(14).Duplicate()
$out4 = $pres.Slides.Item(15).Duplicate()

Setup-FrameSlide -slide $out1 `
    -titleText "PROJECT OUTPUT: RESUME INGESTION & PROGRESS STEPPER" `
    -frameText "Resume File Upload & Dynamic 4-Phase Progress Stepper" `
    -cardText "INTERFACE CAPABILITIES:`r`n`r`n* Multi-Format Ingestion: Supports single PDF, DOCX, or bulk ZIP archives.`r`n`r`n* 4-Phase Live Stepper:`r`n  1. Uploading & Parsing (15%)`r`n  2. Rubric Matching (40%)`r`n  3. Synthesizing Evidence (75%)`r`n  4. Finalizing Dossier (100%)`r`n`r`n* Recruiter Transparency: Animated progress bar eliminates uncertainty during inference.`r`n`r`n* Zero-Emoji Design: Clean semantic badges and typography."

Setup-FrameSlide -slide $out2 `
    -titleText "PROJECT OUTPUT: TIER 1 EXECUTIVE GLANCEABLE CARD" `
    -frameText "Glanceable Score Circle & Three-Pillar Horizontal Meters" `
    -cardText "INTERFACE CAPABILITIES:`r`n`r`n* Composite Match Score: High-visibility circle gauge (0-100) calibrated across academic criteria.`r`n`r`n* Recommendation Pill: Distinct semantic status (Strong Recommend, Interview, Review, Reject).`r`n`r`n* Three-Pillar Meters: Horizontal comparative balance bars for Teaching, Research, and Domain alignment.`r`n`r`n* Executive Summary: Clear 2-sentence rationale synthesized by the scoring agent."

Setup-FrameSlide -slide $out3 `
    -titleText "PROJECT OUTPUT: TIER 2 DOSSIER - EVIDENCE BREAKDOWN" `
    -frameText "Progressive Disclosure Drawer - Sub-Scores & Evidence" `
    -cardText "INTERFACE CAPABILITIES:`r`n`r`n* Progressive Disclosure: Collapsible drawer kept closed by default to prevent reviewer fatigue.`r`n`r`n* Competencies Matched: Green badge tags showing verified skills.`r`n`r`n* Discipline Gaps: Orange badge tags highlighting missing domain areas.`r`n`r`n* Verbatim Evidence: Citation cards displaying exact quotes from the candidate CV alongside objective committee assessments."

Setup-FrameSlide -slide $out4 `
    -titleText "PROJECT OUTPUT: TIER 2 DOSSIER - COMMITTEE INTERVIEW PACK" `
    -frameText "Search Committee Interview Pack & 1-Click Question Copier" `
    -cardText "INTERFACE CAPABILITIES:`r`n`r`n* Probing Questions: Exactly 3 tailored interview questions targeting portfolio gaps, empirical research translation, and ABET accreditation.`r`n`r`n* Numbered Question Cards: Formatted distinctly for faculty hiring committees.`r`n`r`n* 1-Click Clipboard Copy: Instant 'Copy All Questions' button formats questions into a numbered list for immediate committee circulation."

# ==============================================================================
# UPDATE REMAINING SLIDES (Now slides 17, 18, 19, 20)
# ==============================================================================

# --- SLIDE 17: RESULTS AND DISCUSSIONS ---
Write-Host "Updating Slide 17: Results and Discussions..."
$s17 = $pres.Slides.Item(17)
$s17Content = Get-ShapeByName $s17 "Content Placeholder"
if ($s17Content) {
    $s17Text = @"
* Ultra-Low Screening Latency: Groq Cloud LPU inference delivers verified candidate evaluations in sub-1.5 seconds, providing a 15x speedup over conventional cloud LLM providers while enforcing rigid Pydantic JSON schemas.

* Resolution of Allied Doctorate Bias: In comparative benchmark tests on Dr. Marcus Vance (Applied Mathematics Ph.D. applying for Software Engineering), legacy ATS assigned 0% on education and rejected. FacultyHire recognized the quantitative doctorate under the 4-Tier Matrix, assigned 75% education credit, identified curriculum gaps, scored 72.5%, and recommended interview.

* 100% Offline Air-Gapped Operation: Tested and verified complete disconnected operation via local Ollama (LLaMA 3.2 tuned with 10 threads, ~5s) and deterministic rule-based fallback (<5ms), ensuring compliance with university data privacy mandates.

* Automated Test Suite Verification: Achieved 100% pass rate across 22 / 22 Pytest unit and integration tests covering endpoint validation, mocked Groq screening, error handling, and offline fallbacks.

* Resilient Data Persistence: Verified automatic permanent storage of candidates, jobs, and screening dossiers to PostgreSQL and embedded H2 databases.
"@
    $s17Content.TextFrame.TextRange.Text = $s17Text
    $s17Content.TextFrame.TextRange.Font.Size = 11
}

# --- SLIDE 18: CONCLUSION ---
Write-Host "Updating Slide 18: Conclusion & Future Scope..."
$s18 = $pres.Slides.Item(18)
$s18Content = Get-ShapeByName $s18 "Content Placeholder"
if ($s18Content) {
    $s18Text = @"
Conclusion:
FacultyHire demonstrates the successful development of an enterprise-grade polyglot recruitment platform tailored specifically for higher education faculty search committees. By unifying Java Spring Boot 3, Python FastAPI, LangGraph, and React 18, the system bridges the gap between automated recruitment technology and academic hiring norms. Key contributions include the 4-Tier Education Crediting Matrix, Three-Pillar Academic Scoring, and automated Search Committee Interview Packs.

Future Enhancements:
* Blind Review Mode: Automated redaction of candidate names, genders, and institutional prestige markers to eliminate unconscious bias during initial review.
* Campus LMS & HRIS Integration: Direct data connectors for Canvas, Blackboard, and Workday HigherEd to synchronize faculty onboarding.
* Federated Committee Voting: Collaborative multi-reviewer scorecards and consensus aggregation for distributed hiring panels.
* Extended OCR Capabilities: Native Tesseract integration for legacy scanned photocopied faculty dossiers.
"@
    $s18Content.TextFrame.TextRange.Text = $s18Text
    $s18Content.TextFrame.TextRange.Font.Size = 11
}

# --- SLIDE 19: REFERENCES ---
Write-Host "Updating Slide 19: References..."
$s19 = $pres.Slides.Item(19)
$s19Content = Get-ShapeByName $s19 "Content Placeholder"
if ($s19Content) {
    $s19Text = @"
1. A. Vaswani et al., 'Attention Is All You Need,' in Advances in Neural Information Processing Systems (NeurIPS), 2017.
2. J. Devlin, M.-W. Chang, K. Lee and K. Toutanova, 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding,' in Proc. NAACL-HLT, 2019.
3. T. Brown et al., 'Language Models are Few-Shot Learners,' in Advances in Neural Information Processing Systems (NeurIPS), 2020.
4. V. Bhatia, P. Rawat, A. Kumar and R. R. Shah, 'End-to-End Resume Parsing and Finding Candidates for a Job Description using BERT,' arXiv:1910.03089, 2019.
5. J. Wei et al., 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models,' in Advances in Neural Information Processing Systems (NeurIPS), 2022.
6. S. Yao et al., 'ReAct: Synergizing Reasoning and Acting in Language Models,' in Proc. Int. Conf. Learning Representations (ICLR), 2023.
7. M. Wooldridge and N. R. Jennings, 'Intelligent agents: theory and practice,' The Knowledge Engineering Review, vol. 10, no. 2, pp. 115-152, 1995.
"@
    $s19Content.TextFrame.TextRange.Text = $s19Text
    $s19Content.TextFrame.TextRange.Font.Size = 10.5
}

# --- UPDATE SLIDE NUMBERS ACROSS ALL 20 SLIDES ---
Write-Host "Updating Slide Numbers (1 to $($pres.Slides.Count))..."
for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $slide = $pres.Slides.Item($i)
    foreach ($sh in $slide.Shapes) {
        if ($sh.Name -like "*Slide Number*") {
            $sh.TextFrame.TextRange.Text = "$i"
        }
    }
}

# Save presentation
Write-Host "Saving presentation to $dstPath..."
$pres.SaveAs($dstPath)
$pres.Close()
$ppt.Quit()

# Copy to artifact directory
Copy-Item -Path $dstPath -Destination $artifactPath -Force
Write-Host "Successfully copied to artifact path: $artifactPath"
Write-Host "ALL DONE! Total slides: 20"
