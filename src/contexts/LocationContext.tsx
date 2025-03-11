'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { geolocationService } from '@/services/geolocation';
import type { LocationDetails } from '@/types/geolocation';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string;
  searchRadius: number;
  isLoading: boolean;
  error: string | null;
}

type LocationAction =
  | { type: 'SET_COORDINATES'; payload: { latitude: number; longitude: number } }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_SEARCH_RADIUS'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_LOCATION' };

interface LocationContextType {
  state: LocationState;
  setCoordinates: (latitude: number, longitude: number) => void;
  setAddress: (address: string) => void;
  setSearchRadius: (radius: number) => void;
  clearLocation: () => void;
  geocodeAndSetLocation: (address: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  address: '',
  searchRadius: 25, // Default search radius in miles
  isLoading: false,
  error: null,
};

function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_COORDINATES':
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        error: null,
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload,
        error: null,
      };
    case 'SET_SEARCH_RADIUS':
      return {
        ...state,
        searchRadius: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_LOCATION':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  const setCoordinates = useCallback((latitude: number, longitude: number) => {
    if (!geolocationService.validateCoordinates(latitude, longitude)) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid coordinates provided' });
      return;
    }
    dispatch({ type: 'SET_COORDINATES', payload: { latitude, longitude } });
  }, []);

  const setAddress = useCallback((address: string) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  }, []);

  const setSearchRadius = useCallback((radius: number) => {
    dispatch({ type: 'SET_SEARCH_RADIUS', payload: radius });
  }, []);

  const clearLocation = useCallback(() => {
    dispatch({ type: 'CLEAR_LOCATION' });
  }, []);

  const updateLocationState = useCallback((location: LocationDetails) => {
    dispatch({ type: 'SET_COORDINATES', payload: {
      latitude: location.latitude,
      longitude: location.longitude
    }});
    dispatch({ type: 'SET_ADDRESS', payload: location.formatted_address });
  }, []);

  const geocodeAndSetLocation = useCallback(async (address: string) => {
    try {
      if (!address?.trim()) {
        dispatch({ type: 'SET_ERROR', payload: 'Please enter an address' });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add some basic address validation
      const cleanAddress = address.trim().replace(/\s+/g, ' ');
      
      const location = await geolocationService.getLocationFromAddress(cleanAddress);
      updateLocationState(location);
    } catch (error) {
      console.error('Geocoding error:', error);
      let errorMessage = 'Failed to find location';
      
      if (error instanceof Error) {
        if (error.message.includes('No results found')) {
          errorMessage = 'No results found for this address. Please try a different address or add more details (city, state, zip).';
        } else if (error.message.includes('Missing Google Maps API Key')) {
          errorMessage = 'Location service is not properly configured.';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateLocationState]);

  const getCurrentLocation = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('Getting current location...');
      
      const location = await geolocationService.getCurrentLocationDetails();
      console.log('Got location details:', location);
      
      dispatch({ 
        type: 'SET_COORDINATES', 
        payload: { 
          latitude: location.latitude, 
          longitude: location.longitude 
        } 
      });
      dispatch({ type: 'SET_ADDRESS', payload: location.formatted_address });
    } catch (error) {
      console.error('Error getting current location:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to get current location' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value = {
    state,
    setCoordinates,
    setAddress,
    setSearchRadius,
    clearLocation,
    geocodeAndSetLocation,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 