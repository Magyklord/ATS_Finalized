@echo off
title FacultyHire - System Launcher
echo ======================================================================
echo          FacultyHire - AI Recruitment and Screening System           
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

:: 1. Auto-detect Java / JDK 17+
where java >nul 2>&1
if errorlevel 1 (
    echo [JAVA CHECK] 'java' not found in system PATH. Searching for JDK...
    for /d %%D in ("C:\Program Files\Eclipse Adoptium\jdk*" "C:\Program Files\Java\jdk*" "C:\Program Files\Amazon Corretto\jdk*" "C:\Program Files\Microsoft\jdk*") do (
        if exist "%%D\bin\javac.exe" (
            set "JAVA_HOME=%%D"
            set "PATH=%%D\bin;%PATH%"
            goto :found_java
        )
    )
    echo [ERROR] No Java JDK found! Please install JDK 17 or higher from https://adoptium.net/
    pause
    exit /b 1
    :found_java
    echo [JAVA CHECK] Found JDK at %JAVA_HOME%
)

:: 2. Check Database Configuration
set "SPRING_ARGS="
powershell -NoProfile -Command "$c = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue; exit [int](!$c)" >nul 2>&1
if errorlevel 1 (
    echo [DATABASE] PostgreSQL not detected on port 5432.
    echo [DATABASE] Automatically using built-in H2 database (PostgreSQL compatibility mode).
    echo [DATABASE] System will run with full functionality with zero manual DB setup!
    set "SPRING_ARGS=-Dspring-boot.run.arguments=--spring.profiles.active=h2"
) else (
    echo [DATABASE] PostgreSQL detected on port 5432.
    if "%DB_PASSWORD%"=="" (
        set /p DB_PASSWORD="Enter PostgreSQL password (press Enter for default 'varun2006'): "
    )
    if "%DB_PASSWORD%"=="" set "DB_PASSWORD=varun2006"
    :: Attempt to create recruitment_db if psql is available
    where psql >nul 2>&1
    if not errorlevel 1 (
        psql -U postgres -c "CREATE DATABASE recruitment_db;" >nul 2>&1
    )
)

:: 3. Setup Python venv if missing
if not exist "%ROOT_DIR%ai-service\.venv\Scripts\python.exe" (
    echo.
    echo [Setup] First-time setup: Creating Python virtual environment in ai-service...
    cd /d "%ROOT_DIR%ai-service"
    python -m venv .venv
    echo [Setup] Installing Python dependencies from requirements.txt...
    .\.venv\Scripts\pip install -r requirements.txt
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
echo [1/3] Starting Python AI Microservice (Port 8001)...
start "FacultyHire - Python AI Service" cmd /k "cd /d "%ROOT_DIR%ai-service" && (if exist ".\.venv\Scripts\python.exe" (.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload) else (python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload))"

echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "FacultyHire - Java Backend" cmd /k "cd /d "%ROOT_DIR%" && if defined JAVA_HOME (set "PATH=%JAVA_HOME%\bin;%PATH%") && set "DB_PASSWORD=%DB_PASSWORD%" && mvnw.cmd spring-boot:run %SPRING_ARGS%"

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "FacultyHire - React Frontend" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo ======================================================================
echo All 3 services have been launched in separate terminal windows:
echo   - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs
echo   - Java Spring Boot Backend              : http://127.0.0.1:8080
echo   - React Web Portal                      : http://localhost:5173
echo ======================================================================
echo.
echo Opening browser to http://localhost:5173 in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173
