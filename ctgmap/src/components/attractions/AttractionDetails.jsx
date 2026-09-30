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
  Info,
} from "lucide-react";
import { getCategoryColor } from "../../config/constants";
// Local, so a missing or broken photo never depends on a third-party service.
import placeholderImage from "../../assets/placeholder.webp";
import "./AttractionDetails.css";

// Swap in the placeholder once. The guard stops onError from re-firing in a
// loop should the placeholder itself ever fail to load.
const handleImageError = (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = placeholderImage;
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="info-item">
    <Icon size={18} className="info-item__icon" aria-hidden="true" />
    <div>
      <span className="info-item__label">{label}</span>
      <span className="info-item__value">{value}</span>
    </div>
  </div>
);

const AttractionDetails = ({
  attraction,
  onClose,
  onDirections,
  routeInfo,
  routeLoading,
  routeError,
}) => {
  if (!attraction) return null;

  return (
    <article className="attraction-card">
      <div className="attraction-card__media">
        <img
          // key forces a fresh <img> per attraction, which also resets the
          // data-fallback flag set by handleImageError.
          key={attraction.id}
          src={attraction.images || placeholderImage}
          alt={attraction.name}
          className="attraction-card__image"
          onError={handleImageError}
        />
        <button
          type="button"
          className="attraction-card__close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="attraction-card__body">
        <h2 className="attraction-card__title">{attraction.name}</h2>
        <span
          className="attraction-card__category"
          style={{ "--category-color": getCategoryColor(attraction.category) }}
        >
          {attraction.category}
        </span>

        <p className="attraction-card__description">{attraction.description}</p>

        <div className="attraction-card__info">
          <InfoItem icon={MapPin} label="Address" value={attraction.address} />
          {attraction.approximateLocation && (
            <p className="attraction-card__note">
              <Info size={14} aria-hidden="true" />
              Approximate location — the map pin may be a few kilometres off.
            </p>
          )}
          <div className="attraction-card__info-row">
            <InfoItem
              icon={Clock}
              label="Opening Hours"
              value={attraction.openingHours}
            />
            <InfoItem
              icon={Banknote}
              label="Entry Fee"
              value={attraction.entryFee}
            />
          </div>
          <InfoItem
            icon={Calendar}
            label="Best Time to Visit"
            value={attraction.bestTimeToVisit}
          />
          <InfoItem
            icon={Sparkles}
            label="Facilities"
            value={attraction.facilities}
          />
        </div>

        {/* ── Route status panel ───────────────────────────────────────── */}
        {routeLoading && (
          <div
            className="route-status route-status--loading"
            role="status"
            aria-live="polite"
          >
            <Loader2 size={15} className="spinner" aria-hidden="true" />
            <span>Calculating route…</span>
          </div>
        )}

        {routeError && !routeLoading && (
          <div className="route-status route-status--error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            <span>{routeError}</span>
          </div>
        )}

        {routeInfo && !routeLoading && (
          <div
            className={`route-status ${routeInfo.isFallback ? "route-status--fallback" : "route-status--success"}`}
            role="status"
          >
            <div className="route-status__stat">
              <Route size={14} aria-hidden="true" />
              <span>
                <strong>{routeInfo.distance} km</strong>
                {routeInfo.isFallback ? " straight line" : " by road"}
              </span>
            </div>
            {routeInfo.duration && (
              <div className="route-status__stat">
                <Clock size={14} aria-hidden="true" />
                <span>
                  <strong>{routeInfo.duration}</strong> drive
                </span>
              </div>
            )}
            {routeInfo.note && (
              <p className="route-status__note">{routeInfo.note}</p>
            )}
          </div>
        )}

        <div className="attraction-card__actions">
          {attraction.moreInfoLink && (
            <a
              href={attraction.moreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              <ExternalLink size={18} aria-hidden="true" /> Learn More
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={onDirections}
            disabled={routeLoading}
            aria-busy={routeLoading}
          >
            {routeLoading ? (
              <>
                <Loader2 size={18} className="spinner" aria-hidden="true" />{" "}
                Finding route…
              </>
            ) : (
              <>
                <Navigation
                  size={18}
                  className="btn__icon--rotated"
                  aria-hidden="true"
                />{" "}
                Get Directions
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default AttractionDetails;
