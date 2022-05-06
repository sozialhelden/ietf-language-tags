import { compact } from 'lodash';
import { expandTag } from './getTag';
import parseLanguageTag from './parseLanguageTag';
import { ILanguageSubtag, ILanguageTag } from './types';

function wrapPrivateUse(
  type: keyof ILanguageSubtag,
  tag: ILanguageTag,
  descriptionArray: string[],
): string[] {
  if (descriptionArray[0] === 'Private use') {
    return [`private use ${type} ‘${tag.parts[type]}’`];
  }
  return descriptionArray;
}

export default function describeIETFLanguageTag(tag: string) {
  const parsedLanguageTag = parseLanguageTag(tag, true, null);
  if (!parsedLanguageTag) {
    return `Invalid tag ‘${tag}’`;
  }

  const languageTag = expandTag(parsedLanguageTag) as ILanguageTag;

  const languageName = languageTag
    && languageTag.language
    && languageTag.language.Description
    && languageTag.language.Description[0];

  const variantString = languageTag.variants
    && languageTag.variants
      .map((v) => v.Description[0]
        .replace(/^The /, '')
        .replace(languageName || '', '')
        .replace(/^, /, ''))
      .join(' or ');

  const variantPrefix = languageTag.variants
    ? `${variantString}${variantString && variantString.match(/dialect$/) ? '' : ' variant'} of `
    : '';

  const privateUseSuffix = languageTag.privateuse
    ? `private extension ‘${languageTag.privateuse}’`
    : '';

  let description = (
    variantPrefix
    + compact([
      languageTag.grandfathered && `${languageTag.grandfathered.Description} (grandfathered tag)`,
      languageTag.extlang && languageTag.extlang.Description.join(' / '),
      languageTag.macrolanguage && languageTag.macrolanguage.Description,
      languageTag.collection && languageTag.collection.Description,
      languageTag.language
        && wrapPrivateUse('language', languageTag, languageTag.language.Description).join(' / '),
      languageTag.script
        && `written in ${wrapPrivateUse('script', languageTag, languageTag.script.Description).join(
          '/',
        )} script`,
      languageTag.region
        && `as used in ${wrapPrivateUse('region', languageTag, languageTag.region.Description)}`,
      languageTag.redundant && languageTag.redundant.Description,
      languageTag.special && languageTag.special.Description,
      languageTag.extensions
        // Object.keys(languageTag.extensions).length &&
        && `Extensions: ${languageTag.extensions}`,
    ]).join(', ')
  ).replace(/\s+/g, ' ');

  if (privateUseSuffix) {
    if (description) {
      description += ` (with ${privateUseSuffix})`;
    } else {
      description += privateUseSuffix;
    }
  }

  return description.length > 0 ? description : '(undefined tag)';
}
