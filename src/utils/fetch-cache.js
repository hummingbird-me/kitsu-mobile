const FETCH_CACHE = {};
const CACHE_TIME_HOUR = 2;

export function cachedFetch(request) {
  // cached result?
  if (FETCH_CACHE[request]) {
    // Expired?
    if ((new Date()) > FETCH_CACHE[request].expiry) {
      delete FETCH_CACHE[request];
    } else {
      return FETCH_CACHE[request].promise;
    }
  }

  // execute and then cache with expiry date
  const promise = fetch(request).then(r => r.json());
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + (CACHE_TIME_HOUR * 60 * 60 * 1000));
  FETCH_CACHE[request] = {
    promise,
    expiry,
  };
  return promise;
}
