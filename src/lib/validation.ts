export function validateOrThrow(value: any, fieldName: string, min?: number, max?: number): number {
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