#!/usr/bin/env bash
# ======================================================================
#          FacultyHire - AI Recruitment and Screening System           
# ======================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR" || exit 1

SPRING_ARGS=""
if nc -z 127.0.0.1 5432 2>/dev/null; then
    echo "[DATABASE] PostgreSQL detected on port 5432."
    if [ -z "$DB_PASSWORD" ]; then
        read -rsp "Enter PostgreSQL password for user 'postgres' (press Enter for 'varun2006'): " DB_PASSWORD
        echo ""
        if [ -z "$DB_PASSWORD" ]; then
            DB_PASSWORD="varun2006"
        fi
        export DB_PASSWORD
    fi
else
    echo "[DATABASE] PostgreSQL not detected on port 5432."
    echo "[DATABASE] Automatically using built-in H2 database (PostgreSQL mode)."
    SPRING_ARGS="-Dspring-boot.run.arguments=--spring.profiles.active=h2"
fi

# Setup Python venv if missing
if [ ! -f "$ROOT_DIR/ai-service/.venv/bin/python" ]; then
    echo "[Setup] First-time setup: Creating Python virtual environment in ai-service..."
    (
        cd "$ROOT_DIR/ai-service" || exit 1
        python3 -m venv .venv
        ./.venv/bin/pip install -r requirements.txt
    )
fi

# Setup node_modules if missing
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
    echo "[Setup] First-time setup: Installing React frontend dependencies in frontend..."
    (
        cd "$ROOT_DIR/frontend" || exit 1
        npm install
    )
fi

echo ""
echo "[1/3] Starting Python AI Microservice (Port 8001)..."
(
    cd "$ROOT_DIR/ai-service" || exit 1
    if [ -f "./.venv/bin/python" ]; then
        ./.venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
    else
        python3 -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
    fi
) &

echo "[2/3] Starting Java Spring Boot Backend (Port 8080)..."
(
    cd "$ROOT_DIR" || exit 1
    ./mvnw spring-boot:run $SPRING_ARGS
) &

echo "[3/3] Starting React + Vite Frontend (Port 5173)..."
(
    cd "$ROOT_DIR/frontend" || exit 1
    npm run dev
) &

echo ""
echo "======================================================================"
echo "All 3 services have been launched in background processes:"
echo "  - AI Microservice (FastAPI + LangGraph) : http://127.0.0.1:8001/docs"
echo "  - Java Spring Boot Backend              : http://127.0.0.1:8080"
echo "  - React Web Portal                      : http://localhost:5173"
echo "======================================================================"

sleep 5
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    open http://localhost:5173
fi

wait
