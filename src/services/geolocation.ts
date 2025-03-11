import { 
  GeolocationOptions, 
  DEFAULT_GEOLOCATION_OPTIONS,
  LocationDetails,
  GeolocationErrorType,
  GeolocationErrorDetails,
  Coordinates
} from '@/types/geolocation';
import { ERROR_MESSAGES } from '@/config/constants';
import { LocationError } from '@/utils/error';
import { geocodeAddress, reverseGeocode } from '@/lib/geocoding';

export class GeolocationService {
  private options: GeolocationOptions;

  constructor(options: Partial<GeolocationOptions> = {}) {
    this.options = { ...DEFAULT_GEOLOCATION_OPTIONS, ...options };
  }

  /**
   * Gets the user's current position using the browser's geolocation API
   */
  public async getCurrentPosition(): Promise<Coordinates> {
    if (!navigator.geolocation) {
      throw this.createError('POSITION_UNAVAILABLE', ERROR_MESSAGES.LOCATION.UNAVAILABLE);
    }

    try {
      const position = await Promise.race([
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              ...this.options,
              timeout: 10000 // 10 second timeout
            }
          );
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Location request timed out')), 10000)
        )
      ]);

      const { latitude, longitude } = position.coords;
      
      // Validate coordinates before returning
      if (!this.validateCoordinates(latitude, longitude)) {
        throw new Error('Invalid coordinates received from geolocation service');
      }
      
      return { latitude, longitude };
    } catch (error) {
      console.error('Geolocation error:', error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            throw this.createError('PERMISSION_DENIED', ERROR_MESSAGES.LOCATION.PERMISSION_DENIED);
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            throw this.createError('POSITION_UNAVAILABLE', ERROR_MESSAGES.LOCATION.UNAVAILABLE);
          case GeolocationPositionError.TIMEOUT:
            throw this.createError('TIMEOUT', ERROR_MESSAGES.LOCATION.TIMEOUT);
        }
      }
      
      // Handle timeout or other errors
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.LOCATION.UNAVAILABLE;
      throw this.createError('POSITION_UNAVAILABLE', message);
    }
  }

  /**
   * Gets the current location and converts it to an address
   */
  public async getCurrentLocationDetails(): Promise<LocationDetails> {
    const coords = await this.getCurrentPosition();
    
    try {
      const formattedAddress = await reverseGeocode(coords.latitude, coords.longitude);
      return {
        ...coords,
        formatted_address: formattedAddress
      };
    } catch (error) {
      throw this.createError(
        'REVERSE_GEOCODING_FAILED',
        'Failed to get address from coordinates'
      );
    }
  }

  /**
   * Converts an address to coordinates and returns location details
   */
  public async getLocationFromAddress(address: string): Promise<LocationDetails> {
    try {
      const location = await geocodeAddress(address);
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        formatted_address: location.formatted_address
      };
    } catch (error) {
      throw this.createError(
        'GEOCODING_FAILED',
        'Failed to get coordinates from address'
      );
    }
  }

  /**
   * Validates coordinates
   */
  public validateCoordinates(latitude: number, longitude: number): boolean {
    return (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Creates a standardized location error
   */
  private createError(
    type: GeolocationErrorType,
    message: string,
    originalError?: Error
  ): LocationError {
    const errorDetails: GeolocationErrorDetails = {
      type,
      message,
      originalError
    };
    return new LocationError(message, JSON.stringify(errorDetails));
  }
}

// Export a singleton instance with default options
export const geolocationService = new GeolocationService(); 