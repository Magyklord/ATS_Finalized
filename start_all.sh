#!/usr/bin/env bash
# ======================================================================
#          FacultyHire - AI Recruitment and Screening System           
# ======================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR" || exit 1

echo "----------------------------------------------------------------------"
echo "Select Database Mode:"
echo "  [1] In-Memory Database (H2) - Works instantly on ANY computer, ZERO setup!"
echo "  [2] PostgreSQL Database     - Connects to PostgreSQL on port 5432"
echo "----------------------------------------------------------------------"
read -rp "Enter choice [1 or 2, default is 1]: " DB_CHOICE

if [ "$DB_CHOICE" == "2" ]; then
    echo "[DATABASE] Mode: PostgreSQL Database"
    export SPRING_PROFILES_ACTIVE="default"
    if [ -z "$DB_PASSWORD" ]; then
        read -rsp "Enter PostgreSQL password [default 'varun2006']: " DB_PASSWORD
        echo ""
        if [ -z "$DB_PASSWORD" ]; then
            DB_PASSWORD="varun2006"
        fi
        export DB_PASSWORD
    fi
else
    echo "[DATABASE] Mode: In-Memory Database (H2) - no PostgreSQL needed!"
    export SPRING_PROFILES_ACTIVE="h2"
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
echo "[1/3] Starting Python AI Microservice on Port 8001..."
(
    cd "$ROOT_DIR/ai-service" || exit 1
    if [ -f "./.venv/bin/python" ]; then
        ./.venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
    else
        python3 -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
    fi
) &

echo "[2/3] Starting Java Spring Boot Backend on Port 8080..."
(
    cd "$ROOT_DIR" || exit 1
    ./mvnw spring-boot:run
) &

echo "[3/3] Starting React + Vite Frontend on Port 5173..."
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

sleep 4
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    open http://localhost:5173
fi

wait
