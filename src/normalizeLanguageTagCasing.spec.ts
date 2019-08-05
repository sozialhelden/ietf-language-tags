import { normalizeLanguageTagCasing as f } from '.';

describe('normalizeLanguageTagCasing()', () => {
  it('changes region code subtags to uppercase', () => {
    expect(f('de-de')).toBe('de-DE');
    expect(f('sGn-Be-fR')).toBe('sgn-BE-FR');
  });

  it('does not break when using numbers as region subtags', () => {
    expect(f('de-276')).toBe('de-276');
  });

  it('changes language code subtags to lowercase', () => {
    expect(f('En')).toBe('en');
    expect(f('dE-1901')).toBe('de-1901');
  });

  it('title-cases script subtags', () => {
    expect(f('zh-haNs')).toBe('zh-Hans');
  });

  it('lowercases extensions or private use tags', () => {
    expect(f('x-BLAM')).toBe('x-blam');
    expect(f('a-sLoRp')).toBe('a-slorp');
  });

  it('does not uppercase substrings that look like region subtags but are part private use subtags', () => {
    expect(f('en-ca-x-CA')).toBe('en-CA-x-ca');
  });

  it('does not uppercase the first letter of a subtag that looks like a script but is a private use subtag', () => {
    expect(f('az-laTn-x-latN')).toBe('az-Latn-x-latn');
  });

  it('does not title-case subtags that look like scripts after singletons', () => {
    expect(f('SR-qAAA-rs-A-TEsT-0-foobar-x-PhOnEbK')).toBe('sr-Qaaa-RS-a-test-0-foobar-x-phonebk');
  });
});
