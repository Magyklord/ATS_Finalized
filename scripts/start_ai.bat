@echo off
title FacultyHire - Python AI Service (Port 8001)
cd /d "%~dp0..\ai-service"

echo ======================================================================
echo Starting Python AI Microservice on Port 8001...
echo ======================================================================
echo.

if not exist ".venv\Scripts\python.exe" (
    echo [Setup] Creating virtual environment in ai-service\.venv...
    python -m venv .venv
    echo [Setup] Installing requirements...
    call .venv\Scripts\pip.exe install -r requirements.txt
)

call .venv\Scripts\activate.bat
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Python AI Service failed to start. Check the logs above.
    echo ======================================================================
    pause
)
