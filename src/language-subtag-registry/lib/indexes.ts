import collectionJSON from '../json/collection.json';
import extlangJSON from '../json/extlang.json';
import grandfatheredJSON from '../json/grandfathered.json';
import indexJSON from '../json/index.json';
import languageJSON from '../json/language.json';
import macrolanguageJSON from '../json/macrolanguage.json';
import metaJSON from '../json/meta.json';
import privateUseJSON from '../json/private-use.json';
import redundantJSON from '../json/redundant.json';
import regionJSON from '../json/region.json';
import registryJSON from '../json/registry.json';
import scriptJSON from '../json/script.json';
import specialJSON from '../json/special.json';
import variantJSON from '../json/variant.json';

import { IFullIndexEntry, IRegistryEntry } from './types.js';

export const indexesWithKeyTypes = {
  collection: collectionJSON,
  extlang: extlangJSON,
  grandfathered: grandfatheredJSON,
  index: indexJSON,
  language: languageJSON,
  macrolanguage: macrolanguageJSON,
  meta: metaJSON,
  privateUse: privateUseJSON,
  redundant: redundantJSON,
  region: regionJSON,
  registry: registryJSON,
  script: scriptJSON,
  special: specialJSON,
  variant: variantJSON,
};

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
  privateUse: privateUseJSON as Record<string, number>,
  redundant: redundantJSON as Record<string, number>,
  region: regionJSON as Record<string, number>,
  registry: registryJSON as IRegistryEntry[],
  script: scriptJSON as Record<string, number>,
  special: specialJSON as Record<string, number>,
  variant: variantJSON as Record<string, number>,
};

export default indexes;

export const lastUpdatedAtString = new Date(indexes.meta['File-Date']);
export const lastUpdatedAt = new Date(lastUpdatedAtString);
