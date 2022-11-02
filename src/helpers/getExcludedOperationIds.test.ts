import { describe, it, expect } from 'vitest';
import getExcludedOperationIds from './getExcludedOperationIds';

describe('Helpers - getExcludedOperationIds', () => {
  it('should return an array of operation ids to exclude', () => {
    expect(getExcludedOperationIds('')).toStrictEqual([]);
    expect(getExcludedOperationIds('toto')).toStrictEqual(['toto']);
    expect(getExcludedOperationIds('toto|titi')).toStrictEqual([
      'toto',
      'titi',
    ]);
    expect(getExcludedOperationIds('toto | titi')).toStrictEqual([
      'toto',
      'titi',
    ]);
    expect(getExcludedOperationIds('toto | titi|tata')).toStrictEqual([
      'toto',
      'titi',
      'tata',
    ]);
    expect(getExcludedOperationIds('to to | to')).toStrictEqual([
      'to to',
      'to',
    ]);
  });
});
