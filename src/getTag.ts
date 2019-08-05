import getSubTag from './getSubTag';
import parseLanguageTag from './parseLanguageTag';
import { ILanguageSubtag, ILanguageTag } from './types';

const fields: Array<keyof ILanguageTag> = [
  'language',
  'extlang',
  'grandfathered',
  'redundant',
  'region',
  'script',
  'variants',
  'collection',
  'macrolanguage',
  'privateuse',
  'special',
];

export function expandTag(parsedLanguageTag: ILanguageSubtag): ILanguageTag | undefined {
  const languageTag: ILanguageTag = { parts: parsedLanguageTag };

  fields.forEach(type => {
    const subTagObjectOrNameString = (parsedLanguageTag as any)[type];
    if (!subTagObjectOrNameString || type === 'parts') {
      return;
    }
    if (
      type === 'langtag' ||
      type === 'extensions' ||
      type === 'privateuse' ||
      type === 'special'
    ) {
      languageTag[type] = subTagObjectOrNameString;
      return;
    }
    if (type === 'variants') {
      languageTag.variants = subTagObjectOrNameString.map((variant: string) =>
        getSubTag('variant', variant)
      );
      return;
    }
    const subTag = getSubTag(type, subTagObjectOrNameString);
    if (subTag) {
      languageTag[type] = subTag;
    }
  });

  return languageTag;
}

export default function getTag(tag: string): ILanguageTag | undefined {
  const parsedLanguageTag = parseLanguageTag(tag);
  if (!parsedLanguageTag) {
    return undefined;
  }

  return expandTag(parsedLanguageTag);
}
