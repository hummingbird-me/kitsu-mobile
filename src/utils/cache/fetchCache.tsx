// A cache for fetch requests.
class _FetchCache {
  FETCH_CACHE = {};
  CACHE_TIME_HOUR = 2;

  constructor(cacheTimeHour = 2) {
    this.CACHE_TIME_HOUR = cacheTimeHour;
  }

  get(request) {
    // cached result?
    if (this.FETCH_CACHE[request]) {
      // Expired?
      if ((new Date()) > this.FETCH_CACHE[request].expiry) {
        delete this.FETCH_CACHE[request];
      } else {
        return this.FETCH_CACHE[request].promise;
      }
    }

    // execute and then cache with expiry date
    const promise = fetch(request).then(r => r.json());
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (this.CACHE_TIME_HOUR * 60 * 60 * 1000));
    this.FETCH_CACHE[request] = {
      promise,
      expiry,
    };
    return promise;
  }
}

export const FetchCache = new _FetchCache();
