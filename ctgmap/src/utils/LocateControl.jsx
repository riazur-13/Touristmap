import { useMap } from "react-leaflet";
import { Target } from "lucide-react";

const LocateControl = () => {
  const map = useMap();

  const handleLocate = () => {
    // 1. You could add a 'loading' state here to change the icon color
    console.log("Locating...");

    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: false, // Setting this to false makes it much faster
      timeout: 10000, // Stops searching after 10 seconds to save battery
    });

    map.on("locationfound", () => {
      console.log("Location found!");
    });
  };

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{ marginTop: "80px", marginRight: "10px" }}
    >
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLocate}
          className="locate-btn"
          title="Show my location"
        >
          <Target size={20} />
        </button>
      </div>
    </div>
  );
};
export default LocateControl;
