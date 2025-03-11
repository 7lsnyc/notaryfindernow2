import { createClient } from '@supabase/supabase-js'
import type { 
  Notary, 
  SearchParams, 
  FeaturedNotaryRequest, 
  SearchResponse, 
  NotaryResponse, 
  FeaturedRequestResponse,
  ApiError
} from '@/types'
import { handleError } from '@/utils/error'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔌 Initializing Supabase client with:', {
  hasUrl: !!supabaseUrl,
  urlLength: supabaseUrl?.length,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
});

if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
  console.error('❌ Missing or invalid NEXT_PUBLIC_SUPABASE_URL');
  throw new Error('Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Please set this in your .env.local file')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('❌ Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY');
  throw new Error('Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY. Please set this in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'notaryfindernow',
    },
  },
})

export interface SearchFilters {
  services?: string[]
  rating?: number
  available_now?: boolean
  online_booking?: boolean
  radius?: number
}

interface NotarySearchResult {
  notaries: Notary[];
  total: number;
}

// Add this function to test specific coordinates
export async function testSearchCoordinates(latitude: number, longitude: number) {
  console.log('=== Testing Search with Specific Coordinates ===');
  console.log(`Testing coordinates: ${latitude}, ${longitude}`);
  
  try {
    // First, get all notaries to see what's in the database
    console.log('\nChecking all notaries in database...');
    const { data: allNotaries, error: allError } = await supabase
      .from('notaries')
      .select('*');

    if (allError) {
      console.error('❌ Failed to get all notaries:', allError);
    } else {
      console.log('Total notaries in database:', allNotaries?.length || 0);
      if (allNotaries?.length > 0) {
        console.log('Sample notaries:', allNotaries.slice(0, 3).map(n => ({
          name: n.name,
          latitude: n.latitude,
          longitude: n.longitude,
          rating: n.rating,
          reviews: n.reviews,
          is_available_now: n.is_available_now,
          distance: 2 * 3961 * Math.asin(Math.sqrt(
            Math.sin(Math.PI * (n.latitude - latitude) / 360) ** 2 +
            Math.cos(Math.PI * latitude / 180) * 
            Math.cos(Math.PI * n.latitude / 180) *
            Math.sin(Math.PI * (n.longitude - longitude) / 360) ** 2
          ))
        })));
      }
    }

    // Test with exact coordinates
    console.log('\nTesting search function...');
    const { data: exactTest, error: exactError } = await supabase
      .rpc('search_notaries', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius: 25,
        p_limit: 10,
        p_min_rating: 0,
        p_offset: 0
      });

    if (exactError) {
      console.error('❌ Search test failed:', exactError);
    } else {
      console.log(`✓ Search found ${exactTest?.length || 0} notaries`);
      if (exactTest?.length > 0) {
        console.log('Search Results:', exactTest.map((n: Notary) => ({
          name: n.name,
          rating: n.rating,
          reviews: n.reviews,
          location: `${n.latitude}, ${n.longitude}`,
          is_available_now: n.is_available_now,
          distance: 2 * 3961 * Math.asin(Math.sqrt(
            Math.sin(Math.PI * (n.latitude - latitude) / 360) ** 2 +
            Math.cos(Math.PI * latitude / 180) * 
            Math.cos(Math.PI * n.latitude / 180) *
            Math.sin(Math.PI * (n.longitude - longitude) / 360) ** 2
          ))
        })));
      }
    }

    // Also test a direct query with distance calculation
    console.log('\nTesting direct distance query...');
    const { data: distanceTest, error: distanceError } = await supabase
      .from('notaries')
      .select('*')
      .limit(5);

    if (distanceError) {
      console.error('❌ Distance test failed:', distanceError);
    } else {
      console.log('Distance test results:', distanceTest?.map(n => ({
        name: n.name,
        rating: n.rating,
        reviews: n.reviews,
        location: `${n.latitude}, ${n.longitude}`,
        is_available_now: n.is_available_now,
        distance: 2 * 3961 * Math.asin(Math.sqrt(
          Math.sin(Math.PI * (n.latitude - latitude) / 360) ** 2 +
          Math.cos(Math.PI * latitude / 180) * 
          Math.cos(Math.PI * n.latitude / 180) *
          Math.sin(Math.PI * (n.longitude - longitude) / 360) ** 2
        ))
      })));
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
  console.log('=== Coordinate Test Complete ===');
}

// Helper function for number validation
function validateNumber(value: any, fieldName: string, min?: number, max?: number): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid ${fieldName}: must be a number`);
  }
  if (min !== undefined && num < min) {
    throw new Error(`Invalid ${fieldName}: must be at least ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new Error(`Invalid ${fieldName}: must be at most ${max}`);
  }
  return num;
}

