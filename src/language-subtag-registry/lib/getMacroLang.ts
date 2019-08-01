import indexes from './indexes';
import { IRegistryEntry } from './types';

/**
 * Returns the 639-1 macrolanguage code for a given 639-1 language code.
 *
 * @param languageCode A 639-1 language code.
 */

export default function getMacroLanguage(languageCode: string): IRegistryEntry | undefined {
  const index = indexes.language[languageCode];
  const macrolanguageCode = indexes.registry[index].Macrolanguage;
  const macrolanguage = indexes.macrolanguage[macrolanguageCode];
  return indexes.registry[macrolanguage];
}
