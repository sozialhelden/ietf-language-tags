export interface IFullIndexEntry {
  extlang: number;
  grandfathered: number;
  language: number;
  redundant: number;
  region: number;
  script: number;
  variant: number;
}

export interface IRegistryEntry {
  Type: string;
  Subtag: string;
  Description: string[];
  'Suppress-Script': string;
  Scope: string;
  Added: string;
  Deprecated: string;
  'Preferred-Value': string;
  Prefix: string[];
  Comments: string[];
  Macrolanguage: string;
}
