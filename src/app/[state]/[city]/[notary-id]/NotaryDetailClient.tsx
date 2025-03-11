'use client';

import dynamic from 'next/dynamic';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Notary } from '@/types';

const DynamicMap = dynamic(
  () => import('@/components/map/MapComponent').then((mod) => mod.MapComponent),
  {
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    ),
  }
);

interface NotaryDetailClientProps {
  notary: Notary;
}

export default function NotaryDetailClient({ notary }: NotaryDetailClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">{notary.name}</h1>
          <div className="flex items-center mb-4">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1">{notary.rating}</span>
          </div>
          <p className="text-gray-600 mb-4">{notary.about}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p>{notary.address}</p>
            <p>{notary.phone}</p>
            <p>{notary.email}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            <ul className="list-disc list-inside">
              {notary.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <DynamicMap
              notaries={[notary]}
              center={{ lat: notary.latitude, lng: notary.longitude }}
              zoom={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 