import React from 'react';
import { Waves, Mountain, Landmark, Building2, Trees } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({ categories, activeFilters, onFilterToggle }) => {
  // A mapping of category names to their specific icons
  const getIcon = (categoryName) => {
    switch (categoryName) {
      case 'Beach': return <Waves size={18} />;
      case 'Natural Wonder': return <Mountain size={18} />;
      case 'Religious Site': return <Landmark size={18} />;
      case 'Historical Site': return <Building2 size={18} />;
      case 'Hill Station': return <Trees size={18} />;
      default: return null;
    }
  };

  return (
    <div className="filter-panel">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${activeFilters.includes(cat) ? 'active' : ''}`}
          onClick={() => onFilterToggle(cat)}
        >
          {getIcon(cat)}
          <span>{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;