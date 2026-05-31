import type { TravelPackage } from "../data/knowledgeBase";
import { Star, Clock, DollarSign } from "lucide-react";

interface PackageCardProps {
  pkg: TravelPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div className="package-card group">
      {/* Card Header with gradient */}
      <div className={`package-card-header bg-gradient-to-br ${pkg.image}`}>
        <span className="package-emoji">{pkg.emoji}</span>
        <div className="package-category-badge">
          {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
        </div>
      </div>

      {/* Card Body */}
      <div className="package-card-body">
        <div className="package-card-title-row">
          <h3 className="package-card-title">{pkg.name}</h3>
          <div className="package-rating">
            <Star size={12} fill="currentColor" />
            <span>{pkg.rating}</span>
          </div>
        </div>

        <p className="package-destination">📍 {pkg.destination}</p>
        <p className="package-description">{pkg.description}</p>

        {/* Highlights */}
        <div className="package-highlights">
          {pkg.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="highlight-tag">
              {h}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="package-card-footer">
          <div className="package-info-row">
            <span className="package-info-item">
              <Clock size={13} />
              {pkg.duration}
            </span>
            <span className="package-price">
              <DollarSign size={13} />
              {pkg.currency} {pkg.price.toLocaleString()}
            </span>
          </div>
          <button className="package-book-btn">
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
}
