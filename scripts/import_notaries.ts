import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let supabase: ReturnType<typeof createSupabaseClient>;

// Function to get API key
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }
  console.log('Using API key:', apiKey);
  return apiKey;
};

// Load environment variables
async function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    console.log('Loading environment from:', envPath);
    const envFile = await fs.readFile(envPath, 'utf-8');
    console.log('Environment file contents:', envFile);
    dotenv.config({ path: envPath });
  } catch (error) {
    console.error('Error loading environment:', error);
  }
}

// Debug environment variables
function debugEnv() {
  console.log('Environment variables:');
  console.log('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY:', process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY);
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Debug environment setup
async function checkEnvironment() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  console.log('Current working directory:', process.cwd());
  console.log('Attempting to load environment from:', envPath);

  // Check if .env.local exists
  try {
    const envExists = await fs.access(envPath).then(() => true).catch(() => false);
    console.log('.env.local exists:', envExists);
    if (envExists) {
      const envContents = await fs.readFile(envPath, 'utf8');
      console.log('.env.local contents (first line):', envContents.split('\n')[0]);
    }
  } catch (error) {
    console.error('Error checking .env.local:', error);
  }

  // Load environment variables
  dotenv.config({ path: envPath });

  // Debug loaded environment variables
  console.log('\nEnvironment variables after loading:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set');
  console.log('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY:', process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? 'set' : 'not set');

  // Initialize clients after environment variables are loaded
  supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

// Major US cities to search in
const cities = [
  // Existing major metros
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'San Francisco, CA',
  'Charlotte, NC',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA',
  
  // Additional cities in underrepresented states
  'Pittsburgh, PA',
  'Harrisburg, PA',
  'Allentown, PA',
  'Erie, PA',
  'Scranton, PA',
  'Reading, PA',
  
  'Tulsa, OK',
  'Norman, OK',
  'Broken Arrow, OK',
  'Edmond, OK',
  'Lawton, OK',
  
  'Richmond, VA',
  'Virginia Beach, VA',
  'Norfolk, VA',
  'Chesapeake, VA',
  'Arlington, VA',
  'Alexandria, VA',
  
  'Salt Lake City, UT',
  'West Valley City, UT',
  'Provo, UT',
  'West Jordan, UT',
  'Orem, UT',
  
  // Additional secondary markets
  'Reno, NV',
  'Henderson, NV',
  'Sparks, NV',
  
  'Wichita, KS',
  'Overland Park, KS',
  'Kansas City, KS',
  
  'Omaha, NE',
  'Lincoln, NE',
  'Bellevue, NE',
  
  'Des Moines, IA',
  'Cedar Rapids, IA',
  'Davenport, IA',
  
  'Sioux Falls, SD',
  'Rapid City, SD',
  
  'Fargo, ND',
  'Bismarck, ND',
  
  'Billings, MT',
  'Missoula, MT',
  
  'Boise, ID',
  'Meridian, ID',
  
  'Anchorage, AK',
  'Fairbanks, AK',
  
  'Honolulu, HI',
  'Pearl City, HI',
  
  // Additional mid-sized cities
  'Worcester, MA',
  'Springfield, MA',
  'Providence, RI',
  'Warwick, RI',
  'Bridgeport, CT',
  'New Haven, CT',
  'Buffalo, NY',
  'Rochester, NY',
  'Syracuse, NY',
  'Newark, NJ',
  'Jersey City, NJ',
  'Wilmington, DE',
  'Dover, DE',
  'Baltimore, MD',
  'Annapolis, MD',
  'Charleston, WV',
  'Huntington, WV',
  'Durham, NC',
  'Greensboro, NC',
  'Columbia, SC',
  'Charleston, SC',
  'Augusta, GA',
  'Savannah, GA',
  'Mobile, AL',
  'Montgomery, AL',
  'Jackson, MS',
  'Gulfport, MS',
  'Baton Rouge, LA',
  'Shreveport, LA',
  'Little Rock, AR',
  'Fort Smith, AR',
  'Springfield, MO',
  'Independence, MO',
  'Wichita, KS',
  'Topeka, KS',
  'Grand Rapids, MI',
  'Warren, MI',
  'Fort Wayne, IN',
  'Evansville, IN',
  'Dayton, OH',
  'Toledo, OH',
  'Madison, WI',
  'Green Bay, WI',
  'St. Paul, MN',
  'Rochester, MN',
  'Cedar Rapids, IA',
  'Davenport, IA',
  'Omaha, NE',
  'Lincoln, NE',
  'Rapid City, SD',
  'Aberdeen, SD',
  'Bismarck, ND',
  'Grand Forks, ND',
  'Billings, MT',
  'Great Falls, MT',
  'Boise, ID',
  'Idaho Falls, ID',
  'Spokane, WA',
  'Tacoma, WA',
  'Eugene, OR',
  'Salem, OR',
  'Oakland, CA',
  'Bakersfield, CA',
  'Reno, NV',
  'Henderson, NV',
  'Tucson, AZ',
  'Mesa, AZ',
  'Colorado Springs, CO',
  'Aurora, CO',
  'Santa Fe, NM',
  'Las Cruces, NM'
];

interface Place {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  primaryType: string;
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{
    name: string;
    uri: string;
  }>;
}

interface NotaryData extends Record<string, unknown> {
  name: string;
  place_id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  phone?: string;
  website?: string;
  business_hours?: any;
  services: string[];
  is_available_now: boolean;
  reviews: Review[];
  service_types: {
    is_mobile: boolean;
    is_24_hour: boolean;
    is_remote: boolean;
    is_free_initial_consultation: boolean;
    offers_loan_signing: boolean;
    offers_apostille: boolean;
    offers_real_estate: boolean;
    offers_wedding: boolean;
    has_online_booking: boolean;
  };
  diversity_indicators: {
    is_black_owned: boolean;
    is_lgbtq_friendly: boolean;
    is_women_owned: boolean;
  };
  booking_info: {
    booking_url?: string;
    booking_platform?: string;
  };
  photo?: {
    url: string;
    attribution?: string;
  };
}

interface Review {
  author: string;
  rating: number;
  text: string;
  time: string;
}

interface GooglePlaceReview {
  authorName: string;
  rating: number;
  text: string;
  relativePublishTimeDescription: string;
}

// Function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Major city coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 },
  'Philadelphia, PA': { lat: 39.9526, lng: -75.1652 },
  'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
  'San Jose, CA': { lat: 37.3382, lng: -121.8863 }
};

