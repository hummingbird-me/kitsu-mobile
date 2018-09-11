import { _BasicCache } from './basicCache';

// Cache for storing feed related items
// These include visible comments etc..
class _FeedCache extends _BasicCache {
  getComments(parentId) {
    if (!parentId) return null;
    return this.get(`comment-${parentId}`);
  }

  setComments(parentId, comments) {
    if (!parentId) return;
    this.set(`comment-${parentId}`, comments);
  }

  hasComments(parentId) {
    if (!parentId) return false;
    return this.has(`comment-${parentId}`);
  }

  getLike(parentId) {
    if (!parentId) return null;
    return this.get(`like-${parentId}`);
  }

  setLike(parentId, like) {
    if (!parentId) return;
    this.set(`like-${parentId}`, like);
  }

  deleteLike(parentId) {
    if (!parentId) return;
    this.delete(`like-${parentId}`);
  }
}

export const FeedCache = new _FeedCache();
