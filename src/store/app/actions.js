import { kitsuConfig } from 'kitsu/config/env';
import { ALGOLIA_KEY_REQUEST, ALGOLIA_KEY_SUCCESS, ALGOLIA_KEY_FAIL } from 'kitsu/store/types';

export const fetchAlgoliaKeys = () => (dispatch) => {
  dispatch({ type: ALGOLIA_KEY_REQUEST, payload: {} });

  fetch(`${kitsuConfig.baseUrl}/edge/algolia-keys`)
    .then(r => r.json())
    .then((response) => {
      dispatch({ type: ALGOLIA_KEY_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: ALGOLIA_KEY_FAIL, payload: error }));
};
