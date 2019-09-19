
import { isEmpty } from 'lodash';
import { extractUrls } from 'kitsu/utils/url';

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

  // Save original content before we make any edits to it
  // eslint-disable-next-line no-param-reassign
  post.originalContent = post.content;

  /* Remove embed image & video url from the content
    We only want to do this if:
      - We don't have uploads
      - Only 1 url is present
  */
  const urls = extractUrls(post.content);
  if (post.embed && isEmpty(post.uploads) && urls.length <= 1) {
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

  // Finally trim the content
  // eslint-disable-next-line no-param-reassign
  post.content = (post.content || '').trim();

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
    // We only care about the top-most activity
    const activity = group.activities[0];
    if (!activity) { return; }

    // Push in the `target` if the first activity is a comment. This is a side-effect of
    // comment bumping posts. `target` = the post instance.
    if (activity.target && activity.foreignId.includes('Comment')) {
      const post = activity.target[0];
      data.push(post);
    } else if (activity.subject) {
      data.push(activity.subject);
    }
  });

  return preprocessFeedPosts(data);
};
