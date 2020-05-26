import { IFullIndexEntry, IRegistryEntry } from './types';

export default interface IIndexes {
  collection: Record<string, number>;
  extlang: Record<string, number>;
  grandfathered: Record<string, number>;
  /**
   * Holds language tags to records containing all indexes into the registry.
   */
  index: Record<string, Partial<IFullIndexEntry>>;
  language: Record<string, number>;
  macrolanguage: Record<string, number>;
  meta: Record<string, string>;
  privateuse: Record<string, number>;
  redundant: Record<string, number>;
  region: Record<string, number>;
  registry: IRegistryEntry[];
  script: Record<string, number>;
  special: Record<string, number>;
  variant: Record<string, number>;
}
