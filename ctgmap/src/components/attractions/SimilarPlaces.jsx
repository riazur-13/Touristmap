import { ChevronRight, Compass } from "lucide-react";
import { getCategoryColor } from "../../config/constants";
import { useSimilarPlaces } from "../../hooks/useSimilarPlaces";
import "./SimilarPlaces.css";

/**
 * "You might also like" — up to four places similar to the one on screen.
 *
 * Suggestions come from the backend when it is reachable and from the browser
 * when it is not; the two are rendered identically on purpose, so a missing
 * backend is invisible to a visitor. `data-source` records which was used, for
 * debugging and for the browser checks.
 */
const SimilarPlaces = ({ attraction, onSelect }) => {
  const { places, source, loading } = useSimilarPlaces(attraction);

  if (loading) {
    return (
      <section className="similar-places" aria-busy="true">
        <h3 className="similar-places__title">
          <Compass size={16} aria-hidden="true" />
          You might also like
        </h3>
        <p className="similar-places__status" role="status">
          Finding similar places…
        </p>
      </section>
    );
  }

  // No suggestions at all (a category with a single member) — show nothing
  // rather than an empty heading.
  if (places.length === 0) return null;

  return (
    <section className="similar-places" data-source={source}>
      <h3 className="similar-places__title">
        <Compass size={16} aria-hidden="true" />
        You might also like
      </h3>

      <ul className="similar-places__list">
        {places.map((place) => (
          <li key={place.slug}>
            <button
              type="button"
              className="similar-place"
              onClick={() => onSelect(place.slug)}
            >
              <span
                className="similar-place__swatch"
                style={{ "--category-color": getCategoryColor(place.category) }}
                aria-hidden="true"
              />
              <span className="similar-place__text">
                <span className="similar-place__name">{place.name}</span>
                <span className="similar-place__meta">
                  {place.category}
                  {/* Rendered only when known, and never for 0 km, which would
                      read as if it were the same place. */}
                  {place.distanceKm > 0 && (
                    <> · {place.distanceKm.toFixed(1)} km away</>
                  )}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="similar-place__chevron"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SimilarPlaces;
