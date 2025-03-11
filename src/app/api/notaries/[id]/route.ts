import { NextRequest, NextResponse } from 'next/server'
import { getNotaryById } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const notary = await getNotaryById(id)
    
    if (!notary) {
      return NextResponse.json(
        { error: 'Notary not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(notary)
  } catch (error) {
    console.error('Error fetching notary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notary' },
      { status: 500 }
    )
  }
} 