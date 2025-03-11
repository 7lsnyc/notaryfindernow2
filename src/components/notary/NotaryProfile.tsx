import React from 'react';
import { NotaryBase } from '@/lib/supabase';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MapComponent = dynamic(
  () => import('@/components/map/MapComponent').then(mod => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    ),
  }
);

interface NotaryProfileProps {
  notary: NotaryBase;
  onBookNow: () => void;
}

export function NotaryProfile({ notary, onBookNow }: NotaryProfileProps) {
  const stars = Array.from({ length: Math.round(notary.rating || 0) }).map((_, i) => (
    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-200 rounded-full relative">
              {notary.profile_image_url ? (
                <Image
                  src={notary.profile_image_url}
                  alt={notary.name}
                  fill
                  className="object-cover rounded-full"
                  sizes="(max-width: 128px) 100vw, 128px"
                />
              ) : (
                <MapPinIcon className="w-16 h-16 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{notary.name}</h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex">{stars}</div>
              <span className="ml-2 text-sm text-gray-500">
                ({notary.reviews} reviews)
              </span>
            </div>

            <p className="mt-2 text-gray-600">{notary.address}</p>

            <div className="mt-4 flex flex-wrap gap-4">
              {notary.phone && (
                <a href={`tel:${notary.phone}`} className="flex items-center text-gray-600 hover:text-blue-700">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  {notary.phone}
                </a>
              )}
              {notary.email && (
                <a href={`mailto:${notary.email}`} className="flex items-center text-gray-600 hover:text-blue-700">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  {notary.email}
                </a>
              )}
              {notary.website && (
                <a href={notary.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-700">
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            {notary.starting_price && (
              <p className="text-2xl font-bold text-gray-900">
                ${notary.starting_price}
                <span className="text-sm font-normal text-gray-500"> starting</span>
              </p>
            )}
            <div className="mt-4">
              <Button onClick={onBookNow} className="w-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Services */}
        {notary.services && notary.services.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="flex flex-wrap gap-2">
              {notary.services.map(service => (
                <span key={service} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <CheckBadgeIcon className="w-4 h-4 mr-1.5" />
                  {service}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Map */}
        {notary.latitude && notary.longitude && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapComponent
                notaries={[notary]}
                center={{ lat: notary.latitude, lng: notary.longitude }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 