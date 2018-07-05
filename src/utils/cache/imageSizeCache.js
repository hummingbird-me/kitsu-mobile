import { BasicCache } from './basicCache';

// A Cache for storing image sizes
class _ImageSizeCache {
  get(url) {
    if (!url) return null;
    return BasicCache.get(`imageSize-${url}`);
  }

  set(url, width, height) {
    if (!url) return;
    const key = `imageSize-${url}`;
    BasicCache.set(key, { width, height });
  }

  clear() {
    BasicCache.clear(key => key.includes('imageSize'));
  }

  has(url) {
    if (!url) return false;
    const key = `imageSize-${url}`;
    return BasicCache.has(key);
  }
}

export const ImageSizeCache = new _ImageSizeCache();
