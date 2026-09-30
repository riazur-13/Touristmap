import { useEffect, useRef, useMemo, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
// Animation styles only; cluster icons are styled in MapView.css.
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "./MapView.css";
import {
  CATEGORIES,
  MAP_CONFIG,
  BREAKPOINTS,
  FALLBACK_CATEGORY_COLOR,
  getCategoryColor,
} from "../../config/constants";

// ─── Icons (module-level constants — created once, never re-instantiated) ─────
// Every marker passes an explicit icon, so Leaflet's L.Icon.Default (whose
// image paths break under Vite) is never used.
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// Vendored from github.com/pointhi/leaflet-color-markers (BSD-2-Clause) so the
// map has no runtime dependency on raw.githubusercontent.com being reachable.
import markerBlue from "../../assets/markers/marker-icon-2x-blue.png";

// Attraction pins are inline SVG so each category gets its own color from
// CATEGORIES; the selected pin is larger and outlined.
const PIN_PATH =
  "M12.5 0C5.6 0 0 5.6 0 12.5 0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z";

function createPinIcon(color, isActive) {
  const [w, h] = isActive ? [32, 52] : [25, 41];
  const stroke = isActive ? "#1e293b" : "#ffffff";
  return L.divIcon({
    className: isActive ? "map-pin map-pin--active" : "map-pin",
    html:
      `<svg viewBox="-1.5 -1.5 28 44" width="${w}" height="${h}" aria-hidden="true">` +
      `<path d="${PIN_PATH}" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>` +
      `<circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff"/></svg>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    // Tooltip sits above the pin (plus the Tooltip's own offset), never over it.
    tooltipAnchor: [0, -h],
  });
}

const PIN_ICONS = new Map(
  [
    ...Object.values(CATEGORIES).map((c) => c.color),
    FALLBACK_CATEGORY_COLOR,
  ].flatMap((color) => [
    [`${color}|0`, createPinIcon(color, false)],
    [`${color}|1`, createPinIcon(color, true)],
  ]),
);

const getPinIcon = (category, isActive) =>
  PIN_ICONS.get(`${getCategoryColor(category)}|${isActive ? 1 : 0}`);

// Clusters are neutral (slate) so they never read as one of the category
// colors. Setting options.title before Leaflet builds the icon gives the
// focusable cluster an accessible name.
function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 34 : count < 25 ? 40 : 46;
  cluster.options.title = `${count} attractions: select to zoom in`;
  return L.divIcon({
    html: `<span>${count}</span>`,
    className: "map-cluster",
    iconSize: L.point(size, size),
  });
}

// Leaflet does not activate focused markers from the keyboard (see
// AttractionMarker), so Enter/Space on a cluster zooms into it, like a click.
function handleClusterKeydown(e) {
  const { key } = e.originalEvent;
  if (key === "Enter" || key === " ") {
    e.originalEvent.preventDefault();
    e.layer.zoomToBounds({ padding: [40, 40] });
  }
}

// Leaflet paths are drawn to canvas/SVG attributes, not CSS, so this cannot
// be a custom property; it matches --color-primary in variables.css.
const ROUTE_COLOR = "#2563eb";

const UserIcon = L.icon({
  iconUrl: markerBlue,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ─── Smart map controller ─────────────────────────────────────────────────────
// Decides the best view based on available data — priority order:
//   1. Full route  →  fitBounds(route)
//   2. User + dest →  fitBounds(both points)
//   3. Dest only   →  flyTo(dest, MAP_CONFIG.DETAIL_ZOOM)
//   4. Default     →  flyToBounds(homeBounds), i.e. every attraction in view
function RecenterMap({ coords, userPos, routePoints, homeBounds }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (routePoints && routePoints.length > 1) {
      const bounds = L.latLngBounds(routePoints);
      const isMobile = window.innerWidth < BREAKPOINTS.TABLET;
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
      map.flyTo(coords, MAP_CONFIG.DETAIL_ZOOM, {
        animate: true,
        duration: 1.2,
      });
      return;
    }

    map.flyToBounds(homeBounds, {
      padding: MAP_CONFIG.HOME_PADDING,
      animate: true,
      duration: 0.8,
    });
  }, [map, coords, userPos, routePoints, homeBounds]);

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
// Leaflet makes each marker focusable with role="button" but, as of 1.9, does
// not activate it from the keyboard, so Enter/Space are handled here. The
// accessible name is an aria-label set on the marker element.
const AttractionMarker = memo(({ location, isActive, onSelect }) => (
  <Marker
    position={location.coordinates}
    icon={getPinIcon(location.category, isActive)}
    zIndexOffset={isActive ? 1000 : 0}
    eventHandlers={{
      // Not `title`: the browser would show its native tooltip on top of
      // Leaflet's. Re-applied on every add because clustering removes and
      // re-adds marker elements.
      add: (e) =>
        e.target
          .getElement()
          ?.setAttribute("aria-label", `${location.name} (${location.category})`),
      click: () => onSelect(location),
      keydown: ({ originalEvent: e }) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(location);
        }
      },
    }}
  >
    {/* Not sticky: Leaflet ignores the icon's tooltipAnchor for sticky
        tooltips, which then cover the pin when opened by keyboard focus. */}
    <Tooltip direction="top" offset={[0, -4]} opacity={1}>
      <strong>{location.name}</strong>
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
  homeBounds,
}) => {
  // Stable ref for drag handler — prevents Marker re-mount when parent re-renders
  const dragRef = useRef(onMarkerDrag);
  useEffect(() => {
    dragRef.current = onMarkerDrag;
  }, [onMarkerDrag]);

  // Stable object identity; dragRef itself never changes, so no deps needed.
  const dragHandlers = useMemo(
    () => ({
      dragend(e) {
        dragRef.current?.(e.target.getLatLng());
      },
    }),
    [],
  );

  return (
    <MapContainer
      bounds={homeBounds}
      boundsOptions={{ padding: MAP_CONFIG.HOME_PADDING }}
      minZoom={MAP_CONFIG.MIN_ZOOM}
      maxZoom={MAP_CONFIG.MAX_ZOOM}
      maxBounds={MAP_CONFIG.MAX_BOUNDS}
      maxBoundsViscosity={MAP_CONFIG.MAX_BOUNDS_VISCOSITY}
      style={{ height: "100%", width: "100%" }}
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
        homeBounds={homeBounds}
      />
      <ResizeMap />

      {/* Unselected pins cluster when they crowd together; each keeps its
          category color. Tooltip handles hover, click handles selection. */}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={50}
        showCoverageOnHover={false}
        onKeydown={handleClusterKeydown}
      >
        {attractions
          .filter((loc) => loc.id !== selectedAttraction?.id)
          .map((loc) => (
            <AttractionMarker
              key={loc.id}
              location={loc}
              isActive={false}
              onSelect={onSelect}
            />
          ))}
      </MarkerClusterGroup>

      {/* The selected pin stays outside the cluster group so it is never
          hidden inside a cluster, e.g. when a route zooms the map out. */}
      {selectedAttraction && (
        <AttractionMarker
          key={`active-${selectedAttraction.id}`}
          location={selectedAttraction}
          isActive={true}
          onSelect={onSelect}
        />
      )}

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
            color: ROUTE_COLOR,
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
