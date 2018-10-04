import * as React from 'react';
import { View } from 'react-native';
import store from 'kitsu/store/config';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { markNotifications } from 'kitsu/store/feed/actions';
import { connect } from 'react-redux';
import { NotificationOverlay } from 'kitsu/screens/Notifications/NotificationOverlay';
import { Kitsu } from 'kitsu/config/api';
import { isEmpty } from 'lodash';

const isMentioned = (arr, id) => arr.includes(id);

/**
 * Parses notification data into usable objects.
 * Used in in-app notification modal and notification screen render
 *
 * @param {object} activities notification data received from API
 * @param {number} currentUserId logged in user ID
 * @returns {object} notificationData
 *  - {string} notificationData.actorName notification actor name
 *  - {string} notificationData.actorAvatar notification actor avatar URL
 *  - {string} notificationData.text notification text (ex: mentioned you.)
 *  - {string} notificationData.others other users involved in notification
 */
export const parseNotificationData = (activities, currentUserId) => {
  const notificationData = {
    actorName: null,
    actorAvatar: null,
    text: '',
    others: null,
  };

  const activity = activities[0];
  const { replyToType, replyToUser, mentionedUsers, target, subject, actor } = activity;

  // actor
  notificationData.actorName = (actor && actor.name) || '-';

  notificationData.actorAvatar = actor && actor.avatar && actor.avatar.tiny
    ? actor.avatar.tiny
    : 'https://staging.kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png';

  // others
  if (activities.length > 1) {
    notificationData.others =
      activities.length === 2
        ? activities[1].actor ? activities[1].actor.name : 'Unknown '
        : `${activities.length - 1} others`;
  }

  // text
  switch (activity.verb) {
    case 'follow':
      notificationData.text = 'followed you.';
      break;
    case 'post':
      notificationData.text = 'mentioned you in a post.';
      break;
    case 'post_like':
      notificationData.text = 'liked your post.';
      break;
    case 'comment_like':
      notificationData.text = 'liked your comment.';
      break;
    case 'invited':
      notificationData.text = 'invited you to a group.';
      break;
    case 'vote':
      notificationData.text = 'liked your reaction.';
      break;
    case 'aired': {
      const isAnime = actor && actor.type === 'anime';
      const type = isAnime ? 'Episode' : 'Chapter';
      const state = isAnime ? 'aired' : 'released';
      notificationData.actorName = type;
      notificationData.actorAvatar = (actor && actor.posterImage && actor.posterImage.tiny) ||
        notificationData.actorAvatar; // Fallback to default avatar

      if (subject && subject.number > 0) {
        notificationData.text = `${subject.number} of ${actor.canonicalTitle} ${state}.`;
      } else { // No `Episode` or `Chapter` relationship exists...
        notificationData.text = `${actor.canonicalTitle} ${state} a new ${type}.`;
      }

      // Don't bother showing other airing
      notificationData.others = null;
      break;
    }
    case 'comment':
      if (replyToUser && currentUserId === replyToUser.split(':')[1]) {
        notificationData.text = `replied to your ${replyToType}.`;
      } else if (isMentioned(mentionedUsers || [], currentUserId)) {
        notificationData.text = 'mentioned you in a comment.';
      } else {
        notificationData.text = 'replied to';
        if (target && target[0] && target[0].user) {
          if (actor && target[0].user.id === actor.id) {
            notificationData.text = `${notificationData.text} their`;
          } else if (target[0].user.id === currentUserId) {
            notificationData.text = `${notificationData.text} your`;
          } else {
            notificationData.text = `${notificationData.text} a`;
          }
        } else {
          notificationData.text = `${notificationData.text} a`;
        }
        notificationData.text = `${notificationData.text} post.`;
      }
      break;
    default:
      notificationData.text = 'made an action.';
      break;
  }

  return notificationData;
};

/**
 * Handle notifications opened via OneSignal.
 *
 * @param {*} componentId The component id.
 * @param {*} data The notification data.
 */
