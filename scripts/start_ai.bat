@echo off
title FacultyHire - Python AI Service (Port 8001)
cd /d "%~dp0..\ai-service"

echo ======================================================================
echo Starting Python AI Microservice on Port 8001...
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

call .venv\Scripts\activate.bat
call .venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Python AI Service failed to start. Check the logs above.
    echo ======================================================================
    pause
)
