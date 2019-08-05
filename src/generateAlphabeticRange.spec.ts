import { generateAlphabeticRange } from '.';
import { nextString } from './generateAlphabeticRange';

describe('nextString()', () => {
  it("returns 'a' when given empty string", () => {
    expect(nextString('')).toBe('a');
  });

  it('counts up alphabetically', () => {
    expect(nextString('a')).toBe('b');
  });

  it("wraps to 'aa' after 'z'", () => {
    expect(nextString('z')).toBe('aa');
  });

  it('carries wrapping over more than once', () => {
    expect(nextString('bzzz')).toBe('caaa');
  });
});

describe('generateAlphabeticRange()', () => {
  it("wraps after 'z'", () => {
    expect(generateAlphabeticRange('z..aa')).toEqual(['z', 'aa']);
  });

  it('works when given a single string with no range', () => {
    expect(generateAlphabeticRange('aaa')).toEqual(['aaa']);
  });

  it('works with ..', () => {
    expect(generateAlphabeticRange('a..c')).toEqual(['a', 'b', 'c']);
  });

  it('works with ...', () => {
    expect(generateAlphabeticRange('a...c')).toEqual(['a', 'b', 'c']);
  });

  it('produces sequences with varying length', () => {
    expect(generateAlphabeticRange('y...ab')).toEqual(['y', 'z', 'aa', 'ab']);
  });

  it('produces a longer sequence', () => {
    expect(generateAlphabeticRange('z...bb')).toEqual([
      'z',
      'aa',
      'ab',
      'ac',
      'ad',
      'ae',
      'af',
      'ag',
      'ah',
      'ai',
      'aj',
      'ak',
      'al',
      'am',
      'an',
      'ao',
      'ap',
      'aq',
      'ar',
      'as',
      'at',
      'au',
      'av',
      'aw',
      'ax',
      'ay',
      'az',
      'ba',
      'bb',
    ]);
  });

  it('throws if beginning is missing', () => {
    expect(() => generateAlphabeticRange('...ab')).toThrowError(/beginning/);
  });

  it('can exclude the end if wanted', () => {
    expect(generateAlphabeticRange('aaaaa..aaaad', false)).toEqual(['aaaaa', 'aaaab', 'aaaac']);
    expect(generateAlphabeticRange('z..aa', false)).toEqual(['z']);
  });
});
