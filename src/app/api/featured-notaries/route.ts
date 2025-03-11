import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedNotaries } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '37.7749');
    const longitude = parseFloat(searchParams.get('longitude') || '-122.4194');
    const limit = parseInt(searchParams.get('limit') || '3');

    const result = await getFeaturedNotaries(latitude, longitude, limit);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching featured notaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured notaries' },
      { status: 500 }
    );
  }
} 