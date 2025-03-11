export const SEARCH_DEFAULTS = {
  RADIUS_MILES: 25,
  MIN_RATING: 4.0,
  RESULTS_PER_PAGE: 20,
  MAX_RADIUS_MILES: 500,
  MIN_RADIUS_MILES: 1,
  MAX_RESULTS: 100,
} as const;

export const GEOLOCATION_CONFIG = {
  TIMEOUT_MS: 10000,
  MAX_AGE_MS: 60000, // 1 minute
  ENABLE_HIGH_ACCURACY: true,
} as const;

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  DEFAULT_CENTER: {
    lat: 37.7749,
    lng: -122.4194,
  },
  CLUSTER_RADIUS_PX: 50,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
} as const;

export const NOTARY_SERVICES = {
  GENERAL: 'General Notary',
  LOAN_SIGNING: 'Loan Signing',
  REAL_ESTATE: 'Real Estate',
  APOSTILLE: 'Apostille',
  MOBILE: 'Mobile Notary',
  ONLINE: 'Online Notary',
} as const;

export const BUSINESS_HOURS = {
  START: '09:00',
  END: '17:00',
  DAYS: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const,
} as const;

export const API_ENDPOINTS = {
  SEARCH: '/api/notaries/search',
  FEATURED: '/api/notaries/featured',
  NOTARY_DETAIL: '/api/notaries',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOCATION: {
    PERMISSION_DENIED: 'Location permission was denied. Please enable location access or enter your location manually.',
    TIMEOUT: 'Location request timed out. Please try again or enter your location manually.',
    UNAVAILABLE: 'Location information is unavailable. Please enter your location manually.',
    INVALID_COORDS: 'Invalid coordinates received. Please try again.',
  },
  SEARCH: {
    NO_LOCATION: 'Please enter a location to search',
    NO_RESULTS: 'No notaries found in this area. Try expanding your search radius.',
    INVALID_PARAMS: 'Invalid search parameters',
  },
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `${field} is required`,
    INVALID_FORMAT: (field: string) => `Invalid ${field.toLowerCase()} format`,
  },
} as const; 