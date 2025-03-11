'use client';

import React, { useEffect, useState } from 'react';
import { LocationProvider } from '@/contexts/LocationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldCheckIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LocationProvider>
        <SearchProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SearchProvider>
      </LocationProvider>
    </ErrorBoundary>
  );
} 