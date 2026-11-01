@echo off
title FacultyHire - React Frontend (Port 5173)
cd /d "%~dp0..\frontend"

echo ======================================================================
echo Starting React Vite Frontend on Port 5173...
echo ======================================================================
echo.

:: Automatically clear any zombie process occupying port 5173
echo [Port Check] Ensuring port 5173 is available...
powershell -NoProfile -Command ^
  "$conn = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue; " ^
  "if ($conn) { " ^
  "  $pids = $conn | Select-Object -ExpandProperty OwningProcess -Unique; " ^
  "  foreach ($p in $pids) { " ^
  "    if ($p -gt 0) { " ^
  "      Write-Host \"[Port 5173 Conflict] Freeing port 5173 from process $p...\"; " ^
  "      Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; " ^
  "    } " ^
  "  }; " ^
  "  Start-Sleep -Milliseconds 600; " ^
  "}"

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
