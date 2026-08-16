import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "./App.css";
import MapView from "./components/map/MapView";
import attractions, { getAllCategories } from "./data/attractions";
import AttractionDetails from "./components/attractions/AttractionDetails";
import SearchBar from "./components/ui/SearchBar";

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [routePoints, setRoutePoints] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // In-flight request bookkeeping. `abortRef` cancels the previous fetch and
  // `requestIdRef` fences off its response, so a slow earlier reply can never
  // overwrite a newer one (e.g. when the user marker is dragged repeatedly).
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const calculateRoute = useCallback(async (fromPos, target) => {
    if (!fromPos || !target?.coordinates) return;

    const [uLat, uLng] = fromPos;
    const [dLat, dLng] = target.coordinates;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const reqId = ++requestIdRef.current;
    const isCurrent = () => mountedRef.current && reqId === requestIdRef.current;

    setRouteLoading(true);
    setRouteError(null);
    setRoutePoints(null);
    setRouteInfo(null);

    const timer = setTimeout(() => controller.abort(), 10_000);

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${uLng.toFixed(6)},${uLat.toFixed(6)};${dLng.toFixed(6)},${dLat.toFixed(6)}` +
      `?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.code !== "Ok") throw new Error(`OSRM: ${data.code}`);

      const route = data.routes[0];
      if (!isCurrent()) return;

      setRoutePoints(
        route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      );
      setRouteInfo({
        distance: (route.distance / 1000).toFixed(1), // km
        duration: formatDuration(Math.round(route.duration / 60)), // "Xh Ym"
        isFallback: false,
      });
    } catch {
      if (!isCurrent()) return;

      // Straight-line estimate. The fallback panel explains itself via `note`,
      // so this is deliberately not surfaced as a routeError as well.
      setRoutePoints([fromPos, target.coordinates]);
      setRouteInfo({
        distance: haversineKm(fromPos, target.coordinates).toFixed(1),
        duration: null,
        isFallback: true,
        note: "Road data unavailable — showing straight-line estimate.",
      });
    } finally {
      clearTimeout(timer);
      if (isCurrent()) setRouteLoading(false);
    }
  }, []);

  // Cancels any in-flight request and wipes every route-derived piece of state.
  const clearRoute = useCallback(() => {
    abortRef.current?.abort();
    requestIdRef.current++; // fence off any response still in flight
    setRoutePoints(null);
    setRouteInfo(null);
    setRouteError(null);
    setRouteLoading(false);
  }, []);

  const handleGetDirections = useCallback(
    (target) => {
      if (!target?.coordinates) return;

      if (!navigator.geolocation) {
        setRouteError(
          "Geolocation isn't available in this browser, or the page isn't served over HTTPS.",
        );
        return;
      }

      setRouteLoading(true);
      setRouteError(null);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const freshPos = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(freshPos);
          await calculateRoute(freshPos, target);
        },
        (err) => {
          setRouteLoading(false);
          const msg = {
            1: "Location access denied — please allow permission and retry.",
            2: "Position unavailable — check your device GPS.",
            3: "Location timed out — please try again.",
          };
          setRouteError(msg[err.code] ?? "Could not get your location.");
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
      );
    },
    [calculateRoute],
  );

  const handleMarkerDrag = useCallback(
    (newLatLng) => {
      const dragged = [newLatLng.lat, newLatLng.lng];
      setUserPos(dragged);
      if (selectedAttraction) calculateRoute(dragged, selectedAttraction);
    },
    [selectedAttraction, calculateRoute],
  );

  // Selecting a new attraction must drop the previous attraction's route,
  // otherwise its distance/duration would be shown against the new one.
  // `userPos` deliberately survives — it is still valid, and re-fetching it
  // would trigger a redundant permission prompt.
  const handleSelect = useCallback(
    (attraction) => {
      setSelectedAttraction(attraction);
      clearRoute();
    },
    [clearRoute],
  );

  const handleClose = useCallback(() => {
    setSelectedAttraction(null);
    setUserPos(null);
    clearRoute();
  }, [clearRoute]);

  const filteredAttractions = useMemo(
    () =>
      attractions.filter((item) => {
        const matchSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchCat =
          activeCategory === "All" || item.category === activeCategory;
        return matchSearch && matchCat;
      }),
    [searchQuery, activeCategory],
  );

  const categories = useMemo(() => ["All", ...getAllCategories()], []);

  const isSearchEmpty = searchQuery !== "" && filteredAttractions.length === 0;

  return (
    <div className="app-wrapper">
      <header className="header-top">
        <h1>Chittagong Explorer</h1>
      </header>

      <section className="filter-bar">
        <div className="search-and-count">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search locations..."
          />
          <span className="results-badge">
            {filteredAttractions.length}{" "}
            {filteredAttractions.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="vertical-divider"></div>

        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="main-layout">
        <div className="map-column">
          {isSearchEmpty && (
            <div className="no-results-message">
              <p>
                No locations found for "<strong>{searchQuery}</strong>"
              </p>
              <button onClick={() => setSearchQuery("")} className="clear-btn">
                Clear Search
              </button>
            </div>
          )}
          <MapView
            attractions={filteredAttractions}
            onSelect={handleSelect}
            selectedAttraction={selectedAttraction}
            routePoints={routePoints}
            userPos={userPos}
            onMarkerDrag={handleMarkerDrag}
          />
        </div>

        {selectedAttraction && (
          <aside className="sidebar-column">
            <AttractionDetails
              attraction={selectedAttraction}
              routeInfo={routeInfo}
              routeLoading={routeLoading}
              routeError={routeError}
              onDirections={() => handleGetDirections(selectedAttraction)}
              onClose={handleClose}
            />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