async function searchNotariesInCity(city: string): Promise<Place[]> {
  console.log(`\n=== Searching for notaries in ${city}... ===`);
  
  try {
    const searchQueries = [
      `notary public in ${city}`,
      `notary services ${city}`,
      `mobile notary ${city}`,
      `notary ${city}`
    ];
    
    const allPlaces = new Map<string, Place>();
    
    for (const query of searchQueries) {
      const requestData = {
        textQuery: query,
        locationBias: {
          circle: {
            center: {
              latitude: cityCoordinates[city]?.lat || 0,
              longitude: cityCoordinates[city]?.lng || 0
            },
            radius: 40000.0
          }
        },
        maxResultCount: 20,
        languageCode: "en"
      };
      
      const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': getApiKey(),
        'X-Goog-FieldMask': '*'
      };

      console.log(`Trying query: "${query}"`);
      
      const response = await axios.post<{ places: Place[] }>(
        'https://places.googleapis.com/v1/places:searchText',
        requestData,
        { headers }
      );

      if (response.data.places) {
        response.data.places.forEach((place: Place) => {
          if (!allPlaces.has(place.id)) {
            allPlaces.set(place.id, place);
          }
        });
      }
      
      await delay(2000);
    }

    const uniquePlaces = Array.from(allPlaces.values());
    console.log(`Found ${uniquePlaces.length} unique notaries in ${city}`);
    return uniquePlaces;
  } catch (error: any) {
    console.error(`Error searching notaries in ${city}:`, error.response?.status);
    console.error('Error details:', error.response?.data);
    if (error.response?.data?.error?.details) {
      console.error('Error details array:', JSON.stringify(error.response.data.error.details, null, 2));
    }
    await delay(3000);
    return [];
  }
}

async function getPlaceDetails(placeId: string) {
  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': getApiKey(),
          'X-Goog-FieldMask': 'id,displayName.text,formattedAddress,location.latitude,location.longitude,rating,userRatingCount,websiteUri,internationalPhoneNumber,currentOpeningHours.openNow,regularOpeningHours.periods,businessStatus,primaryType,reviews,photos.name'
        }
      }
    );

    // If photos exist, get the first photo's details
    let photoData = undefined;
    if (response.data.photos && response.data.photos.length > 0) {
      const photoName = response.data.photos[0].name;
      try {
        const photoResponse = await axios.get(
          `https://places.googleapis.com/v1/${photoName}/media`,
          {
            headers: {
              'X-Goog-Api-Key': getApiKey(),
            },
            params: {
              maxHeightPx: 400,  // Reasonable size for listing display
              maxWidthPx: 600,
              skipHttpRedirect: false // Get direct URL instead of making another request
            }
          }
        );
        
        photoData = {
          url: photoResponse.data.photoUri || photoResponse.data,
          attribution: photoResponse.data.attribution
        };
      } catch (photoError: any) {
        console.error(`Error fetching photo for place ${placeId}:`, photoError.response?.status);
      }
    }

    return { ...response.data, photoData };
  } catch (error: any) {
    console.error(`Error fetching place details for ${placeId}:`, error.response?.status);
    console.error('Error details:', error.response?.data);
    if (error.response?.data?.error?.details) {
      console.error('Error details array:', JSON.stringify(error.response.data.error.details, null, 2));
    }
    return null;
  }
}

