import * as types from 'kitsu/store/types';

const initialState = {
  algoliaKeys: {},
  pushNotificationEnabled: false,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALGOLIA_KEY_SUCCESS:
      return {
        ...state,
        algoliaKeys: action.payload,
      };
    default:
      return state;
  }
};
