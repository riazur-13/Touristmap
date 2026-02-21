import React from "react";
import { MapPin, Clock, Banknote, Navigation, X } from "lucide-react";
import "./AttractionDetails.css";

const AttractionDetails = ({ attraction, onClose }) => {
  if (!attraction) return null;

  const handleGetDirections = () => {
    const [lat, lng] = attraction.coordinates;
    // Fixed URL format for Google Maps
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  // Safe image logic: Uses your 'images' key from data
  const imageSrc =
    attraction.images || "https://placehold.co/600x400?text=No+Image+Found";

  return (
    <div className="detail-card">
      <div className="card-image-container">
        <img
          src={imageSrc}
          alt={attraction.name}
          className="card-image"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Path+Error";
          }}
        />
        <button className="close-btn-overlay" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="card-body">
        <h2 className="card-title">{attraction.name}</h2>
        <span className="category-badge">{attraction.category}</span>

        <p className="card-description">{attraction.description}</p>

        <div className="info-grid">
          <div className="info-item">
            <MapPin size={18} className="info-icon" />
            <div className="info-text">
              <span className="label">Address</span>
              <span className="value">{attraction.address}</span>
            </div>
          </div>

          <div className="info-row-flex">
            <div className="info-item">
              <Clock size={18} className="info-icon" />
              <div className="info-text">
                <span className="label">Opening Hours</span>
                <span className="value">{attraction.openingHours}</span>
              </div>
            </div>
            <div className="info-item">
              <Banknote size={18} className="info-icon" />
              <div className="info-text">
                <span className="label">Entry Fee</span>
                <span className="value">{attraction.entryFee}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="directions-btn" onClick={handleGetDirections}>
          <Navigation size={18} />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default AttractionDetails;
