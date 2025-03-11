import { GEOLOCATION_CONFIG } from '@/config/constants';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetails extends Coordinates {
  formatted_address: string;
  city?: string;
  state?: string;
  zip?: string;
  place_id?: string;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const DEFAULT_GEOLOCATION_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: GEOLOCATION_CONFIG.ENABLE_HIGH_ACCURACY,
  timeout: GEOLOCATION_CONFIG.TIMEOUT_MS,
  maximumAge: GEOLOCATION_CONFIG.MAX_AGE_MS,
};

export interface ReverseGeocodeResult {
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export type GeolocationErrorType = 
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'INVALID_COORDS'
  | 'GEOCODING_FAILED'
  | 'REVERSE_GEOCODING_FAILED';

export interface GeolocationErrorDetails {
  type: GeolocationErrorType;
  message: string;
  originalError?: Error;
} 