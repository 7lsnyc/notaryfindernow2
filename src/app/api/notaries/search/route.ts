import { NextRequest, NextResponse } from 'next/server';
import { searchNotaries } from '@/lib/supabase';
import { validateSearchFilters } from '@/utils/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      latitude: parseFloat(searchParams.get('latitude') || '0'),
      longitude: parseFloat(searchParams.get('longitude') || '0'),
      radius: parseInt(searchParams.get('radius') || '25'),
      rating: parseFloat(searchParams.get('rating') || '0'),
      services: searchParams.get('services')?.split(',') || [],
      is_available_now: searchParams.get('is_available_now') === 'true',
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    // Validate filters
    const validationError = validateSearchFilters(filters);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Search notaries
    const results = await searchNotaries(filters);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching notaries:', error);
    return NextResponse.json(
      { error: 'Failed to search notaries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters } = body;

    // Validate filters
    const validationError = validateSearchFilters(filters);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Search notaries
    const results = await searchNotaries(filters);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching notaries:', error);
    return NextResponse.json(
      { error: 'Failed to search notaries' },
      { status: 500 }
    );
  }
} 