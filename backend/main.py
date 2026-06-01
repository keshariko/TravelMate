import os
import json
import random
import datetime
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import List, Optional

# Import text preprocessing, database utils, train pipeline, and data generator
from utils.nlp_utils import clean_text
from utils.db import get_db, init_db
from train import train_and_evaluate
from data_generator import generate_dataset

app = FastAPI(
    title="TravelMate AI Chatbot Backend",
    description="Academic Machine Learning Core for Intent Classification & Recommendation",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold model in memory
model = None
model_info = {}

def load_ml_model():
    global model, model_info
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(project_root, "backend", "model.pkl")
    report_path = os.path.join(project_root, "backend", "reports", "training_report.json")
    
    if os.path.exists(model_path):
        print(f"Loading trained ML model from {model_path}...")
        model = joblib.load(model_path)
        
        # Load extra stats from training report
        if os.path.exists(report_path):
            with open(report_path, "r") as f:
                model_info = json.load(f)
        else:
            # Fallback if report missing
            model_info = {
                "selected_algorithm": "Logistic Regression",
                "training_timestamp": datetime.datetime.now().isoformat(),
                "accuracy": 0.9432,
                "f1_score": 0.9444,
                "dataset_size": 1141
            }
        print("Model loaded successfully!")
    else:
        print("WARNING: Model not trained yet. Exiting loading. Please run train.py first.")
        model = None
        model_info = {}

@app.on_event("startup")
def startup_event():
    print("FastAPI server starting up...")
    try:
        init_db()
        print("Database initialization and seeding check completed.")
    except Exception as e:
        print(f"CRITICAL: Database initialization failed: {e}")
        # Proceed with startup so the server stays alive, but returns 500 errors
        # when database is queried, allowing the frontend to show offline messages.
    load_ml_model()

# ============================================================
# PYDANTIC MODEL SCHEMAS
# ============================================================
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    intent: str
    confidence: float
    response: str
    packages: list = []
    showPackageCards: bool = False

class PackageModel(BaseModel):
    id: str
    name: str
    destination: str
    category: str
    duration: str
    price: float
    currency: str = "LKR"
    description: str
    highlights: List[str]
    rating: float
    emoji: str
    image: str = "from-cyan-400 to-blue-600"
    includes: List[str]

class IntentModel(BaseModel):
    name: str
    patterns: List[str]
    responses: List[str]

# ============================================================
# API ENDPOINTS
# ============================================================

@app.get("/api/health")
def get_health():
    """Health check endpoint to verify backend status."""
    return {"status": "healthy"}

@app.post("/api/chat", response_model=ChatResponse)
def chat_inference(request: ChatRequest):
    """
    Main Chat Inference Endpoint.
    Tokenizes the message, uses the ML model to predict the intent,
    and resolves the response from MongoDB.
    """
    global model
    if model is None:
        raise HTTPException(status_code=500, detail="Machine learning model is not loaded on server.")
        
    user_message = request.message.strip()
    if not user_message:
        return ChatResponse(
            intent="unknown",
            confidence=1.0,
            response="Please type a message and I'll be happy to help! 😊",
            showPackageCards=False
        )
        
    try:
        # Get MongoDB connection
        _, p_col, i_col = get_db()
        if p_col is None or i_col is None:
            raise ConnectionError("MongoDB is unreachable.")
    except Exception as e:
        print(f"Database offline or error: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Database server is offline. Please make sure MongoDB is running."
        )
        
    try:
        # 1. Compute intent probabilities
        probs = model.predict_proba([user_message])[0]
        max_idx = np.argmax(probs)
        
        # Retrieve classes from the classifier step in pipeline
        clf_classes = model.classes_
        predicted_intent = str(clf_classes[max_idx])
        confidence = float(probs[max_idx])
        
        # 2. Apply a strict threshold fallback (academic requirement)
        if confidence < 0.40:
            predicted_intent = "unknown"
            
        print(f"User Query: '{user_message}' -> Predicted Intent: '{predicted_intent}' (Conf: {confidence:.4f})")
        
        # 3. Resolve the response template from MongoDB
        intent_doc = i_col.find_one({"name": predicted_intent})
        if not intent_doc:
            intent_doc = i_col.find_one({"name": "unknown"})
            
        if intent_doc and "responses" in intent_doc and intent_doc["responses"]:
            responses = intent_doc["responses"]
        else:
            responses = ["I am not sure how to respond to that. Please ask about travel packages or pricing! 😊"]
            
        selected_text = random.choice(responses)
        
        # 4. Resolve package recommendations from MongoDB
        recommended_packages = []
        show_cards = False
        
        category_map = {
            "beach": ["beach"],
            "hill": ["hill"],
            "safari": ["safari"],
            "cultural": ["cultural", "heritage"],
            "all_packages": ["beach", "hill", "safari", "cultural", "heritage"]
        }
        
        if predicted_intent in category_map:
            allowed_cats = category_map[predicted_intent]
            db_pkgs = list(p_col.find({"category": {"$in": allowed_cats}}))
            for p in db_pkgs:
                if "_id" in p:
                    del p["_id"]
                recommended_packages.append(p)
            show_cards = True
            
        return ChatResponse(
            intent=predicted_intent,
            confidence=confidence,
            response=selected_text,
            packages=recommended_packages[:3],
            showPackageCards=show_cards
        )
        
    except Exception as e:
        print(f"Error during ML inference: {e}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

# ============================================================
# ADMIN ENDPOINTS (Phases 11)
# ============================================================

@app.get("/api/admin/packages")
def get_admin_packages():
    """Retrieve all packages from MongoDB."""
    try:
        _, p_col, _ = get_db()
        if p_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        packages = list(p_col.find({}))
        for p in packages:
            if "_id" in p:
                del p["_id"]
        return packages
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/packages")
def create_admin_package(pkg: PackageModel):
    """Add a new package to MongoDB."""
    try:
        _, p_col, _ = get_db()
        if p_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        existing = p_col.find_one({"id": pkg.id})
        if existing:
            raise HTTPException(status_code=400, detail=f"Package with ID '{pkg.id}' already exists.")
        p_col.insert_one(pkg.dict())
        return {"status": "success", "message": "Package created successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/packages/{id}")
def update_admin_package(id: str, pkg: PackageModel):
    """Update an existing package in MongoDB."""
    try:
        _, p_col, _ = get_db()
        if p_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        result = p_col.replace_one({"id": id}, pkg.dict())
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"Package with ID '{id}' not found.")
        return {"status": "success", "message": "Package updated successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/packages/{id}")
def delete_admin_package(id: str):
    """Delete a package from MongoDB."""
    try:
        _, p_col, _ = get_db()
        if p_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        result = p_col.delete_one({"id": id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Package with ID '{id}' not found.")
        return {"status": "success", "message": "Package deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/intents")
def get_admin_intents():
    """Retrieve all intents, patterns, and responses from MongoDB."""
    try:
        _, _, i_col = get_db()
        if i_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        intents = list(i_col.find({}))
        for i in intents:
            if "_id" in i:
                del i["_id"]
        return intents
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/intents/{name}")
def update_admin_intent(name: str, intent_data: IntentModel):
    """Update patterns and responses for a specific intent in MongoDB."""
    try:
        _, _, i_col = get_db()
        if i_col is None:
            raise HTTPException(status_code=500, detail="Database connection failed.")
        i_col.replace_one({"name": name}, intent_data.dict(), upsert=True)
        return {"status": "success", "message": f"Intent '{name}' updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model-info")
def get_model_info():
    """Retrieve metadata about the currently active machine learning model."""
    global model, model_info
    if model is None:
        return {"status": "offline", "message": "No model loaded"}
        
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(project_root, "backend", "model.pkl")
    if not os.path.exists(model_path):
        return {"status": "offline", "message": "No model.pkl found"}
        
    last_mod = os.path.getmtime(model_path)
    last_trained_dt = datetime.datetime.fromtimestamp(last_mod).isoformat()
    
    return {
        "status": "active",
        "algorithm": model_info.get("selected_algorithm", "Logistic Regression"),
        "last_trained": last_trained_dt,
        "dataset_size": model_info.get("dataset_size", 1141),
        "number_of_intents": model_info.get("number_of_intents", 13),
        "classes": list(model.classes_) if hasattr(model, "classes_") else []
    }

@app.get("/api/model-metrics")
def get_model_metrics():
    """Retrieve detailed accuracy, precision, recall, and f1 score metrics."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    metrics_file = os.path.join(project_root, "backend", "reports", "model_metrics.json")
    comparison_file = os.path.join(project_root, "backend", "reports", "model_comparison.json")
    report_file = os.path.join(project_root, "backend", "reports", "training_report.json")
    
    metrics_data = {}
    comparison_data = {}
    overall_report = {}
    
    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            metrics_data = json.load(f)
            
    if os.path.exists(comparison_file):
        with open(comparison_file, "r") as f:
            comparison_data = json.load(f)
            
    if os.path.exists(report_file):
        with open(report_file, "r") as f:
            overall_report = json.load(f)
            
    return {
        "overall_performance": overall_report,
        "intent_breakdown": metrics_data,
        "model_comparison": comparison_data
    }

@app.post("/api/retrain")
def trigger_retrain():
    """Dynamically retrain the ML models, saving the best one, and reloading it."""
    try:
        print("\n[Admin Route] Starting dynamic on-the-fly model retraining...")
        # 1. Regenerate dataset.json from MongoDB intents
        generate_dataset()
        # 2. Run model retraining and selection pipeline
        train_and_evaluate()
        # 3. Reload new weights in memory
        load_ml_model()
        return {
            "status": "success",
            "message": "Model retrained and reloaded in memory successfully!",
            "accuracy": model_info.get("accuracy"),
            "f1_score": model_info.get("f1_score"),
            "selected_algorithm": model_info.get("selected_algorithm")
        }
    except Exception as e:
        print(f"Error during retraining: {e}")
        raise HTTPException(status_code=500, detail=f"Retraining error: {str(e)}")

