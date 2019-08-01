import getLanguageTagWithCode from './language-subtag-registry/lib/getLanguageTagWithCode';

/**
 * Returns the interpreted locale from a given OSM language tag.
 *
 * OSM is a bit special in this regard as tags have emerged that are not compatible to tags in the
 * IETF language tag registry.
 *
 * @param osmLanguageCode the language code found in an OSM tag.
 * @see https://wiki.openstreetmap.org/wiki/Multilingual_names
 */

export default function getLocaleFromOSMCode(inputCode: string) {
  const code = inputCode
    .replace(/_/, '-')
    .toLowerCase()
    .replace(/^zh-simplified/, 'zh-Hans')
    .replace(/^zh-traditional/, 'zh-Hant')
    .replace(/^zh-zhuyin/, 'zh-Bopo')
    .replace(/^(ja|ko)-(?:rm|roman)/, '$1-Latn')
    .replace(/^ar1/, 'ar');

  const locale = getLanguageTagWithCode(code);
  return locale;
}
