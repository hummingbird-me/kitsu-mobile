import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import * as types from 'kitsu/store/types';
import { Kitsu, setToken } from 'kitsu/config/api';
import { loginUser } from 'kitsu/store/auth/actions';
import { kitsuConfig } from 'kitsu/config/env';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_CURRENT_USER });
  try {
    const { tokens } = getState().auth;
    if (tokens && tokens.access_token) {
      setToken(tokens.access_token);
    }

    const user = await Kitsu.findAll('users', {
      fields: {
        users:
          'id,slug,name,createdAt,email,avatar,coverImage,about,ratingSystem,shareToGlobal,sfwFilter,ratingSystem,facebookId,titleLanguagePreference,status,hasPassword',
      },
      filter: { self: true },
    });

    if (user.length > 0) {
      dispatch({ type: types.FETCH_CURRENT_USER_SUCCESS, payload: user[0] });
      createOneSignalPlayer(dispatch, getState);
      return user[0];
    }

    dispatch({ type: types.FETCH_CURRENT_USER_FAIL, payload: 'No user found in request' });

    // Right interesting case here, there may be a case where api returns empty data array. No idea what causes it (maybe null tokens)
    // Now tokens might be null because redux persist hasn't loaded in the data yet.
    // Just incase, we return null since if it is indeed a user not logged in then somewhere down the line we'll get a 401 and the app will handle it
    return null;
  } catch (e) {
    dispatch({ type: types.FETCH_CURRENT_USER_FAIL, payload: 'Failed to load user' });
    throw e;
  }
};

export const getAccountConflicts = () => async (dispatch, getState) => {
  dispatch({ type: types.GET_ACCOUNT_CONFLICTS });
  const token = getState().auth.tokens.access_token;
  try {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const payload = await fetch(`${kitsuConfig.baseUrl}/edge/users/_conflicts`, {
      method: 'GET',
      headers,
    }).then(res => res.json());
    dispatch({ type: types.GET_ACCOUNT_CONFLICTS_SUCCESS, payload });
  } catch (e) {
    dispatch({ type: types.GET_ACCOUNT_CONFLICTS_FAIL, payload: 'Failed to load user' });
  }
};

export const resolveAccountConflicts = account => async (dispatch, getState) => {
  dispatch({ type: types.RESOLVE_ACCOUNT_CONFLICTS });
  const token = getState().auth.tokens.access_token;
  try {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify({
      chosen: account,
    });
    const payload = await fetch(`${kitsuConfig.baseUrl}/edge/users/_conflicts`, {
      method: 'POST',
      headers,
      body,
    }).then(res => res.json());
    dispatch({ type: types.RESOLVE_ACCOUNT_CONFLICTS_SUCCESS, payload });
    return true;
  } catch (e) {
    dispatch({ type: types.RESOLVE_ACCOUNT_CONFLICTS_FAIL, payload: 'Failed to load user' });
    return false;
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
    loginUser(data, nav, 'signup')(dispatch, getState);

    // TODO: Add user object to redux
    dispatch({ type: types.CREATE_USER_SUCCESS, payload: {} });
    dispatch({ type: types.CLEAR_FBUSER });
  } catch (e) {
    dispatch({ type: types.CREATE_USER_FAIL, payload: e });
  }
};

export const connectFBUser = () => async (dispatch, getState) => {
  dispatch({ type: types.CONNECT_FBUSER });
  const infoRequest = new GraphRequest(
    '/me',
    {
      httpMethod: 'GET',
      version: 'v2.5',
      parameters: {
        fields: {
          string: 'email, name, gender',
        },
      },
    },
    async (error, fbdata) => {
      if (!error) {
        const token = getState().auth.tokens.access_token;
        const currentUser = getState().user.currentUser;
        setToken(token);
        try {
          await Kitsu.update('users', { id: currentUser.id, facebookId: fbdata.id });
          dispatch({ type: types.CONNECT_FBUSER_SUCCESS, payload: fbdata.id });
        } catch (e) {
          dispatch({ type: types.CONNECT_FBUSER_FAIL, payload: 'Failed to connect Facebook user' });
          console.log(e);
        }
      } else {
        console.log(error);
        dispatch({ type: types.CONNECT_FBUSER_FAIL, payload: 'Failed to connect Facebook user' });
      }
    },
  );
  new GraphRequestManager().addRequest(infoRequest).start();
};

export const disconnectFBUser = () => async (dispatch, getState) => {
  dispatch({ type: types.DISCONNECT_FBUSER });
  const token = getState().auth.tokens.access_token;
  const currentUser = getState().user.currentUser;
  setToken(token);
  try {
    await Kitsu.update('users', { id: currentUser.id, facebookId: null });
    dispatch({ type: types.DISCONNECT_FBUSER_SUCCESS });
    LoginManager.logOut();
  } catch (e) {
    dispatch({ type: types.DISCONNECT_FBUSER_FAIL, payload: 'Failed to disconnect fb user' });
    console.log(e);
  }
};

export const updateGeneralSettings = data => async (dispatch, getState) => {
  dispatch({ type: types.UPDATE_GENERAL_SETTINGS });
  const { user, auth } = getState();
  const { id } = user.currentUser;
  const token = auth.tokens.access_token;
  setToken(token);
  try {
    // Update everything we have.
    const payload = data;
    await Kitsu.update('users', { id, ...payload });
    delete payload.password; // Don't keep password.
    dispatch({ type: types.UPDATE_GENERAL_SETTINGS_SUCCESS, payload });
    return null;
  } catch (e) {
    dispatch({ type: types.UPDATE_GENERAL_SETTINGS_FAIL, payload: e && e[0] });
    return (e && e[0]) || 'Something went wrong';
  }
};

export const updateLibrarySettings = data => async (dispatch, getState) => {
  dispatch({ type: types.UPDATE_LIBRARY_SETTINGS });
  const { user, auth } = getState();
  const { id } = user.currentUser;
  const token = auth.tokens && auth.tokens.access_token;
  if (token) {
    setToken(token);
  }
  try {
    await Kitsu.update('users', { id, ...data });
    dispatch({ type: types.UPDATE_LIBRARY_SETTINGS_SUCCESS, payload: data });
    return true;
  } catch (e) {
    dispatch({ type: types.UPDATE_LIBRARY_SETTINGS_FAIL });
  }
  return false;
};

const createOneSignalPlayer = async (dispatch, getState) => {
  const { playerId, playerCreated, currentUser } = getState().user;
  if (!playerCreated) {
    dispatch({ type: types.CREATE_PLAYER });
    try {
      await Kitsu.create('oneSignalPlayers', {
        playerId,
        platform: 'mobile',
        user: currentUser,
      });
      dispatch({ type: types.CREATE_PLAYER_SUCCESS });
    } catch (e) {
      console.log(e);
      dispatch({ type: types.CREATE_PLAYER_FAIL, payload: 'Failed to register notifications' });
    }
  }
};

export const followUser = userId => async (dispatch, getState) => {
  dispatch({ type: types.USER_FOLLOW_REQUEST });

  const { user: { currentUser: { id } } } = getState();
  const data = {
    follower: { id },
    followed: { id: userId },
  };
  try {
    const response = await Kitsu.create('follows', data);
    dispatch({ type: types.USER_FOLLOW_SUCCESS, payload: response });
  } catch (e) {
    dispatch({ type: types.USER_FOLLOW_FAIL, payload: e });
  }
};
