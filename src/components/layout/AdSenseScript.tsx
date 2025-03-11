'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { ADSENSE_CONFIG } from '@/config/adsense';

interface AdSenseScriptProps {
  isTestPage?: boolean;
  nonce?: string;
}

export default function AdSenseScript({ isTestPage, nonce }: AdSenseScriptProps) {
  useEffect(() => {
    // Clean up any existing AdSense instances
    if (typeof window !== 'undefined') {
      window.adsbygoogle = [];
    }
  }, []);

  if (isTestPage || ADSENSE_CONFIG.testMode) {
    console.debug('AdSense disabled in test mode');
    return null;
  }

  return (
    <>
      <Script
        id="adsbygoogle-script"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        nonce={nonce}
        onLoad={() => {
          console.debug('AdSense script loaded');
          window.dispatchEvent(new CustomEvent('adsenseLoaded'));
        }}
        onError={(e) => {
          console.error('Error loading AdSense script:', e);
          window.dispatchEvent(new CustomEvent('adsenseError'));
        }}
      />
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        nonce={nonce}
      >
        {`
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        `}
      </Script>
    </>
  );
} 