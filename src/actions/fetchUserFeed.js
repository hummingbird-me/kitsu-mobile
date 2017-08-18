import { Kitsu } from 'kitsu/config/api';
import types from './types';

const fetchUserFeed = () => async (dispatch, getState) => {
  // dispatch({
  //   type: types.FETCH_USER_FEED_REQUESTED,
  //   payload: {},
  // });
  // console.log('get state', getState());
  // const result = await Kitsu.one('userFeed');
  // console.log('result', result);
};

export default fetchUserFeed;
