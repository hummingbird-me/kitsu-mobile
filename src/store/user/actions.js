import * as types from '../types';
import { Kitsu, setToken } from '../../config/api';
import { loginUser } from '../auth/actions';
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

export const createUser = (data, nav) => async (dispatch, getState) => {
  dispatch({ type: types.CREATE_USER });
  const { username, email, password } = data;
  const { id, gender } = getState().auth.fbuser;
  console.log(getState().auth);
  console.log(data);
  const userObj = {
    name: username,
    email,
    password,
  };

  if (id) {
    userObj.facebookId = id;
    userObj.gender = gender;
  }
  console.log(userObj);
  try {
    const user = await Kitsu.create('users', userObj);
    loginUser(data, nav)(dispatch);
    dispatch({ type: types.CREATE_USER_SUCCESS, payload: {} });
    dispatch({ type: types.CLEAR_FBUSER });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.CREATE_USER_FAIL, payload: e });
  }
};