export async function searchNotaries(params: SearchParams): Promise<NotaryBase[]> {
  const { latitude, longitude, radius = 25, limit = 20, offset = 0, min_rating = 0, filters } = params;

  try {
    console.log('Searching notaries with params:', {
      latitude,
      longitude,
      radius,
      limit,
      min_rating
    });

    const { data: notaries, error } = await supabase
      .rpc('search_tier1_notaries', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius: radius,
        p_limit: limit,
        p_min_rating: min_rating,
        p_offset: offset
      });

    if (error) {
      console.error('Error in searchNotaries RPC:', error);
      return [];
    }

    if (!notaries || notaries.length === 0) {
      console.log('No notaries found for the given criteria');
      return [];
    }

    console.log(`Found ${notaries.length} notaries`);

    // Apply additional filters if needed
    let filteredNotaries = notaries;
    if (filters) {
      filteredNotaries = notaries.filter((notary: NotaryBase) => {
        if (filters.services && filters.services.length > 0) {
          const notaryServices = new Set(notary.services || []);
          if (!filters.services.some(service => notaryServices.has(service))) return false;
        }
        if (filters.available_now && !notary.is_available_now) return false;
        return true;
      });
    }

    return filteredNotaries;
  } catch (error) {
    console.error('Error in searchNotaries:', error);
    return [];
  }
}

export interface NotaryBase extends Notary {
  // Add any additional properties specific to NotaryBase here
}

export interface Booking {
  id: string;
  notaryId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getNotaryById(id: string): Promise<NotaryBase | null> {
  const { data: notary, error } = await supabase
    .from('notaries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching notary:', error);
    return null;
  }

  return notary;
}

export async function getFeaturedNotaries(
  latitude: number,
  longitude: number,
  limit: number = 3  // Changed default to 3 since this is for top rated notaries on home page
): Promise<SearchResponse> {
  try {
    // Validate parameters
    const validParams = {
      p_latitude: validateNumber(latitude, 'latitude', -90, 90),
      p_longitude: validateNumber(longitude, 'longitude', -180, 180),
      p_radius: 25, // Fixed radius for featured notaries
      p_limit: validateNumber(limit, 'limit', 1, 100),
      p_min_rating: 4.0, // Higher rating threshold for featured notaries
      p_offset: 0 // No offset for featured notaries
    };

    console.log('Making featured notaries RPC call with params:', validParams);
    const { data, error } = await supabase.rpc('search_tier1_notaries', validParams);

    if (error) {
      console.error('Featured notaries search error:', error);
      throw error;
    }

    console.log('Featured notaries search results:', {
      count: data?.length || 0,
      sample: data?.[0] ? {
        name: data[0].name,
        distance: data[0].distance,
        rating: data[0].rating
      } : null
    });

    return { 
      data: data || [], 
      error: null,
      total: data?.length || 0
    };
  } catch (error) {
    console.error('Error in getFeaturedNotaries:', error);
    return { 
      data: [], 
      error: handleError(error) as ApiError,
      total: 0
    };
  }
}

export async function submitFeaturedRequest(
  request: FeaturedNotaryRequest
): Promise<FeaturedRequestResponse> {
  try {
    const { error } = await supabase
      .from('featured_requests')
      .insert([request])

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error submitting featured request:', error)
    return { success: false, error: error as Error }
  }
}

interface TestResults {
  searchTest: {
    success: boolean;
    notariesFound: number;
    firstNotary?: any;
    error?: string;
  };
  featuredTest: {
    success: boolean;
    notariesFound: number;
    firstNotary?: any;
    error?: string;
  };
}

