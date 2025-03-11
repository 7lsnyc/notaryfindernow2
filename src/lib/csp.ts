import { headers } from 'next/headers';

// Function to generate a random nonce
function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

export function buildCSP() {
  const policy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://pagead2.googlesyndication.com https://partner.googleadservices.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://*.google.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src 'self' https://www.google.com",
    "connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://vpeehgggmgmzoakenyyb.supabase.co",
  ].join("; ");

  return {
    policy,
  };
} 