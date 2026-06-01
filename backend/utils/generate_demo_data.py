import os
import json
import joblib
import random
import numpy as np

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import knowledge base database mirror
from knowledge_base import travel_packages, intents_responses

def generate_academic_artifacts():
    print("==================================================")
    print("PHASES 15 & 16 - GENERATING DEMO & SAMPLE PREDICTIONS")
    print("==================================================")
    
    backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(backend_root, "model.pkl")
    reports_dir = os.path.join(backend_root, "reports")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError("Model files not found. Please train the model first.")
        
    model = joblib.load(model_path)
    print("Model loaded successfully for generating reports...")
    
    # 50 diverse queries for demonstration (Phase 15)
    demo_queries = [
        "Hi travelmate!",
        "Hello assistant, how can you help me?",
        "Good morning, can we start a chat?",
        "Show me beach destinations in Sri Lanka",
        "I want to see beach packages",
        "Are there coastal tours available?",
        "Let's visit Negombo beaches",
        "What ocean getaways do you offer?",
        "Take me to the sandy shores of Sri Lanka",
        "I want to explore the misty mountains of Ella",
        "Show me hill country packages",
        "Is there a tea factory tour in Ella?",
        "Show me high altitude trekking tours",
        "I love hiking in the mountain region",
        "Do you have a scenic train ride tour?",
        "I want to spot leopards in Yala National Park",
        "Show me Yala safari packages",
        "Tell me about wildlife safari options",
        "Can I see elephants and birds in jungle?",
        "Arrange a jeep game drive safari",
        "Where is leopard density highest?",
        "Show me Kandy cultural tours",
        "I want to see the Temple of the Tooth",
        "Let's explore historical monuments and temples",
        "Climb the Sigiriya Rock fortress",
        "What ancient UNESCO heritage spots are there?",
        "Tell me about Sigiriya Lion Rock frescoes",
        "How much do packages cost?",
        "What is the budget for a hill tour?",
        "How many rupees does Yala safari cost?",
        "Is there a cheap travel package?",
        "What are the pricing details of Colombo tour?",
        "What is the price of Negombo beach trip?",
        "How long are the trips?",
        "How many days do we spend in Yala national park?",
        "Is there a weekend tour package?",
        "Give me the duration of Kandy cultural trip",
        "Show all available packages",
        "What tours do you offer in Ceylon?",
        "Give me options for my Sri Lanka vacation",
        "How do I book a tour?",
        "I would like to reserve Ella adventure",
        "Where can I make a booking for beach escape?",
        "Confirm my reservation please",
        "Tell me about weather in South Asia",
        "What is the climate like in Colombo?",
        "When is the monsoon season?",
        "Give me your support email address",
        "What is your customer service phone number?",
        "Thank you, goodbye!",
        "Alright, bye for now travelmate!"
    ]
    
    demo_results = []
    for q in demo_queries:
        probs = model.predict_proba([q])[0]
        max_idx = np.argmax(probs)
        intent = str(model.classes_[max_idx])
        conf = float(probs[max_idx])
        
        # Resolve response
        resps = intents_responses.get(intent, intents_responses["unknown"])
        resp = random.choice(resps)
        
        demo_results.append({
            "query": q,
            "predicted_intent": intent,
            "confidence": conf,
            "response": resp
        })
        
    demo_file = os.path.join(reports_dir, "demo_queries.json")
    with open(demo_file, "w", encoding="utf-8") as f:
        json.dump(demo_results, f, indent=2, ensure_ascii=False)
    print(f"Generated Phase 15 Demo Queries: {demo_file} ({len(demo_results)} samples)")
    
    # 25 Labeled test queries to show predictions validation (Phase 16)
    sample_tests = [
        ("Hey travelmate assistant!", "greeting"),
        ("Good morning everyone", "greeting"),
        ("I want to relax on the sandy shores of Negombo beach", "beach"),
        ("Surfing and swimming in sea waves", "beach"),
        ("Explore waterfalls, Nine Arch Bridge and tea factory in Ella", "hill"),
        ("Let's go trekking up Little Adam's Peak mountain", "hill"),
        ("Jeep safari inside Yala forest reserve to spot elephants", "safari"),
        ("Spotting wild leopards and crocodiles in national park", "safari"),
        ("Visit Gangaaramaya temple and city monuments in Colombo", "cultural"),
        ("Dambulla cave temple and Kandy lake walk city guide", "cultural"),
        ("Sigiriya ancient lion rock unesco castle", "cultural"),
        ("How much money does a beach tour require?", "pricing"),
        ("Are your packages affordable or expensive?", "pricing"),
        ("Give me the price in rupees of Sigiriya trip", "pricing"),
        ("How many days and nights do I spend in Ella?", "duration"),
        ("What is the length of Kandy tour package?", "duration"),
        ("Show all your available tours options", "all_packages"),
        ("Can you list all packages you offer?", "all_packages"),
        ("I would like to reserve a slot on the next Yala trip", "booking"),
        ("Confirm my reservation support book now", "booking"),
        ("Is Sri Lanka safe for travel?", "sri_lanka"),
        ("When is the best time of year to visit Sri Lanka?", "weather"),
        ("Is it hot and humid right now or raining?", "weather"),
        ("How do I contact your customer support service email?", "contact"),
        ("Alright thank you so much and goodbye!", "goodbye")
    ]
    
    sample_results = []
    correct_count = 0
    
    for query, actual in sample_tests:
        probs = model.predict_proba([query])[0]
        max_idx = np.argmax(probs)
        pred = str(model.classes_[max_idx])
        conf = float(probs[max_idx])
        is_correct = (pred == actual)
        if is_correct:
            correct_count += 1
            
        sample_results.append({
            "input": query,
            "predicted_intent": pred,
            "confidence": conf,
            "actual_intent": actual,
            "correct": is_correct
        })
        
    sample_file = os.path.join(reports_dir, "sample_predictions.json")
    with open(sample_file, "w", encoding="utf-8") as f:
        json.dump(sample_results, f, indent=2, ensure_ascii=False)
        
    acc = correct_count / len(sample_tests)
    print(f"Generated Phase 16 Sample Predictions: {sample_file} ({len(sample_results)} samples, Test accuracy: {acc * 100:.2f}%)")
    print("==================================================\n")

if __name__ == "__main__":
    generate_academic_artifacts()
