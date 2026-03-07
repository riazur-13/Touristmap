import React, { useState } from "react"; // Added useState
import "./App.css";
import "./styles/variables.css";
import { Search, X, MapPin, Waves, Mountain, Landmark } from "lucide-react";
import MapView from "./components/map/MapView";
import attractions from "./data/attractions";
import AttractionDetails from "./components/attractions/AttractionDetails";
import SearchBar from "./components/ui/SearchBar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [routePoints, setRoutePoints] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userPos, setUserPos] = useState(null);

  // ✅ New: pure route calculator — accepts a position directly
  const calculateRoute = async (fromPos, target) => {
    if (!fromPos || !target?.coordinates) return;

    const [userLat, userLng] = fromPos;
    const [destLat, destLng] = target.coordinates;

    const url = `https://router.project-osrm.org/route/v1/driving/${userLng.toFixed(6)},${userLat.toFixed(6)};${destLng.toFixed(6)},${destLat.toFixed(6)}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok") {
        const roadPoints = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);
        const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
        const durationMin = Math.round(data.routes[0].duration / 60);

        setRoutePoints(roadPoints);
        setRouteInfo({ distance: distanceKm, duration: durationMin }); // ✅ Save distance
      } else {
        setRoutePoints([
          [userLat, userLng],
          [destLat, destLng],
        ]);
        setRouteInfo(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setRoutePoints([
        [userLat, userLng],
        [destLat, destLng],
      ]);
      setRouteInfo(null);
    }
  };

  // ✅ This is what the button calls — fetches GPS first, then calculates
  const handleGetDirections = (target) => {
    if (!target?.coordinates) return;

    setRoutePoints(null);
    setRouteInfo(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userPos = [latitude, longitude];
        setUserPos(userPos);
        await calculateRoute(userPos, target);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        alert("Could not get your location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };
  const handleMarkerDrag = (newCoords) => {
    const draggedPos = [newCoords.lat, newCoords.lng];

    setUserPos(draggedPos);

    if (selectedAttraction) {
      calculateRoute(draggedPos, selectedAttraction);
    }
  };
  const filteredAttractions = attractions.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });
  const isSearchEmpty = searchQuery !== "" && filteredAttractions.length === 0;
  const categories = [
    "All",
    ...new Set(attractions.map((item) => item.category)),
  ];

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
            onSelect={setSelectedAttraction}
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
              onDirections={() => handleGetDirections(selectedAttraction)}
              onClose={() => {
                setSelectedAttraction(null);
                setRoutePoints(null);
                setRouteInfo(null);
              }}
            />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
