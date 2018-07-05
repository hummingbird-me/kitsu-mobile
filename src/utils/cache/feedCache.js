import { BasicCache } from './basicCache';

// Cache for storing feed related items
// These include visible comments etc..
class _FeedCache {
  getComments(parentId) {
    if (!parentId) return null;
    return BasicCache.get(`feedComments-${parentId}`);
  }

  setComments(parentId, comments) {
    if (!parentId) return;
    BasicCache.set(`feedComments-${parentId}`, comments);
  }

  getLike(parentId) {
    if (!parentId) return null;
    return BasicCache.get(`feedLike-${parentId}`);
  }

  setLike(parentId, like) {
    if (!parentId) return;
    BasicCache.set(`feedLike-${parentId}`, like);
  }

  deleteLike(parentId) {
    if (!parentId) return;
    BasicCache.delete(`feedLike-${parentId}`);
  }

  clear() {
    BasicCache.clear(key => key.includes('feedComments') || key.includes('feedLike'));
  }

  hasComments(parentId) {
    if (!parentId) return false;
    return BasicCache.has(`feedComments-${parentId}`);
  }
}

export const FeedCache = new _FeedCache();
