import {
  isUndefined,
  isDefined,
  isString,
  isObject,
  isArray,
  isNull,
} from './is';

describe('is methods', () => {
  it('ensure value is an array', () => {
    expect(isArray([])).toEqual(true);
  });

  it('ensure value is defined', () => {
    expect(isDefined(83)).toEqual(true);
  });

  it('ensure value is null', () => {
    expect(isNull(null)).toEqual(true);
  });

  it('ensure value is an object', () => {
    expect(isObject({})).toEqual(true);
  });

  it('ensure value is a string', () => {
    expect(isString('')).toEqual(true);
  });

  it('ensure value is undefined', () => {
    expect(isUndefined(undefined)).toEqual(true);
  });
});
