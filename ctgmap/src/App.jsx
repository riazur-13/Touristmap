import React, { useState } from "react"; // Added useState
import "./App.css";
import { Search, X, MapPin, Waves, Mountain, Landmark } from "lucide-react";
import MapView from "./components/map/MapView";
import attractions from "./data/attractions";
import AttractionDetails from "./components/attractions/AttractionDetails";
import SearchBar from "./components/ui/SearchBar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const filteredAttractions = attractions.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });
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
          <MapView
            attractions={filteredAttractions}
            onSelect={setSelectedAttraction}
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
