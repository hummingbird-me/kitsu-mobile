import { AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import * as types from '../types';
import { auth } from '../../config/api';
import { kitsuConfig } from '../../config/env';

export const loginUser = (data, nav, screen) => async (dispatch) => {
  dispatch({ type: types.LOGIN_USER });
  let tokens = null;
  const loginAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
  });

  if (data) {
    const user = await auth.owner.getToken(data.username, data.password);
    tokens = user.data;
  } else {
    const userFb = await loginUserFb(dispatch);
    if (userFb.status !== 401) {
      tokens = await userFb.json();
    } else if (screen !== 'signup') {
      nav.dispatch(NavigationActions.navigate({ routeName: 'Signup' }));
    }
  }
  if (tokens) {
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: { data: tokens } });
    nav.dispatch(loginAction);
  } else {
    dispatch({
      type: types.LOGIN_USER_FAIL,
      payload: null,
    });
  }
  // } catch (e) {
  //   console.log(e);
  //   dispatch({
  //     type: types.LOGIN_USER_FAIL,
  //     payload: 'Wrong credentials',
  //   });
  // }
};

const loginUserFb = async (dispatch) => {
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
  // Create a graph request asking for user information with a callback to handle the response.
  dispatch({ type: types.GET_FBUSER });
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
    (error, fbdata) => {
      dispatch({ type: types.GET_FBUSER_SUCCESS, payload: fbdata });
    },
  );
  // Start the graph request.
  new GraphRequestManager().addRequest(infoRequest).start();
  return result;
};
export const logoutUser = nav => (dispatch) => {
  const loginAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
    key: null,
  });
  nav.dispatch(loginAction);
  dispatch({ type: types.LOGOUT_USER });
};
