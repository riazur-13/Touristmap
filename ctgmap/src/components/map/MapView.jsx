import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Standard icon fix
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ActiveIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
});

// 1. Cleaner Recenter Logic
function RecenterMap({ coords }) {
  const map = useMap();
  const divisionCenter = [22.3569, 91.7832];
  const divisionZoom = 7.0;

  useEffect(() => {
    if (!map) return;

    try {
      if (coords) {
        map.flyTo(coords, 14, { duration: 1.5 });
      } else {
        // Fly back immediately; ResizeObserver handles the container shift
        map.flyTo(divisionCenter, divisionZoom, { duration: 1 });
      }
    } catch {
      // Silent catch
    }
  }, [coords, map]);

  return null;
}

// 2. The only resize component you need
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const container = map.getContainer();
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
}

const MapView = ({ attractions, onSelect, selectedAttraction }) => {
  return (
    <MapContainer
      center={[22.3569, 91.7832]}
      trackResize={true}
      zoom={7.0}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Removed MapTileFixer - ResizeMap handles everything now */}
      <RecenterMap coords={selectedAttraction?.coordinates} />
      <ResizeMap />

      {attractions.map((loc) => {
        const isActive = selectedAttraction?.id === loc.id;
        return (
          <Marker
            key={loc.id}
            position={loc.coordinates}
            icon={isActive ? ActiveIcon : DefaultIcon}
            eventHandlers={{ click: () => onSelect(loc) }}
          >
            <Popup>
              <strong>{loc.name}</strong>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
