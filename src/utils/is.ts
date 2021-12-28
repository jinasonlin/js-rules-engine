/**
 * Determines if a reference is `undefined`.
 *
 * @param value Reference to check.
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

/**
 * Determines if a reference is defined.
 *
 * @param value Reference to check.
 */
export function isDefined(value: any): boolean {
  return typeof value !== 'undefined';
}

/**
 * Determines if a reference is a `String`.
 *
 * @param value Reference to check.
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Determines if a reference is an 'Object'.
 *
 * @param value Reference to check.
 */
export function isObject(value: any): value is Record<string, unknown> {
  return typeof value === 'object';
}

/**
 * Determines if a reference is an `Array`.
 *
 * @param value Reference to check.
 */
export function isArray<T = any>(value: any): value is T[] | readonly T[] {
  return Array.isArray(value);
}

/**
 * Determines if a reference is `null`.
 *
 * @param value Reference to check.
 */
export function isNull(value: any): value is null {
  return value === null;
}