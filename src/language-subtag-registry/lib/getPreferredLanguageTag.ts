import indexes from './indexes';

export default function getPreferredLanguageTag(languageTag: string) {
  let languageCode = languageTag.toLowerCase();
  const indexEntry = indexes.index[languageCode];
  if (indexEntry) {
    let preferredLanguageTag;
    if (indexEntry.grandfathered) {
      const entry = indexes.registry[indexEntry.grandfathered];
      preferredLanguageTag = entry['Preferred-Value'];
    } else if (indexEntry.redundant) {
      const entry = indexes.registry[indexEntry.redundant];
      preferredLanguageTag = entry['Preferred-Value'];
    }
    languageCode = preferredLanguageTag || languageCode;
  }
  return languageCode.toLowerCase();
}
