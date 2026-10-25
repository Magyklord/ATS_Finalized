@echo off
title FacultyHire - System Launcher
echo ======================================================================
echo          FacultyHire - AI Recruitment and Screening System           
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

:: 1. Auto-detect and configure JAVA_HOME if not defined
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot"
        set "PATH=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot\bin;%PATH%"
    ) else if exist "C:\Program Files\Java\jdk-21" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
        set "PATH=C:\Program Files\Java\jdk-21\bin;%PATH%"
    ) else if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
        set "PATH=C:\Program Files\Java\jdk-17\bin;%PATH%"
    )
)

:: 2. Prompt for PostgreSQL DB_PASSWORD if not set
if "%DB_PASSWORD%"=="" (
    set /p DB_PASSWORD="Enter PostgreSQL password for user 'postgres' (press Enter for 'varun2006'): "
)
if "%DB_PASSWORD%"=="" (
    set "DB_PASSWORD=varun2006"
)

echo.
echo [1/3] Starting Python AI Microservice (Port 8001)...
start "FacultyHire - Python AI Service" cmd /k "cd /d "%ROOT_DIR%ATS Final Project\backend" && (if exist ".\.venv\Scripts\python.exe" (.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload) else (python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload))"

echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "FacultyHire - Java Backend" cmd /k "cd /d "%ROOT_DIR%" && if defined JAVA_HOME (set "PATH=%JAVA_HOME%\bin;%PATH%") && set "DB_PASSWORD=%DB_PASSWORD%" && mvnw.cmd spring-boot:run"

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
echo Opening browser to http://localhost:5173 in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173
