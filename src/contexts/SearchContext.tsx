'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { Notary, SearchFilters } from '@/types';
import { searchNotaries, getFeaturedNotaries, testDatabaseConnection } from '@/lib/supabase';
import { useLocation } from './LocationContext';
import { NotaryBase } from '@/lib/supabase';

interface SearchState {
  results: NotaryBase[];
  featuredNotaries: Notary[];
  filters: SearchFilters;
  isLoading: boolean;
  error: string;
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
}

type SearchAction =
  | { type: 'SET_RESULTS'; payload: NotaryBase[] }
  | { type: 'SET_FEATURED'; payload: Notary[] }
  | { type: 'SET_FILTERS'; payload: SearchFilters }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'CLEAR_RESULTS' };

interface SearchContextType {
  state: SearchState;
  setFilters: (filters: SearchFilters) => void;
  setPage: (page: number) => void;
  clearResults: () => void;
  performSearch: () => Promise<void>;
  loadFeaturedNotaries: () => Promise<void>;
}

const initialState: SearchState = {
  results: [],
  featuredNotaries: [],
  filters: {
    services: [],
    rating: 0,
    available_now: false,
    online_booking: false,
    radius: 25,
  },
  isLoading: false,
  error: '',
  currentPage: 1,
  totalResults: 0,
  resultsPerPage: 10,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        totalResults: action.payload.length,
        error: '',
      };
    case 'SET_FEATURED':
      return {
        ...state,
        featuredNotaries: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        currentPage: 1, // Reset to first page when filters change
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'CLEAR_RESULTS':
      return {
        ...state,
        results: [],
        totalResults: 0,
        currentPage: 1,
        error: '',
      };
    default:
      return state;
  }
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { state: locationState } = useLocation();

  // Add mount logging
  useEffect(() => {
    console.log('🔄 SearchProvider mounted');
    return () => console.log('🔄 SearchProvider unmounted');
  }, []);

  const setFilters = useCallback((filters: SearchFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const clearResults = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULTS' });
  }, []);

  const performSearch = useCallback(async () => {
    try {
      console.log('🔍 Starting search with location state:', locationState);
      
      if (!locationState.latitude || !locationState.longitude) {
        console.error('❌ No location coordinates available');
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Please enter a location or allow location access to search.' 
        });
        return;
      }

      dispatch({ type: 'SET_LOADING' });

      const searchResult = await searchNotaries({
        latitude: locationState.latitude,
        longitude: locationState.longitude,
        radius: state.filters.radius || 25,
        min_rating: state.filters.rating || 0,
        filters: state.filters,
        limit: state.resultsPerPage,
        offset: (state.currentPage - 1) * state.resultsPerPage
      });

      console.log('✨ Search completed:', {
        resultsFound: searchResult.length,
        location: `${locationState.latitude}, ${locationState.longitude}`,
        filters: state.filters
      });

      dispatch({ type: 'SET_RESULTS', payload: searchResult });
    } catch (error) {
      console.error('❌ Search error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to perform search. Please try again.' 
      });
    }
  }, [locationState, state.filters, state.currentPage, state.resultsPerPage]);

  const loadFeaturedNotaries = useCallback(async () => {
    if (!locationState.latitude || !locationState.longitude) return;

    try {
      const featuredResult = await getFeaturedNotaries(
        locationState.latitude,
        locationState.longitude
      );

      if (featuredResult.error) {
        throw featuredResult.error;
      }

      dispatch({ type: 'SET_FEATURED', payload: featuredResult.data });
    } catch (error) {
      console.error('Error loading featured notaries:', error);
      // Don't set error state for featured notaries as it's not critical
    }
  }, [locationState.latitude, locationState.longitude]);

  const value = {
    state,
    setFilters,
    setPage,
    clearResults,
    performSearch,
    loadFeaturedNotaries,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 