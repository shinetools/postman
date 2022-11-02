import { describe, it, expect } from 'vitest';
import getBasePathFromURN from './getBasePathFromURN';

describe('Helpers - getBasePathFromURN', () => {
  it('should return an empty string if input is not an URN', () => {
    expect(getBasePathFromURN('')).toBe('');
    expect(getBasePathFromURN('Hi everybody')).toBe('');
    expect(getBasePathFromURN('this-is-not-an-urn')).toBe('');
    expect(getBasePathFromURN('this/is/not/an/urn')).toBe('');
  });

  it('should return a base path based on an URN', () => {
    expect(getBasePathFromURN('something-v2.endpoints.other.todo')).toBe(
      '/v2/something',
    );

    expect(getBasePathFromURN('other-thing-v2.endpoints.other.todo')).toBe(
      '/v2/other_thing',
    );

    expect(
      getBasePathFromURN('other-thing-again-v3.endpoints.other.todo'),
    ).toBe('/v3/other_thing_again');
  });
});
