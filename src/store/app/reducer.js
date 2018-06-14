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
  imageLightbox: {
    visible: false,
    images: [],
    initialIndex: 0,
  },
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
    case types.LIGHTBOX_SHOW: {
      const images = action.payload.images || [];

      // Cap the index between 0 and images.length - 1
      const initialIndex = Math.min(images.length - 1, Math.max(action.payload.initialIndex, 0));

      return {
        ...state,
        imageLightbox: {
          visible: true,
          images,
          initialIndex,
        },
      };
    }
    case types.LIGHTBOX_HIDE:
      return {
        ...state,
        imageLightbox: {
          visible: false,
          images: [],
          initialIndex: 0,
        },
      };
    case REHYDRATE: {
      const payload = action && action.payload;
      const app = (payload && payload.app) || {};
      return {
        ...state,
        ...app,
        imageLightbox: {
          visible: false,
          images: [],
          initialIndex: 0,
        },
        rehydratedAt: new Date(),
      };
    }
    default:
      return state;
  }
};
