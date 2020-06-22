import { Kitsu } from 'app/config/api';

/**
 * Fetches post by the given id.
 * @param {any} postId The id of the post
 * @returns {object} post
 */
export const fetchPost = async (postId) => {
  if (!postId) return null;

  try {
    const post = await Kitsu.find('posts', postId, {
      include: 'user,targetUser,targetGroup,media,uploads,spoiledUnit',
    });
    return post;
  } catch (e) {
    console.log(e);
  }
  return null;
};

/**
 * Fetches comment by the given id.
 * @param {any} commentId The id of the comment
 * @returns {object} comment
 */
export const fetchComment = async (commentId) => {
  if (!commentId) return null;

  try {
    const comment = await Kitsu.find('comments', commentId, {
      include: 'user,uploads,parent,parent.user,parent.uploads,post,post.user,post.targetUser,post.targetGroup,post.media,post.uploads,post.spoiledUnit',
    });
    return comment;
  } catch (e) {
    console.log(e);
  }
  return null;
};