export const handleOneSignalNotificationData = async (componentId, data) => {
  if (!data) return;

  const { type, id } = data;

  switch (type) {
    case 'follows' : {
      const user = await fetchFollower(id);
      if (user) {
        Navigation.push(componentId, {
          component: {
            name: Screens.PROFILE_PAGE,
            passProps: { userId: user.id },
          },
        });
      }
      break;
    }
    case 'post-likes': {
      const postLike = await fetchPostLike(id);
      if (postLike && postLike.post) {
        navigateToPostDetails(componentId, postLike.post);
      }
      break;
    }
    case 'posts': {
      const post = await fetchPost(id);
      if (post) {
        navigateToPostDetails(componentId, post);
      }
      break;
    }
    case 'comment-likes': {
      const commentLike = await fetchCommentLike(id);
      const comment = commentLike && commentLike.comment;
      if (comment) {
        // If the comment isn't part of another comment then show the post
        if (!comment.parent && comment.post) {
          navigateToPostDetails(componentId, comment.post, [comment]);
        } else if (comment.parent) {
          // Otherwise show the main comment parent then the actual comment
          navigateToPostDetails(componentId, comment.parent, [comment]);
        } else {
          // Otherwise just show the comment
          navigateToPostDetails(componentId, comment);
        }
      }
      break;
    }
    case 'comments': {
      const comment = await fetchComment(id);
      if (comment) {
        // If the comment isn't part of another comment then show the post
        if (!comment.parent && comment.post) {
          navigateToPostDetails(componentId, comment.post, [comment]);
        } else if (comment.parent) {
          // Otherwise show the main comment parent then the actual comment
          navigateToPostDetails(componentId, comment.parent, [comment]);
        } else {
          // Otherwise just show the comment
          navigateToPostDetails(componentId, comment);
        }
      }
      break;
    }
    default:
      console.log('Unhandled notification: ', data);
      break;
  }
};


/**
 * Handle notification press event.
 * Calling this function will trigger the relevant navigation actions.
 *
 * @param {*} componentId The component id to push a view onto.
 * @param {*} notification The notification
 */
