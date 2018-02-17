
import { trimStart, trimEnd } from 'lodash';

const getHttpUrls = (url) => {
  // A quick hack to return both the http and https url
  if (url.indexOf('http:') === -1 && url.indexOf('https:') === -1) return [url];
  const cleanedUrl = url.replace('https:', '').replace('http:', '');
  return [`http:${cleanedUrl}`, `https:${cleanedUrl}`];
};

/**
 * Remove any embed image/video links from content in the given post.
 * This will also work with comments.
 *
 * @param {Object} post A feed post
 * @returns The processed post without embed links in their content
 */
export const preprocessFeedPost = (post) => {
  // Remove embed image & video url from the content
  if (post.embed) {
    const image = post.embed.image;
    const video = post.embed.video;

    if (image) {
      getHttpUrls(image.url || '').forEach((url) => {
        // eslint-disable-next-line no-param-reassign
        post.content = post.content.replace(url, '');
      });
    }

    if (video) {
      getHttpUrls(video.url || '').forEach((url) => {
        // eslint-disable-next-line no-param-reassign
        post.content = post.content.replace(url, '');
      });
    }
  }

  // finally trim the content
  // eslint-disable-next-line no-param-reassign
  post.content = trimEnd(trimStart(post.content));

  return post;
};

/**
 * Remove any embed image/video links from content in the given post array.
 * This will also work with comments.
 *
 * @param {Array} posts An array of posts
 * @returns The processed posts without embed links in their content
 */
export const preprocessFeedPosts = posts => posts.map(preprocessFeedPost);

/**
 * Extract feed objects from the given results.
 *
 * @param {any} result The JSON results from feed fetch.
 */
export const preprocessFeed = (result) => {
  const data = [];

  result.forEach((group) => {
    group.activities.forEach((activity) => {
      if (!activity.subject) { return; }
      data.push(activity.subject);

      // Since we don't support comment posts properly yet,
      // if it's a comment post, just include the actual post as well.
      if (activity.target && activity.target.length > 0) {
        data.push(...activity.target);
      }
    });
  });

  return preprocessFeedPosts(data);
};
