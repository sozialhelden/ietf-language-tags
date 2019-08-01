import indexes from './indexes';

function regexpForKeys(record: Record<string, any>) {
  return Object.keys(record)
    .map(k => k.replace(/\./g, '\\.'))
    .join('|');
}
/**
 * Regular expression to parse an IETF language tag, modeled after specification from
 * [RFC 5646](https://tools.ietf.org/html/rfc5646).
 *
 * It differs in the regard that it accepts only known subtags from the registry index.
 */
export default function createRFC5646Regexp(): RegExp {
  // non-redundant tags registered during the RFC 3066 era, and  irregular tags do not match the
  // 'langtag' production and would not otherwise be considered 'well-formed' These tags are all
  // valid, but most are deprecated in favor of more modern subtags or subtag combination
  const grandfathered = regexpForKeys(indexes.grandfathered);
  // selected ISO 639 codes or permanently reserved
  const extlangs = `(?:-(?<extlang>${regexpForKeys(indexes.extlang)}))){0,2}`;
  const script = regexpForKeys(indexes.script); // ISO 15924 code
  const region = regexpForKeys(indexes.region); // ISO 3166-1 code or UN M.49 code
  const variant = regexpForKeys(indexes.variant); // registered variants
  const singleton = `[0-9a-wy-z]`;
  const extension = `${singleton}(?:-[a-z0-9]{2,8})+`;
  const privateuse = `x(?:-[a-z0-9]{1,8})+`;

  // shortest ISO 639 code sometimes followed by extended language subtags or registered language
  // subtag (no 'reserved for future use' case here to not overmatch)
  const language = `(?:${regexpForKeys(indexes.language)}${extlangs}`;

  const langtag = `
    (?<language>${language})
    (-(?<script>${script}))?
    (-(?<region>${region}))?
    (-(?<variant>${variant}))*
    (-(?<extension>${extension}))*
    (-(?<privateuse>${privateuse}))?
  `;

  const fullTag = `^(?:(?<langtag>${langtag})|(?<privateuse2>${privateuse})|(?<grandfathered>${grandfathered}))$`.replace(
    /[\s\t\n]/g,
    ''
  );
  // console.log(fullTag);
  return new RegExp(fullTag, 'i');
}

export const rfc5646RegExp = createRFC5646Regexp();
// console.log(rfc5646RegExp);
