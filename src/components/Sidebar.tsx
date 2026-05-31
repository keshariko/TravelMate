import {
  MapPin,
  Waves,
  Mountain,
  Camera,
  Landmark,
  Phone,
  Clock,
  Package,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { travelPackages } from "../data/knowledgeBase";

interface SidebarProps {
  onCategoryClick: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    icon: Waves,
    label: "Beach Packages",
    query: "Show me beach packages",
    color: "cat-beach",
    count: 1,
  },
  {
    icon: Mountain,
    label: "Hill Country",
    query: "Tell me about hill country packages",
    color: "cat-hill",
    count: 1,
  },
  {
    icon: Camera,
    label: "Safari Tours",
    query: "What safari tours do you offer?",
    color: "cat-safari",
    count: 1,
  },
  {
    icon: Landmark,
    label: "Cultural Tours",
    query: "Show me cultural and heritage tours",
    color: "cat-cultural",
    count: 2,
  },
  {
    icon: Package,
    label: "All Packages",
    query: "Show all available packages",
    color: "cat-all",
    count: 6,
  },
  {
    icon: Phone,
    label: "Contact Support",
    query: "How do I contact support?",
    color: "cat-contact",
    count: 0,
  },
];

const topDestinations = [
  { name: "Negombo", emoji: "🌊", country: "Western Province" },
  { name: "Ella", emoji: "⛰️", country: "Uva Province" },
  { name: "Yala", emoji: "🦁", country: "Southern Province" },
  { name: "Kandy", emoji: "🏛️", country: "Central Province" },
  { name: "Sigiriya", emoji: "🏔️", country: "North Central" },
];

export function Sidebar({ onCategoryClick, isOpen, onClose }: SidebarProps) {
  const cheapest = [...travelPackages].sort((a, b) => a.price - b.price)[0];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`} id="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-inner">
            <Sparkles size={16} className="sidebar-sparkle" />
            <span>Explore Sri Lanka</span>
          </div>
          <p className="sidebar-subtitle">Find your perfect getaway</p>
        </div>

        {/* Quick Categories */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            <MapPin size={13} />
            Travel Categories
          </h3>
          <nav className="sidebar-nav">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`sidebar-nav-item ${cat.color}`}
                onClick={() => {
                  onCategoryClick(cat.query);
                  onClose();
                }}
                id={`sidebar-${cat.label.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <span className="sidebar-nav-icon">
                  <cat.icon size={15} />
                </span>
                <span className="sidebar-nav-label">{cat.label}</span>
                <span className="sidebar-nav-right">
                  {cat.count > 0 && (
                    <span className="sidebar-count">{cat.count}</span>
                  )}
                  <ChevronRight size={13} />
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Top Destinations */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            <MapPin size={13} />
            Top Destinations
          </h3>
          <div className="destination-list">
            {topDestinations.map((dest) => (
              <button
                key={dest.name}
                className="destination-item"
                onClick={() => {
                  onCategoryClick(`Tell me about ${dest.name}`);
                  onClose();
                }}
              >
                <span className="dest-emoji">{dest.emoji}</span>
                <div className="dest-info">
                  <span className="dest-name">{dest.name}</span>
                  <span className="dest-region">{dest.country}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deal Banner */}
        <div className="sidebar-deal-banner">
          <div className="deal-badge">🔥 Best Deal</div>
          <p className="deal-title">{cheapest.name}</p>
          <p className="deal-price">
            From LKR {cheapest.price.toLocaleString()}
          </p>
          <p className="deal-duration">
            <Clock size={11} /> {cheapest.duration}
          </p>
          <button
            className="deal-btn"
            onClick={() => onCategoryClick(`Tell me about ${cheapest.name}`)}
          >
            View Deal →
          </button>
        </div>
      </aside>
    </>
  );
}
