import indexes from './indexes';

function matchKey(record: Record<string, any>) {
  const joinedKeys = Object.keys(record)
    .map(k => k.replace(/\./g, '\\.'))
    .join('|');

  return `(?:${joinedKeys})`;
}
/**
 * Regular expression to parse an IETF language tag, modeled after specification from
 * [RFC 5646](https://tools.ietf.org/html/rfc5646).
 *
 * You can use this for recognizing subtags in a given language tag, but not for semantic checks,
 * as the RegExp can't recognize semantic errors in the given tag, e.g. if the same variant is
 * included twice.
 *
 * @param [useRegistry] - If set to `true`, the generated regexp will accept only known subtags
 *   from a local copy of the registry index. This can be safer, but is less future-proof. If you
 *   use this, ensure that this module has an up-to-date copy of the registry. `false` by default.
 */
export default function createRFC5646Regexp(useRegistry: boolean = false): RegExp {
  // non-redundant tags registered during the RFC 3066 era, and  irregular tags do not match the
  // 'langtag' production and would not otherwise be considered 'well-formed' These tags are all
  // valid, but most are deprecated in favor of more modern subtags or subtag combination
  const grandfathered = matchKey(indexes.grandfathered);
  // selected ISO 639 codes or permanently reserved
  const extlang = `(?<extlang>${
    useRegistry ? matchKey(indexes.extlang) : '(?:[a-z]{3}(?:-[a-z]{3}){0,2})'
  })`;
  // ISO 15924 code
  const script = useRegistry ? matchKey(indexes.script) : '[a-z]{4}';
  // ISO 3166-1 code or UN M.49 code
  const region = useRegistry ? matchKey(indexes.region) : '(?:[a-z]{2}|[0-9]{3})';
  // registered variants, e.g. '1901' or 'rozaj'
  const variant = useRegistry ? matchKey(indexes.variant) : '(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3})';
  const singleton = `[0-9a-wy-z]`;
  const extension = `${singleton}(?:-[a-z0-9]{2,8})+`;
  const privateuse = `x(?:-[a-z0-9]{1,8})+`;

  // shortest ISO 639 code sometimes followed by extended language subtags or registered language
  // subtag (no 'reserved for future use' case here to not overmatch)
  const language = useRegistry
    ? matchKey(indexes.language)
    : `(?:[a-z]{2,3}(?:-${extlang})?|[a-z]{4}|[a-z]{5,8})`;
  const langtag = `
    (?<language>${language})
    (-(?<script>${script}))?
    (-(?<region>${region}))?
    (?<variants>(?:-${variant})*)
    (?<extensions>(?:-${extension})*)
    (?:-(?<privateuse>(?:${privateuse})))?
  `;

  const fullTag = `^(?:(?<langtag>${langtag})|(?<privateuse2>${privateuse})|(?<grandfathered>${grandfathered}))$`;
  // console.log(fullTag);
  const fullTagWithoutWhitespaces = fullTag.replace(/[\s\t\n]/g, '');
  // console.log(fullTagWithoutWhitespaces);
  return new RegExp(fullTagWithoutWhitespaces, 'i');
}

export const rfc5646RegExp = createRFC5646Regexp();
