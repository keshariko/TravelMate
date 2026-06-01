import os
import json
import time
import datetime
import numpy as np
import pandas as pd
import joblib

# Headless matplotlib configuration to avoid GUI environment crashes
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix
)

# Import our custom text preprocessing utility
from utils.nlp_utils import custom_vectorizer_tokenizer

def train_and_evaluate():
    print("==================================================")
    print("PHASE 5 & 6 & 7 & 8 - ML TRAINING & EVALUATION")
    print("==================================================")
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_file = os.path.join(project_root, "backend", "dataset", "dataset.json")
    reports_dir = os.path.join(project_root, "backend", "reports")
    models_dir = os.path.join(project_root, "backend", "models")
    
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(dataset_file):
        raise FileNotFoundError(f"Dataset file not found at {dataset_file}. Please run data_generator.py first.")
        
    # Load dataset
    with open(dataset_file, "r", encoding="utf-8") as f:
        dataset = json.load(f)
        
    df = pd.DataFrame(dataset)
    print(f"Loaded dataset with {len(df)} samples.")
    print(f"Number of unique intents: {df['intent'].nunique()}")
    
    # 1. Train-Test Split (80/20 ratio for academic standard)
    X_train, X_test, y_train, y_test = train_test_split(
        df["text"],
        df["intent"],
        test_size=0.20,
        random_state=42,
        stratify=df["intent"]
    )
    
    print(f"Training set size: {len(X_train)} samples")
    print(f"Testing set size: {len(X_test)} samples")
    
    # Define pipelines
    lr_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(tokenizer=custom_vectorizer_tokenizer, token_pattern=None, ngram_range=(1, 2))),
        ("clf", LogisticRegression(C=20.0, max_iter=500, random_state=42))
    ])
    
    nb_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(tokenizer=custom_vectorizer_tokenizer, token_pattern=None, ngram_range=(1, 2))),
        ("clf", MultinomialNB(alpha=0.5))
    ])
    
    # Train Logistic Regression
    print("\nTraining Logistic Regression Model...")
    start_time = time.time()
    lr_pipeline.fit(X_train, y_train)
    lr_train_time = time.time() - start_time
    
    # Train Naive Bayes
    print("Training Multinomial Naive Bayes Model...")
    start_time = time.time()
    nb_pipeline.fit(X_train, y_train)
    nb_train_time = time.time() - start_time
    
    # Evaluate models on test set
    y_pred_lr = lr_pipeline.predict(X_test)
    y_pred_nb = nb_pipeline.predict(X_test)
    
    # Calculate performance metrics
    acc_lr = accuracy_score(y_test, y_pred_lr)
    precision_lr, recall_lr, f1_lr, _ = precision_recall_fscore_support(y_test, y_pred_lr, average="weighted")
    
    acc_nb = accuracy_score(y_test, y_pred_nb)
    precision_nb, recall_nb, f1_nb, _ = precision_recall_fscore_support(y_test, y_pred_nb, average="weighted")
    
    print("\n--- MODEL PERFORMANCE COMPARISON ---")
    print(f"Logistic Regression: Accuracy={acc_lr:.4f}, Precision={precision_lr:.4f}, Recall={recall_lr:.4f}, F1-Score={f1_lr:.4f}")
    print(f"Naive Bayes:         Accuracy={acc_nb:.4f}, Precision={precision_nb:.4f}, Recall={recall_nb:.4f}, F1-Score={f1_nb:.4f}")
    
    # Model comparison report JSON
    comparison_data = {
        "Logistic Regression": {
            "accuracy": float(acc_lr),
            "precision": float(precision_lr),
            "recall": float(recall_lr),
            "f1_score": float(f1_lr),
            "training_time_sec": lr_train_time
        },
        "Multinomial Naive Bayes": {
            "accuracy": float(acc_nb),
            "precision": float(precision_nb),
            "recall": float(recall_nb),
            "f1_score": float(f1_nb),
            "training_time_sec": nb_train_time
        }
    }
    
    comparison_file = os.path.join(reports_dir, "model_comparison.json")
    with open(comparison_file, "w", encoding="utf-8") as f:
        json.dump(comparison_data, f, indent=2)
    
    # Select the best model based on F1 Score
    if f1_lr >= f1_nb:
        best_model_name = "Logistic Regression"
        best_pipeline = lr_pipeline
        best_preds = y_pred_lr
        best_acc, best_prec, best_rec, best_f1 = acc_lr, precision_lr, recall_lr, f1_lr
    else:
        best_model_name = "Multinomial Naive Bayes"
        best_pipeline = nb_pipeline
        best_preds = y_pred_nb
        best_acc, best_prec, best_rec, best_f1 = acc_nb, precision_nb, recall_nb, f1_nb
        
    print(f"\n>>> Selected Model: {best_model_name} (F1={best_f1:.4f})")
    
    # Save the best model
    model_save_path = os.path.join(project_root, "backend", "model.pkl")
    joblib.dump(best_pipeline, model_save_path)
    # Also save in models directory for version tracking
    joblib.dump(best_pipeline, os.path.join(models_dir, "best_model.pkl"))
    print(f"Saved selected model to {model_save_path}")
    
    # ============================================================
    # PHASE 6 - EVALUATION DATA
    # ============================================================
    
    # Generate detailed Classification Report for the best model
    report_dict = classification_report(y_test, best_preds, output_dict=True)
    report_file = os.path.join(reports_dir, "classification_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(report_dict, f, indent=2)
        
    # Model metrics per intent
    model_metrics = {}
    for intent, metrics in report_dict.items():
        if intent in ["accuracy", "macro avg", "weighted avg"]:
            continue
        model_metrics[intent] = {
            "precision": float(metrics["precision"]),
            "recall": float(metrics["recall"]),
            "f1_score": float(metrics["f1-score"]),
            "support": int(metrics["support"])
        }
    
    metrics_file = os.path.join(reports_dir, "model_metrics.json")
    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(model_metrics, f, indent=2)
        
    # ============================================================
    # PHASE 7 - RESEARCH QUALITY VISUALIZATIONS
    # ============================================================
    
    # Setup aesthetic configurations for plots
    sns.set_theme(style="whitegrid")
    plt.rcParams.update({
        "font.size": 10,
        "axes.labelsize": 12,
        "axes.titlesize": 14,
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
        "figure.titlesize": 16
    })
    
    # 1. Intent Distribution Plot
    plt.figure(figsize=(10, 6))
    intent_counts = df["intent"].value_counts()
    sns.barplot(x=intent_counts.values, y=intent_counts.index, hue=intent_counts.index, palette="viridis", legend=False)
    plt.title("Distribution of Training Samples Per Intent")
    plt.xlabel("Sample Count")
    plt.ylabel("Intents")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "intent_distribution.png"), dpi=200)
    plt.close()
    
    # 2. Confusion Matrix
    labels = sorted(list(df["intent"].unique()))
    cm = confusion_matrix(y_test, best_preds, labels=labels)
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
    plt.title(f"Confusion Matrix - Selected {best_model_name}")
    plt.xlabel("Predicted Intent")
    plt.ylabel("Actual Intent")
    plt.xticks(rotation=45, ha="right")
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "confusion_matrix.png"), dpi=200)
    plt.close()
    
    # 3. Accuracy Chart & Model Comparison Chart
    # Plotting both side-by-side or as individual files
    # Accuracy chart
    plt.figure(figsize=(6, 5))
    model_names = ["Logistic Regression", "Naive Bayes"]
    accuracies = [acc_lr, acc_nb]
    sns.barplot(x=model_names, y=accuracies, palette=["#4f46e5", "#06b6d4"])
    plt.title("Model Accuracy Comparison")
    plt.ylabel("Accuracy Score")
    plt.ylim(0, 1.1)
    for i, val in enumerate(accuracies):
        plt.text(i, val + 0.02, f"{val:.4f}", ha="center", fontweight="bold")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "accuracy_chart.png"), dpi=200)
    plt.close()
    
    # Model Comparison detailed chart
    comparison_df = pd.DataFrame({
        "Metric": ["Accuracy", "Precision", "Recall", "F1-Score"] * 2,
        "Score": [acc_lr, precision_lr, recall_lr, f1_lr, acc_nb, precision_nb, recall_nb, f1_nb],
        "Model": ["Logistic Regression"] * 4 + ["Naive Bayes"] * 4
    })
    
    plt.figure(figsize=(8, 5))
    sns.barplot(x="Metric", y="Score", hue="Model", data=comparison_df, palette="Set2")
    plt.title("Detailed Classifier Performance Comparison")
    plt.ylabel("Performance Score")
    plt.ylim(0, 1.1)
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "model_comparison.png"), dpi=200)
    plt.close()
    
    # ============================================================
    # PHASE 8 - TRAINING REPORTS
    # ============================================================
    training_report = {
        "training_timestamp": datetime.datetime.now().isoformat(),
        "dataset_size": int(len(df)),
        "number_of_intents": int(df["intent"].nunique()),
        "train_test_split_ratio": "80:20",
        "selected_algorithm": best_model_name,
        "accuracy": float(best_acc),
        "precision": float(best_prec),
        "recall": float(best_rec),
        "f1_score": float(best_f1),
        "lr_metrics": {
            "accuracy": float(acc_lr),
            "f1_score": float(f1_lr)
        },
        "nb_metrics": {
            "accuracy": float(acc_nb),
            "f1_score": float(f1_nb)
        }
    }
    
    training_report_file = os.path.join(reports_dir, "training_report.json")
    with open(training_report_file, "w", encoding="utf-8") as f:
        json.dump(training_report, f, indent=2)
        
    print(f"Successfully generated all evaluation charts and reports in {reports_dir}")
    print("==================================================\n")

if __name__ == "__main__":
    train_and_evaluate()
