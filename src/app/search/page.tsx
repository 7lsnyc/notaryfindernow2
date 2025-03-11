'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { SearchSection } from '@/components/search/SearchSection';
import { NotaryCard } from '@/components/notary/NotaryCard';
import { useSearch } from '@/contexts/SearchContext';
import { useLocation } from '@/contexts/LocationContext';
import { NotaryBase } from '@/lib/supabase';

const MapComponent = dynamic(() => import('@/components/map/MapComponent').then(mod => mod.MapComponent), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

const RESULTS_PER_PAGE = 10;

export default function SearchPage() {
  const { state: searchState } = useSearch();
  const { state: locationState } = useLocation();
  const [currentPage, setCurrentPage] = React.useState(1);

  // Calculate pagination
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const currentResults = searchState.results?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((searchState.results?.length || 0) / RESULTS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ensure notaries have required fields
  const notariesWithRequiredFields: NotaryBase[] = React.useMemo(() => {
    return (searchState.results || []).map(notary => ({
      ...notary,
      created_at: notary.created_at || new Date().toISOString(),
      updated_at: notary.updated_at || new Date().toISOString()
    }));
  }, [searchState.results]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {searchState.results?.length || 0} Notaries Found
              {locationState.address && (
                <span className="text-sm font-normal text-gray-600 block">
                  near {locationState.address}
                </span>
              )}
            </h2>
            <button className="text-primary hover:text-primary-dark">
              Toggle Filters
            </button>
          </div>

          {searchState.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : searchState.error ? (
            <ErrorMessage message={searchState.error} />
          ) : (
            <>
              <div className="space-y-4">
                {currentResults.map((notary) => (
                  <NotaryCard key={notary.id} notary={{
                    ...notary,
                    created_at: notary.created_at || new Date().toISOString(),
                    updated_at: notary.updated_at || new Date().toISOString()
                  }} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded ${
                          currentPage === i + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-[600px] lg:sticky lg:top-24">
          <Suspense fallback={<LoadingSpinner />}>
            <MapComponent
              notaries={notariesWithRequiredFields}
              center={
                locationState.latitude && locationState.longitude
                  ? { lat: locationState.latitude, lng: locationState.longitude }
                  : { lat: 37.7749, lng: -122.4194 } // Default to San Francisco
              }
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 