import IIndexes from './IIndexes';
import collection from './json/collection.json';
import extlang from './json/extlang.json';
import grandfathered from './json/grandfathered.json';
import index from './json/index.json';
import language from './json/language.json';
import macrolanguage from './json/macrolanguage.json';
import meta from './json/meta.json';
import privateuse from './json/private-use.json';
import redundant from './json/redundant.json';
import region from './json/region.json';
import registry from './json/registry.json';
import script from './json/script.json';
import special from './json/special.json';
import variant from './json/variant.json';

import generateAlphabeticRange from './generateAlphabeticRange';

// Indexes to speed up finding information in the registry.
const indexes: IIndexes = {
  collection,
  extlang,
  grandfathered,
  /**
   * Holds language tags to records containing all indexes into the registry.
   */
  index,
  language,
  macrolanguage,
  meta,
  privateuse,
  redundant,
  region,
  registry,
  script,
  special,
  variant,
};

// Private use subtags have names like 'qaa..qzz' indicating a range of all letter combinations
// between 'qaa' and 'qzz'. This adds all possible combinations of letters in the given ranges
// to the registry:

[indexes.script, indexes.region, indexes.privateuse, indexes.language].forEach((indexToExtend) => {
  Object.keys(indexToExtend).forEach((key) => {
    if (key.match('..')) {
      generateAlphabeticRange(key).forEach((generatedKey) => {
        // eslint-disable-next-line no-param-reassign
        indexToExtend[generatedKey] = indexToExtend[key];
      });
    }
  });
});

export default indexes;

export const lastUpdatedAtString = new Date(indexes.meta['File-Date']);
export const lastUpdatedAt = new Date(lastUpdatedAtString);
