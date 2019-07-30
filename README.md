# fetch-cache 🐕

A cache for WhatWG fetch calls.

- Supports TypeScript
- Uses normalized URLs as cache keys
- Can normalize URLs for better performance (you can configure how)
- Does not request the same resource twice if the first request is still loading
- Customizable TTLs per request, dependent on HTTP status code or in case of network errors
- Supports all [Hamster Cache](https://github.com/sozialhelden/hamster-cache) features, e.g. eviction based on LRU, maximal cached item count and/or per-item TTL.
- Runs in NodeJS, but should be isometric && browser-compatible (not tested yet! try at your own risk 🙃)

## Installation

```bash
npm install --save @sozialhelden/fetch-cache
#or
yarn add @sozialhelden/fetch-cache
```

## Usage examples

### Initialization

Bring your own `fetch` - for example:

- your modern browser's [fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [node-fetch](https://github.com/bitinn/node-fetch), a NodeJS implementation
- [fetch-retry](https://github.com/jonbern/fetch-retry) for automatic request retrying with exponential backoff
- [isomorphic-unfetch](https://github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch), an isometric implementation for browsers (legacy and modern) and Node.js

Configure the cache and use `cache.fetch()` as if you would call `fetch()` directly:

```typescript
import FetchCache from '@sozialhelden/fetch-cache';

const fetch = require('node-fetch'); // in NodeJS
// or
const fetch = window.fetch; // in newer browsers

const fetchCache = new FetchCache({
  fetch,
  cacheOptions: {
    // Don't save more than 100 responses in the cache. Allows infinite responses by default
    maximalItemCount: 100,
    // When should the cache evict responses when its full?
    evictExceedingItemsBy: 'lru', // Valid values: 'lru' or 'age'
    // ...see https://github.com/sozialhelden/hamster-cache for all possible options
  },
});

// fetches a response, with side effect that the cache evicts a cached expired response
const url = 'https://jsonplaceholder.typicode.com/todos/1';
fetchCache
  .fetch(url, fetchOptions)
  .then(response => response.body())
  .then(console.log)
  .catch(console.log);
```

### Basic caching operations

```typescript
// Add an external response promise and cache it for 10 seconds
const response = fetch('https://api.example.com');

// Insert a response you got from somewhere else
fetchCache.cache.set('http://example.com', response);

// Set a custom TTL of 10 seconds for this specific response
fetchCache.cache.set('http://example.com', response, { ttl: 10000 });

// gets the cached response without side effects
fetchCache.cache.peek(url);

// `true` if a response exists in the cache, `false` otherwise
fetchCache.cache.has(url);

// same as `peek`, but returns response with meta information
fetchCache.cache.peekItem(url);

// same as `get`, but returns response with meta information
fetchCache.cache.getItem(url);

// Do this to save memory, for example in intervals
fetchCache.cache.evictExpiredItems();

// removes a response from the cache
fetchCache.cache.delete(url);

// forgets all cached responses
fetchCache.cache.clear();
```

### Use different TTLs depending on HTTP response code and headers

```typescript
const fetchCache = new FetchCache({
  fetch,
  ttl: ({ response, state, error }) => {
    switch (state) {
      case 'running':
        return 10000;
      case 'resolved': {
        if (response.status === 200) return 120000;
        if (response.status === 404) return 60000;
        return 10000;
      }
      case 'error':
        return 123;
    }
    // Keep successful responses in the cache for 2 minutes
    if (response.status === 200) return 120000;
    // Allow reattempting failed requests after 10 seconds
    return 10000;
  },
});
```

### Use URL normalization

This saves ressources when the same content is available under more than one URL:

```bash
npm install normalize-url
# or
yarn add normalize-url
```

```typescript
import normalizeURL from 'normalize-url';
import fetch from 'node-fetch';

// Initialize a cache with URL normalization
const cache = new FetchCache<string, string>({ fetch, normalizeURL });

// Initialize a cache with configured URL normalization
// See https://github.com/sindresorhus/normalize-url#readme for all available options
const saferNormalizeURL = url => normalizeUrl(url, { forceHttps: true });
const cache = new FetchCache<string, string>({ fetch, normalizeURL: saferNormalizeURL });
```

## Contributors

- [@dakeyras7](https://github.com/dakeyras7)
- [@lennerd](https://github.com/lennerd)
- [@mutaphysis](https://github.com/mutaphysis)
- [@opyh](https://github.com/opyh)

Supported by

<img src='./doc/sozialhelden-logo.svg' width="200">.
