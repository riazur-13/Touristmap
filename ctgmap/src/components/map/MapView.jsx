import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons not showing up in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// This small component handles the "resize" when the sidebar opens
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

const MapView = ({ attractions, onSelect }) => {
  return (
    <MapContainer
      center={[22.3569, 91.7832]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ResizeMap />
      {attractions.map((loc) => (
        <Marker
          key={loc.id}
          position={loc.coordinates}
          eventHandlers={{
            // When the mouse enters the marker
            mouseover: (e) => {
              e.target.openPopup(); // Optional: show name on hover
              e.target.setOpacity(0.8); // Visual feedback
            },
            // When the mouse leaves the marker
            mouseout: (e) => {
              e.target.closePopup();
              e.target.setOpacity(1.0);
            },
            // Keep your existing click logic
            click: () => onSelect(loc),
          }}
        >
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
