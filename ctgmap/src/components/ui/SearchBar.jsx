import { Search, X } from "lucide-react";
import "./SearchBar.css";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar" role="search">
      <Search size={20} className="search-bar__icon" aria-hidden="true" />
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search attractions by name"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
