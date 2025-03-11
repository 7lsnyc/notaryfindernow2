import { NotaryBase } from '@/lib/supabase';

export const dummyNotaries: NotaryBase[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(415) 555-0123',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    latitude: 37.7749,
    longitude: -122.4194,
    services: [
      'Loan Signing',
      'Real Estate',
      'Affidavits',
      'Power of Attorney',
      'Wills & Trusts'
    ],
    availability: [
      'Monday: 9:00 AM - 5:00 PM',
      'Tuesday: 9:00 AM - 5:00 PM',
      'Wednesday: 9:00 AM - 5:00 PM',
      'Thursday: 9:00 AM - 5:00 PM',
      'Friday: 9:00 AM - 5:00 PM'
    ],
    business_hours: {
      monday: { open: '9:00 AM', close: '5:00 PM' },
      tuesday: { open: '9:00 AM', close: '5:00 PM' },
      wednesday: { open: '9:00 AM', close: '5:00 PM' },
      thursday: { open: '9:00 AM', close: '5:00 PM' },
      friday: { open: '9:00 AM', close: '5:00 PM' }
    },
    rating: 4.9,
    reviews: 128,
    verified: true,
    featured: true,
    business_type: 'Mobile Notary',
    service_radius_miles: 25,
    remote_notary_states: ['CA', 'NV', 'AZ'],
    website: 'https://example.com',
    business_name: 'Sarah Johnson Mobile Notary',
    license_number: 'CA12345',
    commission_expiry: '2025-12-31',
    insurance_expiry: '2024-12-31',
    background_check_date: '2023-01-15',
    profile_image_url: 'https://example.com/profile.jpg',
    about: 'Professional mobile notary with over 10 years of experience.',
    languages: ['English', 'Spanish'],
    certifications: ['NNA Certified', 'Loan Signing Agent'],
    pricing: {
      base_fee: 75,
      travel_fee: 25,
      additional_signatures: 10
    },
    starting_price: 75,
    price_info: 'Base fee includes first signature, additional signatures $10 each',
    website_url: 'https://example.com',
    booking_url: 'https://example.com/book',
    is_available_now: true,
    accepts_online_booking: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-31T00:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '(415) 555-0124',
    address: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    latitude: 37.7897,
    longitude: -122.4001,
    services: [
      'Loan Signing',
      'Real Estate',
      'Affidavits'
    ],
    availability: [
      'Monday: 8:00 AM - 6:00 PM',
      'Tuesday: 8:00 AM - 6:00 PM',
      'Wednesday: 8:00 AM - 6:00 PM',
      'Thursday: 8:00 AM - 6:00 PM',
      'Friday: 8:00 AM - 6:00 PM'
    ],
    business_hours: {
      monday: { open: '8:00 AM', close: '6:00 PM' },
      tuesday: { open: '8:00 AM', close: '6:00 PM' },
      wednesday: { open: '8:00 AM', close: '6:00 PM' },
      thursday: { open: '8:00 AM', close: '6:00 PM' },
      friday: { open: '8:00 AM', close: '6:00 PM' }
    },
    rating: 4.8,
    reviews: 95,
    verified: true,
    featured: false,
    business_type: 'Mobile Notary',
    service_radius_miles: 20,
    website: 'https://example.com',
    business_name: 'Michael Chen Notary Services',
    license_number: 'CA12346',
    commission_expiry: '2025-12-31',
    insurance_expiry: '2024-12-31',
    background_check_date: '2023-01-15',
    about: 'Experienced mobile notary serving the San Francisco Bay Area.',
    languages: ['English', 'Mandarin'],
    certifications: ['NNA Certified'],
    pricing: {
      base_fee: 65,
      travel_fee: 20,
      additional_signatures: 10
    },
    starting_price: 65,
    price_info: 'Base fee includes first signature, additional signatures $10 each',
    is_available_now: false,
    accepts_online_booking: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-31T00:00:00Z'
  }
]; 