import { describeIETFLanguageTag as f } from '.';

describe('f', () => {
  describe('simple language subtags', () => {
    test('de', () => expect(f('de')).toBe('German'));
    test('fr', () => expect(f('fr')).toBe('French'));
    test('ja', () => expect(f('ja')).toBe('Japanese'));
  });

  describe('grandfathered tags', () => {
    test('i-enochian', () => {
      expect(f('i-enochian')).toBe('Enochian (grandfathered tag)');
    });
  });

  describe('Language subtag plus Script subtag', () => {
    test('zh-Hant', () => expect(f('zh-Hant')).toBe('Chinese, written in Han (Traditional variant) script'));
    test('zh-Hans', () => expect(f('zh-Hans')).toBe('Chinese, written in Han (Simplified variant) script'));
    test('sr-Cyrl', () => expect(f('sr-Cyrl')).toBe('Serbian, written in Cyrillic script'));
    test('sr-Latn', () => expect(f('sr-Latn')).toBe('Serbian, written in Latin script'));
  });

  describe('Extended language subtags and their primary language subtag counterparts', () => {
    test('zh-cmn-Hans-CN', () => expect(f('zh-cmn-Hans-CN')).toBe(
      'Mandarin Chinese, written in Han (Simplified variant) script, as used in China',
    ));
    test('cmn-Hans-CN', () => expect(f('cmn-Hans-CN')).toBe(
      'Mandarin Chinese, written in Han (Simplified variant) script, as used in China',
    ));
    test('zh-yue-HK', () => expect(f('zh-yue-HK')).toBe('Yue Chinese / Cantonese, as used in Hong Kong'));
    test('yue-HK', () => expect(f('yue-HK')).toBe('Yue Chinese / Cantonese, as used in Hong Kong'));
  });

  describe('Language-Script-Region', () => {
    test('zh-Hans-CN', () => expect(f('zh-Hans-CN')).toBe(
      'Chinese, written in Han (Simplified variant) script, as used in China',
    ));
    test('sr-Latn-RS', () => expect(f('sr-Latn-RS')).toBe('Serbian, written in Latin script, as used in Serbia'));
  });

  describe('Language-Variant', () => {
    test('sl-rozaj', () => expect(f('sl-rozaj')).toBe('Resian variant of Slovenian'));
    test('sl-rozaj-biske', () => expect(f('sl-rozaj-biske')).toBe(
      'Resian or San Giorgio dialect of Resian variant of Slovenian',
    ));
    test('sl-nedis', () => expect(f('sl-nedis')).toBe('Natisone dialect of Slovenian'));
  });

  describe('Language-Region-Variant', () => {
    test('de-CH-1901', () => expect(f('de-CH-1901')).toBe(
      'Traditional orthography variant of German, as used in Switzerland',
    ));
    test('sl-IT-nedis', () => expect(f('sl-IT-nedis')).toBe('Natisone dialect of Slovenian, as used in Italy'));
  });

  describe('Language-Script-Region-Variant', () => {
    test('hy-Latn-IT-arevela', () => expect(f('hy-Latn-IT-arevela')).toBe(
      'Eastern variant of Armenian, written in Latin script, as used in Italy',
    ));
  });

  describe('Language-Region', () => {
    test('de-DE', () => expect(f('de-DE')).toBe('German, as used in Germany'));
    test('en-US', () => expect(f('en-US')).toBe('English, as used in United States'));
    test('es-419', () => expect(f('es-419')).toBe('Spanish / Castilian, as used in Latin America and the Caribbean'));
  });

  describe('Private use subtags', () => {
    test('de-CH-x-phonebk', () => expect(f('de-CH-x-phonebk')).toBe(
      'German, as used in Switzerland (with private extension ‘x-phonebk’)',
    ));
    test('az-Arab-x-AZE-derbend', () => expect(f('az-Arab-x-AZE-derbend')).toBe(
      'Azerbaijani, written in Arabic script (with private extension ‘x-aze-derbend’)',
    ));
  });

  describe('Private use registry values', () => {
    test('x-whatever', () => expect(f('x-whatever')).toBe('private extension ‘x-whatever’'));
    test('qaa-Qaaa-QM-x-southern', () => expect(f('qaa-Qaaa-QM-x-southern')).toBe(
      'private use language ‘qaa’, written in private use script ‘Qaaa’ script, as used in private use region ‘QM’ (with private extension ‘x-southern’)',
    ));
    test('de-Qaaa', () => expect(f('de-Qaaa')).toBe('German, written in private use script ‘Qaaa’ script'));
    test('sr-Latn-QM', () => expect(f('sr-Latn-QM')).toBe(
      'Serbian, written in Latin script, as used in private use region ‘QM’',
    ));
    test('sr-Qaaa-RS', () => expect(f('sr-Qaaa-RS')).toBe(
      'Serbian, written in private use script ‘Qaaa’ script, as used in Serbia',
    ));
  });

  describe('Some invalid tags', () => {
    test('doesn’t accept two region tags', () => {
      expect(f('de-419-DE')).toBe('Invalid tag ‘de-419-DE’');
    });
    test('doesn’t accept use of a single-character subtag in primary position; note that there are a few grandfathered tags that start with "i-" that are valid', () => {
      expect(f('a-DE')).toBe('Invalid tag ‘a-DE’');
    });
    test('doesn’t accept two extensions with same single-letter prefix', () => {
      expect(f('ar-a-aaa-b-bbb-a-ccc')).toBe('Invalid tag ‘ar-a-aaa-b-bbb-a-ccc’');
    });
  });
});
