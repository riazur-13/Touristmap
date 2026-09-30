/**
 * Google Maps link for a [lat, lng] pair, using the documented Maps URLs
 * "search" format (https://developers.google.com/maps/documentation/urls).
 * Generated from the coordinates so every attraction gets one with no
 * per-entry data to keep in sync.
 */
export const getGoogleMapsUrl = ([lat, lng]) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
