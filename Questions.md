# TravelMate AI Chatbot — Viva & Presentation Demonstration Guide

This document contains curated sample questions categorized by intent to help you demonstrate the machine learning capabilities of the TravelMate AI chatbot during your viva or project presentation.

---

## 1. Introductory & Conversational Queries

These questions demonstrate the chatbot's ability to introduce itself, explain its purpose, and handle basic pleasantries.

| No. | User Input Query | Predicted Intent | Expected Chatbot Behavior |
| :--- | :--- | :--- | :--- |
| 1 | `"who are you"` | `about` | Introduces the bot as **TravelMate AI** and details its assistant capabilities. |
| 2 | `"what is this website for"` | `about` | Explains the site's function (Sri Lankan travel planner) and academic scope. |
| 3 | `"what does this chatbot do"` | `about` | Explains intent classification, tour package recommendations, and FAQ services. |
| 4 | `"hi travelmate"` | `greeting` | Welcomes the user with a friendly greeting and outlines main travel categories. |
| 5 | `"good morning"` | `greeting` | Detects conversational greeting and prompts for user planning preferences. |

*   💡 **Viva Tip**: Point out that the model handles short sentences like *"who are you"* without getting confused by stop words because we preserved structural grammar tokens during feature extraction.

---

## 2. Travel Category Recommendations (Triggers Dynamic Package Cards)

These queries showcase the **Inference-to-Recommendation Pipeline**. When the ML model classifies these intents, the frontend renders interactive UI package cards with descriptions, pricing, and inclusions.

### 🌊 Beach Getaways
*   `"show me beach packages"` ➔ Intent: `beach` (Conf: ~95%+)
*   `"what beach tours do you have"` ➔ Intent: `beach` (Conf: ~95%+)
*   *Expected Behavior*: Displays Negombo Beach Escape template response and loads the **Negombo Beach Escape** details card.

### ⛰️ Hill Country & Hiking
*   `"suggest some hill country packages"` ➔ Intent: `hill` (Conf: ~95%+)
*   `"i want to visit tea plantations in Ella"` ➔ Intent: `hill` (Conf: ~95%+)
*   *Expected Behavior*: Recommends mountain excursions and loads the **Ella Hill Adventure** details card.

### 🦁 Wildlife Safaris
*   `"recommend some safari tours"` ➔ Intent: `safari` (Conf: ~95%+)
*   `"i want to see leopards in Yala"` ➔ Intent: `safari` (Conf: ~95%+)
*   *Expected Behavior*: Prompts with wildlife tours and loads the **Yala Safari Tour** details card.

### 🏛️ Culture & Heritage Landmarks
*   `"tell me about cultural trips"` ➔ Intent: `cultural` (Conf: ~95%+)
*   `"sigiriya rock fortress packages"` ➔ Intent: `cultural` (Conf: ~95%+)
*   *Expected Behavior*: Recommends historic landmarks and loads both **Kandy Cultural Tour** and **Sigiriya Heritage Trip** cards.

---

## 3. General Travel Inquiries

These questions demonstrate the classifier's capability to parse general questions about Sri Lanka's geography, climate, and Monsoons.

| No. | User Input Query | Predicted Intent | Expected Chatbot Behavior |
| :--- | :--- | :--- | :--- |
| 1 | `"tell me about Sri Lanka"` | `sri_lanka` | Summarizes key facts: 8 UNESCO sites, coastline length, and tea culture. |
| 2 | `"is it safe to visit Ceylon"` | `sri_lanka` | Highlights safety and hospitality for international travelers. |
| 3 | `"when is the monsoon season"` | `weather` | Explains Sri Lanka's dual monsoon climate (West vs East coast seasons). |
| 4 | `"best time to visit the beach"` | `weather` | Advises visiting the West/South coast from December to March. |

---

## 4. Practical & Transactional Inquiries

These queries demonstrate transactional flow handling: finding rates, durations, and booking methods.

*   `"travel packages"` ➔ Intent: `all_packages` (Conf: ~90%+)
    *   *Behavior*: Displays a complete list of all 6 available vacation packages.
*   `"how much do the tours cost"` ➔ Intent: `pricing` (Conf: ~95%+)
    *   *Behavior*: Summarizes pricing ranges starting from LKR 12,500 to 32,000.
*   `"how long do the trips take"` ➔ Intent: `duration` (Conf: ~95%+)
    *   *Behavior*: Lists the lengths of the tours (ranging from 2-day trips to 4-day getaways).
*   `"how can I book a safari package"` ➔ Intent: `booking` (Conf: ~95%+)
    *   *Behavior*: Details contact support methods (phone, email, WhatsApp) to reserve the package.
*   `"ya gimme those"` ➔ Intent: `booking` (Conf: ~90%+)
    *   *Behavior*: Triggers the booking instructions (useful for testing conversational context).

---

## 5. Contact & Support

*   `"support phone number"` ➔ Intent: `contact` (Conf: ~95%+)
*   `"where is your office located"` ➔ Intent: `contact` (Conf: ~95%+)
*   *Expected Behavior*: Returns 24/7 customer service phone numbers (+94 11 234 5678) and Colombo office address.

---

## 6. Closing Pleasantries

*   `"thanks for the help"` ➔ Intent: `goodbye` (Conf: ~95%+)
*   `"bye bye travelmate"` ➔ Intent: `goodbye` (Conf: ~95%+)
*   *Expected Behavior*: Responds with a polite thank you/safe travels farewell.

---

## 💡 Top Viva Presentation Tips

1.  **Open Developer Console (`F12`)**:
    *   Switch to the **Network** tab, filter by `Fetch/XHR`, and send a query. Show the examiners that the browser sends a real-time `POST /api/chat` request containing the text payload, and receives the structured JSON response containing `intent`, `confidence`, `response`, and `packages` directly from the Python backend.
2.  **Display Swagger Docs**:
    *   Show off the API design by opening [http://localhost:8000/docs](http://localhost:8000/docs) in your browser. This demonstrates FastAPI's automatically generated interactive documentation, where examiners can test the endpoints (`/api/chat`, `/api/health`, `/api/model-info`, `/api/model-metrics`).
3.  **Explain the ML Theory**:
    *   If asked about the machine learning model: Explain that the text is preprocessed by **cleaning, tokenizing, and stemming** using NLTK. It is vectorized into numeric features using **TF-IDF with Word Unigrams and Bigrams** (to capture phrases like *"how long"* or *"show me"*), and classified using a **Logistic Regression Pipeline** with balanced regularization ($C=20.0$), achieving **99.74% weighted F1-score**.
