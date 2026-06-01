# TravelMate ML Core - Intelligent Tourism Conversational Agent Backend

This directory contains the production-grade Machine Learning (ML) intent classification and recommendation system developed for the **TravelMate** Sri Lankan tourism assistant. 

This ML system replaces a basic client-side token matcher with high-accuracy supervised classification models (**Logistic Regression** and **Multinomial Naive Bayes**) trained on statistical text features (TF-IDF), served via a high-performance **FastAPI** web service.

---

## 1. Project Architecture

### 1.1 Directory Structure
```
backend/
├── main.py                # FastAPI web server, CORS configurations, REST routes
├── train.py               # Model training script, compares LR vs NB, saves best pipeline
├── data_generator.py      # Synthesizes ~1,100 unique samples from frontend templates & synonyms
├── requirements.txt       # Python dependencies (scikit-learn, fastapi, joblib, nltk, etc.)
├── model.pkl              # Serialized best ML Pipeline (TF-IDF Vectorizer + Classifier)
├── start.sh               # One-click start shell script for macOS and Linux
├── start.bat              # One-click start batch file for Windows
│
├── dataset/
│   └── dataset.json       # Generated balanced training dataset
│
├── reports/
│   ├── ML_REPORT.md       # Full academic thesis chapter on ML theories and results
│   ├── training_report.json     # Metadata from the last training run
│   ├── model_metrics.json       # Per-intent Precision, Recall, F1 and Support breakdown
│   ├── model_comparison.json    # Accuracy, F1 and time comparisons between LR and NB
│   ├── demo_queries.json        # 50 query outputs for system demonstration and viva checks
│   ├── sample_predictions.json  # Labeled validation test set to inspect exact outcomes
│   ├── intent_distribution.png  # Visual chart: balanced sample counts per category
│   ├── confusion_matrix.png     # Visual chart: detailed classification error heatmap
│   ├── accuracy_chart.png       # Visual chart: Logistic Regression vs Naive Bayes accuracy
│   ├── model_comparison.png     # Visual chart: multi-metric comparison of classifiers
│   ├── system_architecture.svg  # Vector graphics showing full UI -> REST -> ML flow
│   └── system_architecture.png  # High-res image showing full UI -> REST -> ML flow
│
└── utils/
    ├── __init__.py
    ├── nlp_utils.py       # Preprocessing pipeline: lowercase, regex clean, Porter stemming
    └── knowledge_base.py  # Python mirror of the Sri Lanka travel packages and responses
```

---

## 2. Machine Learning Core Specification

The chatbot models **13 distinct intent classes**:
`greeting`, `beach`, `hill`, `safari`, `cultural`, `pricing`, `duration`, `all_packages`, `booking`, `sri_lanka`, `weather`, `contact`, `goodbye`.

### Preprocessing Pipeline:
Every query undergoes cleaning to remove structural noise:
1. **Lowercasing**
2. **Noise Cleansing**: Removing punctuation and special characters `[^\w\s]`
3. **Tokenization**: Splitting sentences into words
4. **Stop-Word Removal**: Filtering high-frequency English operators (e.g. "a", "the", "was") using NLTK
5. **Stemming**: Reducing inflections to base stems using the **Porter Stemmer** (e.g., `trekking` -> `trek`, `beaches` -> `beach`)

### Model Details:
- **Feature Extraction**: TF-IDF (Term Frequency-Inverse Document Frequency) capturing unigrams and bigrams (`ngram_range=(1, 2)`).
- **Classifiers Evaluated**:
  1. **Logistic Regression**: Softmax multi-class formulation with L2 Regularization ($C=2.0$).
  2. **Multinomial Naive Bayes**: Laplace Smoothing ($\alpha=0.5$).
- **Selection Rule**: The pipeline with the highest hold-out **weighted F1-Score** is automatically serialized and saved to `backend/model.pkl` (Logistic Regression won with **94.44% F1-Score**).

---

## 3. Quickstart Installation & Setup

### Prerequisites
- Python 3.8 or higher. Check using: `python3 --version`
- Package installer `pip`. Check using: `pip3 --version`

### 3.1 One-Click Automation Run (Recommended)
We provide automated scripts to run the entire backend lifecycle:
- **macOS / Linux**:
  ```bash
  chmod +x backend/start.sh
  ./backend/start.sh
  ```
- **Windows**:
  ```cmd
  backend\start.bat
  ```

This single command will:
1. Validate and install python libraries from `requirements.txt`.
2. Extract intents, synthesize a balanced dataset, and export `dataset.json`.
3. Preprocess texts, train both Logistic Regression and Naive Bayes, select the best model, and save `model.pkl`.
4. Output 4 empirical charts, 2 validation reports, and a complete system diagram in `reports/`.
5. Start the FastAPI server with hot-reload enabled.

