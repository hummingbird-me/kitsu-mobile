import { kitsuConfig } from 'kitsu/config/env';
import * as types from 'kitsu/store/types';

export const fetchAlgoliaKeys = () => (dispatch) => {
  dispatch({ type: types.ALGOLIA_KEY_REQUEST, payload: {} });

  fetch(`${kitsuConfig.baseUrl}/edge/algolia-keys`)
    .then(r => r.json())
    .then((response) => {
      dispatch({ type: types.ALGOLIA_KEY_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: types.ALGOLIA_KEY_FAIL, payload: error }));
};

export const setDataSaver = value => (dispatch) => {
  dispatch({ type: types.SETTING_DATA_SAVER, payload: !!value });
};

export const setInitialPage = value => (dispatch) => {
  dispatch({ type: types.SETTING_INITIAL_PAGE, payload: value });
};

export const showLightbox = (images, initialIndex = 0) => (dispatch) => {
  dispatch({
    type: types.LIGHTBOX_SHOW,
    payload: {
      images,
      initialIndex,
    },
  });
};

export const hideLightbox = () => (dispatch) => {
  dispatch({ type: types.LIGHTBOX_HIDE });
};
