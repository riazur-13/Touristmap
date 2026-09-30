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
  // The map opens (and returns, when nothing is selected) fitted to the
  // bounding box of all attractions, with this padding in pixels.
  HOME_PADDING: [24, 24],

  // Zoom used when flying to a selected attraction.
  DETAIL_ZOOM: 14,

  // Panning limit, applied as `maxBounds`. Leaflet locks panning on any axis
  // where the viewport is larger than this box, so it must stay bigger than
  // the view at MIN_ZOOM: at zoom 7 a 1920x1080 screen shows ~21 x 10 deg.
  // This box (22 x 12 deg) does, and it spans all of Bangladesh so a route
  // from anywhere in the country still fits.
  MAX_BOUNDS: [
    [16.5, 81.0],  // Southwest corner
    [28.5, 103.0]  // Northeast corner
  ],
  // 0 = soft (bounds only nudge), 1 = hard wall. 0.8 resists dragging past
  // the edge but still gives a little elastic feedback.
  MAX_BOUNDS_VISCOSITY: 0.8,

  // Zoom limits. The attractions span ~3.5 deg of latitude (Saint Martin's to
  // Brahmanbaria), which needs zoom 7 to fit on a laptop screen. Lowering
  // MIN_ZOOM further needs MAX_BOUNDS re-checked (see above).
  MIN_ZOOM: 7,
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
