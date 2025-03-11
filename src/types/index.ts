export interface Notary {
  id: string
  created_at?: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  services: string[]
  availability: string[]
  rating: number
  reviews: number
  verified: boolean
  featured: boolean
  business_type?: string
  service_radius_miles?: number
  remote_notary_states?: string[]
  website?: string
  business_name?: string
  license_number?: string
  commission_expiry?: string
  insurance_expiry?: string
  background_check_date?: string
  profile_image_url?: string
  about?: string
  languages?: string[]
  certifications?: string[]
  pricing?: {
    base_fee: number
    travel_fee?: number
    additional_signatures?: number
  }
  place_id?: string
  distance?: number
  specialized_services?: string[]
  business_hours?: Record<string, { open: string; close: string }>
  review_summary?: string
  last_updated?: string
  starting_price?: number
  price_info?: string
  website_url?: string
  booking_url?: string
  is_available_now?: boolean
  accepts_online_booking?: boolean
  updated_at: string
}

// Helper functions to determine notary service types
export function isMobileNotary(notary: Notary): boolean {
  return notary.services.some(service => 
    service.toLowerCase().includes('mobile') || 
    notary.business_type?.toLowerCase().includes('mobile')
  );
}

export function isOnlineNotary(notary: Notary): boolean {
  return notary.services.some(service => 
    service.toLowerCase().includes('online') || 
    service.toLowerCase().includes('remote')
  ) || (notary.remote_notary_states?.length ?? 0) > 0;
}

export interface SearchParams {
  latitude: number
  longitude: number
  radius?: number
  limit?: number
  offset?: number
  min_rating?: number
  filters?: SearchFilters
}

export interface SearchFilters {
  services?: string[]
  rating?: number
  available_now?: boolean
  online_booking?: boolean
  radius?: number
}

export interface FeaturedNotaryRequest {
  notaryId: string
  requesterId: string
  requesterEmail: string
  requesterPhone?: string
  message?: string
  created_at?: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface SearchResponse {
  data: Notary[]
  error: Error | null
  total?: number
  page?: number
  totalPages?: number
}

export interface NotaryResponse {
  data: Notary | null
  error: Error | null
}

export interface FeaturedRequestResponse {
  success: boolean
  error: Error | null
}

export interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  is_open: boolean
  open_time?: string
  close_time?: string
  is_24_hours?: boolean
}

export enum BusinessType {
  INDIVIDUAL = 'individual',
  AGENCY = 'agency',
  LAW_FIRM = 'law_firm'
}

export enum ServiceType {
  GENERAL = 'general',
  LOAN_SIGNING = 'loan_signing',
  REAL_ESTATE = 'real_estate',
  APOSTILLE = 'apostille',
  MOBILE = 'mobile',
  ONLINE = 'online'
}

export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  CHINESE = 'Chinese',
  VIETNAMESE = 'Vietnamese',
  KOREAN = 'Korean',
  TAGALOG = 'Tagalog',
  RUSSIAN = 'Russian',
  ARABIC = 'Arabic',
  FRENCH = 'French',
  GERMAN = 'German'
}

export interface ApiError extends Error {
  code?: string
  details?: string
  hint?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface GeocodeResult {
  latitude: number
  longitude: number
  formatted_address: string
  city?: string
  state?: string
  zip?: string
}

export interface Booking {
  id: string
  notaryId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceType: string
  date: string
  time: string
  location: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
} 