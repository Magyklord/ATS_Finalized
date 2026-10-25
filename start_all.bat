@echo off
title FacultyHire - System Launcher
echo ======================================================================
echo          FacultyHire - AI Recruitment and Screening System           
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo [1/3] Starting Python AI Microservice (Port 8001)...
start "FacultyHire - Python AI Service" cmd /c "%ROOT_DIR%scripts\start_ai.bat"

echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "FacultyHire - Java Backend" cmd /c "%ROOT_DIR%scripts\start_backend.bat"

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "FacultyHire - React Frontend" cmd /c "%ROOT_DIR%scripts\start_frontend.bat"

echo.
echo ======================================================================
echo All 3 services have been launched in separate terminal windows:
echo   - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs
echo   - Java Spring Boot Backend              : http://127.0.0.1:8080
echo   - React Web Portal                      : http://localhost:5173
echo ======================================================================
echo.
echo Opening browser to http://localhost:5173 in 4 seconds...
ping -n 5 127.0.0.1 >nul
start http://localhost:5173

echo.
echo Services are now active. You may close this launcher window anytime.
echo (The 3 services will continue running in their own windows).
pause
