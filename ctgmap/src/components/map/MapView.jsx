import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// This fix ensures the default icons are found by Vite
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

function RecenterMap({ coords }) {
  const map = useMap();

  // These coordinates and zoom level cover the main Chittagong area
  const chittagongCenter = [22.3569, 91.7832];
  const chittagongZoom = 7.0;

  useEffect(() => {
    if (coords) {
      // Smoothly fly to the selected attraction
      map.flyTo(coords, 14, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    } else {
      // Smoothly fly back to the full city view when selection is cleared
      map.flyTo(chittagongCenter, chittagongZoom, {
        duration: 1.2,
      });
    }
  }, [coords, map]);

  return null;
}
function ResizeMap({ isSidebarOpen }) {
  const map = useMap();

  useEffect(() => {
    // We wait 300ms for the sidebar's CSS transition to finish
    // before recalculating the map size
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [isSidebarOpen, map]);

  return null;
}

const MapView = ({ attractions, onSelect, selectedAttraction }) => {
  return (
    <MapContainer
      center={[22.3569, 91.7832]}
      maxBounds={[
        [20.5, 90.0], // Southwest (Sea)
        [24.0, 93.5], // Northeast (Hills)
      ]}
      minZoom={7.0}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <RecenterMap coords={selectedAttraction?.coordinates} />
      <ResizeMap isSidebarOpen={!!selectedAttraction} />

      {attractions.map((loc) => {
        const isActive = selectedAttraction?.id === loc.id;
        return (
          <Marker
            key={loc.id}
            position={loc.coordinates}
            icon={isActive ? ActiveIcon : DefaultIcon}
            eventHandlers={{
              click: () => onSelect(loc),
            }}
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
