import indexes from './indexes';

export default function getPreferredLanguageTag(languageSubtag: string): string | undefined {
  const indexEntry = indexes.index[languageSubtag.toLowerCase()];
  if (indexEntry) {
    if (indexEntry.grandfathered) {
      const entry = indexes.registry[indexEntry.grandfathered];
      return entry['Preferred-Value'];
    }
    if (indexEntry.redundant) {
      const entry = indexes.registry[indexEntry.redundant];
      return entry['Preferred-Value'];
    }
  }
  return undefined;
}
