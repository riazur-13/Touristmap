const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle ("as the crow flies") distance in km between two [lat, lng]
 * points. Makes no claim about travel distance — a road route is always longer.
 *
 * Mirrors `haversine_km` in the backend's app/recommender.py, so a `distanceKm`
 * from the API and one computed here by the offline fallback agree.
 */
export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
