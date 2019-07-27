import Cache, {
  Item as CacheItem,
  Options as CacheOptions,
  SetItemOptions,
} from '@sozialhelden/hamster-cache';

type K = string;
type State = 'running' | 'resolved' | 'error' | 'timeout' | 'externalAbort' | 'disposed';
type V = {
  abortController: AbortController;
  promise: Promise<Response>;
  state: State;
};

type Options = {
  fetch: typeof fetch;
  cacheOptions: Partial<CacheOptions<K, V>>;
  responseTTL: (response: Response) => number;
  errorTTL: (error: Error) => number;
  normalizeURL: (url: string) => string;
};

const defaultResponseTTL = 5 * 60 * 1000;
const defaultErrorTTL = 10 * 1000;
const defaultTimeout = 30 * 1000;

/**
 * A HTTP cache for WhatWG fetch.
 */
export default class FetchCache {
  readonly options: Readonly<Options>;
  readonly cache: Cache<K, V>;

  constructor({
    fetch,
    cacheOptions = {},
    responseTTL = () => defaultResponseTTL,
    errorTTL = () => defaultErrorTTL,
    normalizeURL = url => url,
  }: Partial<Options> = {}) {
    this.cache = new Cache(cacheOptions);
    this.options = Object.freeze({
      fetch,
      cacheOptions,
      responseTTL,
      errorTTL,
      normalizeURL,
    });
  }

  fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    if (typeof input !== 'string') {
      throw new Error('Please supply URL as a string.');
    }

    const normalizedURL = this.options.normalizeURL(input);

    const existingItem = this.cache.getItem(normalizedURL);

    if (existingItem) {
      return existingItem.value.promise;
    }

    return this.createFetchCacheItem(normalizedURL, init);
  }

  /**
   * test cases:
   *
   * - aborted while running, then disposed
   * - disposed while running, then aborted
   * - aborted after done
   * - aborted after error
   * -
   */
  private createFetchCacheItem(url: string, init: RequestInit = {}) {
    // create a cache item with a promise as value
    const abortController = new AbortController();
    const signal = abortController.signal;
    const promise = this.options.fetch(url, { ...init, signal });
    const value: V = { abortController, promise, state: 'running' };

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    let externalAbortListener: () => void;

    const cleanup = (state: State) => () => {
      if (externalAbortListener) {
        init.signal.removeEventListener('abort', externalAbortListener);
      }
      if (value.state === 'running' && !abortController.signal.aborted) {
        abortController.abort();
        delete value.abortController;
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
      value.state = state;
    };

    promise.then(() => cleanup('resolved'));
    promise.catch(() => cleanup('error'));
    if (init.signal) {
      externalAbortListener = cleanup('externalAbort');
      init.signal.addEventListener('abort', externalAbortListener);
    }
    timeoutHandle = setTimeout(cleanup('timeout'), defaultTimeout);
    this.cache.set(url, value, { dispose: cleanup('disposed') });
    return promise;
  }

  adaptTTLForSuccessfulResponse(
    cacheItem: CacheItem<V>,
    response: Response,
    now: number = Date.now()
  ) {
    this.options.responseTTL(response) || defaultErrorTTL;

    cache;
  }
}
