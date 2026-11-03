@echo off
title FacultyHire - Offline AI Service (Port 8001)
cd /d "%~dp0..\ai-service"

echo ======================================================================
echo Starting FacultyHire Offline AI Analyzer on Port 8001...
echo (Zero-Network Mode: Local Ollama + Deterministic Safety Engine)
echo ======================================================================
echo.

:: Automatically clear any zombie process occupying port 8001
echo [Port Check] Ensuring port 8001 is available...
powershell -NoProfile -Command ^
  "$conn = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue; " ^
  "if ($conn) { " ^
  "  $pids = $conn | Select-Object -ExpandProperty OwningProcess -Unique; " ^
  "  foreach ($p in $pids) { " ^
  "    if ($p -gt 0) { " ^
  "      Write-Host \"[Port 8001 Conflict] Freeing port 8001 from process $p...\"; " ^
  "      Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; " ^
  "    } " ^
  "  }; " ^
  "  Start-Sleep -Milliseconds 600; " ^
  "}"

:: Attempt to detect and start Ollama if available on Windows
set "OLLAMA_FOUND=0"
where ollama >nul 2>&1
if not errorlevel 1 (
    set "OLLAMA_FOUND=1"
    set "OLLAMA_CMD=ollama"
) else (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        set "OLLAMA_FOUND=1"
        set "OLLAMA_CMD=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"
    )
)

if "%OLLAMA_FOUND%"=="1" (
    echo [Ollama Check] Checking local Ollama service...
    powershell -NoProfile -Command ^
      "$res = try { (Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2 -UseBasicParsing).StatusCode } catch { 0 }; " ^
      "exit (if ($res -eq 200) { 0 } else { 1 })"
    if errorlevel 1 (
        echo [Ollama] Launching Ollama background runner...
        start "Ollama Runner" /min cmd /c "%OLLAMA_CMD% serve"
        timeout /t 2 /nobreak >nul
    ) else (
        echo [Ollama] Local Ollama service is already active on port 11434.
    )
) else (
    echo [Notice] Ollama not found in standard paths.
    echo [Notice] The built-in deterministic offline engine will serve all screenings with 100%% uptime.
)

if not exist ".venv\Scripts\python.exe" (
    echo [Setup] Creating virtual environment in ai-service\.venv...
    where py >nul 2>&1
    if not errorlevel 1 (
        py -3.10 -m venv .venv || py -3 -m venv .venv || py -m venv .venv
    ) else (
        python -m venv .venv
    )
    echo [Setup] Installing requirements...
    call .venv\Scripts\pip.exe install -r requirements.txt
)

:: Configure Offline Analyzer Backend
set "ANALYZER_BACKEND=local"
set "OLLAMA_HOST=http://127.0.0.1:11434"
set "LOCAL_LLM_MODEL=llama3.2:3b"

call .venv\Scripts\activate.bat
echo [Backend] Launching FastAPI in OFFLINE mode (ANALYZER_BACKEND=local)...
call .venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Offline AI Service failed to start. Check the logs above.
    echo ======================================================================
    pause
)
