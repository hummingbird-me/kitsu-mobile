import { kitsuConfig } from 'kitsu/config/env';
import { Kitsu } from 'kitsu/config/api';
import { ALGOLIA_KEY_REQUEST, ALGOLIA_KEY_SUCCESS, ALGOLIA_KEY_FAIL } from 'kitsu/store/types';

export const fetchAlgoliaKeys = () => async (dispatch) => {
  dispatch({ type: ALGOLIA_KEY_REQUEST, payload: {} });

  const response = await Kitsu.findAll('algolia-keys');
  console.log('response', response);
  dispatch({ type: ALGOLIA_KEY_SUCCESS, payload: response });
};
