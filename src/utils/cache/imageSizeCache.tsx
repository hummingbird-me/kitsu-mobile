import { _BasicCache } from './basicCache';

// A Cache for storing image sizes
class _ImageSizeCache extends _BasicCache {
  set(url, width, height) {
    super.set(url, { width, height });
  }
}

export const ImageSizeCache = new _ImageSizeCache();
