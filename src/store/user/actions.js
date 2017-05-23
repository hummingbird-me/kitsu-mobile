import { NavigationActions } from 'react-navigation';
import * as types from '../types';
import { Kitsu, setToken } from '../../config/api';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_USER });
  const token = getState().auth.tokens.access_token;
  setToken(token);
  try {
    const user = await Kitsu.findAll('users', {
      fields: {
        users: 'id,name,createdAt,email,avatar,about,bio',
      },
      filter: { self: true },
    });
    dispatch({ type: types.FETCH_USER_SUCCESS, payload: user[0] });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_USER_FAIL, payload: 'Failed to load user' });
  }
};
