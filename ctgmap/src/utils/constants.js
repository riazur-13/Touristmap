

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
  
  // Initial zoom level (9 = region view, 13 = close-up)
  DEFAULT_ZOOM: 9,
  DETAIL_ZOOM: 13,
  
  // Map bounds (prevents users from panning too far)
  MAX_BOUNDS: [
    [20.5, 90.5],  // Southwest corner
    [23.5, 93.0]   // Northeast corner
  ],
  
  // Zoom limits
  MIN_ZOOM: 8,
  MAX_ZOOM: 18
};

/**
 * Breakpoints for responsive design
 * Matches common device sizes
 */
export const BREAKPOINTS = {
  MOBILE: 640,      // 640px and below
  TABLET: 768,      // 641px - 768px
  DESKTOP: 1024,    // 769px - 1024px
  WIDE: 1280        // 1025px and above
};

/**
 * Animation durations (in milliseconds)
 * Consistent timing creates better UX
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300
};

/**
 * Feature flags
 * Easy way to enable/disable features
 */
export const FEATURES = {
  SEARCH_ENABLED: true,
  FILTER_ENABLED: true,
  FAVORITES_ENABLED: false,  
  AI_ENABLED: false,         
  OFFLINE_MODE: false       
};