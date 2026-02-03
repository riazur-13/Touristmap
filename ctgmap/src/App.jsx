import { useState, useMemo } from 'react'
import attractions from './data/attractions'
import Header from "./components/layout/Header";
import MapView from "./components/map/MapView";
import SearchFilterBar from "./components/ui/SearchFilterBar";
import AttractionDetails from "./components/attractions/AttractionsDetails";

// Import the App-specific CSS
import './App.css'

const App = () => {
  const [selectedAttraction, setSelectedAttraction] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // Filtering Logic
  const filteredAttractions = useMemo(() => {
    return attractions.filter(attraction => {
      const matchesSearch = 
        searchQuery === '' ||  
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        activeFilters.length === 0 ||  
        activeFilters.includes(attraction.category);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilters]);

  const attractionCount = filteredAttractions.length;

  const uniqueCategories = useMemo(() => {
    return [...new Set(attractions.map(attr => attr.category))];
  }, []);

  // Event Handlers
  const handleAttractionSelect = (attraction) => {
    setSelectedAttraction(attraction);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterToggle = (category) => {
    setActiveFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleCloseDetail = () => {
    setSelectedAttraction(null);
  };
  
  return (
    <div className="app-container">
      <Header attractionCount={attractionCount}/>
      
      <SearchFilterBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange}
        categories={uniqueCategories}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle} 
        onClearFilters={handleClearFilters}
      />

       <main className="main-content">
        <MapView 
          attractions={filteredAttractions}
          selectedAttraction={selectedAttraction}
          onAttractionSelect={handleAttractionSelect}
        />
      </main>

      <AttractionDetails attraction={selectedAttraction}
        onClose={handleCloseDetail}/>
    </div>
  )
}

export default App