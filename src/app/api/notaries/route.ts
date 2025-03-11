import { NextRequest, NextResponse } from 'next/server'
import { searchNotaries } from '@/lib/supabase'
import { parseLocation } from '@/utils/location'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationStr = searchParams.get('location')
    const filtersStr = searchParams.get('filters')

    if (!locationStr) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      )
    }

    // Parse location string into coordinates
    const { latitude, longitude } = await parseLocation(locationStr)
    
    // Parse filters
    const filters = filtersStr ? JSON.parse(filtersStr) : {}

    const notaries = await searchNotaries({
      latitude,
      longitude,
      filters
    })
    
    return NextResponse.json(notaries)
  } catch (error) {
    console.error('Error searching notaries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 