
import { FetchCache } from './fetchCache';
import { ImageSizeCache } from './imageSizeCache';
import { BasicCache, _BasicCache } from './basicCache';
import { FeedCache } from './feedCache';

const EmbedUrlCache = new _BasicCache();
const ViewMoreTextCache = new _BasicCache();

export {
  BasicCache,
  FetchCache,
  EmbedUrlCache,
  ImageSizeCache,
  ViewMoreTextCache,
  FeedCache,
};
