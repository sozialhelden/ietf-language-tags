import { getSubTag as f } from '.';

describe('getSubTag()', () => {
  it('returns a region subtag requested in uppercase', () => {
    expect(f('region', 'RS')).toMatchObject({ Description: ['Serbia'] });
  });

  it('returns a region subtag requested in lowercase', () => {
    expect(f('region', 'sr')).toMatchObject({ Description: ['Suriname'] });
  });

  it('returns a private-use region subtag', () => {
    expect(f('region', 'qz')).toMatchObject({ Description: ['Private use'] });
  });

  it('returns a collection subtag', () => {
    expect(f('collection', 'sgn')).toMatchObject({ Description: ['Sign languages'] });
  });

  it('returns a extlang subtag', () => {
    expect(f('extlang', 'hsn')).toMatchObject({ Description: ['Xiang Chinese'] });
  });

  it('returns a grandfathered subtag', () => {
    expect(f('grandfathered', 'i-klingon')).toMatchObject({ 'Preferred-Value': 'tlh' });
  });

  it('returns a language subtag', () => {
    expect(f('language', 'ker')).toMatchObject({ Description: ['Kera'] });
  });

  it('returns a macrolanguage subtag', () => {
    expect(f('macrolanguage', 'zh')).toMatchObject({ Description: ['Chinese'] });
  });

  it('returns a known privateuse subtag', () => {
    expect(f('privateuse', 'qaa')).toMatchObject({ Description: ['Private use'] });
  });

  it('returns another known privateuse subtag', () => {
    expect(f('privateuse', 'qbb')).toMatchObject({ Description: ['Private use'] });
  });

  it('returns a redundant subtag', () => {
    expect(f('redundant', 'de-ch-1996')).toMatchObject({
      Description: ['German, Swiss variant, orthography of 1996'],
    });
  });

  it('returns a script subtag', () => {
    expect(f('script', 'Hans')).toMatchObject({ Description: ['Han (Simplified variant)'] });
  });

  it('returns a private-use script subtag', () => {
    expect(f('script', 'Qaaa')).toMatchObject({ Description: ['Private use'] });
  });

  it('returns a special subtag', () => {
    expect(f('special', 'und')).toMatchObject({ Description: ['Undetermined'] });
  });

  it('returns a variant subtag', () => {
    expect(f('variant', 'xsistemo')).toMatchObject({
      Description: ['Standard X-system orthographic fallback for spelling Esperanto'],
    });
  });

  it('returns `undefined`', () => {
    expect(f('variant', 'This does not exist!')).toBeUndefined();
  });
});
