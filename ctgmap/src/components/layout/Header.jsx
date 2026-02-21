import React from 'react';
import { Map } from 'lucide-react';
import './Header.css';

const Header = ({ attractionCount }) => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-section">
          <Map size={32} className="logo-icon" />
          <h1>Chittagong Explorer</h1>
        </div>
        <div className="attraction-badge">
          {attractionCount} Attractions
        </div>
      </div>
    </header>
  );
};

export default Header;