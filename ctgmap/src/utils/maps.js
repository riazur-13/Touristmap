/**
 * Google Maps link for an attraction, using the documented Maps URLs
 * "search" format (https://developers.google.com/maps/documentation/urls).
 * Generated from the attraction's own data, so there is no per-entry URL to
 * keep in sync.
 *
 * Normally the query is the exact "<lat>,<lng>". For attractions flagged
 * `approximateLocation`, our pin may be kilometres off, so the query is
 * "<name>, <address>" instead and Google resolves the real place.
 */
export const getGoogleMapsUrl = ({
  name,
  address,
  coordinates: [lat, lng],
  approximateLocation,
}) => {
  const query = approximateLocation
    ? encodeURIComponent(`${name}, ${address}`)
    : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};
