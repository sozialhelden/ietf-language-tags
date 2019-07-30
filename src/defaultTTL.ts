import { CachedValue, IMinimalResponse } from './types';

export default function defaultTTL<ResponseT extends IMinimalResponse>(
  cachedValue: CachedValue<ResponseT>
) {
  if (cachedValue.state === 'running') {
    // Evict running promises after 30s if they are not resolved to allow re-requesting.
    // This leaves it up to the fetch implementation to clean up resources if requests are not
    // aborted and the same URL is requested multiple times.
    return 30000;
  }

  if (cachedValue.state === 'resolved') {
    const { response } = cachedValue;
    if (!response) {
      throw new Error(
        'Tried to find TTL for a cache item that was marked as resolved, but did not contain a response. If you encounter this error, please report is as bug.'
      );
    }
    // Keep successful or 'resource missing' responses in the cache for 120 minutes
    if (response.status === 200 || response.status === 404) {
      return 120 * 60 * 1000;
    }
    // Allow retrying all other responses after 10 seconds
    return 10000;
  }

  if (cachedValue.state === 'rejected') {
    const { error } = cachedValue;
    if (typeof error.name !== 'undefined' && error.name === 'AbortError') {
      return 0;
    }
    // Allow reattempting failed requests after 10 seconds
    return 10000;
  }

  // If you should encounter this, the cases handled above are not complete.
  throw new Error(
    'Unknown state. If this happens, please ensure all states have a defined TTL in the `defaultTTL` implementation.'
  );
}
