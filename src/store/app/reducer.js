import * as types from 'kitsu/store/types';
import { REHYDRATE } from 'redux-persist';

const initialState = {
  algoliaKeys: {
    media: {},
    users: {},
  },
  dataSaver: false,
  pushNotificationEnabled: false,
  initialPage: 'Feed',
  activityIndicatorHOCVisible: false,
  bannerDismissed: false,
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
    case types.SETTING_DATA_SAVER:
      return {
        ...state,
        dataSaver: action.payload,
      };
    case types.SETTING_INITIAL_PAGE:
      return {
        ...state,
        initialPage: action.payload || 'Feed',
      };
    case types.ACTIVITY_INDICATOR_HOC:
      return {
        ...state,
        activityIndicatorHOCVisible: !!action.payload,
      };
    case types.DISMISS_BANNER:
      return {
        ...state,
        bannerDismissed: true
      };
    case REHYDRATE: {
      const payload = action && action.payload;
      const app = (payload && payload.app) || {};
      return {
        ...state,
        ...app,
        activityIndicatorHOCVisible: false,
        rehydratedAt: new Date(),
      };
    }
    default:
      return state;
  }
};
