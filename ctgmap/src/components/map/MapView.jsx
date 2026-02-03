import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG, CATEGORIES } from '../../utils/constants';
import './MapView.css'; // Import our new CSS

const createCustomIcon = (category, isSelected) => {
  const categoryData = Object.values(CATEGORIES).find(cat => cat.name === category);
  const color = categoryData?.color || '#667eea';
  const icon = categoryData?.icon || '📍';

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="marker-pin ${isSelected ? 'selected' : ''}" 
           style="background-color: ${color}; --marker-color: ${color}">
        <span>${icon}</span>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

const MapView = ({ attractions, selectedAttraction, onAttractionSelect }) => {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={MAP_CONFIG.DEFAULT_CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={attraction.coordinates}
            icon={createCustomIcon(
              attraction.category, 
              selectedAttraction?.id === attraction.id
            )}
            eventHandlers={{
              click: () => onAttractionSelect(attraction),
            }}
          >
            <Popup>
              <div>
                <h3 style={{ margin: 0 }}>{attraction.name}</h3>
                <p style={{ margin: '5px 0', color: 'var(--color-text-secondary)' }}>
                  {attraction.category}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="map-stats-overlay">
        {attractions.length} locations found
      </div>
    </div>
  );
};

export default MapView;