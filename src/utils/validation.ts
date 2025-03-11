import { ValidationResult, SearchParams, SearchFilters, Notary } from '@/types';
import { ValidationError } from './error';

export function validateSearchParams(params: Partial<SearchParams>): ValidationResult {
  const errors: Record<string, string> = {};

  if (params.latitude === undefined || params.latitude < -90 || params.latitude > 90) {
    errors.latitude = 'Invalid latitude value';
  }

  if (params.longitude === undefined || params.longitude < -180 || params.longitude > 180) {
    errors.longitude = 'Invalid longitude value';
  }

  if (params.radius !== undefined && (params.radius <= 0 || params.radius > 500)) {
    errors.radius = 'Radius must be between 0 and 500 miles';
  }

  if (params.limit !== undefined && (params.limit <= 0 || params.limit > 100)) {
    errors.limit = 'Limit must be between 1 and 100';
  }

  if (params.min_rating !== undefined && (params.min_rating < 0 || params.min_rating > 5)) {
    errors.min_rating = 'Rating must be between 0 and 5';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateSearchFilters(filters: Partial<SearchFilters>): ValidationResult {
  const errors: Record<string, string> = {};

  if (filters.services && !Array.isArray(filters.services)) {
    errors.services = 'Services must be an array';
  }

  if (filters.rating !== undefined && (filters.rating < 0 || filters.rating > 5)) {
    errors.rating = 'Rating must be between 0 and 5';
  }

  if (filters.radius !== undefined && filters.radius <= 0) {
    errors.radius = 'Radius must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateNotaryData(notary: Partial<Notary>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!notary.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!notary.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(notary.email)) {
    errors.email = 'Invalid email format';
  }

  if (!notary.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(notary.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!notary.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!notary.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!notary.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!notary.zip?.trim()) {
    errors.zip = 'ZIP code is required';
  } else if (!isValidZip(notary.zip)) {
    errors.zip = 'Invalid ZIP code format';
  }

  if (notary.latitude === undefined || notary.latitude < -90 || notary.latitude > 90) {
    errors.latitude = 'Invalid latitude value';
  }

  if (notary.longitude === undefined || notary.longitude < -180 || notary.longitude > 180) {
    errors.longitude = 'Invalid longitude value';
  }

  if (notary.service_radius_miles !== undefined && notary.service_radius_miles <= 0) {
    errors.service_radius_miles = 'Service radius must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?1?\d{10,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

function isValidZip(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

export function validateOrThrow<T>(data: T, validator: (data: T) => ValidationResult): T {
  const result = validator(data);
  if (!result.isValid) {
    throw new ValidationError(
      'Validation failed',
      Object.entries(result.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ')
    );
  }
  return data;
} 