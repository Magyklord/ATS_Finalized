@echo off
title FacultyHire - Java Backend (Port 8080)
cd /d "%~dp0.."

echo ======================================================================
echo Starting Java Spring Boot Backend on Port 8080...
echo ======================================================================
echo.

:: Automatically clear any zombie or active process occupying port 8080
echo [Port Check] Ensuring port 8080 is available...
powershell -NoProfile -Command ^
  "$conn = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue; " ^
  "if ($conn) { " ^
  "  $pids = $conn | Select-Object -ExpandProperty OwningProcess -Unique; " ^
  "  foreach ($p in $pids) { " ^
  "    if ($p -gt 0) { " ^
  "      Write-Host \"[Port 8080 Conflict] Freeing port 8080 from process $p...\"; " ^
  "      Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; " ^
  "    } " ^
  "  }; " ^
  "  Start-Sleep -Milliseconds 600; " ^
  "}"

:: Detect JAVA_HOME if not already set
if not defined JAVA_HOME (
    for /d %%D in ("C:\Program Files\Eclipse Adoptium\jdk*" "C:\Program Files\Java\jdk*" "C:\Program Files\Amazon Corretto\jdk*" "C:\Program Files\Microsoft\jdk*") do (
        if exist "%%D\bin\java.exe" (
            set "JAVA_HOME=%%D"
            set "PATH=%%D\bin;%PATH%"
            goto :java_ready
        )
    )
)
:java_ready

:: Prefer fast direct JAR execution if already packaged, fallback to mvnw
if exist "target\recruitment-system-0.0.1-SNAPSHOT.jar" (
    echo [Backend] Launching packaged production JAR...
    java -jar target\recruitment-system-0.0.1-SNAPSHOT.jar
) else (
    echo [Backend] Packaging JAR not found, launching with Maven...
    call mvnw.cmd spring-boot:run
)

if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Java Backend failed to start. Check the logs above.
    echo ======================================================================
    pause
)
