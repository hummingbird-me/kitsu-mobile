import * as types from 'kitsu/store/types';

const initialState = {
  algoliaKeys: {
    media: {},
    users: {},
  },
  pushNotificationEnabled: false,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ALGOLIA_KEY_SUCCESS:
      return {
        ...state,
        algoliaKeys: action.payload,
      };
    case types.ONESIGNAL_ID_RECEIVED:
      return {
        ...state,
        pushNotificationEnabled: true,
      };
    default:
      return state;
  }
};
