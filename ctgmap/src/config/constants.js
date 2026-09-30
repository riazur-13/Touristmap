export const CATEGORIES = {
  BEACH: {
    name: 'Beach',
    color: '#3b82f6'
  },
  HILL_STATION: {
    name: 'Hill Station',
    color: '#10b981'
  },
  HISTORICAL: {
    name: 'Historical Site',
    color: '#f59e0b'  // Amber - represents age/heritage
  },
  RELIGIOUS: {
    name: 'Religious Site',
    color: '#8b5cf6'
  },
  NATURAL: {
    name: 'Natural Wonder',
    color: '#14b8a6'
  },
  CULTURAL: {
    name: 'Cultural Center',
    color: '#ec4899'
  }
};

// Used for any category name that is missing from CATEGORIES.
export const FALLBACK_CATEGORY_COLOR = '#64748b';

/**
 * Marker/badge color for a category *name* (the value stored on each
 * attraction), so the map pins, filter chips and details badge always agree.
 */
export const getCategoryColor = (name) =>
  Object.values(CATEGORIES).find((c) => c.name === name)?.color ??
  FALLBACK_CATEGORY_COLOR;

export const MAP_CONFIG = {
  // Midpoint of the attractions (Saint Martin's in the south to Chandranath
  // in the north), so every pin is in view at DEFAULT_ZOOM on phone and
  // desktop alike.
  DEFAULT_CENTER: [21.65, 92.1],

  // Initial zoom level (8 = all attractions, 14 = close-up on one attraction)
  DEFAULT_ZOOM: 8,
  DETAIL_ZOOM: 14,

  // Panning limit, applied as `maxBounds`. Leaflet locks panning on any axis
  // where the viewport is larger than this box, so it must stay bigger than
  // the view at MIN_ZOOM: at zoom 8 a 1920x1080 screen shows ~10.5 x 5 deg.
  // This box (12 x 8.3 deg) does, and it spans all of Bangladesh so a route
  // from anywhere in the country still fits.
  MAX_BOUNDS: [
    [18.5, 86.0],  // Southwest corner
    [26.8, 98.0]   // Northeast corner
  ],
  // 0 = soft (bounds only nudge), 1 = hard wall. 0.8 resists dragging past
  // the edge but still gives a little elastic feedback.
  MAX_BOUNDS_VISCOSITY: 0.8,

  // Zoom limits. MIN_ZOOM must stay <= DEFAULT_ZOOM, otherwise Leaflet clamps
  // the initial view and the map opens more zoomed-in than intended. Raising
  // it past 8 needs MAX_BOUNDS re-checked (see above); lowering it below 8
  // lets large screens outgrow the box.
  MIN_ZOOM: 8,
  MAX_ZOOM: 18
};

/**
 * Breakpoints for responsive design
 * Matches common device sizes. TABLET is the mobile/desktop split and must be
 * kept in sync with the `max-width: 767px` media queries in the stylesheets.
 */
export const BREAKPOINTS = {
  MOBILE: 640,      // 640px and below
  TABLET: 768,      // 641px - 768px
  DESKTOP: 1024,    // 769px - 1024px
  WIDE: 1280        // 1025px and above
};
