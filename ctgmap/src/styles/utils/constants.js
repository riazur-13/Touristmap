

export const CATEGORIES = {
  BEACH: {
    name: 'Beach',
    color: '#3b82f6', 
    icon: '🏖️'
  },
  HILL_STATION: {
    name: 'Hill Station',
    color: '#10b981',  
    icon: '⛰️'
  },
  HISTORICAL: {
    name: 'Historical Site',
    color: '#f59e0b',  // Amber - represents age/heritage
    icon: '🏛️'
  },
  RELIGIOUS: {
    name: 'Religious Site',
    color: '#8b5cf6',  
    icon: '🕌'
  },
  NATURAL: {
    name: 'Natural Wonder',
    color: '#14b8a6', 
    icon: '🌿'
  },
  CULTURAL: {
    name: 'Cultural Center',
    color: '#ec4899', 
    icon: '🎭'
  }
};


export const MAP_CONFIG = {
  // Chittagong city center coordinates
  DEFAULT_CENTER: [22.3569, 91.7832],

  // Initial zoom level (7 = whole division, 14 = close-up on one attraction)
  DEFAULT_ZOOM: 7,
  DETAIL_ZOOM: 14,

  // NOT currently applied to the map. At DEFAULT_ZOOM a desktop viewport shows
  // 16-28 degrees of longitude, but this box is only 2.5 degrees wide, so
  // passing it as `maxBounds` would pin the map and disable panning entirely.
  // To enforce it, raise DEFAULT_ZOOM/MIN_ZOOM to ~10 or widen the box first.
  MAX_BOUNDS: [
    [20.5, 90.5],  // Southwest corner
    [23.5, 93.0]   // Northeast corner
  ],

  // Zoom limits. MIN_ZOOM must stay <= DEFAULT_ZOOM, otherwise Leaflet clamps
  // the initial view and the map opens more zoomed-in than intended.
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