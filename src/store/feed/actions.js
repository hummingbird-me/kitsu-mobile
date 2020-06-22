import * as types from 'app/store/types';
import { Kitsu } from 'app/config/api';
import { getStream } from 'app/config/stream';
import { kitsuConfig } from 'app/config/env';
import { NavigationActions } from 'app/navigation';
import { BasicCache } from 'app/utils/cache';
import { uniq } from 'lodash';

let inAppNotificationTimer = 0;

/*
Get all the inlcudes required for notifications

*/
const getIncludes = () => {
  const postFields = ['user', 'targetUser', 'targetGroup', 'media', 'uploads', 'spoiledUnit'];
  const commentFields = ['user', 'uploads', 'parent', 'post', 'parent.user', 'parent.uploads', 'parent.post'];

  // The combined fields from post and comments
  const combined = uniq([...postFields, ...commentFields]);
  
  const others = ['anime', 'manga', 'library_entry', 'followed'];
  const targetFields = ['target', 'target.videos', ...combined.map(f => `target.${f}`)];
  const subjectFields = ['subject', 'subject.videos', ...others.map(f => `subject.${f}`), ...combined.map(f => `subject.${f}`)];

  const includeFields = ['media', 'actor', 'unit', ...targetFields, ...subjectFields];
  return includeFields.join(',');
};

