import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

async function testPlacesAPI() {
  // Load environment variables
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  console.log('Testing with API key:', apiKey);
  
  // Test using the new Places API endpoint
  try {
    console.log('\nTesting Places API (New)...');
    const baseUrl = 'https://places.googleapis.com/v1/places:searchText';
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
    };
    
    const data = {
      textQuery: 'notary public in New York, NY'
    };
    
    console.log('Request URL:', baseUrl);
    console.log('Headers:', headers);
    console.log('Request data:', JSON.stringify(data, null, 2));
    
    const response = await axios.post(baseUrl, data, { headers });
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error:', {
        status: error.response?.status,
        data: error.response?.data,
        details: error.response?.data?.error?.details,
        message: error.message
      });
    } else {
      console.error('Error:', error);
    }
  }
}

testPlacesAPI().catch(console.error); 