export const handleNotificationPress = async (componentId, notification) => {
  const activity = notification && notification.activities && notification.activities[0];
  if (!activity) return;

  const { target, verb, actor, subject } = activity;
  const currentUser = store.getState().user.currentUser;

  switch (verb) {
    case 'follow':
      Navigation.push(componentId, {
        component: {
          name: Screens.PROFILE_PAGE,
          passProps: { userId: actor.id || currentUser.id },
        },
      });
      break;
    case 'invited':
      break;
    case 'vote':
      try {
        const response = await fetchMediaReactions(target[0].id);
        Navigation.push(componentId, {
          component: {
            name: Screens.MEDIA_PAGE,
            passProps: {
              mediaId: (response.anime && response.anime.id) || (response.manga && response.manga.id),
              mediaType: response.anime ? 'anime' : 'manga',
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
      break;
    case 'post':
      if (subject) {
        navigateToPostDetails(componentId, subject);
      } else { // should be a "mention"
        const post = await fetchPostFromActivity(activity);
        if (post) {
          navigateToPostDetails(componentId, post);
        }
      }
      break;
    case 'post_like':
    case 'comment_like':
    case 'comment':
      if (target.length !== 0) {
        navigateToPostDetails(componentId, target[0]);
      }
      break;
    case 'aired':
      // Make sure we have a media item
      if (!actor) break;

      // Try to take user to the episode/chapter discussion page
      if (subject) {
        Navigation.push(componentId, {
          component: {
            name: Screens.MEDIA_UNIT_DETAIL,
            passProps: {
              unit: subject,
              media: actor,
            },
          },
        });
      // If that fails then take them to the media page instead
      } else if (actor.id && actor.type) {
        Navigation.push(componentId, {
          component: {
            name: Screens.MEDIA_PAGE,
            passProps: {
              mediaId: actor.id,
              mediaType: actor.type,
            },
          },
        });
      }
      break;
    default:
      break;
  }

  // Mark notification as read
  if (notification && !notification.isRead) {
    await store.dispatch(markNotifications([notification], 'read'));
  }
};


/**
 * Add a NotificationHOC wrapper around a component
 *
 * @param {*} Component The component to add the wrapper around.
 * @returns Wrapped Component.
 */
export const withNotifications = (Component) => {
  class NotificationHOC extends React.PureComponent {
    constructor(props) {
      super(props);
      this.isVisible = false;
      Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
      this.isVisible = true;
    }

    componentDidDisappear() {
      this.isVisible = false;
    }

    render() {
      const { inAppNotification, ...props } = this.props;
      const showNotification = this.isVisible && inAppNotification && inAppNotification.visible;
      return (
        <View style={{ flex: 1 }}>
          <Component {...props} />
          {showNotification && <NotificationOverlay notification={inAppNotification.data} />}
        </View>
      );
    }
  }

  const mapStateToProps = ({ feed }) => {
    const { inAppNotification } = feed;
    return { inAppNotification };
  };

  return connect(mapStateToProps)(NotificationHOC);
};

const navigateToPostDetails = (componentId, post, comments = []) => {
  const currentUser = store.getState().user.currentUser;

  if (post) {
    Navigation.push(componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: {
          post,
          comments,
          showLoadMoreComments: !isEmpty(comments),
          like: null,
          currentUser,
        },
      },
    });
  }
};


/**
 * Fetches media reaction.
 * @param {number} mediaId Media ID of notification target ID.
 */
// TODO: temporary request to fetch mediareactions & to navigate corresponding
// media screen. (since we don't have mediareactions screen right now)
const fetchMediaReactions = async mediaId =>
  Kitsu.find('mediaReactions', mediaId, {
    include: 'user,anime,manga',
  });

/**
* Fetches post by extracting postId from activity foreignId.
* Created for fetching mentions in a hacky way.
* @param {object} activity Activity object from notifications
* @returns {object} post
*/
const fetchPostFromActivity = async (activity) => {
  if (!activity.foreignId) return null;
  const postId = activity.foreignId.split(':')[1];
  return fetchPost(postId);
};

/**
 * Fetches post by the given id.
 * @param {any} postId The id of the post
 * @returns {object} post
 */
const fetchPost = async (postId) => {
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
 * Fetches the post like by the given id
 *
 * @param {*} postLikeId The id of the post like
 * @returns {object} postLike
 */
const fetchPostLike = async (postLikeId) => {
  if (!postLikeId) return null;

  try {
    const postLike = await Kitsu.find('postLikes', postLikeId, {
      include: 'post,post.user,post.targetUser,post.targetGroup,post.media,post.uploads,post.spoiledUnit',
    });
    return postLike;
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
const fetchComment = async (commentId) => {
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


/**
 * Fetches the comment like by the given id
 *
 * @param {*} commentLikeId The id of the comment like
 * @returns {object} commentLike
 */
const fetchCommentLike = async (commentLikeId) => {
  if (!commentLikeId) return null;

  try {
    const commentLike = await Kitsu.find('commentLikes', commentLikeId, {
      include: 'comment,comment.user,comment.uploads,comment.parent,comment.parent.user,comment.parent.uploads,comment.post,comment.post.user,comment.post.targetUser,comment.post.targetGroup,comment.post.media,comment.post.uploads,comment.post.spoiledUnit',
    });
    return commentLike;
  } catch (e) {
    console.log(e);
  }

  return null;
};

/**
 * Fetches a user from a follows id
 *
 * @param {*} followsId The follows id
 * @returns {object} user
 */
const fetchFollower = async (followsId) => {
  if (!followsId) return null;
  try {
    const follow = await Kitsu.find('follows', followsId, {
      include: 'follower',
    });
    return follow && follow.follower;
  } catch (e) {
    console.log(e);
  }
  return null;
};
