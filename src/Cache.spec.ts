import Cache, { CacheStrategy } from './Cache';

describe('Cache', () => {
  it('caches items', () => {
    const cache = new Cache();
    cache.set('foo', 'bar');
    cache.set('qoo', 'qux');
    expect(cache.get('foo')).toBe('bar');
    expect(cache.get('qoo')).toBe('qux');
  });

  it('does not cache more items than allowed', () => {
    const cache = new Cache<string, string>({
      maximalItemCount: 2,
      evictExceedingItemsBy: 'age',
    });

    let xIsDisposed = false;
    let yIsDisposed = false;
    let zIsDisposed = false;

    cache.set('old', 'X', { dispose: () => (xIsDisposed = true) });
    cache.set('new', 'Y', { dispose: () => (yIsDisposed = true) });

    // Mark the item as used to keep it in the cache on reaching the maximal number of items
    cache.get('old');
    cache.set('evenNewer', 'Z', { dispose: () => (zIsDisposed = true) });

    expect(cache.get('old')).toBeUndefined();
    expect(xIsDisposed).toBe(true);
    expect(cache.get('new')).toBe('Y');
    expect(yIsDisposed).toBe(false);
    expect(cache.get('evenNewer')).toBe('Z');
    expect(zIsDisposed).toBe(false);
  });

  it('does not cache more items than allowed', () => {
    const cache = new Cache<string, string>({
      maximalItemCount: 2,
      evictExceedingItemsBy: 'lru',
    });

    let xIsDisposed = false;
    let yIsDisposed = false;
    let zIsDisposed = false;

    cache.set('old', 'X', { dispose: () => (xIsDisposed = true) });
    cache.set('new', 'Y', { dispose: () => (yIsDisposed = true) });

    // Mark the item as used to keep it in the cache on reaching the maximal number of items
    cache.get('old');
    cache.set('evenNewer', 'Z', { dispose: () => (zIsDisposed = true) });

    expect(cache.get('old')).toBe('X');
    expect(xIsDisposed).toBe(false);
    expect(cache.get('new')).toBeUndefined();
    expect(yIsDisposed).toBe(true);
    expect(cache.get('evenNewer')).toBe('Z');
    expect(zIsDisposed).toBe(false);
  });

  describe('Cache with TTL', () => {
    let dateNowSpy: jest.SpyInstance<number, []> | undefined;

    beforeEach(() => {
      // Lock Time
      dateNowSpy = jest.spyOn(Date, 'now');
    });

    afterEach(() => {
      // Unlock Time
      if (dateNowSpy) dateNowSpy.mockRestore();
    });

    const createCache = (strategy: CacheStrategy) =>
      new Cache<string, string>({
        maximalItemCount: 4,
        evictExceedingItemsBy: strategy,
        defaultTTL: 5000,
      });

    (['lru', 'age'] as CacheStrategy[]).forEach(strategy => {
      it(`has a working 'peekItem' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        dateNowSpy.mockReturnValueOnce(10000);
        const dispose = () => {};
        cache.set('x', 'y', { dispose });
        dateNowSpy.mockReturnValueOnce(14999);
        const expectedItem = {
          value: 'y',
          expireAfterTimestamp: 15000,
          storageTimestamp: 10000,
          dispose,
        };
        expect(cache.peekItem('x')).toEqual(expectedItem);
        dateNowSpy.mockReturnValueOnce(15000);
        expect(cache.peekItem('x')).toEqual(expectedItem);
      });

      it(`has a working 'peek' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        dateNowSpy.mockReturnValueOnce(10000);
        const dispose = () => {};
        cache.set('x', 'y', { dispose });
        dateNowSpy.mockReturnValueOnce(14999);
        expect(cache.peek('x')).toEqual('y');
        dateNowSpy.mockReturnValueOnce(15000);
        expect(cache.peek('x')).toEqual('y');
      });

      it(`has a working 'getItem' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        dateNowSpy.mockReturnValue(10000);
        const dispose = () => {};
        cache.set('x', 'y', { dispose });
        dateNowSpy.mockReturnValue(14999);
        expect(cache.getItem('x')).toEqual({
          value: 'y',
          expireAfterTimestamp: 15000,
          storageTimestamp: 10000,
          dispose,
        });
        dateNowSpy.mockReturnValue(15000);
        expect(cache.getItem('x')).toBeUndefined();
      });

      it(`has a working 'get' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        dateNowSpy.mockReturnValue(10000);
        cache.set('x', 'y');
        dateNowSpy.mockReturnValue(14999);
        expect(cache.get('x')).toBe('y');
        dateNowSpy.mockReturnValue(15000);
        expect(cache.get('x')).toBeUndefined();
      });

      it(`has a working 'expireItems' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        dateNowSpy.mockReturnValue(10000);
        cache.set('a', 'x');
        cache.set('b', 'x');
        cache.set('c', 'x');
        dateNowSpy.mockReturnValue(11000);
        cache.set('d', 'x');
        cache.set('e', 'x');
        dateNowSpy.mockReturnValue(14999);
        expect(cache.peek('a')).toBeUndefined();
        expect(cache.peek('b')).toBe('x');
        expect(cache.peek('c')).toBe('x');
        expect(cache.peek('d')).toBe('x');
        expect(cache.peek('e')).toBe('x');
        dateNowSpy.mockReturnValue(15000);
        expect(cache.peek('a')).toBeUndefined();
        expect(cache.peek('b')).toBe('x');
        expect(cache.peek('c')).toBe('x');
        expect(cache.peek('d')).toBe('x');
        expect(cache.peek('e')).toBe('x');
        cache.evictExpiredItems();
        expect(cache.peek('a')).toBeUndefined();
        expect(cache.peek('b')).toBeUndefined();
        expect(cache.peek('c')).toBeUndefined();
        expect(cache.peek('d')).toBe('x');
        expect(cache.peek('e')).toBe('x');
      });

      it(`has a working 'has' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        cache.set('a', 'x');
        expect(cache.has('a')).toBe(true);
        expect(cache.has('b')).toBe(false);
      });

      it(`has a working 'clear' method with '${strategy}' strategy`, () => {
        const cache = createCache(strategy);
        cache.set('a', 'x');
        cache.set('b', 'x');
        expect(cache.has('a')).toBe(true);
        expect(cache.has('b')).toBe(true);
        cache.set('a', 'x');
        cache.set('b', 'x');
        cache.clear();
        expect(cache.has('a')).toBe(false);
        expect(cache.has('b')).toBe(false);
      });
    });
  });

  it('disposes deleted items', () => {});
});
