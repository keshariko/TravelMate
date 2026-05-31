import { Sun, Moon, Menu, Plane, Globe, Bell } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
}

export function Navbar({ darkMode, onToggleDark, onToggleSidebar }: NavbarProps) {
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
        <div className="navbar-brand">
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
