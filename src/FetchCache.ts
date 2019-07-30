import hamsterCache from '@sozialhelden/hamster-cache';
import defaultTTL from './defaultTTL';
import { CachedValue, Config, IMinimalResponse, Options } from './types';

interface IHasFetchMethodWithSameReturnTypeAs<T extends (...args: any) => any> {
  fetch: (...args: any[]) => ReturnType<T>;
}

/**
 * A HTTP cache for WhatWG fetch.
 */
export default class FetchCache<
  RequestInitT extends {},
  ResponseT extends IMinimalResponse,
  FetchT extends (url: string, init?: RequestInitT) => Promise<ResponseT>
> implements IHasFetchMethodWithSameReturnTypeAs<FetchT> {
  public readonly options: Config<FetchT, ResponseT>;
  public readonly cache: hamsterCache<string, CachedValue<ResponseT>>;

  constructor({
    cacheOptions = {},
    fetch,
    normalizeURL = url => url,
    ttl = defaultTTL,
  }: Options<FetchT, ResponseT>) {
    this.cache = new hamsterCache(cacheOptions);
    this.options = Object.freeze({ cacheOptions, fetch, normalizeURL, ttl });
  }

  public fetch(input: string, init?: RequestInitT, dispose?: () => void): ReturnType<FetchT> {
    const normalizedURL = this.options.normalizeURL(input);
    const existingItem = this.cache.getItem(normalizedURL);
    if (existingItem) {
      return existingItem.value.promise as ReturnType<FetchT>;
    }
    return this.createFetchCacheItem(normalizedURL, init, dispose);
  }

  private createFetchCacheItem(
    url: string,
    init?: RequestInitT,
    dispose?: () => void
  ): ReturnType<FetchT> {
    const cache = this.cache;
    const options = this.options;
    const promise = this.options
      .fetch(url, init)
      .then(response => {
        Object.assign(value, { response, state: 'resolved' });
        const ttl = options.ttl(value);
        cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl);
        return response;
      })
      .catch(error => {
        Object.assign(value, { error, state: 'rejected' });
        const ttl = options.ttl(value);
        cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl);
        throw error;
      }) as ReturnType<FetchT>;
    const value: CachedValue<ResponseT> = {
      promise,
      state: 'running',
    };
    this.cache.set(url, value, { dispose, ttl: options.ttl(value) });
    return promise;
  }
}
