import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { getAllNotaries } from '@/lib/supabase';
import { SearchSection } from '@/components/search/SearchSection';
import { NotaryCard } from '@/components/notary/NotaryCard';
import type { Notary } from '@/types';
import Script from 'next/script';

export default async function HomePage() {
  const notaries = await getAllNotaries() as Notary[];
  const featuredNotaries = notaries.filter(notary => notary.featured);

  return (
    <div className="min-h-screen">
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
      />

      {/* Hero Section */}
      <div className="bg-blue-600 relative">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Find a Qualified Notary Near You — Now!
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with mobile, 24-hour, and free notary services in your area instantly.
            </p>
            
            {/* Search Section */}
            <div className="mt-8 max-w-3xl mx-auto">
              <SearchSection />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
              data-ad-slot="YOUR_AD_SLOT_ID"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </div>

      {/* Top Rated Notaries Near You */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top-Rated Notaries Near You</h2>
            <Link 
              href="/search" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>
          {notaries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notaries.slice(0, 3).map((notary, index) => (
                <NotaryCard
                  key={notary.id}
                  notary={notary}
                  distance={notary.distance}
                  isClosest={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No top-rated notaries found in your area yet.</p>
              <p className="text-gray-600 mt-2">Try searching for all notaries instead.</p>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose NotaryFinderNow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600">
                All notaries are verified and background-checked to ensure quality service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments online instantly with our easy-to-use platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Service</h3>
              <p className="text-gray-600">
                Many notaries offer mobile service, coming to your location for convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Space */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
              data-ad-slot="YOUR_AD_SLOT_ID"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
