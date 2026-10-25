Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "         FacultyHire - AI Recruitment and Screening System            " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Python AI Service
Write-Host "[1/3] Starting Python AI Microservice (Port 8001)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/c `"$rootDir\scripts\start_ai.bat`""

# 2. Start Java Spring Boot Backend
Write-Host "[2/3] Starting Java Spring Boot Backend (Port 8080)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/c `"$rootDir\scripts\start_backend.bat`""

# 3. Start React Frontend
Write-Host "[3/3] Starting React + Vite Frontend (Port 5173)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/c `"$rootDir\scripts\start_frontend.bat`""

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "All 3 services have been launched in separate terminal windows:" -ForegroundColor Cyan
Write-Host "  - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs"
Write-Host "  - Java Spring Boot Backend              : http://127.0.0.1:8080"
Write-Host "  - React Web Portal                      : http://localhost:5173"
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser to http://localhost:5173 in 4 seconds..."
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
