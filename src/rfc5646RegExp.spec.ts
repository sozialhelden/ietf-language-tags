import { createRFC5646Regexp } from '.';

const regexp = createRFC5646Regexp();

describe('createRFC5646Regexp()', () => {
  it('creates a RegExp', () => {
    expect(regexp).toBeInstanceOf(RegExp);
  });

  describe('matching valid tags', () => {
    it('matches an obscure tag', () => {
      const match = 'zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1'.match(regexp);
      expect(match).toBeInstanceOf(Array);
      if (!match) {
        throw new Error('RegExp must match the given string.');
      }
      const groups = match.groups;

      expect(groups).toEqual({
        extensions: '-a-extend1',
        extlang: 'yue',
        langtag: 'zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1',
        language: 'zh-yue',
        privateuse: 'x-foobar-private1',
        privateuse2: undefined,
        region: 'CN',
        script: 'Latn',
        variants: '-pinyin',
      });
    });
  });

  it('does not match the most basic invalid tags', () => {
    const match = 'zhzhzhzhzhzh-Latn-CN-pinyin-a-extend1-x-foobar-private1-abc-def-ghi-jkl-mno-pqr'.match(
      regexp
    );
    expect(match).toBeNull();
  });
});
