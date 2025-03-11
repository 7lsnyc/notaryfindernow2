export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error('Missing Google Maps API Key in environment variables');
    throw new Error('Missing Google Maps API Key');
  }

  try {
    // Log the raw and cleaned address
    const cleanedAddress = address.trim().replace(/\s+/g, ' ');
    console.log('Geocoding request details:', {
      raw: address,
      cleaned: cleanedAddress,
      encoded: encodeURIComponent(cleanedAddress),
      hasApiKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      apiKeyLength: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length
    });
    
    // Add components parameter for better results
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cleanedAddress
    )}&components=country:US&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    
    console.log('Geocoding URL (without API key):', url.split('&key=')[0]);

    const response = await fetch(url);
    console.log('Geocoding response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('Geocoding response not OK:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Geocoding API response:', {
      status: data.status,
      results_count: data.results?.length || 0,
      error_message: data.error_message,
      full_response: JSON.stringify(data, null, 2)
    });
    
    if (data.status === 'ZERO_RESULTS') {
      console.log('No results found for address');
      throw new Error('No results found for this address. Please check the address and try again.');
    }

    if (data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API request denied:', data.error_message);
      throw new Error('Location service is not properly configured. Please check API key.');
    }

    if (data.status !== 'OK' || !data.results?.[0]) {
      console.error('Geocoding error:', {
        status: data.status,
        message: data.error_message
      });
      throw new Error(data.error_message || 'Failed to geocode address');
    }

    const result = data.results[0];
    console.log('Geocoding successful:', {
      formatted_address: result.formatted_address,
      location: result.geometry.location,
      types: result.types,
      place_id: result.place_id
    });

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formatted_address: result.formatted_address,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error('Missing Google Maps API Key');
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      throw new Error('No results found for these coordinates');
    }

    return data.results[0].formatted_address;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
} 