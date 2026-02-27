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
  const [userLocation, setUserLocation] = useState(null);
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
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by you browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = [latitude, longitude];
        setUserLocation(newCoords);
        setSelectedAttraction({
          id: "user",
          name: "My Location",
          coordinates: newCoords,
          category: "You",
        });
      },
      () => {
        alert(
          "Unable to retrieve your location.Please check your permissions.",
        );
      },
    );
  };

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
          <button
            className="locate-btn"
            onClick={handleLocateMe}
            title="Find my location"
          >
            <MapPin size={20} />
          </button>
          {/* Dynamic result count */}
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
          />
        </div>

        {selectedAttraction && (
          <aside className="sidebar-column">
            <AttractionDetails
              attraction={selectedAttraction}
              onClose={() => setSelectedAttraction(null)}
            />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
