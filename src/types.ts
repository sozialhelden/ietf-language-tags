import { IOptions as ICacheOptions } from '@sozialhelden/hamster-cache';

type State = 'running' | 'resolved' | 'rejected';

export interface IMinimalResponse {
  status: number;
}

export interface ICachedValueWithState {
  state: State;
}
export type CachedValue<ResponseT extends IMinimalResponse> =
  | ICachedValueWithState & {
      promise: Promise<ResponseT>;
      state: 'running';
    }
  | {
      promise: Promise<ResponseT>;
      response?: ResponseT;
      state: 'resolved';
    }
  | {
      error?: any;
      promise: Promise<ResponseT>;
      state: 'rejected';
    };

export type TTLFunction<ResponseT extends IMinimalResponse> = (
  cachedValue: CachedValue<ResponseT>
) => number;

export interface IMandatoryOptions<FetchT> {
  fetch: FetchT;
}

export interface IOptionalOptions<ResponseT extends IMinimalResponse> {
  cacheOptions: Partial<ICacheOptions<string, CachedValue<ResponseT>>>;
  ttl: TTLFunction<ResponseT>;
  normalizeURL: (url: string) => string;
}

/**
 * Describes fully configured caching behavior. All fields are mandatory.
 */
export type Config<FetchT, ResponseT extends IMinimalResponse> = Readonly<
  IMandatoryOptions<FetchT> & IOptionalOptions<ResponseT>
>;

/**
 * Describes
 */
export type Options<FetchT, ResponseT extends IMinimalResponse> = IMandatoryOptions<FetchT> &
  Partial<IOptionalOptions<ResponseT>>;
