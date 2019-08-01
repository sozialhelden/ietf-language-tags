import nameTags from './fixtures/nameTags';
import getLocaleFromOSMCode from './getLocaleFromOSMCode';

describe('getLocaleFromOSMCode()', () => {
  describe('Language-specific codes', () => {
    xit('works with `zh`', () => {
      // Non-standard
      expect(getLocaleFromOSMCode('zh-pinyin')).toMatchObject({
        language: 'zh',
        script: 'Latn',
        variant: 'pinyin',
      });
      expect(getLocaleFromOSMCode('zh-zhuyin')).toMatchObject({
        language: 'zh',
        script: 'Latn',
        variant: 'zhuyin',
      });
      expect(getLocaleFromOSMCode('zh_pinyin')).toMatchObject({
        language: 'zh',
        script: 'Latn',
        variant: 'pinyin',
      });
      expect(getLocaleFromOSMCode('zh_zhuyin')).toMatchObject({
        language: 'zh',
        script: 'Latn',
        variant: 'zhuyin',
      });

      // Standard
      expect(getLocaleFromOSMCode('zh-Hans')).toMatchObject({ language: 'zh', script: 'Hans' });
      expect(getLocaleFromOSMCode('zh-Hans-CN')).toMatchObject({
        language: 'zh',
        region: 'CN',
        script: 'Hans',
      });
    });

    // http://www.personal.psu.edu/ejp10/blogs/gotunicode/2007/05/picking-the-right-cantonese-la.html
    describe('Cantonese', () => {
      // zh - yue;
      // zh - HK;
      // yue;
    });
    describe('kr', () => {});
    describe('Arabic', () => {
      // ar1;
    });
    describe('ar', () => {});
  });
  describe('Country-specific', () => {
    describe('Japan', () => {});
    describe('Morocco', () => {});
    describe('Morocco', () => {});
  });
});
