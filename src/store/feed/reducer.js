import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  userFeed: [],
  mediaFeed: [],
  notifications: [],
  notificationsUnseen: 0,
  notificationsUnread: 0,
  markingRead: false,
  loadingNotifications: false,
  loadingMoreNotifications: false,
  loadingUserFeed: false,
  loadingMediaFeed: false,
};

export const feedReducer = (state = INITIAL_STATE, action) => {
  let notifications = [];
  let feed = [];
  let filtered = [];
  switch (action.type) {
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
        notificationsUnread: action.meta.unreadCount,
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
        notificationsUnread: action.meta.unreadCount,
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
    case types.FETCH_NOTIFICATIONS:
      return {
        ...state,
        loadingNotifications: true,
        loadingMoreNotifications: action.loadingMoreNotifications,
      };
    case types.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        notificationsUnread: action.meta.unreadCount,
        error: '',
      };
    case types.FETCH_NOTIFICATIONS_MORE:
      filtered = state.notifications.filter(value => value.group !== action.payload[0].group);
      notifications = [...action.payload, ...filtered];
      return {
        ...state,
        notifications,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        notificationsUnread: action.meta.unreadCount,
        error: '',
      };
    case types.FETCH_NOTIFICATIONS_LESS:
      notifications = state.notifications.filter(value => value.id !== action.payload);
      return {
        ...state,
        notifications,
        loadingNotifications: false,
        notificationsUnseen: action.meta.unseenCount,
        notificationsUnread: action.meta.unreadCount,
        error: '',
      };
    case types.FETCH_NOTIFICATIONS_FAIL:
      return {
        ...state,
        notifications: [],
        loadingNotifications: false,
        loadingMoreNotifications: false,
        error: action.payload,
      };
    case types.MARK_AS_SEEN:
      return {
        ...state,
      };
    case types.MARK_AS_SEEN_SUCCESS:
      // Setting notifications unseen to 0
      // since response of the `mark seen` is
      // not immediately changed and therefore
      // metadata is invalid.
      return {
        ...state,
        notificationsUnseen: 0,
        notifications: state.notifications.map(v => ({
          ...v,
          isSeen: true,
        })),
      };
    case types.MARK_AS_SEEN_FAIL:
      return {
        ...state,
        // error: action.payload,
      };
    case types.MARK_ALL_AS_READ:
      return {
        ...state,
        markingRead: true,
      };
    case types.MARK_ALL_AS_READ_SUCCESS:
      return {
        ...state,
        markingRead: false,
        notificationsUnread: 0,
        notifications: state.notifications.map(v => ({
          ...v,
          isRead: true,
        })),
      };
    case types.MARK_ALL_AS_READ_FAIL:
      return {
        ...state,
        markingRead: false,
        // error: action.payload,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
