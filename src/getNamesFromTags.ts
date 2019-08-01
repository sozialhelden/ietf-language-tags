import compact from 'lodash.compact';
import { IMinimalLocale, IName } from './types';

export default function getNamesFromTags(tags: Record<string, string>): IName[] {
  // Sort keys to let shorter ones come first
  const keys = Object.keys(tags).sort();

  return compact(
    keys.map(
      (key: string): IName | undefined => {
        const prefixMatches = key.match(/^(?:(offical|alt|int|old|short)_)name)/);
        if (!prefixMatches) return;

        const matchingNamePrefix = prefixMatches[1];

        // See https://taginfo.openstreetmap.org/search?q=name%3Azh for examples
        let locale: IMinimalLocale | undefined;

        const osmLanguageCode = key.split(':')[1];

        return {
          locale,
          string: tags[key],
          variantFlags: {
            // https://wiki.openstreetmap.org/wiki/Key:name
            alternative: matchingNamePrefix === 'alt',
            international: matchingNamePrefix === 'int',
            local: matchingNamePrefix === 'loc',
            national: matchingNamePrefix === 'nat',
            official: matchingNamePrefix === 'offical',
            old: matchingNamePrefix === 'old',
            regional: matchingNamePrefix === 'reg',
            sorting: matchingNamePrefix === 'sorting',
          },
        };
      }
    )
  );
}
