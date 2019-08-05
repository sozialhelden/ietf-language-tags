import collectionJSON from './json/collection.json';
import extlangJSON from './json/extlang.json';
import grandfatheredJSON from './json/grandfathered.json';
import indexJSON from './json/index.json';
import languageJSON from './json/language.json';
import macrolanguageJSON from './json/macrolanguage.json';
import metaJSON from './json/meta.json';
import privateUseJSON from './json/private-use.json';
import redundantJSON from './json/redundant.json';
import regionJSON from './json/region.json';
import registryJSON from './json/registry.json';
import scriptJSON from './json/script.json';
import specialJSON from './json/special.json';
import variantJSON from './json/variant.json';

import generateAlphabeticRange from './generateAlphabeticRange';
import { IFullIndexEntry, IRegistryEntry } from './types.js';

// Indexes to speed up finding information in the registry.
const indexes = {
  collection: collectionJSON as Record<string, number>,
  extlang: extlangJSON as Record<string, number>,
  grandfathered: grandfatheredJSON as Record<string, number>,
  /**
   * Holds language tags to records containing all indexes into the registry.
   */
  index: indexJSON as Record<string, Partial<IFullIndexEntry>>,
  language: languageJSON as Record<string, number>,
  macrolanguage: macrolanguageJSON as Record<string, number>,
  meta: metaJSON as Record<string, string>,
  privateuse: privateUseJSON as Record<string, number>,
  redundant: redundantJSON as Record<string, number>,
  region: regionJSON as Record<string, number>,
  registry: registryJSON as IRegistryEntry[],
  script: scriptJSON as Record<string, number>,
  special: specialJSON as Record<string, number>,
  variant: variantJSON as Record<string, number>,
};

// Private use subtags have names like 'qaa..qzz' indicating a range of all letter combinations
// between 'qaa' and 'qzz'. This adds all possible combinations of letters in the given ranges
// to the registry:

[indexes.script, indexes.region, indexes.privateuse, indexes.language].forEach(index => {
  Object.keys(index).forEach(key => {
    if (key.match('..')) {
      generateAlphabeticRange(key).forEach(generatedKey => {
        index[generatedKey] = index[key];
      });
    }
  });
});

export default indexes;

export const lastUpdatedAtString = new Date(indexes.meta['File-Date']);
export const lastUpdatedAt = new Date(lastUpdatedAtString);
