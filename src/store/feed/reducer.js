import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  notifications: [],
  userFeed: [],
  mediaFeed: [],
  notificationsUnseen: 0,
  loadingNotifications: false,
  loadingUserFeed: false,
  loadingMediaFeed: false,
};

export const feedReducer = (state = INITIAL_STATE, action) => {
  let notifications = [];
  let feed = [];
  let filtered = [];
  switch (action.type) {
    case types.GET_NOTIFICATIONS:
      return {
        ...state,
        loadingNotifications: true,
      };
    case types.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_NOTIFICATIONS_MORE:
      filtered = state.notifications.filter(value => value.group !== action.payload[0].group);
      notifications = [...action.payload, ...filtered];
      return {
        ...state,
        notifications,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_NOTIFICATIONS_LESS:
      notifications = state.notifications.filter(value => value.id !== action.payload);
      return {
        ...state,
        notifications,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_NOTIFICATIONS_FAIL:
      return {
        ...state,
        notifications: [],
        loadingNotifications: false,
        error: action.payload,
      };
    case types.GET_USER_FEED:
      const empty = action.payload ? {} : { userFeed: [] };
      return {
        ...state,
        ...empty,
        loadingUserFeed: true,
      };
    case types.GET_USER_FEED_SUCCESS:
      return {
        ...state,
        userFeed: action.payload,
        loadingUserFeed: false,
        notificationsUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_USER_FEED_MORE:
      filtered = state.userFeed.filter(value => value.group !== action.payload[0].group);
      feed = [...action.payload, ...filtered];
      return {
        ...state,
        userFeed: feed,
        loadingUserFeed: false,
        userFeedUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_USER_FEED_LESS:
      feed = state.userFeed.filter(value => value.id !== action.payload);
      return {
        ...state,
        userFeed: feed,
        loadingUserFeed: false,
        userFeedUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_USER_FEED_FAIL:
      return {
        ...state,
        userFeed: [],
        loadingUserFeed: false,
        error: action.payload,
      };
    case types.GET_MEDIA_FEED:
      const emptyMedia = action.payload ? {} : { mediaFeed: [] };
      return {
        ...state,
        ...emptyMedia,
        loadingMediaFeed: true,
      };
    case types.GET_MEDIA_FEED_SUCCESS:
      return {
        ...state,
        mediaFeed: action.payload,
        loadingMediaFeed: false,
        notificationsUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_MEDIA_FEED_MORE:
      filtered = state.mediaFeed.filter(value => value.group !== action.payload[0].group);
      feed = [...action.payload, ...filtered];
      return {
        ...state,
        mediaFeed: feed,
        loadingMediaFeed: false,
        mediaFeedUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_MEDIA_FEED_LESS:
      feed = state.mediaFeed.filter(value => value.id !== action.payload);
      return {
        ...state,
        mediaFeed: feed,
        loadingMediaFeed: false,
        mediaFeedUnseen: action.meta.unseenCount,
        error: '',
      };
    case types.GET_MEDIA_FEED_FAIL:
      return {
        ...state,
        mediaFeed: [],
        loadingMediaFeed: false,
        error: action.payload,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
