# ietf-language-tags 🇺🇳

Tools for working with IETF language tags as specified by
[BCP 47 / RFC 5646](https://tools.ietf.org/html/rfc5646).

- Validates given tag strings like `zh-Hant-CN`
- Interprets complicated (but valid) tags like
  `zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1`
- Helps you with getting rid of redundant or deprecated tags
- Optionally checks given tags against a local copy of the central IETF language tag registry so
  don't let unregistered subtags slip through

## Terminology

The terminology of this library follows [RFC5646](https://tools.ietf.org/html/rfc5646). To quote the specification:

- **Tag** refers to a complete language tag, such as `sr-Latn-RS` or `az-Arab-IR`.
- **Subtag** refers to a specific section of a tag, delimited by a hyphen, such as the subtags
  `zh`, `Hant`, and `CN` in the tag `zh-Hant-CN`.
- **Code** refers to values defined in external standards (and that are used as subtags in this
  document). For example, `Hant` is an [ISO15924](http://www.unicode.org/iso15924) script code that
  was used to define the `Hant` script subtag for use in a language tag.

### How is this related to Unicode CLDR language tags and POSIX locales?

- **Unicode CLDR** uses IETF language tags as basis standard and [adds its own extensions](http://cldr.unicode.org/index/bcp47-extension) - it allows using underscores in the tags, and specifies how to add information about cultural attributes like currencies, measurement units or collations. Most OSes, programming languages and browsers support the CLDR specifications. What's still missing in many CLDR libraries is correct support for matching user-preferred and app-supported language tags - while the Unicode CLDR specification lists 2 algorithms for matching that are more sophisticated than the proposed matching algorithm in IETF's [RFC 4647](https://tools.ietf.org/html/rfc4647), many libraries only implement the simplest one. Rafael Xavier de Souza from the [CLDR.js](https://github.com/rxaviers/cldrjs) project has an [explanation of the issue](https://github.com/rxaviers/cldrjs/blob/master/doc/bundle_lookup_matcher.md).
- **POSIX locales** are used in Unix-based systems to determine how apps should handle character sets and string formatting. Even after replacing their underscore separators with hyphen characters, they would not be valid as IETF language tags, and you shouldn't use them with this library without a proper conversion. For example, `C` is a valid POSIX locale, but not a valid IETF language tag.

## Installation

```bash
npm install --save @sozialhelden/ietf-language-tags
#or
yarn add @sozialhelden/ietf-language-tags
```

## Usage examples

- Parse a given IETF language tag to get access to its parts:

  ```typescript
  const tag = parseLanguageTag(
    'sl-rozaj-biske',
    // Set to `true` for returning `undefined` for invalid tags,
    // outputting errors to the console.
    // Set to `false` to throw an error if a given tag is invalid.
    // The library tries to give helpful feedback for typical errors in tags.
    true,
    // Allows you to use your own logging function. Supply `null` to suppress console output.
    console.log
  );
  ```

  ```json
  {
    "langtag": "sl-rozaj-biske",
    "language": "sl",
    "variants": ["rozaj", "biske"]
  }
  ```

- Get all information about a given language tag, including descriptions and registry meta infos:

  ```typescript
  const tagMetaInfo = getTag('zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1');
  ```

  ```javascript
    {
      extlang: {
        Added: '2009-07-29',
        Description: ['Yue Chinese', 'Cantonese'],
        Macrolanguage: 'zh',
        'Preferred-Value': 'yue',
        Prefix: ['zh'],
        Subtag: 'yue',
        Type: 'extlang',
      },
      parts: {
        extensions: {
          a: 'extend1',
        },
        extlang: 'yue',
        langtag: 'zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1',
        language: 'zh-yue',
        privateuse: 'x-foobar-private1',
        region: 'CN',
        script: 'Latn',
        variants: ['pinyin'],
      },
      privateuse: 'x-foobar-private1',
      region: {
        Added: '2005-10-16',
        Description: ['China'],
        Subtag: 'CN',
        Type: 'region',
      },
      script: {
        Added: '2005-10-16',
        Description: ['Latin'],
        Subtag: 'Latn',
        Type: 'script',
      },
      variants: [
        {
          Added: '2008-10-14',
          Description: ['Pinyin romanization'],
          Prefix: ['zh-Latn', 'bo-Latn'],
          Subtag: 'pinyin',
          Type: 'variant',
        },
      ],
    }
  ```

- Return a plain English description of a given tag

  ```typescript
  describeIETFLanguageTag('zh-Hans'); // → 'Chinese, written in Han (Simplified variant) script'
  describeIETFLanguageTag('yue-HK'); // → 'Yue Chinese / Cantonese, as used in Hong Kong'
  describeIETFLanguageTag('es-419'); // → 'Spanish / Castilian, as used in Latin America and the Caribbean'
  ```

- Beautify tags to make them more readable

  ```typescript
  normalizeLanguageTagCasing('sGn-Be-fR'); // → 'sgn-BE-FR'
  ```

- Get a language tag the IETF language tag registry prefers over the given tag

  ```typescript
  getPreferredLanguageTag('zh-yue'); // → 'yue'
  getPreferredLanguageTag('i-klingon'); // → 'tlh'
  ```

- Get a specific, single subtag from the IETF language tag registry:

  ```typescript
  getSubTag('extlang', 'hsn');
  ```

  ```typescript
  {
    Type: 'language',
    Subtag: 'hsn',
    Description: ['Xiang Chinese'],
    Added: '2009-07-29',
    Macrolanguage: 'zh'
  }
  ```

- Match against a RegExp mimicking the RFC specs, without further semantic checks:

  ```typescript
  const regexp = createRFC5646Regexp();
  const match = 'zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1'.match(regexp);
  ```

  ```typescript
  {
    region: "CN",
    script: "Latn",
    extlang: "yue",
    language: "zh-yue",
    variants: "-pinyin" // can contain one or more variants in one string
    extensions: "-a-extend1", // can contain one or more extensions in one string
    privateuse: "x-foobar-private1",
    privateuse2: undefined, // For tags that consist of nothing more than a private-use subtag
    langtag: "zh-yue-Latn-CN-pinyin-a-extend1-x-foobar-private1",
  }
  ```

## Credits / License

Contributors to this package:

- [Sebastian Felix Zappe](https://twitter.com/opyh)

Thanks to [@mcaruanagalizia](<(https://twitter.com/mcaruanagalizia)>) for maintaining the
`language-subtag-registry` NPM package, which this package relies on.

Update scripts copyright (c) 2013, [Matthew Caruana Galizia](https://twitter.com/mcaruanagalizia) and licensed under and [MIT license](http://mattcg.mit-license.org/).

The JSON database is licensed under the [Open Data Commons Attribution License (ODC-BY)](http://opendatacommons.org/licenses/by/1.0/).

Supported by

<img src='./doc/sozialhelden-logo.svg' width="200">.
