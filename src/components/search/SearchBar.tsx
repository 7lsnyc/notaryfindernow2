'use client';

import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const { state: locationState, geocodeAndSetLocation, getCurrentLocation } = useLocation();
  const { performSearch } = useSearch();
  const [inputValue, setInputValue] = useState(locationState.address);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await geocodeAndSetLocation(inputValue);
      // If we're not already on the search page, navigate to it
      if (!window.location.pathname.includes('/search')) {
        router.push('/search');
      }
      // Perform the search with the new location
      await performSearch();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleLocationClick = async () => {
    try {
      await getCurrentLocation();
      // If we're not already on the search page, navigate to it
      if (!window.location.pathname.includes('/search')) {
        router.push('/search');
      }
      // Perform the search with the new location
      await performSearch();
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleLocationClick}
          className="absolute left-4 hover:bg-gray-50 p-1 rounded-full transition-colors"
          title="Use my current location"
        >
          {locationState.isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          ) : (
            <MapPinIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
        <input
          type="text"
          className="w-full pl-14 pr-4 py-3 border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent ring-0 ring-offset-0 ring-transparent"
          placeholder="Enter your location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ outline: '0', boxShadow: 'none', border: '0' } as React.CSSProperties}
        />
      </div>
      {locationState.error && (
        <p className="mt-2 text-sm text-red-600">{locationState.error}</p>
      )}
    </form>
  );
} 