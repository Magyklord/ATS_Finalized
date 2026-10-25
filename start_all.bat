@echo off
title FacultyHire - System Launcher
echo ======================================================================
echo          FacultyHire - AI Recruitment and Screening System           
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

:: 1. Verify Java Installation
set "JAVA_FOUND="
where java >nul 2>&1 && set "JAVA_FOUND=1"

if not defined JAVA_FOUND (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot\bin\javac.exe" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot"
        set "PATH=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot\bin;%PATH%"
        set "JAVA_FOUND=1"
    )
)

if not defined JAVA_FOUND (
    if defined JAVA_HOME (
        if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_FOUND=1"
    )
)

if not defined JAVA_FOUND (
    echo [ERROR] Java JDK 17 or higher is required but was not found.
    echo Please install Eclipse Temurin JDK 17 or 21 from https://adoptium.net/
    echo.
    pause
    exit /b 1
)

:: 2. Choose Database Mode
echo ----------------------------------------------------------------------
echo Select Database Mode:
echo   [1] In-Memory Database H2 : Works instantly on ANY computer, ZERO setup!
echo   [2] PostgreSQL Database   : Connects to PostgreSQL on port 5432
echo ----------------------------------------------------------------------
set "DB_CHOICE=1"
set /p DB_CHOICE=Enter choice 1 or 2 [default 1]: 
if "%DB_CHOICE%"=="2" (
    echo [DATABASE] Mode: PostgreSQL Database
    set "SPRING_PROFILES_ACTIVE=default"
    if "%DB_PASSWORD%"=="" set /p DB_PASSWORD=Enter PostgreSQL password [default varun2006]: 
    if "%DB_PASSWORD%"=="" set "DB_PASSWORD=varun2006"
    where psql >nul 2>&1 && psql -U postgres -c "CREATE DATABASE recruitment_db;" >nul 2>&1
) else (
    echo [DATABASE] Mode: In-Memory Database H2 -- no PostgreSQL needed!
    set "SPRING_PROFILES_ACTIVE=h2"
)

:: 3. Setup Python venv if missing
if not exist "%ROOT_DIR%ai-service\.venv\Scripts\python.exe" (
    echo.
    echo [Setup] First-time setup: Creating Python virtual environment in ai-service...
    cd /d "%ROOT_DIR%ai-service"
    python -m venv .venv
    echo [Setup] Installing Python dependencies from requirements.txt...
    call .venv\Scripts\pip.exe install -r requirements.txt
    cd /d "%ROOT_DIR%"
)

:: 4. Setup React node_modules if missing
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo.
    echo [Setup] First-time setup: Installing React frontend dependencies in frontend...
    cd /d "%ROOT_DIR%frontend"
    call npm install
    cd /d "%ROOT_DIR%"
)

echo.
echo [1/3] Starting Python AI Microservice on Port 8001...
start "FacultyHire - Python AI Service" cmd /k "cd /d "%ROOT_DIR%ai-service" && .venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

echo [2/3] Starting Java Spring Boot Backend on Port 8080...
start "FacultyHire - Java Backend" cmd /k "cd /d "%ROOT_DIR%" && if defined JAVA_HOME (set "PATH=%JAVA_HOME%\bin;%PATH%") && set "SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE%" && set "DB_PASSWORD=%DB_PASSWORD%" && call mvnw.cmd spring-boot:run"

echo [3/3] Starting React + Vite Frontend on Port 5173...
start "FacultyHire - React Frontend" cmd /k "cd /d "%ROOT_DIR%frontend" && call npm run dev"

echo.
echo ======================================================================
echo All 3 services have been launched in separate terminal windows:
echo   - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs
echo   - Java Spring Boot Backend              : http://127.0.0.1:8080
echo   - React Web Portal                      : http://localhost:5173
echo ======================================================================
echo.
echo Opening browser to http://localhost:5173 in 4 seconds...
timeout /t 4 >nul 2>&1 || ping -n 5 127.0.0.1 >nul
start http://localhost:5173

echo.
echo Services are now active. Keep this window or the individual service windows open.
pause
