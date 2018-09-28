
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
  notificationData.actorName = (actor && actor.name && `${actor.name} `) || '-';

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
    case 'aired':
      const isAnime = actor && actor.type === 'anime';
      const type = isAnime ? 'Episode' : 'Chapter';
      const state = isAnime ? 'aired' : 'released';
      notificationData.actorName = type;
      notificationData.actorAvatar = actor && actor.posterImage && actor.posterImage.tiny ||
        notificationData.actorAvatar; // Fallback to default avatar
      if (subject && subject.number > 0) {
        notificationData.text = `${subject.number} of ${actor.canonicalTitle} ${state}`;
      } else { // No `Episode` or `Chapter` relationship exists...
        notificationData.text = `${actor.canonicalTitle} ${state} a new ${type}`;
      }
      break;
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