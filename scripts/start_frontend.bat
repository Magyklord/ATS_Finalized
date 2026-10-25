@echo off
title FacultyHire - React Frontend (Port 5173)
cd /d "%~dp0..\frontend"

echo ======================================================================
echo Starting React Vite Frontend on Port 5173...
echo ======================================================================
echo.

if not exist "node_modules" (
    echo [Setup] Installing npm packages in frontend...
    call npm install
)

call npm run dev
if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Frontend failed to start. Check the logs above.
    echo ======================================================================
    pause
)
