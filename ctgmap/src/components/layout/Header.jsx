
import { Map } from "lucide-react";
import './Header.css'; 

const Header = ({ attractionCount }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div>
          <h1 className="header-title">
            <Map size={32} />
            Chittagong Tourist Map
          </h1>
        </div>
        <div className="header-stats">
          <span>{attractionCount} Destinations Found</span>
        </div>
      </div>
    </header>
  );
};

export default Header;