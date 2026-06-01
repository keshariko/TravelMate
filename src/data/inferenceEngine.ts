// ============================================================
// TravelMate NLP Inference Engine (Backend-Only Classifier)
// Connects to the Python FastAPI backend for AI classification.
// ============================================================

import { type TravelPackage } from "./knowledgeBase";

export interface InferenceResult {
  intent: string;
  confidence: number;
  response: string;
  packages?: TravelPackage[];
  showPackageCards?: boolean;
}

export async function runInference(userInput: string): Promise<InferenceResult> {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return {
      intent: "unknown",
      confidence: 1,
      response:
        "Please type a message and I'll be happy to help! 😊 Try asking about beach packages, safaris, or pricing.",
    };
  }

  // Attempt to call the Python Machine Learning backend API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const apiResponse = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmed }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log(`[ML Backend Inference] Success:`, data);
      return {
        intent: data.intent,
        confidence: data.confidence,
        response: data.response,
        packages: data.packages,
        showPackageCards: data.showPackageCards,
      };
    } else {
      console.warn(`[ML Backend Inference] Failed status ${apiResponse.status}.`);
      try {
        const errData = await apiResponse.json();
        if (errData && errData.detail) {
          return {
            intent: "offline",
            confidence: 0.0,
            response: `⚠️ **Database Connection Error**\n\n${errData.detail}`,
            showPackageCards: false,
          };
        }
      } catch (e) {}
    }
  } catch (error) {
    console.warn("[ML Backend Offline] API unreachable.", error);
  }

  // If backend is offline or response is not OK, prompt the user to start the backend
  return {
    intent: "offline",
    confidence: 0.0,
    response: "⚠️ **ML Backend Server Offline**\n\nThe Python machine learning backend is not running. Please start the server by running `./backend/start.sh` (or `backend\\start.bat` on Windows) in your terminal to enable AI intent classification and package recommendation.",
    showPackageCards: false,
  };
}
