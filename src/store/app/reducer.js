import * as types from 'kitsu/store/types';
import { REHYDRATE } from 'redux-persist';

const initialState = {
  algoliaKeys: {
    media: {},
    users: {},
  },
  dataSaver: false,
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
    case types.SETTING_DATA_SAVER: {
      return {
        ...state,
        dataSaver: action.payload,
      };
    }
    case REHYDRATE: {
      const payload = action && action.payload;
      const app = (payload && payload.app) || {};
      return {
        ...state,
        ...app,
        rehydratedAt: new Date(),
      };
    }
    default:
      return state;
  }
};
