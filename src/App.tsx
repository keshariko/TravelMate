import { useState, useCallback, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow, type Message } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { runInference } from "./data/inferenceEngine";

let messageCounter = 0;
const newId = () => `msg-${++messageCounter}-${Date.now()}`;

const WELCOME_MESSAGE: Message = {
  id: newId(),
  role: "bot",
  text: "Welcome to TravelMate! 🌍✈️\n\nI'm your AI-powered Sri Lanka tourism assistant. I can help you discover amazing travel packages, plan your itinerary, and answer all your travel questions.\n\n**How can I help you today?** Try asking about:\n• 🌊 Beach packages\n• ⛰️ Hill country adventures\n• 🦁 Safari tours\n• 🏛️ Cultural experiences\n• 💰 Pricing & availability",
  timestamp: new Date(),
  intent: "greeting",
  confidence: 1,
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply dark mode class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSend = useCallback(async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: newId(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Run NLP inference engine
      const result = await runInference(text);

      const botMsg: Message = {
        id: newId(),
        role: "bot",
        text: result.response,
        timestamp: new Date(),
        packages: result.packages,
        showPackageCards: result.showPackageCards,
        intent: result.intent,
        confidence: result.confidence,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "bot",
          text: "Sorry, I encountered an error. Please try again! 😊",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleClearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className={`app-root ${darkMode ? "dark" : ""}`}>
      {/* Animated background */}
      <div className="bg-animated">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {/* Main Layout */}
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          onCategoryClick={handleSend}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Chat Panel */}
        <main className="chat-panel" id="chat-panel">
          {/* Chat header bar */}
          <div className="chat-panel-header">
            <div className="chat-panel-info">
              <div className="bot-info-avatar">🤖</div>
              <div>
                <p className="bot-info-name">TravelMate AI</p>
                <p className="bot-info-status">
                  <span className="status-dot-sm" />
                  NLP Engine Active • Intent Detection Online
                </p>
              </div>
            </div>
            <button
              className="clear-chat-btn"
              onClick={handleClearChat}
              id="clear-chat-btn"
              title="Clear conversation"
            >
              New Chat
            </button>
          </div>

          {/* Chat Messages */}
          <ChatWindow messages={messages} isTyping={isTyping} />

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </main>
      </div>
    </div>
  );
}
