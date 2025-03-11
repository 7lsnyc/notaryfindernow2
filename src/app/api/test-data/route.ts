import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all notaries
    const { data: notaries, error } = await supabase
      .from('notaries')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching notaries:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the data for debugging
    console.log('Notaries data:', notaries?.map(n => ({
      id: n.id,
      name: n.name,
      phone: n.phone || 'No phone',
      email: n.email || 'No email',
      rating: n.rating,
      services: n.services
    })));

    return NextResponse.json({
      count: notaries?.length || 0,
      notaries: notaries?.map(n => ({
        id: n.id,
        name: n.name,
        phone: n.phone || 'No phone',
        email: n.email || 'No email',
        rating: n.rating,
        services: n.services
      }))
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}