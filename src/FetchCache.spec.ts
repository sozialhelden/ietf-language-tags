import FetchCache from './FetchCache';

// basic" | "cors" | "default" | "error" | "opaque" | "opaqueredirect";

// const createFetch = (
//   shouldResolve: boolean,
//   shouldReject: boolean,
//   response?: Response,
//   error?: any
// ): ((url: string, requestInit: RequestInit) => Promise<Response>) =>

//   jest.fn((url, requestInit: RequestInit) => {
//     return new Promise((resolve, reject) => {
//       setImmediate(() => {
//         if (shouldResolve) {
//           resolve(response);
//         } else if (shouldReject) {
//           reject(error);
//         }
//       });
//     });
//   });

describe('FetchCache', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basics', () => {
    it('can be initialized', () => {
      const mockResponse = {};
      const fetch = jest.fn().mockResolvedValue(mockResponse);
      new FetchCache({ fetch });
    });

    it('resolves', () => {
      const mockResponse = {};
      const fetch = jest.fn().mockResolvedValue(mockResponse);
      const cache = new FetchCache({ fetch });
      return expect(cache.fetch('url')).resolves.toBe(mockResponse);
    });

    it('rejects', () => {
      const error = new Error('test');
      const fetch = jest.fn().mockRejectedValue(error);
      const cache = new FetchCache({ fetch });
      return expect(cache.fetch('url')).rejects.toBe(error);
    });

    xit('caches');

    xit('supports URL normalization', () => {});
  });

  describe('TTL handling', () => {
    xit('returns cached response before TTL is reached', () => {});
    xit('evicts item after TTL is reached', () => {});
    xit('fetches again after TTL is reached', () => {});
    xit('evicts items with a 404 status, a 200 status, a timeout, and a network error after different TTLs', () => {});
  });

  describe('aborting requests', () => {
    xit('with external signal while running', () => {});
    xit('with external signal after response (as no-op)', () => {});
    xit('with external signal after timeout (as no-op)', () => {});
    xit('with external signal after disposal (as no-op)', () => {});
    xit('aborts requests on timeout', () => {});
    xit('does not try to abort requests after response', () => {});
  });

  describe('state', () => {
    xit('goes to ', () => {});
  });

  describe('3rd party NPM module compatibility', () => {
    xit('`node-fetch`', () => {});
    xit('`isometric-unfetch`', () => {});
    xit("GitHub's `fetch`", () => {});
    xit('`whatwg-fetch`', () => {});
  });

  describe('memory management', () => {
    xit('it cleans up timeouts on eviction');
    xit('disposes everything on timeout');
    xit('disposes everything on external aborting');
  });
});
