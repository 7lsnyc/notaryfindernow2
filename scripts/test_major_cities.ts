import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
async function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  dotenv.config({ path: envPath });
}

// Function to get API key
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }
  return apiKey;
};

// Major city coordinates
const majorCities = {
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 }
};

// Function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface Place {
  primaryType: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
}

async function searchNotariesInCity(city: string, coordinates: { lat: number; lng: number }) {
  console.log(`\n=== Testing search for notaries in ${city}... ===`);
  
  try {
    // Try different search queries
    const searchQueries = [
      `notary public in ${city}`,
      `notary services ${city}`,
      `mobile notary ${city}`,
      `notary ${city}`
    ];

    for (const query of searchQueries) {
      console.log(`\nTrying query: "${query}"`);
      
      const requestData = {
        textQuery: query,
        locationBias: {
          circle: {
            center: {
              latitude: coordinates.lat,
              longitude: coordinates.lng
            },
            radius: 20000.0
          }
        },
        maxResultCount: 20
      };
      
      const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': getApiKey(),
        'X-Goog-FieldMask': '*'
      };

      console.log('Request data:', JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        requestData,
        { headers }
      );

      if (response.data.places && response.data.places.length > 0) {
        console.log(`Found ${response.data.places.length} results for "${query}"`);
        console.log('First result:', JSON.stringify(response.data.places[0], null, 2));
        console.log('Types of places found:', response.data.places.map((p: Place) => p.primaryType).join(', '));
        
        // Log more details about each place
        response.data.places.forEach((place: Place, index: number) => {
          console.log(`\nResult ${index + 1}:`);
          console.log(`Name: ${place.displayName.text}`);
          console.log(`Address: ${place.formattedAddress}`);
          console.log(`Type: ${place.primaryType}`);
        });
      } else {
        console.log(`No results found for "${query}"`);
      }

      await delay(2000); // Wait 2 seconds between queries
    }
  } catch (error: any) {
    console.error(`Error searching notaries in ${city}:`);
    console.error('Status:', error.response?.status);
    console.error('Error details:', error.response?.data);
    if (error.response?.data?.error?.details) {
      console.error('Error details array:', JSON.stringify(error.response.data.error.details, null, 2));
    }
  }
}

async function main() {
  await loadEnv();
  console.log('Testing major city searches...');
  
  for (const [city, coordinates] of Object.entries(majorCities)) {
    await searchNotariesInCity(city, coordinates);
    await delay(3000); // Wait 3 seconds between cities
  }
}

// Run the test
main().catch(console.error); 