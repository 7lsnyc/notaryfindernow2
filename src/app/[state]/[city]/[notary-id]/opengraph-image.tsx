import { ImageResponse } from 'next/og';
import { getNotaryById } from '@/lib/supabase';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { 'notary-id': string } }) {
  const notary = await getNotaryById(params['notary-id']);

  if (!notary) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 600,
          }}
        >
          Notary Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '24px',
            color: '#1a365d',
          }}
        >
          {notary.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            textAlign: 'center',
            color: '#4a5568',
          }}
        >
          Notary Public in {notary.city}, {notary.state}
        </div>
        {notary.rating > 0 && (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              marginTop: '24px',
              color: '#2d3748',
            }}
          >
            Rating: {notary.rating.toFixed(1)} ⭐️
          </div>
        )}
      </div>
    ),
    { ...size }
  );
} 