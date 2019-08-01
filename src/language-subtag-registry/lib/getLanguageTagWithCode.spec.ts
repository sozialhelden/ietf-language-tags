import f from './getLanguageTagWithCode';

describe('getLanguageTagWithCode', () => {
  it('simple language subtags', () => {
    expect(f('de')).toEqual({
      language: 'de',
    });
    expect(f('fr')).toEqual({
      language: 'fr',
    });
    expect(f('ja')).toEqual({
      language: 'ja',
    });
  });

  it('grandfathered tags', () => {
    expect(f('i-enochian')).toEqual({
      grandfathered: 'i-enochian',
    });
  });

  it('Language subtag plus Script subtag', () => {
    expect(f('zh-Hant')).toEqual({
      language: 'zh',
      script: 'Hant',
    });
    expect(f('zh-Hans')).toEqual({
      language: 'zh',
      script: 'Hans',
    });
    expect(f('sr-Cyrl')).toEqual({
      language: 'sr',
      script: 'Cyrl',
    });
    expect(f('sr-Latn')).toEqual({
      language: 'sr',
      script: 'Latn',
    });
  });

  xit('Extended language subtags and their primary language subtag counterparts', () => {
    expect(f('zh-cmn-Hans-CN')).toEqual({
      language: 'zh-cmn',
      region: 'CN',
      script: 'Hans',
    });
    expect(f('cmn-Hans-CN')).toEqual({
      language: 'cmn',
      region: 'CN',
      script: 'Hans',
    });
    expect(f('zh-yue-HK')).toEqual({
      language: 'zh-yue',
      region: 'HK',
    });
    expect(f('yue-HK')).toEqual({
      language: 'yue',
      region: 'HK',
    });
  });

  it('Language-Script-Region', () => {
    expect(f('zh-Hans-CN')).toEqual({
      language: 'zh',
      region: 'CN',
      script: 'Hans',
    });
    expect(f('sr-Latn-RS')).toEqual({
      language: 'sr',
      region: 'RS',
      script: 'Latn',
    });
  });

  it('Language-Variant', () => {
    expect(f('zh-pinyin')).toEqual({
      language: 'zh',
      variant: 'pinyin',
    });
    expect(f('sl-rozaj')).toEqual({
      language: 'sl',
      variant: 'rozaj',
    });
    expect(f('sl-rozaj-biske')).toEqual({
      language: 'sl',
      variant: ['rozaj', 'biske'],
    });
    expect(f('sl-nedis')).toEqual({
      language: 'sl',
      variant: 'nedis',
    });
  });

  xit('Language-Region-Variant', () => {
    expect(f('de-CH-1901')).toEqual({
      language: 'de',
      region: 'CH',
      variant: '1901',
    });
    expect(f('sl-IT-nedis')).toEqual({
      language: 'sl',
      region: 'IT',
      variant: 'nedis',
    });
  });

  xit('Language-Script-Region-Variant', () => {
    expect(f('hy-Latn-IT-arevela')).toEqual({
      language: 'hy',
      region: 'IT',
      script: 'Latn',
      variant: 'arevela',
    });
  });

  it('Language-Region', () => {
    expect(f('de-DE')).toEqual({
      language: 'de',
      region: 'DE',
    });
    expect(f('en-US')).toEqual({
      language: 'en',
      region: 'US',
    });
    expect(f('es-419')).toEqual({
      language: 'es',
      region: '419',
    });
  });

  it('Private use subtags', () => {
    expect(f('de-CH-x-phonebk')).toEqual({
      language: 'de',
      privateuse: 'x-phonebk',
      region: 'CH',
    });
    expect(f('az-Arab-x-AZE-derbend')).toEqual({
      language: 'az',
      privateuse: 'x-AZE-derbend',
      script: 'Arab',
    });
  });

  xit('Private use registry values', () => {
    // private use using the singleton 'x'
    expect(f('x-whatever')).toEqual({
      privateuse: 'x-whatever',
    });
    // all private tags
    expect(f('qaa-Qaaa-QM-x-southern')).toEqual({
      language: 'qaa',
      privateuse: 'x-southern',
      region: 'QM',
      script: 'Qaaa',
    });
    // German, with a private script
    expect(f('de-Qaaa')).toEqual({
      language: 'az',
      privateuse: 'x-AZE-derbend',
      script: 'Arab',
    });
    // Serbian, Latin script, private region
    expect(f('sr-Latn-QM')).toEqual({
      language: 'sr',
      region: 'QM',
      script: 'Latn',
    });
    // Serbian, private script, for Serbia
    expect(f('sr-Qaaa-RS')).toEqual({
      language: 'sr',
      region: 'SR',
      script: 'Qaaa',
    });
  });

  xdescribe('Some invalid tags', () => {
    it('does not accept two region tags', () => {
      expect(f('de-419-DE')).toBeUndefined();
    });
    it('does not accept use of a single-character subtag in primary position; note that there are a few grandfathered tags that start with "i-" that are valid', () => {
      expect(f('a-DE')).toBeUndefined();
    });
    it('does not accept two extensions with same single-letter prefix', () => {
      expect(f('ar-a-aaa-b-bbb-a-ccc')).toBeUndefined();
    });
    it('does not accept tags with the same variant twice', () => {
      expect(f('de-DE-1901-1901')).toBeUndefined();
    });
  });
});
