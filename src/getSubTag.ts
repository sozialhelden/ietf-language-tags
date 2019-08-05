import indexes from './indexes';
import { IFullIndexEntry, IRegistryEntry } from './types';

export default function getSubTag(type: keyof IFullIndexEntry, subTag: string): IRegistryEntry {
  const index = indexes[type][subTag.toLowerCase()];
  return indexes.registry[index];
}
