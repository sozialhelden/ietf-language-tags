import { getTag } from '.';

describe('getTag()', () => {
  it('returns undefined for an undefined tag', () => {
    expect(getTag('', true)).toBeUndefined();
  });

  it('returns an object with registry references + parsed meta infos', () => {
    expect(getTag('zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1')).toEqual({
      extlang: {
        Added: '2009-07-29',
        Description: ['Yue Chinese', 'Cantonese'],
        Macrolanguage: 'zh',
        'Preferred-Value': 'yue',
        Prefix: ['zh'],
        Subtag: 'yue',
        Type: 'extlang',
      },
      parts: {
        extensions: {
          a: 'extend1',
        },
        extlang: 'yue',
        langtag: 'zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1',
        language: 'zh-yue',
        privateuse: 'x-foobar-private1',
        region: 'CN',
        script: 'Latn',
        variants: ['pinyin'],
      },
      privateuse: 'x-foobar-private1',
      region: {
        Added: '2005-10-16',
        Description: ['China'],
        Subtag: 'CN',
        Type: 'region',
      },
      script: {
        Added: '2005-10-16',
        Description: ['Latin'],
        Subtag: 'Latn',
        Type: 'script',
      },
      variants: [
        {
          Added: '2008-10-14',
          Description: ['Pinyin romanization'],
          Prefix: ['zh-Latn', 'bo-Latn'],
          Subtag: 'pinyin',
          Type: 'variant',
        },
      ],
    });
  });
});
