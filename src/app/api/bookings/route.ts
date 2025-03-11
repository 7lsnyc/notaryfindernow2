import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notaryId = searchParams.get('notaryId')
    const clientEmail = searchParams.get('clientEmail')

    if (!notaryId && !clientEmail) {
      return NextResponse.json(
        { error: 'Must provide either notaryId or clientEmail' },
        { status: 400 }
      )
    }

    let query = supabase.from('bookings').select('*')

    if (notaryId) {
      query = query.eq('notary_id', notaryId)
    }

    if (clientEmail) {
      query = query.eq('client_email', clientEmail)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notaryId, date, time, service, clientName, clientEmail, clientPhone, location, notes } = body

    if (!notaryId || !date || !time || !service || !clientName || !clientEmail || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        notary_id: notaryId,
        date,
        time,
        service,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        location,
        notes,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Get notary details
    const { data: notary } = await supabase
      .from('notaries')
      .select('*')
      .eq('id', notaryId)
      .single()

    // Send confirmation email
    await sendBookingConfirmationEmail({
      booking,
      notary,
      clientEmail,
      clientName
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    })
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 