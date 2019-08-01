export type LocalizedString =
  | string
  | {
      [key: string]: string;
    };

export interface IMinimalLocale {
  language: string;
  extlang?: string;
  script?: string;
  region?: string;
  variant?: string;
}

export type NameVariant =
  | 'alternative'
  | 'international'
  | 'official'
  | 'old'
  | 'regional'
  | 'national'
  | 'local'
  | 'sorting';

export type VariantFlags = Record<NameVariant, boolean>;

export interface IName {
  string: string;
  locale?: IMinimalLocale;
  variantFlags: VariantFlags;
}