export const getUserFeed = (userId, cursor, limit = 10) => async (dispatch, getState) => {
  dispatch({ type: types.GET_USER_FEED, payload: Boolean(cursor) });
  try {
    const results = await Kitsu.one('userFeed', userId).get({
      page: { limit, cursor },
      filter: {
        // kind: 'posts',
      },
      include: getIncludes(),
    });
    const posts = results
      .sort(item => item.activities[0].verb === 'post')
      .map(item => item.activities[0].subject.id);
    // console.log(posts);
    const postLikes = await Kitsu.findAll('postLikes', {
      fields: {
        users: 'avatar,name',
        posts: 'id',
      },
      filter: {
        postId: posts,
      },
      include: 'user,post',
      page: { limit: 4 },
    });
    const likesMap = postLikes.reduce((acc, item) => {
      const curr = acc[item.post.id] || [];
      acc[item.post.id] = [...curr, ...item.user];
      return acc;
    }, {});
    // console.log(likesMap);
    // console.log(postLikes);
    const resultsWithLikes = results.map((item) => {
      if (item.activities[0].verb === 'post' && likesMap[item.activities[0].subject.id]) {
        item.activities.likes = likesMap[item.activities[0].subject.id];
      }
      return item;
    });

    if (cursor) {
      const { userFeed } = getState().feed;
      dispatch({
        type: types.GET_USER_FEED_SUCCESS,
        payload: [...userFeed, ...resultsWithLikes],
        meta: results.meta,
      });
      return;
    }
    dispatch({ type: types.GET_USER_FEED_SUCCESS, payload: [...results], meta: results.meta });
    const userFeed = getStream().feed(
      results.meta.feed.group,
      results.meta.feed.id,
      results.meta.feed.token,
    );
    userFeed.subscribe(async (data) => {
      const not = await Kitsu.one('userFeed', userId).get({
        page: { limit: 1 },
        include: getIncludes(),
        filter: {
          // kind: 'posts',
        },
      });
      if (data.new.length > 0) {
        dispatch({ type: types.GET_USER_FEED_MORE, payload: not, meta: not.meta });
      }
      if (data.deleted.length > 0) {
        dispatch({ type: types.GET_USER_FEED_LESS, payload: data.deleted[0], meta: not.meta });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const getMediaFeed = (mediaId, type, cursor, limit = 10) => async (dispatch, getState) => {
  // console.log(mediaId, type);
  // console.log(cursor);
  dispatch({ type: types.GET_MEDIA_FEED, payload: Boolean(cursor) });
  try {
    const results = await Kitsu.one('mediaFeed', `${_.capitalize(type)}-${mediaId}`).get({
      page: { limit, cursor },
      filter: {
        // kind: 'posts',
      },
      include: getIncludes(),
    });
    if (cursor) {
      const { userFeed } = getState().feed;
      dispatch({
        type: types.GET_MEDIA_FEED_SUCCESS,
        payload: [...userFeed, ...results],
        meta: results.meta,
      });
      return;
    }
    dispatch({ type: types.GET_MEDIA_FEED_SUCCESS, payload: [...results], meta: results.meta });
    const mediaFeed = getStream().feed(
      results.meta.feed.group,
      results.meta.feed.id,
      results.meta.feed.token,
    );
    mediaFeed.subscribe(async (data) => {
      const not = await Kitsu.one('userFeed', mediaId).get({
        page: { limit: 1 },
        include: getIncludes(),
        filter: {
          // kind: 'posts',
        },
      });
      if (data.new.length > 0) {
        dispatch({ type: types.GET_MEDIA_FEED_MORE, payload: not, meta: not.meta });
      }
      if (data.deleted.length > 0) {
        dispatch({ type: types.GET_MEDIA_FEED_LESS, payload: data.deleted[0], meta: not.meta });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchNotifications = (cursor, limit = 30) => async (dispatch, getState) => {
  const { id } = getState().user.currentUser;
  const { notifications } = getState().feed;

  // Make sure we have a valid id
  if (!id) return;

  dispatch({ type: types.FETCH_NOTIFICATIONS, loadingMoreNotifications: !!cursor });
  try {
    const results = await Kitsu.one('activityGroups', id).get({
      page: { limit, cursor },
      include: getIncludes(),
      fields: {
        activities: 'time,verb,id',
      },
    });
    if (cursor) {
      dispatch({
        type: types.FETCH_NOTIFICATIONS_SUCCESS,
        payload: [...notifications, ...results],
        meta: results.meta,
        loadingMoreNotifications: false,
      });
      return;
    }
    dispatch({
      type: types.FETCH_NOTIFICATIONS_SUCCESS,
      payload: [...results],
      meta: results.meta,
      loadingMoreNotifications: false,
    });

    // Subscribe to the notifications
    // Make sure we only subscribed to notifications once
    // This is to avoid duplicate notifications
    const key = `NOTIFICATION_${results.meta.feed.group}_${results.meta.feed.id}`;

    if (!BasicCache.has(key)) {
      const notificationsStream = getStream().feed(
        results.meta.feed.group,
        results.meta.feed.id,
        results.meta.feed.token,
      );

      notificationsStream.subscribe(async (data) => {
        console.log('Notifications stream callback triggered! Fetching more notifications.');
        const not = await Kitsu.one('activityGroups', id).get({
          page: { limit: 1 },
          include: getIncludes(),
        });
        if (data.new.length > 0) {
          dispatch({ type: types.FETCH_NOTIFICATIONS_MORE, payload: not, meta: not.meta });
          // NavigationActions.showNotification(not[0]);
          clearTimeout(inAppNotificationTimer);
          inAppNotificationTimer = setTimeout(() => dispatch(dismissInAppNotification()), 5000);
        }
        if (data.deleted.length > 0) {
          dispatch({
            type: types.FETCH_NOTIFICATIONS_LESS,
            payload: data.deleted[0],
            meta: not.meta,
          });
        }
      });

      BasicCache.set(key, true);
    }
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_NOTIFICATIONS_FAIL, payload: e });
  }
};

export const dismissInAppNotification = () => (dispatch) => {
  dispatch({ type: types.DISMISS_IN_APP_NOTIFICATION });
};

/**
 * Marks notifications as read or seen and updates redux state.
 * @param {object[]} notifications array to be updated
 * @param {string} type seen or read
 */
export const markNotifications = (notifications, type = 'seen') => async (dispatch, getState) => {
  if (type !== 'seen' && type !== 'read') {
    throw Error('Notification Type must be "seen" or "read"');
  }
  const token = getState().auth.tokens.access_token;
  const { id } = getState().user.currentUser;

  // Make sure we have a user
  if (!id) {
    throw Error('User ID is not valid');
  }

  // Make sure we have a token
  if (!token) {
    throw Error('User Tokens are not valid');
  }

  const notificationsFiltered = notifications
    .filter(v => !v[type === 'seen' ? 'isSeen' : 'isRead'])
    .map(v => v.id);

  dispatch({ type: types[`MARK_AS_${type.toUpperCase()}`] });
  try {
    // TODO: Use Devour: Manually fetching results in ugly response,
    // which also makes reducer more complicated than it should be.
    const response = await fetch(`${kitsuConfig.baseUrl}/edge/feeds/notifications/${id}/_${type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.api+json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(notificationsFiltered),
    });

    const results = await response.json();

    dispatch({
      type: types[`MARK_AS_${type.toUpperCase()}_SUCCESS`],
      payload: results.data,
      meta: results.meta,
      notifications,
    });
  } catch (e) {
    console.log(e);
    dispatch({ type: types[`MARK_AS_${type.toUpperCase()}_FAIL`] });
  }
};

export const markAllNotificationsAsRead = () => async (dispatch, getState) => {
  const { id } = getState().user.currentUser;
  dispatch({ type: types.MARK_ALL_AS_READ });
  try {
    // hit _read to mark all read.
    await Kitsu.one('activityGroups', id).get({ mark: 'read' });
    // get notifications
    // getNotifications()(dispatch, getState);
    // or skip that ^, since everything else will remain exactly the same,
    // console.log(results);
    dispatch({ type: types.MARK_ALL_AS_READ_SUCCESS });
  } catch (e) {
    dispatch({ type: types.MARK_ALL_AS_READ_FAIL });
    console.log(e);
  }
};
