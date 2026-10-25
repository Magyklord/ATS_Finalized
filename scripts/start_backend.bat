@echo off
title FacultyHire - Java Backend (Port 8080)
cd /d "%~dp0.."

echo ======================================================================
echo Starting Java Spring Boot Backend on Port 8080...
echo ======================================================================
echo.

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

call mvnw.cmd spring-boot:run
if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [ERROR] Java Backend failed to start. Check the logs above.
    echo ======================================================================
    pause
)
