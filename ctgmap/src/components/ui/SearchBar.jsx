import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar-wrapper">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear-btn" onClick={() => onChange('')}>
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;