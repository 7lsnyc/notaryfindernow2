'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getNotaryById, NotaryBase } from '@/lib/supabase';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Notary } from '@/types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NotaryProfile } from '@/components/notary/NotaryProfile';
import { BookingForm } from '@/components/booking/BookingForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

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

interface NotaryPageClientProps {
  params: {
    id: string;
  };
}

export function NotaryPageClient({ params }: NotaryPageClientProps) {
  const [notary, setNotary] = useState<NotaryBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const loadNotary = useCallback(async () => {
    try {
      setIsLoading(true);
      const notaryData = await getNotaryById(params.id);
      if (!notaryData) {
        setError(new Error('Notary not found'));
      } else {
        setNotary(notaryData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notary'));
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadNotary();
  }, [loadNotary]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!notary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Notary not found" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NotaryProfile
        notary={notary}
        onBookNow={() => setShowBookingForm(true)}
      />
      {showBookingForm && (
        <BookingForm
          notary={notary}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
} 