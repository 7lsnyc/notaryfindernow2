'use client';

import Script from 'next/script'

interface GoogleAnalyticsProps {
  nonce?: string;
}

export default function GoogleAnalytics({ nonce }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-WTEDS72KXS`}
        strategy="lazyOnload"
        nonce={nonce}
        async
      />
      <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WTEDS72KXS');
        `}
      </Script>
    </>
  )
} 