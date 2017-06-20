import * as types from '../types';
import { Kitsu } from '../../config/api';
import { getStream } from '../../config/stream';

export const getNotifications = (offset = 0) => async (dispatch, getState) => {
  dispatch({ type: types.GET_NOTIFICATIONS });
  const { id } = getState().user.profile;
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

export const seenNotifications = arr => async (dispatch, getState) => {
  const { id } = getState().user.profile;
  const results = await Kitsu.one('activityGroups', id).all('_seen').post(arr);
  console.log(results);
};
