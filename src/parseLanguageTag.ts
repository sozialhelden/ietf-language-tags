// tslint:disable-next-line: no-implicit-dependencies
import invariant, { errorMessages } from './invariant';
import normalizeLanguageTagCasing from './normalizeLanguageTagCasing';
import { rfc5646RegExp } from './rfc5646RegExp';
import { ILanguageSubtag } from './types';

export default function parseLanguageTag(
  inputTag: string,
  ignoreErrors: boolean = false,
  // tslint:disable-next-line: no-console
  log: ((message: string) => void) | null = console.log
): ILanguageSubtag | undefined {
  if (inputTag.match(/_/)) {
    invariant(errorMessages.underscoresFound(inputTag), ignoreErrors, log);
    return undefined;
  }
  if (inputTag === '') {
    invariant(errorMessages.emptyTag, ignoreErrors, log);
    return undefined;
  }

  const tag = normalizeLanguageTagCasing(inputTag);
  const match = tag.match(rfc5646RegExp);
  if (!match || !match.groups) {
    invariant(errorMessages.invalidTag(inputTag), ignoreErrors, log);
    return undefined;
  }

  const { groups } = match;
  const extensions: Record<string, string> = {};
  let extensionsAreValid = true;
  if (groups.extensions) {
    const matches = (groups.extensions as string)
      .toLowerCase()
      .match(/(?:[0-9a-wy-z](?:-[a-z0-9]{2,8})+)/g);
    Array.from(matches || []).forEach(extension => {
      const previousValue = extensions[extension[0]];
      if (previousValue) {
        invariant(errorMessages.invalidExtension(tag, extension, previousValue), ignoreErrors, log);
        extensionsAreValid = false;
      }
      extensions[extension[0]] = extension.slice(2);
    });
  }
  if (!extensionsAreValid) {
    return undefined;
  }

  const variants = groups.variants ? groups.variants.split(/-/).filter(s => s !== '') : undefined;
  const uniqueVariants = new Set(variants);
  if (variants && variants.length !== uniqueVariants.size) {
    const firstDuplicateVariant = Array.from(uniqueVariants).find(
      variant => variants.filter(v => v === variant).length > 1
    );
    if (firstDuplicateVariant) {
      invariant(errorMessages.duplicateVariant(tag, firstDuplicateVariant), ignoreErrors, log);
      return undefined;
    }
  }

  const result: ILanguageSubtag = {
    variants,
    // tslint:disable-next-line: object-literal-sort-keys
    extensions: groups.extensions ? extensions : undefined,
    extlang: groups.extlang,
    grandfathered: groups.grandfathered,
    langtag: groups.langtag,
    language: groups.language,
    privateuse: groups.privateuse || groups.privateuse2,
    region: groups.region,
    script: groups.script,
  };

  // tslint:disable-next-line: prefer-array-literal
  (Object.keys(result) as Array<keyof (typeof result)>).forEach(k => {
    const value = result[k];
    if (typeof value === 'undefined' || value === '') {
      delete result[k];
    }
  });

  return result;
}
