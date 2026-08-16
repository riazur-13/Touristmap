import {
  MapPin,
  Clock,
  Banknote,
  Navigation,
  X,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  Route,
  ExternalLink,
} from "lucide-react";
import "./AttractionDetails.css";

const AttractionDetails = ({
  attraction,
  onClose,
  onDirections,
  routeInfo,
  routeLoading,
  routeError,
}) => {
  if (!attraction) return null;

  const imageSrc =
    attraction.images || "https://placehold.co/600x400?text=No+Image+Found";

  return (
    <div className="detail-card">
      <div className="card-image-container">
        <img
          src={imageSrc}
          alt={attraction.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Path+Error";
          }}
        />
        <button
          className="close-btn-overlay"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="card-body">
        <h2 className="card-title">{attraction.name}</h2>
        <span className="category-badge">{attraction.category}</span>

        <p className="card-description">{attraction.description}</p>

        <div className="info-grid">
          <div className="info-item">
            <MapPin size={18} className="info-icon" />
            <div className="info-text">
              <span className="label">Address</span>
              <span className="value">{attraction.address}</span>
            </div>
          </div>

          <div className="info-row-flex">
            <div className="info-item">
              <Clock size={18} className="info-icon" />
              <div className="info-text">
                <span className="label">Opening Hours</span>
                <span className="value">{attraction.openingHours}</span>
              </div>
            </div>
            <div className="info-item">
              <Banknote size={18} className="info-icon" />
              <div className="info-text">
                <span className="label">Entry Fee</span>
                <span className="value">{attraction.entryFee}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="extra-info-section">
          <div className="info-item full-width">
            <Calendar size={18} className="info-icon" />
            <div className="info-text">
              <span className="label">Best Time to Visit</span>
              <span className="value">{attraction.bestTimeToVisit}</span>
            </div>
          </div>
          <div className="info-item full-width">
            <Sparkles size={18} className="info-icon" />
            <div className="info-text">
              <span className="label">Facilities</span>
              <span className="value">{attraction.facilities}</span>
            </div>
          </div>
        </div>

        {/* ── Route status panel ───────────────────────────────────────── */}
        {routeLoading && (
          <div
            className="route-info-box route-loading"
            role="status"
            aria-live="polite"
          >
            <Loader2 size={15} className="spin" />
            <span>Calculating route…</span>
          </div>
        )}

        {routeError && !routeLoading && (
          <div className="route-info-box route-error" role="alert">
            <AlertCircle size={15} />
            <span>{routeError}</span>
          </div>
        )}

        {routeInfo && !routeLoading && (
          <div
            className={`route-info-box ${routeInfo.isFallback ? "route-fallback" : "route-success"}`}
          >
            <div className="route-stat">
              <Route size={14} />
              <span>
                <strong>{routeInfo.distance} km</strong>
                {routeInfo.isFallback ? " straight line" : " by road"}
              </span>
            </div>
            {routeInfo.duration && (
              <div className="route-stat">
                <Clock size={14} />
                <span>
                  <strong>{routeInfo.duration}</strong> drive
                </span>
              </div>
            )}
            {routeInfo.note && <p className="route-note">{routeInfo.note}</p>}
          </div>
        )}

        <div className="buttons-group">
          {attraction.moreInfoLink && (
            <a
              href={attraction.moreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="learn-more-btn"
            >
              <ExternalLink size={18} /> Learn More
            </a>
          )}

          <button
            className="directions-btn"
            onClick={onDirections}
            disabled={routeLoading}
            aria-busy={routeLoading}
          >
            {routeLoading ? (
              <>
                <Loader2 size={18} className="spin" /> Finding route…
              </>
            ) : (
              <>
                <Navigation size={18} /> Get Directions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetails;
