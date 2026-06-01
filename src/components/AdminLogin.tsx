import React, { useState } from "react";
import { Lock, ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Simplistic demo authentication check (Can change the passkey if needed by changing the "1234")
    if (password.trim() === "1234") {
      localStorage.setItem("admin_authenticated", "true");
      onLoginSuccess();
    } else {
      setError(true);
      setPassword("");
      // Clear error after 3 seconds
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="admin-login-container">
      <div className={`admin-login-card ${error ? "animate-shake" : ""}`}>
        {/* Glow Effects */}
        <div className="admin-login-glow-1" />
        <div className="admin-login-glow-2" />

        {/* Lock Icon Circle */}
        <div className={`admin-login-icon-box ${error ? "error" : ""}`}>
          <Lock size={26} />
        </div>

        <h2 className="admin-login-title">Admin Access Required</h2>
        <p className="admin-login-subtitle">
          Please enter the system passkey to unlock the TravelMate management panel.
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin passkey..."
              className={`admin-login-input ${error ? "error" : ""}`}
              autoFocus
            />
            <div className="admin-login-input-icon">
              <Lock size={16} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="admin-login-error-msg">
                <ShieldAlert size={14} />
                <span>Invalid passkey. Please try again.</span>
              </div>
            )}
          </div>

          {/* Hint for examiners */}
          {/* <div className="admin-login-hint-box">
            <span>Demo Passkey:</span>
            <span className="admin-login-hint-badge">admin</span>
          </div> */}

          {/* Actions */}
          <div className="admin-login-actions">
            <button
              type="button"
              onClick={onCancel}
              className="admin-login-btn admin-login-btn-secondary"
            >
              <ArrowLeft size={14} />
              Back to Chat
            </button>
            <button
              type="submit"
              className="admin-login-btn admin-login-btn-primary"
            >
              Unlock
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
