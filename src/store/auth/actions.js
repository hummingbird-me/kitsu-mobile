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
      const user = await auth.owner.getToken(data.email, data.password);
      tokens = user.data;
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      /**
       * The flow here is:
       * If we get a 401 or 403 from the Kitsu server, Send the user to the signup page.
       * Otherwise set the tokens which means a user account is already associated with the fb account.
      */
      const userFb = await loginUserFb(dispatch);
      if (![401, 403].includes(userFb.status)) {
        tokens = await userFb.json();
      // We only navigate to the signup screen
      // IF `createAccount` wasn't the one that called this function
      } else if (screen !== 'signup') {
        nav.dispatch(NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: 'AuthScreen',
            params: { authType: 'signup' },
          })],
          key: null,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (tokens) {
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: tokens });
    const user = await fetchCurrentUser()(dispatch, getState);

    /**
     * Now over here, aozora users will always have their status set to `aozora`, until they complete onboarding which will set their status to `registered`.
     * However for regular users we can't differentiate if they just signed up or not,since their status is always `registered` from the start.
     * Thus we check the screen name to see if it's a `signup`.
     * Note: `signup` is passed in from `createUser` function. It shouldn't be passed in from anywhere else
       otherwise users might always be sent to onboarding when logging in with fb.
    */
    if (user.status === 'aozora') {
      await getAccountConflicts()(dispatch, getState);
      const onboardingAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      });
      nav.dispatch(onboardingAction);
    } else if (user.status !== 'registered' || screen === 'signup') {
      await getAccountConflicts()(dispatch, getState);
      const onboardingAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      });
      nav.dispatch(onboardingAction);
    } else {
      setOnboardingComplete()(dispatch, getState);
      const loginAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
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
  dispatch({ type: types.LOGOUT_USER });
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Intro' })],
    key: null,
  });
  nav.dispatch(resetAction);
};
