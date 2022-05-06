import { parseLanguageTag as f } from '.';

describe('parseLanguageTag()', () => {
  describe('reactions to valid tags', () => {
    it('accepts simple language subtags', () => {
      expect(f('de')).toEqual({
        langtag: 'de',
        language: 'de',
      });
      expect(f('fr')).toEqual({
        langtag: 'fr',
        language: 'fr',
      });
      expect(f('ja')).toEqual({
        langtag: 'ja',
        language: 'ja',
      });
    });

    it('accepts grandfathered tags', () => {
      expect(f('i-enochian')).toEqual({
        grandfathered: 'i-enochian',
      });
    });

    it('accepts Language subtag plus Script subtag', () => {
      expect(f('zh-Hant')).toEqual({
        langtag: 'zh-Hant',
        language: 'zh',
        script: 'Hant',
      });
      expect(f('zh-Hans')).toEqual({
        langtag: 'zh-Hans',
        language: 'zh',
        script: 'Hans',
      });
      expect(f('sr-Cyrl')).toEqual({
        langtag: 'sr-Cyrl',
        language: 'sr',
        script: 'Cyrl',
      });
      expect(f('sr-Latn')).toEqual({
        langtag: 'sr-Latn',
        language: 'sr',
        script: 'Latn',
      });
    });

    it('accepts Extended language subtags and their primary language subtag counterparts', () => {
      expect(f('zh-cmn-Hans-CN')).toEqual({
        extlang: 'cmn',
        langtag: 'zh-cmn-Hans-CN',
        language: 'zh-cmn',
        region: 'CN',
        script: 'Hans',
      });
      expect(f('cmn-Hans-CN')).toEqual({
        langtag: 'cmn-Hans-CN',
        language: 'cmn',
        region: 'CN',
        script: 'Hans',
      });
      expect(f('zh-yue-HK')).toEqual({
        extlang: 'yue',
        langtag: 'zh-yue-HK',
        language: 'zh-yue',
        region: 'HK',
      });
      expect(f('yue-HK')).toEqual({
        langtag: 'yue-HK',
        language: 'yue',
        region: 'HK',
      });
    });

    it('accepts Language-Script-Region', () => {
      expect(f('zh-Hans-CN')).toEqual({
        langtag: 'zh-Hans-CN',
        language: 'zh',
        region: 'CN',
        script: 'Hans',
      });
      expect(f('sr-Latn-RS')).toEqual({
        langtag: 'sr-Latn-RS',
        language: 'sr',
        region: 'RS',
        script: 'Latn',
      });
    });

    it('accepts Language-Variant', () => {
      expect(f('zh-pinyin')).toEqual({
        langtag: 'zh-pinyin',
        language: 'zh',
        variants: ['pinyin'],
      });
      expect(f('sl-rozaj')).toEqual({
        langtag: 'sl-rozaj',
        language: 'sl',
        variants: ['rozaj'],
      });
      expect(f('sl-rozaj-biske')).toEqual({
        langtag: 'sl-rozaj-biske',
        language: 'sl',
        variants: ['rozaj', 'biske'],
      });
      expect(f('sl-nedis')).toEqual({
        langtag: 'sl-nedis',
        language: 'sl',
        variants: ['nedis'],
      });
    });

    it('accepts Language-Region-Variant', () => {
      expect(f('de-CH-1901')).toEqual({
        langtag: 'de-CH-1901',
        language: 'de',
        region: 'CH',
        variants: ['1901'],
      });
      expect(f('sl-IT-nedis')).toEqual({
        langtag: 'sl-IT-nedis',
        language: 'sl',
        region: 'IT',
        variants: ['nedis'],
      });
    });

    it('accepts Language-Script-Region-Variant', () => {
      expect(f('hy-Latn-IT-arevela')).toEqual({
        langtag: 'hy-Latn-IT-arevela',
        language: 'hy',
        region: 'IT',
        script: 'Latn',
        variants: ['arevela'],
      });
    });

    it('accepts Language-Region', () => {
      expect(f('de-DE')).toEqual({
        langtag: 'de-DE',
        language: 'de',
        region: 'DE',
      });
      expect(f('en-US')).toEqual({
        langtag: 'en-US',
        language: 'en',
        region: 'US',
      });
      expect(f('es-419')).toEqual({
        langtag: 'es-419',
        language: 'es',
        region: '419',
      });
    });

    it('normalizes case of the given subtags according to common practice', () => {
      expect(f('en-us')).toEqual({
        langtag: 'en-US',
        language: 'en',
        region: 'US',
      });
      expect(f('SR-qAAA-rs-A-TEsT-0-foobar-X-PhOnEbK')).toEqual({
        extensions: {
          0: 'foobar',
          a: 'test',
        },
        langtag: 'sr-Qaaa-RS-a-test-0-foobar-x-phonebk',
        language: 'sr',
        privateuse: 'x-phonebk',
        region: 'RS',
        script: 'Qaaa',
      });
    });

    it('accepts private use subtags', () => {
      expect(f('de-CH-x-phonebk')).toEqual({
        langtag: 'de-CH-x-phonebk',
        language: 'de',
        privateuse: 'x-phonebk',
        region: 'CH',
      });
      expect(f('az-Arab-x-AZE-derbend')).toEqual({
        langtag: 'az-Arab-x-aze-derbend',
        language: 'az',
        privateuse: 'x-aze-derbend',
        script: 'Arab',
      });
    });

    it('accepts private use registry values', () => {
      // private use using the singleton 'x'
      expect(f('x-whatever')).toEqual({
        privateuse: 'x-whatever',
      });
      // all private tags
      expect(f('qaa-Qaaa-QM-x-southern')).toEqual({
        langtag: 'qaa-Qaaa-QM-x-southern',
        language: 'qaa',
        privateuse: 'x-southern',
        region: 'QM',
        script: 'Qaaa',
      });
      // German, with a private script
      expect(f('de-Qaaa')).toEqual({
        langtag: 'de-Qaaa',
        language: 'de',
        script: 'Qaaa',
      });
      // Serbian, Latin script, private region
      expect(f('sr-Latn-QM')).toEqual({
        langtag: 'sr-Latn-QM',
        language: 'sr',
        region: 'QM',
        script: 'Latn',
      });
      // Serbian, private script, for Serbia
      expect(f('sr-Qaaa-RS')).toEqual({
        langtag: 'sr-Qaaa-RS',
        language: 'sr',
        region: 'RS',
        script: 'Qaaa',
      });
    });
  });

  describe('reactions to invalid tags', () => {
    it('prints errors to the console when supplying `true` as second parameter', () => {
      let loggedString;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation((s) => { loggedString = s; });
      expect(f('a-DE', true)).toBeUndefined();
      expect(loggedString).toMatch(/Could not interpret ‘a-DE’/);
      consoleSpy.mockRestore();
    });

    it("doesn't accept empty strings as tags", () => {
      expect(() => f('', false)).toThrowError(/empty/);
      expect(f('', true)).toBeUndefined();
    });

    it("doesn't accept underscores in tags, as they are a typical mistake", () => {
      expect(() => f('en_NZ', false)).toThrowError(/underscore/);
      expect(f('en_NZ', true)).toBeUndefined();
    });

    it("doesn't accept two region tags (not ignoring the error, throwing)", () => {
      expect(() => f('de-419-DE', false)).toThrowError(/de-419-DE/);
    });

    it('doesn\'t accept use of a single-character subtag in primary position; note that there are a few grandfathered tags that start with "i-" that are valid', () => {
      expect(() => f('a-DE', false)).toThrowError(/Could not interpret ‘a-DE’/);
    });

    it("doesn't accept two extensions with same single-letter prefix", () => {
      expect(() => f('ar-a-aaa-b-bbb-a-ccc', false)).toThrowError(/‘ar-a-aaa-b-bbb-a-ccc’/);
    });

    it("doesn't accept tags with the same variant twice", () => {
      expect(() => f('de-DE-1901-1901', false)).toThrowError(/‘1901’/);
      expect(f('de-DE-1901-1901', true)).toBeUndefined();
    });
  });
});
