#!/bin/bash
# ============================================================
# TravelMate Automated ML Chatbot Startup Script (macOS/Linux)
# Installs requirements, generates datasets, trains models,
# exports diagrams/reports, and starts the FastAPI REST server.
# ============================================================

set -e

# Get the directory of this script (backend/)
BACKEND_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
WORKSPACE_DIR="$(dirname "$BACKEND_DIR")"

echo "=========================================================="
echo "      TravelMate AI - Final Year ML Project Automation     "
echo "=========================================================="

# Ensure workspace is target CWD
cd "$WORKSPACE_DIR"

# Ensure Python exists
if ! command -v python >/dev/null 2>&1; then
    echo "ERROR: Python not found."
    echo "Activate your Conda environment first:"
    echo "  conda activate travelmate"
    exit 1
fi

# Display Python information
echo ""
echo "Using Python: $(python --version)"
echo "Python Path:  $(which python)"
echo "Using pip:    $(python -m pip --version)"

# Optional: Warn if not running inside a Conda environment
if [ -z "$CONDA_DEFAULT_ENV" ]; then
    echo ""
    echo "WARNING: No Conda environment detected."
    echo "Recommended:"
    echo "  conda activate travelmate"
    echo ""
fi

# 1. Install requirements
echo ""
echo "[1/5] Verifying Python library dependencies..."
python -m pip install -r backend/requirements.txt

# 2. Generate dataset
echo ""
echo "[2/5] Synthesizing dataset from React intents and synonym maps..."
python backend/data_generator.py

# 3. Train model
echo ""
echo "[3/5] Launching NLP & Classifier Training Pipeline..."
python backend/train.py

# 4. Generate reports and diagrams
echo ""
echo "[4/5] Exporting demo queries, predictive checks, and vector architecture diagrams..."
python backend/utils/generate_demo_data.py
python backend/utils/generate_diagram.py

# 5. Start FastAPI
echo ""
echo "=========================================================="
echo "  All academic deliverables built successfully!"
echo "  Starting FastAPI REST API Server..."
echo ""
echo "  Endpoints Online:"
echo "    - http://localhost:8000/api/health"
echo "    - http://localhost:8000/api/chat"
echo "    - http://localhost:8000/api/model-info"
echo "    - http://localhost:8000/api/model-metrics"
echo ""
echo "  Swagger UI:"
echo "    - http://localhost:8000/docs"
echo "=========================================================="

cd backend

python -m uvicorn main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload