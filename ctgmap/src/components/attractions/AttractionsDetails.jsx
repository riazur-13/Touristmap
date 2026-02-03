import React from 'react';
import { X, MapPin, Clock, DollarSign, Calendar, Info, Navigation } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import AttractionImage from '../ui/AttractionImage';
import './AttractionsDetails.css'; // Import the CSS

const AttractionDetails = ({ attraction, onClose }) => {
  if (!attraction) return null;

  const category = Object.values(CATEGORIES).find(cat => cat.name === attraction.category) || { color: '#667eea' };

  const handleGetDirections = () => {
    const [lat, lng] = attraction.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="details-overlay" onClick={onClose}>
      <aside className="details-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <button className="details-close-btn" onClick={onClose}><X size={20} /></button>
          <AttractionImage 
            src={Array.isArray(attraction.images) ? attraction.images[0] : attraction.images} 
            alt={attraction.name} 
            style={{ height: '100%', borderRadius: 0 }} 
          />
        </div>

        <div className="details-body">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{attraction.name}</h2>
          <span style={{ color: category.color, fontWeight: 'bold' }}>{attraction.category}</span>
          <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>{attraction.description}</p>

          <section className="details-info-section">
            <InfoRow icon={<MapPin size={20} color={category.color}/>} label="Address" value={attraction.address} />
            <InfoRow icon={<Calendar size={20} color={category.color}/>} label="Best Time" value={attraction.bestTimeToVisit} />
            <InfoRow icon={<Clock size={20} color={category.color}/>} label="Opening Hours" value={attraction.openingHours} />
            <InfoRow icon={<DollarSign size={20} color={category.color}/>} label="Entry Fee" value={attraction.entryFee} />
            <InfoRow icon={<Info size={20} color={category.color}/>} label="Facilities" value={attraction.facilities} />
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