---

## 4. Manual Operations

If you wish to run individual steps manually, navigate to the project directory:

### 4.1 Install Libraries
```bash
pip3 install -r backend/requirements.txt
```

### 4.2 Generate Dataset
```bash
python3 backend/data_generator.py
```

### 4.3 Train Models & Save Charts
```bash
python3 backend/train.py
```

### 4.4 Run Validation Generators (Viva Prep)
```bash
python3 backend/utils/generate_demo_data.py
python3 backend/utils/generate_diagram.py
```

### 4.5 Start FastAPI Server
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 5. API Route Documentation

FastAPI runs on `http://localhost:8000`. You can inspect the interactive OpenAPI/Swagger documentation at `http://localhost:8000/docs`.

### 5.1 Public Endpoints

#### `GET /api/health`
- **Purpose**: Server health diagnostics.
- **Response**: `{"status": "healthy"}`

#### `POST /api/chat`
- **Purpose**: Primary chat inference. Processes user input, predicts intent via Logistic Regression, and resolves travel packages.
- **Request Body**:
  ```json
  {
    "message": "I want to visit the beaches in Negombo and go swimming"
  }
  ```
- **Response Body**:
  ```json
  {
    "intent": "beach",
    "confidence": 0.9634,
    "response": "We recommend our **Negombo Beach Escape** package 🌊 — 3 days of golden beaches, sunrise boat tours, and fresh seafood. Starting from **Rs. 18,500**!",
    "packages": [
      {
        "id": "pkg-001",
        "name": "Negombo Beach Escape",
        "destination": "Negombo, Sri Lanka",
        "category": "beach",
        "duration": "3 Days / 2 Nights",
        "price": 18500,
        "currency": "LKR",
        "description": "Experience the golden beaches...",
        "highlights": ["Golden sandy beaches", "Fresh seafood"],
        "rating": 4.7,
        "emoji": "🌊"
      }
    ],
    "showPackageCards": true
  }
  ```

---

### 5.2 Admin Endpoints (Academic Management)

#### `GET /api/model-info`
- **Purpose**: Returns active model algorithm, training timestamp, training dataset size, and classification labels.
- **Response**:
  ```json
  {
    "status": "active",
    "algorithm": "Logistic Regression",
    "last_trained": "2026-05-31T23:45:00",
    "dataset_size": 1141,
    "number_of_intents": 13,
    "classes": ["all_packages", "beach", "booking", "contact", ...]
  }
  ```

#### `GET /api/model-metrics`
- **Purpose**: Returns training report summary, individual precision/recall metrics for each of the 13 intents, and comparative stats between classifiers.
- **Response**:
  ```json
  {
    "overall_performance": { "accuracy": 0.9432, "f1_score": 0.9444 },
    "intent_breakdown": {
      "beach": { "precision": 0.96, "recall": 0.94, "f1_score": 0.95, "support": 35 },
      "hill": { "precision": 0.95, "recall": 0.95, "f1_score": 0.95, "support": 35 }
    },
    "model_comparison": { ... }
  }
  ```

#### `POST /api/retrain`
- **Purpose**: Instantly retrain the models on the fly on the server. Compares pipelines, saves the best model, and reloads it into active API memory without server restarts.
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Model retrained and reloaded in memory successfully!",
    "accuracy": 0.9432,
    "f1_score": 0.9444,
    "selected_algorithm": "Logistic Regression"
  }
  ```

---

## 6. Frontend Fallback Architecture

To guarantee high system reliability, the React application implements a **Resilient Fallback Controller** in `src/data/inferenceEngine.ts`:
1. The app queries `POST http://localhost:8000/api/chat` with a strict **3-second network timeout** via `AbortController`.
2. If the API is online, it displays the predictions, ML confidence badge, and dynamic recommendations.
3. If the server is offline or fails to respond, the app catches the error, outputs an explicit `console.warn` message, and seamlessly activates the local client-side rule-based NLP parser.
4. The user experiences **zero lag** and **zero crashes**, showcasing a production-ready software engineering model.

---

## 7. Troubleshooting

- **Error: `ModuleNotFoundError: No module named 'utils'` during joblib load**
  - **Reason**: The tokenizer path wasn't registered in the executing script's path context.
  - **Solution**: The automated script resolves this by adding the root `backend` directory to `sys.path` on startup. Ensure you boot using `./backend/start.sh` or run your custom scripts with `PYTHONPATH=.` set from the `backend/` root folder.
  
- **Matplotlib Font Building Freeze**
  - **Reason**: On fresh environments, Matplotlib compiles local system font folders which can take up to 60 seconds.
  - **Solution**: The script is configured with `matplotlib.use('Agg')` for headless operation. Simply wait a moment; this cache process only runs once.
