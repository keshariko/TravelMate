import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { PackageCard } from "./PackageCard";
import type { TravelPackage } from "../data/knowledgeBase";

export interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  packages?: TravelPackage[];
  showPackageCards?: boolean;
  intent?: string;
  confidence?: number;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-window" id="chat-window">
      {messages.length === 0 && (
        <div className="chat-empty-state">
          <div className="chat-empty-icon">
            <Bot size={48} />
          </div>
          <h2>Welcome to TravelMate 🌍</h2>
          <p>
            Your AI-powered travel assistant is ready to help you plan the
            perfect Sri Lankan adventure. Ask me anything!
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-wrapper ${msg.role === "user" ? "message-user" : "message-bot"}`}
        >
          {/* Avatar */}
          {msg.role === "bot" && (
            <div className="avatar bot-avatar">
              <Bot size={18} />
            </div>
          )}

          <div className="message-content-col">
            {/* Bubble */}
            <div
              className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"}`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
              />
            </div>

            {/* Package Cards */}
            {msg.showPackageCards && msg.packages && msg.packages.length > 0 && (
              <div className="package-cards-row">
                {msg.packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}

            {/* Intent badge + timestamp */}
            <div
              className={`message-meta ${msg.role === "user" ? "meta-right" : "meta-left"}`}
            >
              {msg.role === "bot" && msg.intent && msg.intent !== "unknown" && (
                <span className="intent-badge">
                  Intent: {msg.intent} ({Math.round((msg.confidence ?? 0) * 100)}%)
                </span>
              )}
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>

          {/* User Avatar */}
          {msg.role === "user" && (
            <div className="avatar user-avatar">
              <User size={18} />
            </div>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="message-wrapper message-bot">
          <div className="avatar bot-avatar">
            <Bot size={18} />
          </div>
          <div className="typing-indicator" id="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
