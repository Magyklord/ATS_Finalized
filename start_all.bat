@echo off
title FacultyHire - System Launcher
echo ======================================================================
echo          FacultyHire - AI Recruitment and Screening System           
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

:: Prompt for PostgreSQL DB_PASSWORD if not already set in environment
if "%DB_PASSWORD%"=="" (
    set /p DB_PASSWORD="Enter PostgreSQL password for user 'postgres' (press Enter if blank): "
)

echo.
echo [1/3] Starting Python AI Microservice (Port 8001)...
start "FacultyHire - Python AI Service" cmd /k "cd /d "%ROOT_DIR%ATS Final Project\backend" && (if exist ".\.venv\Scripts\python.exe" (.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload) else (python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload))"

echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "FacultyHire - Java Backend" cmd /k "cd /d "%ROOT_DIR%" && set "DB_PASSWORD=%DB_PASSWORD%" && mvnw.cmd spring-boot:run"

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "FacultyHire - React Frontend" cmd /k "cd /d "%ROOT_DIR%AI ATS frontend\recruitment-frontend" && npm run dev"

echo.
echo ======================================================================
echo All 3 services have been launched in separate terminal windows:
echo   - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs
echo   - Java Spring Boot Backend              : http://localhost:8080
echo   - React Web Portal                      : http://localhost:5173
echo ======================================================================
echo.
echo Opening browser to http://localhost:5173 in 4 seconds...
timeout /t 4 >nul
start http://localhost:5173
