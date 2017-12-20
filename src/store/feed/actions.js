import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';
import { getStream } from 'kitsu/config/stream';
import { kitsuConfig } from 'kitsu/config/env';

const feedInclude =
  'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga';

export const getUserFeed = (userId, cursor, limit = 10) => async (dispatch, getState) => {
  dispatch({ type: types.GET_USER_FEED, payload: Boolean(cursor) });
  try {
    const results = await Kitsu.one('userFeed', userId).get({
      page: { limit, cursor },
      filter: {
        // kind: 'posts',
      },
      include: feedInclude,
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
        include: feedInclude,
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
      include: feedInclude,
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
        include: feedInclude,
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
  dispatch({ type: types.FETCH_NOTIFICATIONS, loadingMoreNotifications: !!cursor });
  const { id } = getState().user.currentUser;
  const { notifications } = getState().feed;
  try {
    const results = await Kitsu.one('activityGroups', id).get({
      page: { limit, cursor },
      include: 'target.user,target.post,actor',
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
    dispatch({ type: types.FETCH_NOTIFICATIONS_SUCCESS, payload: [...results], meta: results.meta });
    const notificationsStream = getStream().feed(
      results.meta.feed.group,
      results.meta.feed.id,
      results.meta.feed.token,
    );
    notificationsStream.subscribe(async (data) => {
      const not = await Kitsu.one('activityGroups', id).get({
        page: { limit: 1 },
        include: 'target.user,target.post,actor',
      });
      if (data.new.length > 0) {
        dispatch({ type: types.FETCH_NOTIFICATIONS_MORE, payload: not, meta: not.meta });
      }
      if (data.deleted.length > 0) {
        dispatch({ type: types.FETCH_NOTIFICATIONS_LESS, payload: data.deleted[0], meta: not.meta });
      }
    });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_NOTIFICATIONS_FAIL, payload: e });
  }
};

export const markNotifications = notifs => async (dispatch, getState) => {
  const { id } = getState().user.currentUser;
  const token = getState().auth.tokens.access_token;

  // TODO: this can be rewritten with Devour.
  fetch(`${kitsuConfig.baseUrl}/edge/feeds/notifications/${id}/_read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(notifs),
  });
};

export const markNotificationsAsSeen = () => async (dispatch, getState) => {
  const token = getState().auth.tokens.access_token;
  const { id } = getState().user.currentUser;
  const { notifications } = getState().feed;
  const notificationsUnseen = notifications.filter(v => !v.isSeen).map(v => v.id);

  dispatch({ type: types.MARK_AS_SEEN });
  try {
    // TODO: Use Devour: Manually fetching results in ugly response,
    // which also makes reducer more complicated than it should be.
    const results = await fetch(`${kitsuConfig.baseUrl}/edge/feeds/notifications/${id}/_seen`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.api+json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(notificationsUnseen),
    }).then(response => response.json());
    dispatch({ type: types.MARK_AS_SEEN_SUCCESS, payload: results.data });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.MARK_AS_SEEN_FAIL });
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
