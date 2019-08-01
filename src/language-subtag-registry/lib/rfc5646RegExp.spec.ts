import createRFC5646Regexp from './rfc5646Regexp';

const regexp = createRFC5646Regexp();

xdescribe('createRFC5646Regexp()', () => {
  it('creates a RegExp', () => {
    expect(regexp).toBeInstanceOf(RegExp);
  });

  describe('matching valid tags', () => {
    it('', () => {
      const match = 'zh-Latn-CN-pinyin-a-extend1-x-foobar-private1'.match(regexp);
      expect(match).toBeInstanceOf(Array);
      if (!match) {
        throw new Error('RegExp must match the given string.');
      }
      const groups = match.groups;

      expect(groups).toMatchObject({
        extension: 'a-extend1',
        language: 'zh',
        privateuse: 'x-foobar-private1',
        region: 'CN',
        script: 'Latn',
        variant: 'pinyin',
      });
    });
  });

  xit('does not match the most basic invalid tags', () => {
    const match = 'zhzhzhzhzhzh-Latn-CN-pinyin-a-extend1-x-foobar-private1-abc-def-ghi-jkl-mno-pqr'.match(
      regexp
    );
    expect(match).toBeNull();
  });
});
