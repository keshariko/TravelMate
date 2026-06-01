import { Sun, Moon, Menu, Plane, Globe, Bell } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
  currentRoute: "chat" | "admin";
  onNavigate: (route: "chat" | "admin") => void;
}

export function Navbar({ darkMode, onToggleDark, onToggleSidebar, currentRoute, onNavigate }: NavbarProps) {
  return (
    <header className="navbar" id="navbar">
      <div className="navbar-left">
        {/* Mobile menu button */}
        <button
          className="navbar-menu-btn"
          onClick={onToggleSidebar}
          id="menu-btn"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="navbar-brand cursor-pointer" onClick={() => onNavigate("chat")}>
          <div className="navbar-logo">
            <Plane size={20} className="logo-plane" />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-name">TravelMate</span>
            <span className="brand-tagline">AI Tourism Assistant</span>
          </div>
        </div>
      </div>

      {/* Center - Status */}
      <div className="navbar-center">
        <div className="bot-status">
          <span className="status-dot"></span>
          <Globe size={13} />
          <span>AI Online • Sri Lanka Tourism</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="navbar-right">
        {/* Admin Navigation Button */}
        <button
          onClick={() => onNavigate(currentRoute === "chat" ? "admin" : "chat")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            currentRoute === "admin"
              ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
              : "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25"
          }`}
          id="admin-route-btn"
        >
          {currentRoute === "admin" ? "💬 Chatbot View" : "🛠️ Admin Panel"}
        </button>

        <button
          className="navbar-icon-btn"
          title="Notifications"
          id="notif-btn"
        >
          <Bell size={18} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="dark-mode-toggle"
          onClick={onToggleDark}
          id="dark-mode-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle dark mode"
        >
          <div className="toggle-track">
            <div className={`toggle-thumb ${darkMode ? "toggle-dark" : ""}`}>
              {darkMode ? <Moon size={11} /> : <Sun size={11} />}
            </div>
          </div>
        </button>

        {/* Avatar */}
        <div className="user-avatar-nav" id="user-avatar">
          <span>U</span>
        </div>
      </div>
    </header>
  );
}
