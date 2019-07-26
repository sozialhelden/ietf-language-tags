import LRUQueue from './LRUQueue';

describe('LRUQueue', () => {
  it('pushes and moves new item to the back', () => {
    const queue = new LRUQueue<string>();
    queue.push('X');
    queue.push('Y');
    expect(queue.shift()).toEqual('X');
    expect(queue.shift()).toEqual('Y');
  });

  it('moves a touched item to the back', () => {
    const queue = new LRUQueue<string>();
    queue.push('X');
    queue.push('Y');
    queue.push('Z');
    queue.touch('Y');
    expect(queue.shift()).toEqual('X');
    expect(queue.shift()).toEqual('Z');
    expect(queue.shift()).toEqual('Y');
  });

  it('can delete items', () => {
    const queue = new LRUQueue<string>();
    queue.push('X');
    queue.push('Y');
    queue.push('Z');
    queue.delete('Y');
    expect(queue.shift()).toEqual('X');
    expect(queue.shift()).toEqual('Z');
    expect(queue.shift()).toBeUndefined();
  });

  it('clears items on request', () => {
    const queue = new LRUQueue<string>();
    queue.push('X');
    queue.push('Y');
    queue.push('Z');
    queue.clear();
    expect(queue.shift()).toBeUndefined();
  });
});
