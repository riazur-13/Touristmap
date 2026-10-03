import attractions from "../data/attractions";
import { haversineKm } from "../utils/geo";

/**
 * Suggestions computed in the browser, used whenever the backend is unavailable.
 *
 * The rule is deliberately simpler than the API's: same category, nearest first.
 * It cannot match TF-IDF's reading of the descriptions, but it needs no network
 * and no data the page does not already have, so the site keeps working with no
 * backend deployed at all — which is the point.
 *
 * Results are shaped exactly like the API's so the UI cannot tell them apart.
 */
export function localSimilarPlaces(attraction, limit) {
  return attractions
    .filter(
      (other) =>
        other.slug !== attraction.slug &&
        other.category === attraction.category,
    )
    .map((other) => ({
      slug: other.slug,
      name: other.name,
      category: other.category,
      distanceKm:
        Math.round(haversineKm(attraction.coordinates, other.coordinates) * 10) /
        10,
    }))
    // Slug breaks ties so two places at an identical distance always come back
    // in the same order, matching the API's determinism guarantee.
    .sort(
      (a, b) => a.distanceKm - b.distanceKm || a.slug.localeCompare(b.slug),
    )
    .slice(0, limit);
}