// Test function to verify setup
export async function testSearchSetup(): Promise<TestResults> {
  try {
    // Test search in San Francisco
    console.log('Running search test...');
    const searchResult = await searchNotaries({
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 25,
      limit: 5
    });
    
    const results: TestResults = {
      searchTest: {
        success: searchResult.length > 0,
        notariesFound: searchResult.length,
        firstNotary: searchResult[0]
      },
      featuredTest: {
        success: false,
        notariesFound: 0,
        firstNotary: undefined,
        error: undefined
      }
    };
    console.log('Search test results:', results.searchTest);

    // Test featured notaries
    console.log('Running featured test...');
    const featuredResult = await getFeaturedNotaries(37.7749, -122.4194, 3);
    
    results.featuredTest = {
      success: !featuredResult.error,
      notariesFound: featuredResult.data.length,
      firstNotary: featuredResult.data[0],
      error: featuredResult.error ? featuredResult.error.message : undefined
    };
    console.log('Featured test completed:', results.featuredTest);

    return results;
  } catch (error) {
    console.error('Test failed with error:', error);
    return {
      searchTest: {
        success: false,
        notariesFound: 0,
        firstNotary: undefined,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      featuredTest: {
        success: false,
        notariesFound: 0,
        firstNotary: undefined,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
}

// Add this function after the existing functions
export async function testNotariesTable() {
  console.log('=== Starting Database Test ===');
  console.log('Supabase Configuration:');
  console.log('URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('Key:', supabaseAnonKey ? 'Set' : 'Not set');
  
  try {
    console.log('Testing connection to notaries table...');
    
    // First test - simple connection
    const { error: connectionError } = await supabase
      .from('notaries')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError);
      return;
    }
    console.log('✓ Connection test successful');

    // Test regular search (tier 1 notaries with default rating threshold)
    console.log('\nTesting regular search...');
    const { data: searchTest, error: searchError } = await supabase
      .rpc('search_tier1_notaries', {
        p_latitude: 40.7128,
        p_longitude: -74.0060,
        p_radius: 25,
        p_limit: 10,
        p_min_rating: 3.0,
        p_offset: 0
      });

    if (searchError) {
      console.error('❌ Regular search test failed:', searchError);
    } else {
      console.log(`✓ Regular search found ${searchTest?.length || 0} tier 1 notaries`);
      if (searchTest?.length > 0) {
        console.log('Sample notary:', {
          name: searchTest[0].name,
          rating: searchTest[0].rating,
          review_count: searchTest[0].review_count,
          services: searchTest[0].services
        });
      }
    }

    // Test top rated notaries (higher rating threshold)
    console.log('\nTesting top rated notaries...');
    const { data: topRatedTest, error: topRatedError } = await supabase
      .rpc('search_tier1_notaries', {
        p_latitude: 40.7128,
        p_longitude: -74.0060,
        p_radius: 25,
        p_limit: 3,
        p_min_rating: 4.0,
        p_offset: 0
      });

    if (topRatedError) {
      console.error('❌ Top rated search test failed:', topRatedError);
    } else {
      console.log(`✓ Found ${topRatedTest?.length || 0} top rated notaries`);
      if (topRatedTest?.length > 0) {
        console.log('Top rated sample:', {
          name: topRatedTest[0].name,
          rating: topRatedTest[0].rating,
          review_count: topRatedTest[0].review_count,
          services: topRatedTest[0].services
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
  console.log('=== Database Test Complete ===');
}

export async function listDatabaseFunctions() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // List available functions
    const { data: functions, error: functionsError } = await supabase
      .rpc('list_functions')
      .select('*');

    if (functionsError) {
      console.error('Error listing functions:', functionsError);
      return null;
    }

    // Test a simple query to verify database connection
    const { data: testData, error: testError } = await supabase
      .from('notaries')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Error testing database connection:', testError);
      return null;
    }

    console.log('Available functions:', functions);
    console.log('Database connection test:', testData);
    
    return { functions, testData };
  } catch (error) {
    console.error('Error in listDatabaseFunctions:', error);
    return null;
  }
}

// Test database connection
export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test basic query with timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const start = Date.now();
    const { data, error } = await supabase
      .from('notaries')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);

    clearTimeout(timeoutId);
    const duration = Date.now() - start;
    console.log(`⏱️ Query duration: ${duration}ms`);

    if (error) {
      console.error('❌ Database connection test failed:', {
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!data) {
      console.error('❌ No data returned from test query');
      throw new Error('No data returned from test query');
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Database connection timed out after 5 seconds');
      throw new Error('Database connection timed out. Please try again later.');
    }
    console.error('❌ Database connection error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function getAllNotaries(): Promise<NotaryBase[]> {
  const { data: notaries, error } = await supabase
    .from('notaries')
    .select('*')
    .order('rating', { ascending: false })
    .gt('rating', 4.0); // Only get notaries with rating > 4.0

  if (error) {
    console.error('Error fetching notaries:', error);
    return [];
  }

  return notaries || [];
} 