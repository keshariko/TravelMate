# ✈️ TravelMate — AI-Powered Tourism Chatbot

> A modern, intelligent Sri Lanka tourism assistant built with React, TypeScript, and an in-browser NLP inference engine.

---

## 🌍 Overview

TravelMate is a full-featured AI tourism chatbot that helps users discover Sri Lankan travel packages through natural language conversation. It demonstrates core Artificial Intelligence concepts including intent detection, NLP preprocessing, pattern matching, and knowledge-base retrieval — all running entirely in the browser.

---

## 🏗️ Architecture (3-Tier)

```
┌─────────────────────────────────┐
│  1. Natural Language Interface   │  React UI — Chat bubbles, sidebar,
│     (Frontend)                   │  package cards, voice input
├─────────────────────────────────┤
│  2. Inference Engine (NLP)       │  inferenceEngine.ts — Tokenization,
│     (Business Logic)             │  stemming, stop-word removal, intent
│                                  │  classification, response generation
├─────────────────────────────────┤
│  3. Knowledge Base / Database    │  knowledgeBase.ts — 6 travel packages,
│     (Data Layer)                 │  13 intents, 60+ pattern rules
└─────────────────────────────────┘
```

---

## 🧠 AI / NLP Features

| Feature | Description |
|---------|-------------|
| **Tokenization** | Splits input into word tokens, removes punctuation |
| **Stop-word Removal** | Filters 60+ common English stop words |
| **Stemming** | Rule-based suffix stripping (ing→, tion→te, ies→y…) |
| **Intent Classification** | Direct keyword matching + TF-IDF-style F1 scoring |
| **Response Generation** | Random selection from intent-specific response pool |
| **Knowledge Retrieval** | Fetches matching travel packages from the database |
| **Voice Input** | Web Speech API integration |

### Supported Intents
`greeting` · `beach` · `hill` · `safari` · `cultural` · `pricing` · `duration` · `all_packages` · `booking` · `sri_lanka` · `weather` · `contact` · `goodbye` · `unknown`

---

## 📦 Travel Package Database

| # | Package | Category | Duration | Price (LKR) |
|---|---------|----------|----------|-------------|
| 1 | 🌊 Negombo Beach Escape | Beach | 3D/2N | 18,500 |
| 2 | ⛰️ Ella Hill Adventure | Hill | 4D/3N | 24,000 |
| 3 | 🦁 Yala Safari Tour | Safari | 3D/2N | 32,000 |
| 4 | 🏛️ Kandy Cultural Tour | Cultural | 3D/2N | 21,000 |
| 5 | 🏔️ Sigiriya Heritage Trip | Heritage | 2D/1N | 15,000 |
| 6 | 🌆 Colombo City Explorer | Cultural | 2D/1N | 12,500 |

---

## 🎨 UI Features

- **3-panel layout** — Sidebar + Chat + Input bar
- **Glassmorphism** design with animated blob background
- **Dark / Light mode** toggle
- **Animated chat bubbles** with slide-in transitions
- **Typing indicator** (3-dot bounce animation)
- **Package cards** rendered inline in bot responses
- **Quick reply chips** for common queries
- **Voice input** via Web Speech API
- **Intent badge** showing detected intent + confidence %
- **Responsive** — mobile-friendly with collapsible sidebar
- **Auto-resize** textarea input

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + Custom CSS |
| Icons | Lucide React |
| Fonts | Inter + Plus Jakarta Sans (Google Fonts) |
| NLP | Custom TypeScript inference engine |
| Voice | Web Speech API |

---

## 🚀 Getting Started

```bash
# Install dependencies
cd TravelMate
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

## 💬 Example Conversations

```
You: hello
Bot: Welcome to TravelMate! 🌍✈️ I'm your AI-powered Sri Lanka tourism assistant...

You: show beach packages
Bot: We recommend our Negombo Beach Escape package 🌊 — 3 days of golden beaches...
     [Package Card: Negombo Beach Escape — LKR 18,500]

You: how much does it cost?
Bot: Our travel packages start from Rs. 12,500 💰
     • 🌊 Negombo Beach — Rs. 18,500
     • ⛰️ Ella Hill — Rs. 24,000 ...

You: bye
Bot: Thank you for using TravelMate! Safe travels ✈️
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Category nav + destinations + deal banner
│   ├── ChatWindow.tsx      # Message list + typing indicator
│   ├── ChatInput.tsx       # Textarea + quick replies + voice
│   └── PackageCard.tsx     # Travel package display card
├── data/
│   ├── knowledgeBase.ts    # Packages DB + intent patterns
│   └── inferenceEngine.ts  # NLP pipeline + intent classifier
├── App.tsx                 # Root component + state management
├── index.css               # Full design system + animations
└── main.tsx                # Entry point
```

---

## 🎓 AI Coursework Demonstration

This project demonstrates:

1. **Artificial Intelligence** — Rule-based + statistical NLP inference
2. **Natural Language Processing** — Full preprocessing pipeline
3. **Inference Engine** — Intent classification with confidence scoring
4. **Knowledge Base** — Structured tourism data retrieval
5. **User Interface** — Modern, accessible chat interface

---

*Built with ❤️ for Sri Lanka Tourism | TravelMate © 2026*
