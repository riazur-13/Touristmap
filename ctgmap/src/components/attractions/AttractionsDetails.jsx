import React, { useState } from 'react';
import { X, MapPin, Clock, DollarSign, Calendar, Info, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

import './AttractionsDetails.css';

const AttractionDetails = ({ attraction, onClose }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  if (!attraction) return null;

  const category = Object.values(CATEGORIES).find(cat => cat.name === attraction.category) || { color: '#667eea' };
  const nextImage = () => {
    const images = Array.isArray(attraction.images) ? attraction.images : [attraction.images];
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = Array.isArray(attraction.images) ? attraction.images : [attraction.images];
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleGetDirections = () => {
    const [lat, lng] = attraction.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };
  const images = Array.isArray(attraction.images) ? attraction.images : [attraction.images];
  const currentImage = images[currentImgIndex];
  return (
    <div className="details-overlay" onClick={onClose}>
      <aside className="details-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">

        <div className="details-image-container" style={{ position: 'relative', height: '250px', backgroundColor: '#f0f0f0' }}>
          <button className="details-close-btn" onClick={onClose}><X size={20} /></button>
          <img
            src={currentImage}
            alt={attraction.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            </div>
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="nav-btn left"> <ChevronLeft size={24} /> </button>
              <button onClick={nextImage} className="nav-btn right"> <ChevronRight size={24} /> </button>
              <div className="img-counter"> {currentImgIndex + 1} / {images.length} </div>
            </>
          )}
        </div>

        <div className="details-body">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{attraction.name}</h2>
          <span style={{ color: category.color, fontWeight: 'bold' }}>{attraction.category}</span>
          <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>{attraction.description}</p>
  { attraction.moreInfoLink &&(
<div className="see-more-section" style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
    Want to explore more history and photos?
  </p>
  <a 
    href={attraction.moreInfoLink} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    Visit Official Wiki / Website
    <span style={{ fontSize: '1.2rem' }}>↗</span>
  </a>
</div>
  )}

          <section className="details-info-section">
            <InfoRow icon={<MapPin size={20} color={category.color} />} label="Address" value={attraction.address} />
            <InfoRow icon={<Calendar size={20} color={category.color} />} label="Best Time" value={attraction.bestTimeToVisit} />
            <InfoRow icon={<Clock size={20} color={category.color} />} label="Opening Hours" value={attraction.openingHours} />
            <InfoRow icon={<DollarSign size={20} color={category.color} />} label="Entry Fee" value={attraction.entryFee} />
            <InfoRow icon={<Info size={20} color={category.color} />} label="Facilities" value={attraction.facilities} />
          </section>

          <button className="directions-btn" onClick={handleGetDirections}
            style={{
              width: '100%', marginTop: '2rem', padding: '1rem',
              backgroundColor: 'var(--color-primary)', color: 'white',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px', fontWeight: 'bold'
            }}>
            <Navigation size={20} />
            Get Directions
          </button>
        </div>
      </aside>
    </div>
  );
};

// Helper component for the info rows
const InfoRow = ({ icon, label, value }) => (
  <div className="info-item">
    <div style={{ marginTop: '4px' }}>{icon}</div>
    <div>
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
    </div>
  </div>
);

export default AttractionDetails;