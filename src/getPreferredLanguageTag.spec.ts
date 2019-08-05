import { getPreferredLanguageTag } from '.';

describe('getPreferredLanguageTag()', () => {
  it('returns a shorter tag', () => {
    expect(getPreferredLanguageTag('zh-yue')).toBe('yue');
  });

  it('works with Klingon', () => {
    expect(getPreferredLanguageTag('i-klingon')).toBe('tlh');
  });
});
