import { BasicCache } from './basicCache';

// A cache for storing height of ViewMoreText
class _ViewMoreTextCache {
  get(key) {
    if (!key) return null;
    return BasicCache.get(`viewMore-${key}`);
  }

  set(key, height) {
    if (!key) return;
    BasicCache.set(`viewMore-${key}`, height);
  }

  clear() {
    BasicCache.clear(key => key.includes('viewMore'));
  }

  has(key) {
    if (!key) return false;
    return BasicCache.has(`viewMore-${key}`);
  }
}

export const ViewMoreTextCache = new _ViewMoreTextCache();
