export default function invariant(
  message: string,
  ignoreErrors: boolean,
  log: ((message: string) => void) | null
) {
  if (ignoreErrors) {
    if (log !== null) {
      log(message.trim());
    }
  } else {
    throw new Error(message.trim());
  }
}

export const errorMessages = {
  duplicateVariant: (tag: string, variant: string) => `
    The supplied tag ‘${tag}’ contains a variant (‘${variant}’) that is present more than once.

    Please provide variants only once.
  `,
  emptyTag: `
    The supplied tag was empty. Please supply an IETF language tag!
  `,
  invalidExtension: (tag: string, extension: string, previousValue: string) => `
    The supplied tag ‘${tag}’ contains a singleton (the ‘${extension[0]}’ in ‘${extension}’ and
    ‘${extension[0]}-${previousValue}’) that is present more than once.

    The tag cannot have ‘${extension}’ and ‘${extension[0]}-${previousValue}’ at the same time.

    Please supply only one value for the ‘${extension[0]}-...’ extension.
  `,
  invalidTag: (inputTag: string) => `
    Could not interpret ‘${inputTag}’ - Please supply a valid IETF/BCP-47 language tag!

    If necessary, you can find out more on https://tools.ietf.org/html/rfc5646.
  `,
  underscoresFound: (inputTag: string) => `
    ‘${inputTag}’ is not a valid IETF language tag.

    It contains underscores, indicating that it is a POSIX locale [1] or Unicode language tag [2].

    Despite looking similar, both standards work differently than what the
    @sozialhelden/ietf-language-tags module supports.

    - If you generated the tag yourself, please ensure you use minus signs (e.g. ‘de-DE’), not
      underscores, for separating the subtags.
    - If you got the value from an API or library, please try to find a replacement that outputs
      real IETF/BCP-47 language tags, or convert the value yourself. Note that conversion is more
      complicated than just replacing '_' with '-'! For Unicode language tags, the standard [2]
      describes how to convert them to the IETF/BCP-47 format.
    - If you actually wanted to work with POSIX locales, this library is probably not the right
      one, it only supports IETF language tags.
    - If you actually wanted to work with Unicode language tags, you can convert them by replacing
      the underscores with hyphens. However, this library won't help you with parsing the Unicode
      standard’s extensions - if you need to interpret them, you need additional code for this. It
      might be a better idea to have a look at cldrjs [3] in your case.

    Sorry for the inconvenience!

    [1] POSIX locales / ISO 15897 / https://www.iso.org/standard/50707.html
    [2] http://unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers.
    [3] https://github.com/rxaviers/cldrjs
  `,
};
