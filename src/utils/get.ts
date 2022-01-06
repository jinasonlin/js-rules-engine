import { isDefined, isUndefined, isObject, isString, isArray, isNull } from './is';

/**
 * Regex to test if a string is a valid array index key.
 */
const indexer = /^[0-9]+$/;

/**
 * Disallowed keys.
 */
const disallowed: string[] = ['__proto__', 'prototype', 'constructor'];

/**
 * Split a dot notation string into parts.
 *
 * Examples:
 * - `obj.value` => `['obj', 'value']`
 * - `obj.ary[0].value` => `['obj', 'ary', '0', 'value']`
 * - `obj.ary[*].value` => `['obj', 'ary', 'value']`
 *
 * @param path Dot notation string.
 */
function getParts(path: string): string[] {
  const parts: string[] = path
    .split(/[.]|(?:\[(\d|\*)\])/)
    .filter((item) => !!item);

  if (parts.some((x) => disallowed.indexOf(x) !== -1)) {
    return [];
  }

  return parts;
}

/**
 * Get object property value.
 *
 * @param obj Object to get value from.
 * @param path Dot notation string.
 * @param value Optional default value to return if path is not found.
 */
export default (obj: any, path: string, value?: any): any => {
  const defaultValue: any = isDefined(value) ? value : undefined;

  if (!isObject(obj) || !isString(path)) {
    return defaultValue;
  }

  const parts: string[] = getParts(path);

  if (parts.length === 0) {
    return defaultValue;
  }

  let nest = false;

  for (const key of parts) {
    if (key === '*') {
      nest = true;
      continue;
    }

    if (isArray(obj) && nest && !indexer.test(key)) {
      obj = obj.map((item) => isObject(item) && !isNull(item) ? item[key] : undefined);
    } else {
      obj = obj[key];
    }

    nest = false;

    if (isUndefined(obj) || isNull(obj)) {
      break;
    }
  }

  return isUndefined(obj) ? defaultValue : obj;
}
