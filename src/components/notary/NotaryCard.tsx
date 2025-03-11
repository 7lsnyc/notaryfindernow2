'use client';

import React from 'react'
import Link from 'next/link'
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import type { NotaryBase } from '@/lib/supabase'
import { LanguageIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface NotaryCardProps {
  notary: NotaryBase
  distance?: number
  isClosest?: boolean
}

export function NotaryCard({ notary, distance, isClosest }: NotaryCardProps) {
  // Handle missing rating
  const rating = notary.rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i}>
      {i < Math.floor(rating) ? (
        <StarIcon className="w-5 h-5 text-yellow-500" />
      ) : (
        <StarOutlineIcon className="w-5 h-5 text-yellow-500" />
      )}
    </span>
  ))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        {isClosest && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Closest to you
          </span>
        )}
        {distance !== undefined && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            {distance.toFixed(1)} miles
          </span>
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full relative flex-shrink-0">
          {notary.profile_image_url ? (
            <Image
              src={notary.profile_image_url}
              alt={notary.name}
              fill
              className="object-cover rounded-full"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500">
              {notary.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{notary.name}</h3>
          <div className="flex items-center mt-1">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {notary.rating?.toFixed(1)} ({notary.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {notary.is_available_now && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            24/7 Availability
          </span>
        )}
        {notary.services?.includes('Loan Signing') && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Loan Signing
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/notary/${notary.id}`}
          className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Profile
        </Link>
        <Link
          href={`/notary/${notary.id}?action=contact`}
          className="flex-1 text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Contact Now
        </Link>
      </div>
    </div>
  )
} 