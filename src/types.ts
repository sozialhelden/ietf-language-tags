export interface IFullIndexEntry {
  extlang: number;
  grandfathered: number;
  language: number;
  redundant: number;
  region: number;
  script: number;
  variant: number;
  collection: number;
  macrolanguage: number;
  privateuse: number;
  special: number;
}

export interface IRegistryEntry {
  /**
   * Type's field-body MUST consist of one of the following strings:
   * "language", "extlang", "script", "region", "variant",
   * "grandfathered", and "redundant"; it denotes the type of tag or
   * subtag.
   */
  Type: string;

  /*
   * Tag's field-body contains a complete language tag.  This field
   * MUST appear in all records whose 'Type' has one of these
   * values: "grandfathered" or "redundant".  If the 'Type' is
   * "grandfathered", then the 'Tag' field-body will be one of the
   * tags listed in either the 'regular' or 'irregular' production
   * found in Section 2.1.
   */
  Tag?: string;

  /*
   * Subtag's field-body contains the subtag being defined.  This
   * field MUST appear in all records whose 'Type' has one of these
   * values: "language", "extlang", "script", "region", or
   * "variant".
   */
  Subtag: string;

  /**
   * Description's field-body contains a non-normative description
   * of the subtag or tag.
   */
  Description: string[];

  /**
   * Scope's field-body contains information about a primary or
   * extended language subtag indicating the type of language code
   * according to ISO 639.  The values permitted in this field are
   * "macrolanguage", "collection", "special", and "private-use".
   * This field only appears in records whose 'Type' field-body is
   * either 'language' or 'extlang'.  When this field is omitted,
   * the language is an individual language. (RFC 5646)
   */
  Scope?: string;

  /*
   * Added's field-body contains the date the record was registered
   * or, in the case of grandfathered or redundant tags, the date
   * the corresponding tag was registered under the rules of
   * [RFC1766] or [RFC3066].
   */

  Added: string;

  /*
   * Deprecated's field-body contains the date the record was
   * deprecated.  In some cases, this value is earlier than that of
   * the 'Added' field in the same record.  That is, the date of
   * deprecation preceded the addition of the record to the
   * registry.
   */
  Deprecated?: string;

  /**
   *  Preferred-Value's field-body contains a canonical mapping from
   *  this record's value to a modern equivalent that is preferred in
   *  its place.  Depending on the value of the 'Type' field, this
   *  value can take different forms:
   *
   *  - For fields of type 'language', 'Preferred-Value' contains
   *    the primary language subtag that is preferred when forming
   *    the language tag.
   *
   *  - For fields of type 'script', 'region', or 'variant',
   *    'Preferred-Value' contains the subtag of the same type that
   *    is preferred for forming the language tag.
   *
   *  - For fields of type 'extlang', 'grandfathered', or
   *    'redundant', 'Preferred-Value' contains an "extended
   *    language range" [RFC4647] that is preferred for forming the
   *    language tag.  That is, the preferred language tag will
   *    contain, in order, each of the subtags that appears in the
   *    'Preferred-Value'; additional fields can be included in a
   *    language tag, as described elsewhere in this document.  For
   *    example, the replacement for the grandfathered tag "zh-min-
   *    nan" (Min Nan Chinese) is "nan", which can be used as the
   *
   *    basis for tags such as "nan-Hant" or "nan-TW" (note that the
   *    extended language subtag form such as "zh-nan-Hant" or "zh-
   *    nan-TW" can also be used).
   */
  'Preferred-Value'?: string;

  /*
   * Prefix's field-body contains a valid language tag that is
   * RECOMMENDED as one possible prefix to this record's subtag.
   * This field MAY appear in records whose 'Type' field-body is
   * either 'extlang' or 'variant' (it MUST NOT appear in any other
   * record type). (RFC 5646)
   */
  Prefix?: string[];

  /**
   * Comments's field-body contains additional information about the subtag, as deemed appropriate
   * for understanding the registry and implementing language tags using the subtag or tag. (RFC 5646)
   */
  Comments?: string[];

  /**
   * Macrolanguage's field-body contains a primary language subtag
   * defined by ISO 639 as the "macrolanguage" that encompasses this
   * language subtag.  This field MUST appear only in records whose
   * 'Type' field-body is either 'language' or 'extlang'. (RFC 5646)
   */
  Macrolanguage?: string;

  /**
   * Suppress-Script's field-body contains a script subtag that
   * SHOULD NOT be used to form language tags with the associated
   * primary or extended language subtag.  This field MUST appear
   * only in records whose 'Type' field-body is 'language' or
   * 'extlang'.  See Section 4.1 of RFC 5646 (RFC 5646)
   */
  'Suppress-Script'?: string;
}

export interface ILanguageSubtag {
  langtag?: string;
  language?: string;
  extlang?: string;
  script?: string;
  region?: string;
  variants?: string[];
  extensions?: Record<string, string>;
  privateuse?: string;
  grandfathered?: string;
}

export interface ILanguageTag {
  langtag?: IRegistryEntry;
  language?: IRegistryEntry;
  extlang?: IRegistryEntry;
  script?: IRegistryEntry;
  region?: IRegistryEntry;
  variants?: IRegistryEntry[];
  extensions?: Record<string, IRegistryEntry>;
  privateuse?: IRegistryEntry;
  grandfathered?: IRegistryEntry;
  redundant?: IRegistryEntry;
  variant?: IRegistryEntry;
  collection?: IRegistryEntry;
  macrolanguage?: IRegistryEntry;
  special?: IRegistryEntry;
  parts: ILanguageSubtag;
}
