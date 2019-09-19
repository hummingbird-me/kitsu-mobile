import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import { NetInfo } from 'react-native';
import { auth } from 'kitsu/config/api';
import { kitsuConfig } from 'kitsu/config/env';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { getAccountConflicts, setOnboardingComplete } from 'kitsu/store/onboarding/actions';
import * as types from 'kitsu/store/types';
import { Sentry } from 'react-native-sentry';
import { isEmpty } from 'lodash';
import { fetchAlgoliaKeys, toggleActivityIndicatorHOC } from 'kitsu/store/app/actions';
import { Navigation } from 'react-native-navigation';
import { Screens, NavigationActions } from 'kitsu/navigation';

export const refreshTokens = () => async (dispatch, getState) => {
  const tokens = getState().auth.tokens;
  if (isEmpty(tokens)) return null;
  if (getState().auth.isRefreshingTokens) return tokens;

  dispatch({ type: types.TOKEN_REFRESH });

  try {
    const newTokens = await auth.createToken(tokens).refresh();
    dispatch({ type: types.TOKEN_REFRESH_SUCCESS, payload: newTokens.data });
    return newTokens.data;
  } catch (e) {
    dispatch({ type: types.TOKEN_REFRESH_FAIL });
    return Promise.reject(e);
  }
};

export const loginUser = (data, componentId, screen) => async (dispatch, getState) => {
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
       * If we get a 401 from the Kitsu server, Send the user to the signup page.
       * Otherwise set the tokens which means a user account is already associated with the fb account.
      */
      const userFb = await loginUserFb(dispatch);

      if (userFb.status !== 401) {
        tokens = await userFb.json();

        // Log sentry for empty tokens
        if (isEmpty(tokens)) {
          Sentry.captureMessage('Empty tokens received', {
            tags: {
              type: 'facebook',
            },
            extra: {
              userFb,
              status: userFb.status,
            },
          });
        }
      // We only navigate to the signup screen
      // IF `createAccount` wasn't the one that called this function
      } else if (screen !== 'signup') {
        Navigation.setStackRoot(componentId, {
          component: {
            name: Screens.AUTH_LOGIN,
            passProps: { authType: 'signup' },
          },
        });
      }
    } catch (e) {
      console.log(e);
      Sentry.captureMessage('Failed to log in facebook', {
        tags: {
          type: 'facebook',
        },
        extra: {
          exception: e,
        },
      });
      dispatch({
        type: types.LOGIN_USER_FAIL,
        payload: 'Failed to login with Facebook',
      });
    }
  }

  if (tokens) {
    dispatch({ type: types.LOGIN_USER_SUCCESS, payload: tokens });
    try {
      fetchAlgoliaKeys()(dispatch, getState);
      const user = await fetchCurrentUser()(dispatch, getState);

      /**
       * Now over here, aozora users will always have their status set to `aozora`, until they complete onboarding which will set their status to `registered`.
       * However for regular users we can't differentiate if they just signed up or not,since their status is always `registered` from the start.
       * Thus we check the screen name to see if it's a `signup`.
       * Note: `signup` is passed in from `createUser` function. It shouldn't be passed in from anywhere else
         otherwise users might always be sent to onboarding when logging in with fb.
      */
      if (user && user.status === 'aozora') {
        await getAccountConflicts()(dispatch, getState);
        NavigationActions.showOnboarding();
      } else if ((user && user.status !== 'registered') || screen === 'signup') {
        await getAccountConflicts()(dispatch, getState);
        NavigationActions.showOnboarding();
      } else {
        setOnboardingComplete()(dispatch, getState);
        NavigationActions.showMainApp();
      }
    } catch (e) {
      console.warn(e);
      const string = JSON.stringify(e);
      Sentry.captureMessage('Failed to fetch current user', {
        tags: {
          type: 'auth',
        },
        extra: {
          detail: string,
          error: getState().user.error,
        },
      });

      dispatch({
        type: types.LOGIN_USER_FAIL,
        payload: 'Failed to fetch user',
      });
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

  // Make sure we have a token
  if (!data || !data.accessToken) {
    throw new Error('Invalid Facebook Access Token');
  }

  try {
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
        version: 'v2.9',
        parameters: {
          fields: {
            string: 'email, name, gender',
          },
        },
      },
      (error, fbdata) => {
        if (error) {
          dispatch({ type: types.GET_FBUSER_FAIL, payload: error });
        } else {
          dispatch({ type: types.GET_FBUSER_SUCCESS, payload: fbdata });
        }
      },
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
    return result;
  } catch (e) {
    throw e;
  }
};

export const logoutUser = () => (dispatch) => {
  LoginManager.logOut();
  dispatch({ type: types.LOGOUT_USER });
  dispatch(toggleActivityIndicatorHOC(false));
};
