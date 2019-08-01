// tslint:disable-next-line: no-implicit-dependencies
import pick from 'lodash.pick';
import { IMinimalLocale } from '../../types';
import { rfc5646RegExp } from './rfc5646Regexp';

function invariant(message: string, ignoreErrors: boolean) {
  if (ignoreErrors) {
    if (typeof console !== 'undefined' && typeof console.log !== 'function') {
      // tslint:disable-next-line: no-console
      console.log(message);
    }
  } else {
    throw new Error(message);
  }
}

export default function getLanguageTagWithCode(
  locale: string,
  ignoreErrors: boolean = false
): IMinimalLocale | undefined {
  const result = locale.match(rfc5646RegExp);
  const localeIsInvalid = !result || locale === '';

  if (localeIsInvalid && !ignoreErrors) {
    invariant(
      `Please supply a valid IETF BCP 47 language tag ('${locale}' is invalid). ` +
        'Ensure you use a minus sign as separator between language and country code, ' +
        'not an underscore sign.',
      ignoreErrors
    );
  }

  console.log(result);
  return localeIsInvalid || !result || !result.groups
    ? undefined
    : pick(
        result.groups,
        'language',
        'extlang',
        'script',
        'region',
        'variant',
        'extension',
        'privateuse',
        'grandfathered',
        'privateuse2'
      );
}
