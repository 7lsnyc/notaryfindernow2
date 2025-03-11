'use client';

import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG, AdSlotType } from '@/config/adsense';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  adSlot: AdSlotType;
  adFormat?: 'leaderboard' | 'medium-rectangle' | 'large-rectangle';
  className?: string;
}

const formatStyles = {
  'leaderboard': {
    width: '728px',
    height: '90px',
    className: 'mx-auto max-w-full h-[90px]'
  },
  'medium-rectangle': {
    width: '300px',
    height: '250px',
    className: 'mx-auto w-[300px] h-[250px]'
  },
  'large-rectangle': {
    width: '336px',
    height: '280px',
    className: 'mx-auto w-[336px] h-[280px]'
  }
};

const formatToSlotMap = {
  'leaderboard': 'leaderboard',
  'medium-rectangle': 'mediumRectangle',
  'large-rectangle': 'largeRectangle',
} as const;

export default function AdSense({ adSlot, adFormat = 'leaderboard', className = '' }: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);
  const uniqueId = useRef(`ad-${adSlot}-${formatToSlotMap[adFormat]}`);
  const initAttempts = useRef(0);
  const maxAttempts = 3;
  const initTimer = useRef<NodeJS.Timeout>();

  // Get the actual slot ID from the configuration
  const slotId = ADSENSE_CONFIG.slots[adSlot];

  useEffect(() => {
    // Only initialize if window exists and component is mounted
    if (typeof window === 'undefined' || !adRef.current) return;

    const currentAd = adRef.current;

    const initializeAd = () => {
      try {
        // Check if we've exceeded max attempts
        if (initAttempts.current >= maxAttempts) {
          console.warn('Max initialization attempts reached for ad slot:', slotId);
          return;
        }
        initAttempts.current++;

        // Check if the ad element still exists and hasn't been initialized
        if (!currentAd || currentAd.getAttribute('data-ad-status')) {
          console.debug('Ad already initialized or removed:', slotId);
          return;
        }

        // Check if AdSense script is loaded
        if (typeof window.adsbygoogle === 'undefined') {
          console.debug('Waiting for AdSense script to load...');
          return;
        }

        // Set a unique ID to track this instance
        currentAd.setAttribute('data-ad-id', uniqueId.current);
        
        // Push new ad with a slight delay to ensure proper initialization
        initTimer.current = setTimeout(() => {
          try {
            if (ADSENSE_CONFIG.testMode) {
              console.debug('AdSense in test mode, not pushing ad');
              return;
            }
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isInitialized.current = true;
            console.debug('AdSense initialized for slot:', slotId, 'with ID:', uniqueId.current);
          } catch (error) {
            if (error instanceof Error && error.message.includes('already have ads')) {
              console.debug('Ad already exists for slot:', slotId);
              return;
            }
            console.error('Error pushing ad:', error);
          }
        }, 250);
      } catch (error) {
        console.error('Error initializing AdSense:', error);
        
        // Retry initialization after a delay if we haven't exceeded max attempts
        if (initAttempts.current < maxAttempts) {
          initTimer.current = setTimeout(initializeAd, 1500);
        }
      }
    };

    // Listen for AdSense script load event
    const handleAdsenseLoaded = () => {
      console.debug('AdSense script loaded event received');
      initializeAd();
    };

    // Listen for AdSense script error event
    const handleAdsenseError = () => {
      console.error('AdSense script failed to load');
    };

    window.addEventListener('adsenseLoaded', handleAdsenseLoaded);
    window.addEventListener('adsenseError', handleAdsenseError);

    // Start initialization process if script is already loaded
    if (typeof window.adsbygoogle !== 'undefined') {
      initializeAd();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('adsenseLoaded', handleAdsenseLoaded);
      window.removeEventListener('adsenseError', handleAdsenseError);
      if (initTimer.current) {
        clearTimeout(initTimer.current);
      }
      if (currentAd) {
        currentAd.remove();
      }
      isInitialized.current = false;
      initAttempts.current = 0;
    };
  }, [adSlot, slotId]); // Re-run if adSlot or slotId changes

  const format = formatStyles[adFormat];

  return (
    <div className={`bg-[#E6F0FA] rounded-lg p-4 my-6 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: format.width,
          height: format.height,
          maxWidth: '100%'
        }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-id={uniqueId.current}
      />
    </div>
  );
} 