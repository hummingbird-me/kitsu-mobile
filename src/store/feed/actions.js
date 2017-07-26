import * as types from '../types';
import { Kitsu } from '../../config/api';
import { getStream } from '../../config/stream';

export const getNotifications = (offset = 0) => async (dispatch, getState) => {
  dispatch({ type: types.GET_NOTIFICATIONS });
  const { id } = getState().user.currentUser;
  try {
    const results = await Kitsu.one('activityGroups', id).get({
      page: { limit: 30, offset },
      include: 'target.user,target.post,actor',
      fields: {
        activities: 'time,verb,id',
      },
    });
    if (offset > 0) {
      const { notifications } = getState().feed;
      dispatch({
        type: types.GET_NOTIFICATIONS_SUCCESS,
        payload: [...notifications, ...results],
        meta: results.meta,
      });
      return;
    }
    dispatch({ type: types.GET_NOTIFICATIONS_SUCCESS, payload: [...results], meta: results.meta });
    const notifications = getStream().feed(
      results.meta.feed.group,
      results.meta.feed.id,
      results.meta.feed.token,
    );
    notifications.subscribe(async (data) => {
      const not = await Kitsu.one('activityGroups', id).get({
        page: { limit: 1 },
        include: 'target.user,target.post,actor',
      });
      if (data.new.length > 0) {
        dispatch({ type: types.GET_NOTIFICATIONS_MORE, payload: not, meta: not.meta });
      }
      if (data.deleted.length > 0) {
        dispatch({ type: types.GET_NOTIFICATIONS_LESS, payload: data.deleted[0], meta: not.meta });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const getUserFeed = (userId, cursor, limit = 30) => async (dispatch, getState) => {
  dispatch({ type: types.GET_USER_FEED, payload: Boolean(cursor) });
  try {
    const results = await Kitsu.one('userFeed', userId).get({
      page: { limit, cursor },
      filter: {
        kind: 'media',
        // activitiesVerb: 'post',
      },
      include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry',
    });
    if (cursor) {
      const { userFeed } = getState().feed;
      dispatch({
        type: types.GET_USER_FEED_SUCCESS,
        payload: [...userFeed, ...results],
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
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry',
        filter: {
          kind: 'posts',
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

export const seenNotifications = arr => async (dispatch, getState) => {
  const { id } = getState().user.profile;
  const results = await Kitsu.one('activityGroups', id).all('_seen').post(arr);
  console.log(results);
};
