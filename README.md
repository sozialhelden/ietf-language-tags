# Hamster Cache 🐹

- Supports TypeScript
- Evicts items by least recent use ('LRU') or age, depending on configuration
- Evicts items if it reaches a configurable item limit on insertion
- Evicts too old items on getting a value, or on request - based on a per-item time-to-live (TTL)
- Lets you define a custom function to clean up, e.g. to close file handles or open connections, when it evicts an item
- Allows you to bring your own internal cache (if it supports the ES6 `Map` interface)
- Gives you meta information about cached objects, for stats generation or debugging

## Installation

```bash
npm install --save @sozialhelden/hamster-cache
#or
yarn add @sozialhelden/hamster-cache
```

## Usage examples

```typescript
import Cache from '@sozialhelden/hamster-cache';

const cache = new Cache<string, string>({
  evictExceedingItemsBy: 'lru', // or 'age'
  defaultTTL: 5000,
  maximalItemCount: 100,
});

cache.set('key', { some: 'object' }); // Add value to the cache

// Add value to the cache, but with more information
cache.set(
  'key',
  { some: 'object' },
  {
    ttl: 1000,
    dispose() {
      console.log('Object disposed!');
    },
  }
);

cache.peek('key'); // gets the cached value without side effects
cache.has('key'); // `true` if an item exists in the cache, `false` otherwise
cache.peekItem('key'); // same as `peek`, but returns value with meta information
cache.get('key'); // gets a value with side effect that the cache evicts the object if expired
cache.getItem('key'); // same as `get`, but returns value with meta information
cache.evictExpiredItems(); // Do this to save memory in a setInterval call - or whenever you need it!
cache.delete('key'); // removes an item from the cache
cache.clear(); // forgets all items
```

## Contributors

- [@lennerd](https://github.com/lennerd)
- [@mutaphysis](https://github.com/mutaphysis)
- [@opyh](https://github.com/opyh)

Supported by <img src='./doc/sozialhelden-logo.svg' width="200">.
