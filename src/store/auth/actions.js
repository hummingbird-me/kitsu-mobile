import { AccessToken } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import * as types from '../types';
import { auth, Kitsu, setToken } from '../../config/api';
import { kitsuConfig } from '../../config/env';

export const loginUser = (data, nav) => async (dispatch) => {
  dispatch({ type: types.LOGIN_USER });
  let tokens = null;
  const loginAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    key: null,
  });
  try {
    if (data) {
      const user = await auth.owner.getToken(data.username, data.password);
      tokens = user.data;
    } else {
      const userFb = await loginUserFb();
      tokens = await userFb.json();
    }
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: { data: tokens } });
    // dispatch(loginAction)
    nav.dispatch(loginAction);
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.LOGIN_USER_FAIL,
      payload: 'Wrong credentials',
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
export const logoutUser = (nav) => (dispatch) => {
  const loginAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
    key: null,
  });
  nav.dispatch(loginAction);  
  dispatch({ type: types.LOGOUT_USER });
};
