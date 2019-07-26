import LRUQueue from './LRUQueue';

export type DisposeFunction = () => void;

export type CacheStrategy = 'age' | 'lru';

/**
 * An item in the cache, stored with metadata.
 */
export type Item<T> = {
  value: T;
  expireAfterTimestamp: number;
  storageTimestamp: number;
  dispose?: DisposeFunction;
};

export type Options<K, V> = {
  /** Time to live (TTL) for items without specified custom TTL, given in milliseconds. */
  defaultTTL: number;
  /** Maximal number of items in the cache before it starts evicting items on adding new ones */
  maximalItemCount: number;
  evictExceedingItemsBy: CacheStrategy;
  /** You can supply your own cache to this. */
  cache: Map<K, Item<V>>;
};

export type SetItemOptions<K, V> = {
  ttl?: number;
  storageTimestamp?: number;
  dispose?: DisposeFunction;
};

/**
 * A cache.
 *
 * - Evicts items by least recent use ('lru') or age depending on configuration
 * - Evicts items if it reaches a configurable item count limit on insert
 * - Evicts too old items on get or on request
 * - Supports items with different TTLs
 */
export default class LimitedCache<K, V> {
  options: Readonly<Options<K, V>>;
  lruQueue = new LRUQueue<K>();

  constructor({
    defaultTTL = Infinity,
    maximalItemCount = Infinity,
    cache = new Map<K, Item<V>>(),
    evictExceedingItemsBy = 'lru',
  }: Partial<Options<K, V>> = {}) {
    if (defaultTTL < 0) {
      throw new Error('Please supply a `ttl` value greater than zero.');
    }

    if (maximalItemCount < 1) {
      throw new Error(
        'Please supply a `maximalItemCount` parameter that is greater than zero, or do not supply the parameter to allow an infinite number of items.'
      );
    }

    this.options = Object.freeze({
      defaultTTL,
      maximalItemCount,
      cache,
      evictExceedingItemsBy,
    });
  }

  private dispose(key: K) {
    const item = this.peekItem(key);
    if (item.dispose) {
      item.dispose();
    }
  }

  set(
    key: K,
    value: V,
    {
      ttl = this.options.defaultTTL,
      storageTimestamp = Date.now(),
      dispose,
    }: SetItemOptions<K, V> = {}
  ): boolean {
    // Adding the value to the cache is not possible if ttl is zero.
    if (ttl <= 0) {
      return false;
    }

    // Check for infinity in which case the item persists forever.
    const expireAfterTimestamp = ttl < Infinity ? storageTimestamp + ttl : Infinity;

    const item: Item<V> = {
      value,
      expireAfterTimestamp,
      storageTimestamp,
      dispose,
    };

    while (this.options.cache.size >= this.options.maximalItemCount) {
      switch (this.options.evictExceedingItemsBy) {
        case 'age':
          this.deleteOldestItem();
          break;
        case 'lru':
          this.deleteLeastRecentlyUsedItem();
          break;
      }
    }

    this.lruQueue.push(key);
    this.options.cache.set(key, item);
    return true;
  }

  private deleteOldestItem() {
    // This works because the insertion order is maintained when iterating keys.
    const key = this.options.cache.keys().next().value;
    if (typeof key !== 'undefined') {
      this.delete(key);
    }
  }

  private deleteLeastRecentlyUsedItem() {
    const key = this.lruQueue.shift();
    this.dispose(key);
    this.lruQueue.delete(key);
    return this.options.cache.delete(key);
  }

  /**
   * Looks up a cached value + metadata without deleting it if expired.
   *
   * @param key The key to look up
   * @returns the looked up value + metadata, or `undefined` if the value is not cached.
   */
  peekItem(key: K): Item<V> | undefined {
    return this.options.cache.get(key);
  }

  /**
   * Looks up a cached value without deleting it if expired.
   *
   * @param key The key to look up
   * @returns the looked up value, or `undefined` if the value is not cached.
   */

  peek(key: K): V | undefined {
    const item = this.peekItem(key);
    return item && item.value;
  }

  /**
   * Looks up a cached value + metadata, deleting it if its older than the given timestamp.
   *
   * @param key The key to look up
   * @returns the looked up value + metadata, or `undefined` if the value is expired or not cached.
   */

  getItem(key: K, ifNotOlderThanTimestamp: number = Date.now()): Item<V> {
    const item = this.options.cache.get(key);
    if (typeof item !== 'undefined' && item.expireAfterTimestamp <= ifNotOlderThanTimestamp) {
      this.delete(key);
      return;
    }
    this.lruQueue.touch(key);
    return item;
  }

  /**
   * Looks up a value in the cache, deleting it if expired.
   *
   * @param key The key to look up
   * @param ifNotOlderThanTimestamp If an item is older than this timestamp, it expires.
   * @returns the looked up value, or `undefined` if the value is expired or not cached.
   */

  get(key: K, ifNotOlderThanTimestamp: number = Date.now()): V | undefined {
    const item = this.getItem(key, ifNotOlderThanTimestamp);
    return item && item.value;
  }

  /**
   * Sweeps the cache and removes all items that are expired after the given timestamp.
   *
   * @param ifNotOlderThanTimestamp If an item is older than this timestamp, it expires.
   */
  evictExpiredItems(ifOlderThanTimestamp: number = Date.now()) {
    for (const [key, item] of this.options.cache) {
      if (item.expireAfterTimestamp <= ifOlderThanTimestamp) {
        this.delete(key);
      }
    }
  }

  /**
   * Looks up an item in the cache without marking it as touched.
   *
   * @param key The key to look up
   */
  has(key: K): boolean {
    return this.options.cache.has(key);
  }

  /**
   * Looks up an item in the cache without marking it as touched.
   *
   * @param key The key to look up
   */
  delete(key: K): boolean {
    this.dispose(key);
    this.lruQueue.delete(key);
    return this.options.cache.delete(key);
  }

  /**
   * Removes all items from the cache.
   */
  clear(): void {
    this.options.cache.clear();
    this.lruQueue.clear();
  }
}
