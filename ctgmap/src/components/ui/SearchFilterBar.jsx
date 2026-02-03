import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import './SearchFilterBar.css'; // New import

const SearchFilterBar = ({ searchQuery, onSearchChange, categories, activeFilters, onFilterToggle, onClearFilters }) => {
  return (
    <div className="search-filter-container">
      <div className="search-filter-content">
        <div className="search-row">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search attractions..."
          />
        </div>
        <FilterPanel
          categories={categories}
          activeFilters={activeFilters}
          onFilterToggle={onFilterToggle}
          onClearAll={onClearFilters}
        />
      </div>
    </div>
  );
};

export default SearchFilterBar;