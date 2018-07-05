import { BasicCache } from './basicCache';

// Cache for storing embed objects belonging to a url
class _EmbedUrlCache {
  get(url) {
    if (!url) return null;
    return BasicCache.get(`embedUrl-${url}`);
  }

  set(url, embed) {
    if (!url) return;
    const key = `embedUrl-${url}`;
    BasicCache.set(key, embed);
  }

  clear() {
    BasicCache.clear(key => key.includes('embedUrl'));
  }

  has(url) {
    if (!url) return false;
    const key = `embedUrl-${url}`;
    return BasicCache.has(key);
  }
}

export const EmbedUrlCache = new _EmbedUrlCache();
