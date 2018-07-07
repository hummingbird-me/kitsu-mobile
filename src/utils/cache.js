
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

// A Cache for storing image sizes
class _ImageSizeCache {
  CACHE = {};

  get(uri) {
    if (!uri) return null;
    return this.CACHE[uri];
  }

  set(uri, width, height) {
    if (uri) {
      this.CACHE[uri] = { width, height };
    }
  }

  clear() {
    this.CACHE = {};
  }

  contains(uri) {
    if (!uri) return false;
    return Object.keys(this.CACHE).includes(uri);
  }
}

export const ImageSizeCache = new _ImageSizeCache();

// Cache for storing embed objects belonging to a url
class _EmbedUrlCache {
  CACHE = {};

  get(url) {
    if (!url) return null;
    return this.CACHE[url];
  }

  set(url, embed) {
    if (url) {
      this.CACHE[url] = embed;
    }
  }

  clear() {
    this.CACHE = {};
  }

  contains(url) {
    if (!url) return false;
    return Object.keys(this.CACHE).includes(url);
  }
}

export const EmbedUrlCache = new _EmbedUrlCache();
