import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import './SearchFilterBar.css'; // New import

const SearchFilterBar = ({ searchQuery, onSearchChange, categories, activeFilters, onFilterToggle }) => {
  return (
    <div className="search-filter-container">
      <div className="search-filter-content">
        
        <div className="search-wrapper">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search locations..."
          />
        </div>

        
        <div className="filter-wrapper">
          <FilterPanel
            categories={categories}
            activeFilters={activeFilters}
            onFilterToggle={onFilterToggle}
          />
        </div>
      </div>
    </div>
  );
};
export default SearchFilterBar;