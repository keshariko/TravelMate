@echo off
rem ============================================================
rem TravelMate Automated ML Chatbot Startup Script (Windows)
rem Installs requirements, generates datasets, trains models,
rem exports diagrams/reports, and starts the FastAPI REST server.
rem ============================================================

echo ==========================================================
echo       TravelMate AI - Final Year ML Project Automation     
echo ==========================================================

rem Move to workspace root
cd %~dp0\..

rem 1. Installing requirements
echo.
echo [1/5] Verifying Python library dependencies...
pip install -r backend\requirements.txt

rem 2. Generating dataset
echo.
echo [2/5] Synthesizing dataset from React intents and synonym maps...
python backend\data_generator.py

rem 3. Model Training
echo.
echo [3/5] Launching NLP ^& Classifier Training Pipeline...
python backend\train.py

rem 4. Generating Evaluation Reports ^& Diagrams
echo.
echo [4/5] Exporting demo queries, predictive checks, and vector architecture diagrams...
python backend\utils\generate_demo_data.py
python backend\utils\generate_diagram.py

rem 5. Starting FastAPI
echo.
echo ==========================================================
echo   All academic deliverables built successfully!            
echo   Starting FastAPI REST API Server...                       
echo   Endpoints Online:                                         
echo     - http://localhost:8000/api/health (GET)                
echo     - http://localhost:8000/api/chat (POST)                  
echo     - http://localhost:8000/api/model-info (GET)            
echo     - http://localhost:8000/api/model-metrics (GET)         
echo   Swagger UI Docs: http://localhost:8000/docs               
echo ==========================================================
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
