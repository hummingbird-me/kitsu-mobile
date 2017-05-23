import { AccessToken } from 'react-native-fbsdk';
import * as types from '../types';
import { auth, Kitsu, setToken } from '../../config/api';
import { kitsuConfig } from '../../config/env';

export const loginUser = data => async (dispatch) => {
  dispatch({ type: types.LOGIN_USER });
  let tokens = null;
  try {
    if (data) {
      const user = await auth.owner.getToken(data.username, data.password);
      tokens = user.data;
    } else {
      const userFb = await loginUserFb();
      tokens = await userFb.json();
    }
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: { data: tokens } });
    setToken(tokens.access_token);
    Kitsu.findAll('users', {
      fields: {
        users: 'id,name',
      },
      filter: { self: true },
      page: { limit: 1 },
    }).then((response) => {
      console.log(response);
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.LOGIN_USER_FAIL,
      payload: { error: 'Wrong credentials' },
    });
  }
};

const loginUserFb = async () => {
  const data = await AccessToken.getCurrentAccessToken();
  const result = await fetch(`${kitsuConfig.baseUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'assertion',
      assertion: data.accessToken.toString(),
      provider: 'facebook',
    }),
  });
  return result;
};
export const logoutUser = () => (dispatch) => {
  dispatch({ type: types.LOGOUT_USER });
};
