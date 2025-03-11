import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { buildCSP } from '@/lib/csp';
import { Suspense } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NotaryFinderNow - Find Trusted Notaries Near You',
    template: '%s | NotaryFinderNow',
  },
  description:
    'Find and book trusted mobile notaries, loan signing agents, and 24/7 notary services near you. Get instant quotes and schedule appointments online.',
  keywords: [
    'notary',
    'mobile notary',
    'loan signing agent',
    '24/7 notary',
    'notary near me',
    'notary services',
    'online notary',
    'remote notary',
  ],
  authors: [{ name: 'NotaryFinderNow' }],
  creator: 'NotaryFinderNow',
  publisher: 'NotaryFinderNow',
  metadataBase: new URL('https://notaryfindernow.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://notaryfindernow.com',
    title: 'NotaryFinderNow - Find Trusted Notaries Near You',
    description:
      'Find and book trusted mobile notaries, loan signing agents, and 24/7 notary services near you.',
    siteName: 'NotaryFinderNow',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NotaryFinderNow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaryFinderNow - Find Trusted Notaries Near You',
    description:
      'Find and book trusted mobile notaries, loan signing agents, and 24/7 notary services near you.',
    images: ['/images/twitter-image.jpg'],
    creator: '@notaryfindernow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const csp = buildCSP();
  
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp.policy} />
      </head>
      <body className={inter.className}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ShieldCheckIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <div className="animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        }>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
