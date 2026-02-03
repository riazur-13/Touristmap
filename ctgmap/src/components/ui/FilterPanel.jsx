import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import { Filter, X } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({ categories, activeFilters, onFilterToggle, onClearAll }) => {
  const isActive = (category) => activeFilters.includes(category);

  return (
    <div className="filter-panel-container">
      <div className="filter-label">
        <Filter size={18} />
        <span>Filter by:</span>
      </div>
      
      {categories.map((categoryName) => {
        const categoryData = Object.values(CATEGORIES).find(cat => cat.name === categoryName);
        const color = categoryData?.color || 'var(--color-primary)';
        
        return (
          <button
            key={categoryName}
            onClick={() => onFilterToggle(categoryName)}
            className={`filter-btn ${isActive(categoryName) ? 'active' : ''}`}
            style={{ '--category-color': color }}
          >
            <span>{categoryData?.icon || '📍'}</span>
            <span>{categoryName}</span>
          </button>
        );
      })}
      
      {activeFilters.length > 0 && (
        <button onClick={onClearAll} className="clear-all-btn">
          <X size={16} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;