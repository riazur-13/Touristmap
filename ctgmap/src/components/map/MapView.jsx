import React, { useEffect, useRef, useMemo, memo } from "react";
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
import "./MapView.css";

// ─── Icons (module-level constants — created once, never re-instantiated) ─────
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

const UserIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ─── Smart map controller ─────────────────────────────────────────────────────
// Decides the best view based on available data — priority order:
//   1. Full route  →  fitBounds(route)
//   2. User + dest →  fitBounds(both points)
//   3. Dest only   →  flyTo(dest, 14)
//   4. Default     →  flyTo(region, 7)
const REGION = [22.3569, 91.7832];
const REGION_Z = 7;
function RecenterMap({ coords, userPos, routePoints }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (routePoints && routePoints.length > 1) {
      const bounds = L.latLngBounds(routePoints);
      const isMobile = window.innerWidth < 768;
      map.fitBounds(bounds, {
        padding: isMobile ? [40, 20] : [80, 80],
        maxZoom: 15,
        animate: true,
        duration: 1.2,
      });
      return;
    }

    if (coords && userPos) {
      map.fitBounds(L.latLngBounds([coords, userPos]), {
        padding: [100, 60],
        maxZoom: 15,
        animate: true,
        duration: 1.2,
      });
      return;
    }

    if (coords) {
      map.flyTo(coords, 14, { animate: true, duration: 1.2 });
      return;
    }

    map.flyTo(REGION, REGION_Z, { animate: true, duration: 0.8 });
  }, [map, coords, userPos, routePoints]);

  return null;
}

// ─── ResizeObserver fix ───────────────────────────────────────────────────────
// rAF prevents layout thrash when the sidebar slides in/out on mobile.
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    });
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}

// ─── Single attraction marker — memo'd so it only re-renders when its own ─────
// data changes, not when userPos or routePoints update.
const AttractionMarker = memo(({ location, isActive, onSelect }) => (
  <Marker
    position={location.coordinates}
    icon={isActive ? ActiveIcon : DefaultIcon}
    eventHandlers={{ click: () => onSelect(location) }}
  >
    <Tooltip
      direction="top"
      offset={[0, -10]}
      opacity={1}
      permanent={false}
      sticky={true}
      interactive={false}
    >
      <span style={{ fontWeight: "bold" }}>{location.name}</span>
    </Tooltip>
  </Marker>
));
AttractionMarker.displayName = "AttractionMarker";

// ─── Main MapView ─────────────────────────────────────────────────────────────
const MapView = ({
  attractions,
  onSelect,
  selectedAttraction,
  routePoints,
  userPos,
  onMarkerDrag,
}) => {
  // Stable ref for drag handler — prevents Marker re-mount when parent re-renders
  const dragRef = useRef(onMarkerDrag);
  useEffect(() => {
    dragRef.current = onMarkerDrag;
  }, [onMarkerDrag]);

  // ✅ useMemo — stable object identity, no ref access during render
  const dragHandlers = useMemo(
    () => ({
      dragend(e) {
        dragRef.current?.(e.target.getLatLng());
      },
    }),
    [],
  ); // empty deps — dragRef itself never changes identity

  return (
    <MapContainer
      center={[22.3569, 91.7832]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      tap={true} // required for iOS touch events
      tapTolerance={15} // larger tap target on mobile
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        detectRetina={true} // serves @2x tiles on Retina / HDPI screens
        keepBuffer={2} // pre-fetches 2 tile-widths ahead while panning
        maxNativeZoom={19}
      />

      <RecenterMap
        coords={selectedAttraction?.coordinates ?? null}
        userPos={userPos}
        routePoints={routePoints}
      />
      <ResizeMap />

      {/* One loop only — tooltip handles hover, click handles selection */}
      {attractions.map((loc) => (
        <AttractionMarker
          key={loc.id}
          location={loc}
          isActive={selectedAttraction?.id === loc.id}
          onSelect={onSelect}
        />
      ))}

      {/* User position marker — draggable to correct GPS drift */}
      {userPos && (
        <Marker
          position={userPos}
          icon={UserIcon}
          draggable={true}
          eventHandlers={dragHandlers}
        >
          <Popup>
            <strong>Your location</strong>
            <br />
            Drag to correct if inaccurate.
          </Popup>
        </Marker>
      )}

      {/* Route polyline */}
      {routePoints && routePoints.length > 1 && (
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
            opacity: 0.85,
            lineJoin: "round",
            lineCap: "round",
          }}
        />
      )}
    </MapContainer>
  );
};

export default memo(MapView);
