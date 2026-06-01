import { useState, useCallback, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow, type Message } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { runInference } from "./data/inferenceEngine";
import { AdminDashboard } from "./components/AdminDashboard";

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
  
  // Custom router state
  const [route, setRoute] = useState<"chat" | "admin">(
    window.location.pathname === "/admin" ? "admin" : "chat"
  );
  
  const [backendOffline, setBackendOffline] = useState(false);

  // Sync route on popstate (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname === "/admin" ? "admin" : "chat");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Ping backend to detect connection
  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/health");
      if (res.ok) {
        setBackendOffline(false);
      } else {
        setBackendOffline(true);
      }
    } catch (e) {
      setBackendOffline(true);
    }
  }, []);

  useEffect(() => {
    checkBackend();
    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, [checkBackend]);

  const navigate = (newRoute: "chat" | "admin") => {
    setRoute(newRoute);
    const path = newRoute === "admin" ? "/admin" : "/";
    window.history.pushState({}, "", path);
  };

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
      // If inference succeeded and wasn't offline message, make sure indicator is online
      if (result.intent !== "offline") {
        setBackendOffline(false);
      } else {
        setBackendOffline(true);
      }
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

  const handleSidebarCategoryClick = (query: string) => {
    navigate("chat");
    setSidebarOpen(false);
    handleSend(query);
  };

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
        currentRoute={route}
        onNavigate={navigate}
      />

      {/* Main Layout */}
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          onCategoryClick={handleSidebarCategoryClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* View Switching */}
        {route === "admin" ? (
          <AdminDashboard />
        ) : (
          <main className="chat-panel" id="chat-panel">
            {/* Offline Alert Banner */}
            {backendOffline && (
              <div className="bg-rose-500/10 dark:bg-rose-950/20 border-b border-rose-500/20 dark:border-rose-500/10 px-5 py-3 text-xs text-rose-600 dark:text-rose-450 font-medium flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                  <span>
                    <strong>ML Backend Server Offline:</strong> Machine Learning classification is disconnected. Run <code>./backend/start.sh</code> to enable intent parsing and recommendations.
                  </span>
                </div>
                <button
                  onClick={checkBackend}
                  className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 text-2xs font-semibold uppercase tracking-wider transition-all"
                >
                  Reconnect
                </button>
              </div>
            )}

            {/* Chat header bar */}
            <div className="chat-panel-header">
              <div className="chat-panel-info">
                <div className="bot-info-avatar">🤖</div>
                <div>
                  <p className="bot-info-name">TravelMate AI</p>
                  <p className="bot-info-status">
                    <span className={`status-dot-sm ${backendOffline ? "bg-rose-500 animate-pulse" : "bg-green-500"}`} />
                    {backendOffline ? "ML Engine Offline" : "NLP Engine Active • Intent Detection Online"}
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
        )}
      </div>
    </div>
  );
}
