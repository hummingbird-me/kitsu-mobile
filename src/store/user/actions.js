import * as types from 'kitsu/store/types';
import { Kitsu, setToken } from 'kitsu/config/api';
import { loginUser } from 'kitsu/store/auth/actions';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_CURRENT_USER });
  const token = getState().auth.tokens.access_token;
  setToken(token);
  try {
    const user = await Kitsu.findAll('users', {
      fields: {
        users: 'id,name,createdAt,email,avatar,about,bio,ratingSystem,shareToGlobal,sfwFilter,linkedAccounts',
      },
      include: 'linkedAccounts',
      filter: { self: true },
    });
    dispatch({ type: types.FETCH_CURRENT_USER_SUCCESS, payload: user[0] });
  } catch (e) {
    dispatch({ type: types.FETCH_CURRENT_USER_FAIL, payload: 'Failed to load user' });
  }
};

export const createUser = (data, nav) => async (dispatch, getState) => {
  dispatch({ type: types.CREATE_USER });
  const { username, email, password } = data;
  const { id, gender } = getState().auth.fbuser;
  const userObj = {
    name: username,
    email,
    password,
  };

  if (id) {
    userObj.facebookId = id;
    userObj.gender = gender;
  }
  try {
    await Kitsu.create('users', userObj);
    loginUser(data, nav)(dispatch);

    // TODO: Add user object to redux
    dispatch({ type: types.CREATE_USER_SUCCESS, payload: {} });
    dispatch({ type: types.CLEAR_FBUSER });
  } catch (e) {
    dispatch({ type: types.CREATE_USER_FAIL, payload: e });
  }
};

export const updatePersonalSettings = data => async (dispatch, getState) => {
  dispatch({ type: types.UPDATE_PERSONAL_SETTINGS });
  const { user, auth } = getState();
  const { id } = user.currentUser.id;
  const token = auth.tokens.access_token;
  setToken(token);
  try {
    const { name, password } = data;
    await Kitsu.update('users', { id, name, password });
    dispatch({ type: types.UPDATE_PERSONAL_SETTINGS_SUCCESS });
  } catch (e) {
    dispatch({ type: types.UPDATE_PERSONAL_SETTINGS_FAIL });
  }
};