function detectBookingInfo(name: string, website: string = '', description: string = '', reviews: any[] = []): { has_online_booking: boolean; booking_info: NotaryData['booking_info'] } {
  const textToAnalyze = `${name} ${description} ${reviews.map(r => r.text).join(' ')}`.toLowerCase();
  const websiteLower = website.toLowerCase();
  
  // Common booking platforms and their URL patterns
  const bookingPlatforms = {
    'Calendly': /calendly\.com/,
    'Acuity': /acuityscheduling\.com/,
    'Square': /square\.site|squareup\.com/,
    'Booksy': /booksy\.com/,
    'Vagaro': /vagaro\.com/,
    'SimplyBook': /simplybook\.me/,
    'Schedulicity': /schedulicity\.com/,
    'Setmore': /setmore\.com/,
    'YouCanBookMe': /youcanbook\.me/,
    'Booking Page': /booking|schedule|appointment|reserve/,
    'GigaSmart': /gigasmart\.com/,
    'Notary.net': /notary\.net/,
    'Notarize': /notarize\.com/
  };

  let bookingInfo: NotaryData['booking_info'] = {};
  let hasOnlineBooking = false;

  // Check website URL for booking platform indicators
  for (const [platform, pattern] of Object.entries(bookingPlatforms)) {
    if (pattern.test(websiteLower)) {
      hasOnlineBooking = true;
      bookingInfo.booking_url = website;
      bookingInfo.booking_platform = platform;
      break;
    }
  }

  // Look for booking keywords in text
  const hasBookingKeywords = /book online|schedule online|book now|schedule appointment|book appointment|schedule now|online booking|online scheduling|book a notary|schedule a notary|reserve appointment|book your appointment|schedule your notary|instant booking|easy scheduling/.test(textToAnalyze);

  return {
    has_online_booking: hasOnlineBooking || hasBookingKeywords,
    booking_info: bookingInfo
  };
}

function detectServices(name: string, description: string = '', reviews: any[] = []): NotaryData['service_types'] {
  const textToAnalyze = `${name} ${description} ${reviews.map(r => r.text).join(' ')}`.toLowerCase();
  
  return {
    is_mobile: /mobile|traveling|on-site|we come to you|travel to|come to your|house calls|drive to|go to your|at your location|at your home|at your office/.test(textToAnalyze),
    
    is_24_hour: /24(\s)?(-)?(\s)?hour|available any time|after hours|overnight|weekend|anytime|24\/7|all hours|emergency|late night|early morning|always available/.test(textToAnalyze),
    
    is_remote: /remote|online|virtual|zoom|electronic|e-notary|ron|webcam|video|digital notary|remote online|virtual notary|e-sign|electronic notary/.test(textToAnalyze),
    
    is_free_initial_consultation: /free consultation|free estimate|no obligation|free quote|complimentary|free assessment/.test(textToAnalyze),
    
    offers_loan_signing: /loan|mortgage|signing agent|nsa|title|escrow|closing|refinance|real estate|deed|settlement|lending|home loan|purchase|refi/.test(textToAnalyze),
    
    offers_apostille: /apostille|authentication|certification|embassy|international|document certification|secretary of state|foreign|legalization|consulate/.test(textToAnalyze),
    
    offers_real_estate: /real estate|property|deed|title|mortgage|closing|settlement|home|house|purchase|sale|refinance|refi|commercial|residential/.test(textToAnalyze),
    
    offers_wedding: /wedding|marriage|officiant|ceremony|vow|matrimony|civil union|civil marriage|domestic partnership/.test(textToAnalyze),
    
    has_online_booking: false // Will be set by detectBookingInfo
  };
}

function detectDiversityIndicators(name: string, description: string = '', reviews: any[] = []): NotaryData['diversity_indicators'] {
  const textToAnalyze = `${name} ${description} ${reviews.map(r => r.text).join(' ')}`.toLowerCase();
  
  return {
    is_black_owned: /black(\s|-)?owned|african american(\s|-)?owned|minority(\s|-)?owned/.test(textToAnalyze),
    is_lgbtq_friendly: /lgbtq?(\s|-)?friendly|gay(\s|-)?friendly|pride|rainbow|queer(\s|-)?friendly/.test(textToAnalyze),
    is_women_owned: /women(\s|-)?owned|woman(\s|-)?owned|female(\s|-)?owned/.test(textToAnalyze)
  };
}

