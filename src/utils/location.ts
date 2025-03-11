interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function parseLocation(location: string): Promise<Coordinates> {
  // For now, we'll use a simple comma-separated format "lat,lng"
  const [lat, lng] = location.split(',').map(Number)
  
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid location format. Expected "latitude,longitude"')
  }

  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90')
  }

  if (lng < -180 || lng > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180')
  }

  return {
    latitude: lat,
    longitude: lng
  }
} 