import { ApiError } from '@/types';

export class AppError extends Error implements ApiError {
  code?: string;
  details?: string;
  hint?: string;

  constructor(message: string, options?: { code?: string; details?: string; hint?: string }) {
    super(message);
    this.name = 'AppError';
    if (options) {
      this.code = options.code;
      this.details = options.details;
      this.hint = options.hint;
    }
  }
}

export class LocationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, { 
      code: 'LOCATION_ERROR',
      details 
    });
    this.name = 'LocationError';
  }
}

export class SearchError extends AppError {
  constructor(message: string, details?: string) {
    super(message, { 
      code: 'SEARCH_ERROR',
      details 
    });
    this.name = 'SearchError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, { 
      code: 'VALIDATION_ERROR',
      details 
    });
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError(
    typeof error === 'string' ? error : 'An unexpected error occurred'
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function formatErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
} 