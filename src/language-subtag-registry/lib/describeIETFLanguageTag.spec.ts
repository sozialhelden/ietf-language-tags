import f from './describeIETFLanguageTag';

describe('f', () => {
  xit('simple language subtags', () => {
    expect(f('de')).toBe('German');
    expect(f('fr')).toBe('French');
    expect(f('ja')).toBe('Japanese');
  });

  xit('grandfathered tags', () => {
    expect(f('i-enochian')).toBe('Enochian (grandfathered tag)');
  });

  xit('Language subtag plus Script subtag', () => {
    expect(f('zh-Hant')).toBe('Chinese written using the Traditional Chinese script');
    expect(f('zh-Hans')).toBe('Chinese written using the Simplified Chinese script');
    expect(f('sr-Cyrl')).toBe('Serbian written using the Cyrillic script');
    expect(f('sr-Latn')).toBe('Serbian written using the Latin script');
  });

  xit('Extended language subtags and their primary language subtag counterparts', () => {
    expect(f('zh-cmn-Hans-CN')).toBe(
      'Chinese, Mandarin, written using the Simplified script, as used in China'
    );
    expect(f('cmn-Hans-CN')).toBe(
      'Mandarin Chinese, written using the Simplified script, as used in China'
    );
    expect(f('zh-yue-HK')).toBe('Chinese, Cantonese, as used in Hong Kong SAR');
    expect(f('yue-HK')).toBe('Cantonese Chinese, as used in Hong Kong SAR');
  });

  xit('Language-Script-Region', () => {
    expect(f('zh-Hans-CN')).toBe(
      'Chinese written using the Simplified script as used in mainland China'
    );
    expect(f('sr-Latn-RS')).toBe('Serbian written using the Latin script as used in Serbia');
  });

  xit('Language-Variant', () => {
    expect(f('sl-rozaj')).toBe('Resian dialect of Slovenian');
    expect(f('sl-rozaj-biske')).toBe('San Giorgio dialect of Resian dialect of Slovenian');
    expect(f('sl-nedis')).toBe('Nadiza dialect of Slovenian');
  });

  xit('Language-Region-Variant', () => {
    expect(f('de-CH-1901')).toBe(
      'German as used in Switzerland using the 1901 variant [orthography]'
    );
    expect(f('sl-IT-nedis')).toBe('Slovenian as used in Italy, Nadiza dialect');
  });

  xit('Language-Script-Region-Variant', () => {
    expect(f('hy-Latn-IT-arevela')).toBe(
      'Eastern Armenian written in Latin script, as used in Italy'
    );
  });

  xit('Language-Region', () => {
    expect(f('de-DE')).toBe('German as used in Germany');
    expect(f('en-US')).toBe('English as used in the United States');
    expect(f('es-419')).toBe(
      'Spanish appropriate for the Latin America and Caribbean region using the UN region code'
    );
  });

  xit('Private use subtags', () => {
    expect(f('de-CH-x-phonebk')).toBe('');
    expect(f('az-Arab-x-AZE-derbend')).toBe('');
  });

  xit('Private use registry values', () => {
    // private use using the singleton 'x'
    expect(f('x-whatever')).toBe('');
    // all private tags
    expect(f('qaa-Qaaa-QM-x-southern')).toBe('');
    // German, with a private script
    expect(f('de-Qaaa')).toBe('');
    // Serbian, Latin script, private region
    expect(f('sr-Latn-QM')).toBe('');
    // Serbian, private script, for Serbia
    expect(f('sr-Qaaa-RS')).toBe('');
  });

  xit('Some invalid tags', () => {
    // two region tags
    expect(f('de-419-DE')).toBeUndefined();
    // use of a single-character subtag in primary position; note that there are a few grandfathered tags that start with "i-" that are valid
    expect(f('a-DE')).toBeUndefined();
    // two extensions with same single-letter prefix
    expect(f('ar-a-aaa-b-bbb-a-ccc')).toBeUndefined();
  });
});
