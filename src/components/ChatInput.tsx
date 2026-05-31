import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { quickReplies } from "../data/knowledgeBase";

// ── Web Speech API local types (not in TS default lib) ──────
interface ISpeechRecognitionResult {
  readonly [index: number]: { readonly transcript: string };
}
interface ISpeechRecognitionResultList {
  readonly [index: number]: ISpeechRecognitionResult;
}
interface ISpeechRecognitionEvent extends Event {
  readonly results: ISpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

// ────────────────────────────────────────────────────────────

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const toggleVoice = () => {
    const w = window as WindowWithSpeech;
    const SpeechRecognitionClass = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  };

  return (
    <div className="chat-input-area">
      {/* Quick Replies */}
      <div className="quick-replies-bar">
        {quickReplies.map((qr) => (
          <button
            key={qr.label}
            className="quick-reply-chip"
            onClick={() => onSend(qr.query)}
            disabled={disabled}
            id={`qr-${qr.label.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="input-row">
        <div className="input-box-wrapper">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="chat-textarea"
            placeholder="Ask me about destinations, packages, pricing..."
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
          />
        </div>

        {/* Voice Button */}
        <button
          className={`icon-btn voice-btn ${listening ? "voice-active" : ""}`}
          onClick={toggleVoice}
          title={listening ? "Stop listening" : "Voice input"}
          id="voice-btn"
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send Button */}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          id="send-btn"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      {listening && (
        <p className="voice-listening-label">🎤 Listening... speak now</p>
      )}
    </div>
  );
}
