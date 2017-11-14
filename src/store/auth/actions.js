import { AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import { auth } from 'kitsu/config/api';
import { kitsuConfig } from 'kitsu/config/env';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { getAccountConflicts, setOnboardingComplete } from 'kitsu/store/onboarding/actions';
import * as types from 'kitsu/store/types';

export const loginUser = (data, nav, screen) => async (dispatch, getState) => {
  dispatch({ type: types.LOGIN_USER });
  let tokens = null;

  if (data) {
    try {
      const user = await auth.owner.getToken(data.username, data.password);
      tokens = user.data;
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      const userFb = await loginUserFb(dispatch);
      if (userFb.status !== 401) {
        tokens = await userFb.json();
      } else if (screen !== 'signup') {
        nav.dispatch(NavigationActions.navigate({ routeName: 'Signup' }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (tokens) {
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: tokens });
    const user = await fetchCurrentUser()(dispatch, getState);
    if (screen === 'signup') {
      const onboardingAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
      });
      nav.dispatch(onboardingAction);
    } else if (user.status === 'aozora') {
      await getAccountConflicts()(dispatch, getState);
      const onboardingAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
      });
      nav.dispatch(onboardingAction);
    } else {
      setOnboardingComplete()(dispatch, getState);
      const loginAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
      });
      nav.dispatch(loginAction);
    }
  } else {
    dispatch({
      type: types.LOGIN_USER_FAIL,
      payload: 'Wrong credentials',
    });
  }
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
