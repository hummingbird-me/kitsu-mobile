import types from './types';
import { Kitsu } from '../config/api';

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
