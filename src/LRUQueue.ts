export default class LRUQueue<K> {
  lruRemovalQueue: K[] = [];
  keysToLRUQueueIndexes = new Map<K, number>();

  push(key: K) {
    this.keysToLRUQueueIndexes.set(key, this.lruRemovalQueue.length);
    this.lruRemovalQueue.push(key);
  }

  delete(key: K) {
    const lruIndex = this.keysToLRUQueueIndexes.get(key);
    this.lruRemovalQueue.splice(lruIndex, 1);
    this.keysToLRUQueueIndexes.delete(key);
    return lruIndex;
  }

  touch(key: K) {
    this.delete(key);
    this.push(key);
  }

  shift() {
    const key = this.lruRemovalQueue.shift();
    this.keysToLRUQueueIndexes.delete(key);
    return key;
  }

  clear() {
    this.lruRemovalQueue = [];
    this.keysToLRUQueueIndexes.clear();
  }
}