// Function to sanitize text data
function sanitizeText(text: any): string {
  if (!text) return '';
  if (typeof text !== 'string') {
    // If it's an object or array, convert to JSON string
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    } else {
      // Convert numbers, booleans, etc to string
      text = String(text);
    }
  }
  return text
    .replace(/\u0000/g, '') // Remove null characters
    .replace(/[\uD800-\uDFFF]/g, '') // Remove surrogate pairs
    .replace(/[^\x20-\x7E\n\r\t]/g, ''); // Keep only basic ASCII, newlines, and tabs
}

async function importNotaries() {
  let qualifyingNotaries = 0;
  const cityNotaryCounts: Record<string, number> = {};
  let errorCities: string[] = [];
  
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (const city of cities) {
    try {
      cityNotaryCounts[city] = 0;
      const notaries = await searchNotariesInCity(city);
      
      if (!notaries || notaries.length === 0) {
        console.log(`⚠️ No notaries found in ${city}`);
        errorCities.push(city);
        continue;
      }

      for (const notary of notaries) {
        const details = await getPlaceDetails(notary.id);
        if (details) {
          // Extract city and state from formatted address
          const addressParts = details.formattedAddress.split(',').map((part: string) => part.trim());
          const state = addressParts[addressParts.length - 2]?.split(' ')[0];
          const city = addressParts[addressParts.length - 3];

          // Process and format the notary data
          const bookingInfo = detectBookingInfo(
            details.displayName.text,
            details.websiteUri,
            details.editorialSummary?.text || '',
            details.reviews
          );

          const notaryData = {
            name: sanitizeText(details.displayName.text),
            address: sanitizeText(details.formattedAddress),
            city: sanitizeText(city),
            state: sanitizeText(state),
            latitude: details.location.latitude,
            longitude: details.location.longitude,
            rating: details.rating || 0,
            review_count: details.userRatingCount || 0,
            phone: sanitizeText(details.internationalPhoneNumber),
            website: sanitizeText(details.websiteUri),
            is_available_now: details.currentOpeningHours?.openNow || false,
            business_hours: details.regularOpeningHours?.periods || {},
            place_id: details.id,
            business_type: sanitizeText(details.primaryType),
            services: ['Notary Public'],
            reviews: (details.reviews || []).slice(0, 10).map((review: GooglePlaceReview) => ({
              author: sanitizeText(review.authorName),
              rating: review.rating,
              text: sanitizeText(review.text),
              time: sanitizeText(review.relativePublishTimeDescription)
            })),
            service_types: {
              ...detectServices(
                details.displayName.text,
                details.editorialSummary?.text || '',
                details.reviews
              ),
              has_online_booking: bookingInfo.has_online_booking
            },
            booking_info: bookingInfo.booking_info,
            diversity_indicators: detectDiversityIndicators(
              details.displayName.text,
              details.editorialSummary?.text || '',
              details.reviews
            ),
            photo: details.photoData ? {
              url: sanitizeText(details.photoData.url),
              attribution: sanitizeText(details.photoData.attribution)
            } : undefined,
            created_at: new Date().toISOString()
          };

          try {
            // Insert the notary data into the database
            const { error } = await supabase
              .from('notaries_new')
              .upsert([notaryData], {
                onConflict: 'place_id',
                ignoreDuplicates: false
              });

            if (error) {
              console.error(`Error saving notary ${notaryData.name}:`, error);
            } else {
              console.log(`Successfully saved notary: ${notaryData.name}`);
              qualifyingNotaries++;
              cityNotaryCounts[city]++;
            }
          } catch (error) {
            console.error(`Error processing notary ${notaryData.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing city ${city}:`, error);
      errorCities.push(city);
    }
  }

  console.log('\nNotaries per major city:');
  const majorCities = ['New York, NY', 'Los Angeles, CA', 'Houston, TX', 'Chicago, IL', 'Miami, FL'];
  for (const city of majorCities) {
    console.log(`${city}: ${cityNotaryCounts[city]} notaries`);
  }

  console.log(`\nTotal: ${qualifyingNotaries} qualifying notaries across all cities`);
  console.log('Import complete!');
}

async function main() {
  await loadEnv();
  debugEnv();
  
  await checkEnvironment();

  // Create Supabase client
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await importNotaries();
}

// Run the import
main()
  .catch(console.error); 