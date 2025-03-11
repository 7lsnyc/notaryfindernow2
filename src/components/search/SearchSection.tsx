'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/navigation';
import styles from './SearchSection.module.css';

// Custom hook for debounced search
function useDebounce<T extends (...args: any[]) => Promise<void>>(
  callback: T,
  delay: number
): [T, () => void] {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      return new Promise<void>((resolve) => {
        setTimeoutId(
          setTimeout(async () => {
            await callback(...args);
            resolve();
          }, delay)
        );
      });
    },
    [callback, delay, timeoutId]
  ) as T;

  const cancelDebounce = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return [debouncedCallback, cancelDebounce];
}

export function SearchSection() {
  const router = useRouter();
  const { state: locationState, geocodeAndSetLocation, getCurrentLocation } = useLocation();
  const { state: searchState, performSearch } = useSearch();
  const [inputValue, setInputValue] = useState(locationState.address || '');
  const [serviceType, setServiceType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] = useState(false);

  useEffect(() => {
    console.log('🔍 SearchSection mounting...');
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError('Location service is not properly configured. Please check API key.');
    }
    return () => {
      console.log('🔍 SearchSection unmounting...');
    };
  }, []);

  const handleSearch = useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;
      
      try {
        setIsLoading(true);
        console.log('🔍 Starting search process for:', value);
        await geocodeAndSetLocation(value);
        console.log('📍 Location set, performing search...');
        await performSearch();
        console.log('✅ Search completed');
      } catch (error) {
        console.error('❌ Search error:', error);
        setError('Failed to perform search. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [geocodeAndSetLocation, performSearch, isLoading]
  );

  const [debouncedSearch, cancelSearch] = useDebounce(handleSearch, 300);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only trigger search if we have at least 5 characters and some non-numeric content
    if (value.trim().length >= 5 && /[a-zA-Z]/.test(value)) {
      console.log('🔄 Debounced search triggered from input change');
      debouncedSearch(value);
    } else {
      cancelSearch();
    }
  };

  // Handle service type changes
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServiceType(value);
    
    // Only trigger search if we have a valid address
    if (inputValue.trim().length >= 3 && /[a-zA-Z]/.test(inputValue)) {
      console.log('🔄 Search triggered from service type change');
      debouncedSearch(inputValue);
    }
  };

  // Prevent auto-search on mount
  useEffect(() => {
    if (locationState.address && !hasAttemptedAutoLocation) {
      setHasAttemptedAutoLocation(true);
    }
  }, [locationState.address, hasAttemptedAutoLocation]);

  useEffect(() => {
    // Only attempt auto-location once and if we don't already have an address
    if (!hasAttemptedAutoLocation && !locationState.address) {
      console.log('🎯 Attempting auto-location detection');
      const autoDetectLocation = async () => {
        try {
          await getCurrentLocation();
          console.log('📍 Auto-location successful');
          
          // Wait for location state to be updated
          if (locationState.latitude && locationState.longitude) {
            console.log('🔍 Coordinates available, performing search...');
            await performSearch();
            console.log('✅ Auto-location search completed');
          } else {
            console.log('⚠️ No coordinates available after location update');
          }
        } catch (error) {
          console.error('⚠️ Auto-location detection error:', error);
        }
      };
      
      autoDetectLocation();
      setHasAttemptedAutoLocation(true);
    }
  }, [getCurrentLocation, performSearch, hasAttemptedAutoLocation, locationState]);

  // Add a watcher for location state changes
  useEffect(() => {
    if (locationState.latitude && locationState.longitude && hasAttemptedAutoLocation) {
      console.log('📍 Location state updated, coordinates available:', {
        lat: locationState.latitude,
        lng: locationState.longitude
      });
    }
  }, [locationState, hasAttemptedAutoLocation]);

  const handleLocationClick = async () => {
    try {
      setIsLoading(true);
      await getCurrentLocation();
      
      // Wait for location state to be updated
      if (locationState.latitude && locationState.longitude) {
        if (!window.location.pathname.includes('/search')) {
          router.push('/search');
        }
        await performSearch();
      } else {
        throw new Error('No coordinates available after location update');
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputValue.trim();
    
    if (!value) {
      return;
    }

    // Basic address validation
    if (value.length < 5 || !/[a-zA-Z]/.test(value)) {
      console.log('⚠️ Invalid address format:', value);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 Submit search for address:', value);
      await geocodeAndSetLocation(value);
      console.log('📍 Location set, navigating to search page...');
      if (!window.location.pathname.includes('/search')) {
        router.push('/search');
      }
      console.log('🔍 Performing search...');
      await performSearch();
      console.log('✅ Search completed');
    } catch (error) {
      console.error('❌ Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden py-4 relative">
        <div className="w-full px-4 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden py-2 relative"
      suppressHydrationWarning
    >
      {/* Location Input Section */}
      <div className="flex-1 relative flex items-center border-r border-gray-200">
        <div className={styles.searchContainer}>
          <button
            type="button"
            onClick={handleLocationClick}
            disabled={isLoading}
            className={`flex items-center justify-center text-gray-400 hover:text-gray-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <MapPinIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isLoading ? 'Loading...' : 'Enter your location'}
            className={`w-full h-full bg-transparent text-gray-600 focus:ring-0 focus:ring-offset-0 focus:ring-transparent ring-0 ring-offset-0 ring-transparent focus:outline-none focus:border-0 focus:shadow-none ${
              styles.searchInput
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Service Type Dropdown */}
      <div className="flex-1 relative">
        <select
          value={serviceType}
          onChange={handleServiceChange}
          className={`w-full h-full px-4 py-3 bg-transparent text-gray-600 cursor-pointer focus:ring-0 focus:ring-offset-0 focus:ring-transparent ring-0 ring-offset-0 ring-transparent focus:outline-none ${
            styles.selectInput
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          <option value="">Any Service</option>
          <option value="24-hour">24-Hour Service</option>
          <option value="mobile">Mobile Service</option>
          <option value="remote">Remote/Online Service</option>
          <option value="free">Free Service</option>
          <option value="loan-signing">Loan Signing</option>
          <option value="real-estate">Real Estate</option>
          <option value="general">General Notary</option>
          <option value="apostille">Apostille Service</option>
          <option value="wedding">Wedding Officiant</option>
          <option value="business">Business Documents</option>
          <option value="immigration">Immigration Documents</option>
          <option value="medical">Medical Documents</option>
        </select>
      </div>

      {/* Search Button Container */}
      <div className="px-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {(locationState.error || error) && (
        <div className="absolute -bottom-8 left-0 right-0 text-sm text-red-600 bg-red-50 p-2 rounded">
          {locationState.error || error}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-500">Loading...</div>
        </div>
      )}
    </form>
  );
} 