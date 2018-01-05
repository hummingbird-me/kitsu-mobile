
import { unescape } from 'lodash';

export const preprocessFeed = (result) => {
  let data = [];

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

  // Pull images out of HTML and replace in content.
  // Regex is the absolutely wrong tool for this job, but we're against a wall on
  // timings and we should probably just structure actual posts better anyway so
  // the app actually knows what kind of post they are and gets the content
  // in the right structure to render them rather than guessing from HTML.
  const imagePattern = /<img[^>]+src="(.+?)"\/?>/ig;
  const videoPattern = /<a href="(.+?youtube.+?)".+?>.+?<\/a>/ig;

  let lastMatch;
  data = data.map((post) => {
    const images = [];
    // eslint-disable-next-line no-cond-assign
    while ((lastMatch = imagePattern.exec(post.contentFormatted)) !== null) {
      const imageUri = unescape(lastMatch[1]);

      images.push(imageUri);
      // eslint-disable-next-line no-param-reassign
      post.content = post.content.replace(imageUri, '');
    }

    // If they're embedding a video the URL will show up in the content.
    // Remove it there too.
    if (post.embed && post.embed.video && post.embed.video.url) {
      // eslint-disable-next-line no-cond-assign
      while ((lastMatch = videoPattern.exec(post.contentFormatted)) !== null) {
        const videoUri = unescape(lastMatch[1]);

        // eslint-disable-next-line no-param-reassign
        post.content = post.content.replace(videoUri, '');
      }
    }

    return {
      ...post,
      images,
    };
  });

  return data;
};
