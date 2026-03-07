import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  Tooltip,
} from "react-leaflet";
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

function RecenterMap({ coords, userPos, routePoints }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // If we have a route, fit the map to show the whole route
    if (routePoints && routePoints.length > 0) {
      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [60, 60], duration: 1.5 });
      return;
    }

    // If we have both user and destination, fit both
    if (coords && userPos) {
      const bounds = L.latLngBounds([coords, userPos]);
      map.fitBounds(bounds, { padding: [80, 80], duration: 1.5 });
      return;
    }

    // Just an attraction selected — center on it
    if (coords) {
      map.flyTo(coords, 14, { duration: 1.5 });
      return;
    }

    // Default: show full region
    map.flyTo([22.3569, 91.7832], 7.0, { duration: 1 });
  }, [coords, userPos, routePoints, map]);

  return null;
}

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

const MapView = ({
  attractions,
  onSelect,
  selectedAttraction,
  routePoints,
  userPos,
  onMarkerDrag,
}) => {
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
      <RecenterMap
        coords={selectedAttraction?.coordinates}
        userPos={userPos}
        routePoints={routePoints}
      />
      <ResizeMap />
      {attractions.map((attr) => (
        <Marker
          key={attr.id}
          position={attr.coordinates}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(), // Opens on hover
            mouseout: (e) => e.target.closePopup(), // Closes when mouse leaves
          }}
        >
          <Popup>{attr.name}</Popup>
        </Marker>
      ))}

      {userPos && (
        <Marker
          position={userPos} // This starts at the GPS spot, but changes when dragged
          draggable={true} // This allows the user to fix the "Far away" problem
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const newPos = marker.getLatLng();

              // This calls the function in App.jsx to update the state
              onMarkerDrag(newPos);
            },
          }}
        >
          <Popup>You are here. Drag me to your exact spot!</Popup>
        </Marker>
      )}
      {routePoints && (
        <Polyline
          positions={routePoints}
          pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.8 }}
        />
      )}

      {attractions.map((loc) => {
        const isActive = selectedAttraction?.id === loc.id;

        return (
          <Marker
            key={loc.id}
            position={loc.coordinates}
            icon={isActive ? ActiveIcon : DefaultIcon}
            eventHandlers={{
              click: () => onSelect(loc),
              // We can actually remove mouseover/mouseout entirely
              // because Tooltips can be set to 'sticky' or 'permanent'
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent={false} // Only shows on hover
              sticky={true} // Follows the mouse slightly for a smooth feel
              interactive={false} // THIS STOPS THE GLITCHING
            >
              <span style={{ fontWeight: "bold" }}>{loc.name}</span>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
