import { kitsuConfig } from 'app/config/env';
import * as types from 'app/store/types';
import { isEmpty } from 'lodash';

export const fetchAlgoliaKeys = () => async (dispatch, getState) => {
  dispatch({ type: types.ALGOLIA_KEY_REQUEST, payload: {} });

  // Set the auth headers if we can
  const authHeader = {};
  const tokens = getState().auth.tokens;
  if (!isEmpty(tokens) && !isEmpty(tokens.access_token)) {
    authHeader.Authorization = `Bearer ${tokens.access_token}`;
  }

  try {
    const response = await fetch(`${kitsuConfig.baseUrl}/edge/algolia-keys`, {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });
    const json = await response.json();
    dispatch({ type: types.ALGOLIA_KEY_SUCCESS, payload: json });
  } catch (error) {
    dispatch({ type: types.ALGOLIA_KEY_FAIL, payload: error });
  }
};

export const setDataSaver = value => (dispatch) => {
  dispatch({ type: types.SETTING_DATA_SAVER, payload: !!value });
};

export const setInitialPage = value => (dispatch) => {
  dispatch({ type: types.SETTING_INITIAL_PAGE, payload: value });
};

export const toggleActivityIndicatorHOC = visible => (dispatch) => {
  dispatch({ type: types.ACTIVITY_INDICATOR_HOC, payload: visible });
};

export const dismissBanner = () => (dispatch) => {
  dispatch({ type: types.DISMISS_BANNER });
}
