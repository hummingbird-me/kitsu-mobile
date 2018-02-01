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
  inAppNotification: {
    visible: false,
    data: null,
  },
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
        loadingMoreNotifications: action.loadingMoreNotifications,
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
        loadingNotifications: true,
        notificationsUnseen: action.meta.unseenCount,
        notificationsUnread: action.meta.unreadCount,
        inAppNotification: {
          visible: true,
          data: action.payload[0],
        },
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
      // Setting notificationsUnseen to meta - seen
      // since response of the `mark seen` is
      // not immediately changed because of using 3rd party
      // notification service at backend.
      currentNotifications = state.notifications.slice();
      seen = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (current of currentNotifications) {
        // eslint-disable-next-line no-restricted-syntax
        for (target of action.notifications) {
          if (current.id === target.id) {
            current.isSeen = true;
            seen += 1;
          }
        }
      }
      return {
        ...state,
        notificationsUnseen: action.meta.unseenCount - seen,
        notifications: currentNotifications,
      };
    case types.MARK_AS_SEEN_FAIL:
      return {
        ...state,
        // error: action.payload,
      };
    case types.MARK_AS_READ:
      return {
        ...state,
      };
    case types.MARK_AS_READ_SUCCESS:
      // Setting notificationsUnread to meta - read
      // since response of the `mark read` is
      // not immediately changed because of using 3rd party
      // notification service at backend.
      currentNotifications = state.notifications.slice();
      read = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (current of currentNotifications) {
        // eslint-disable-next-line no-restricted-syntax
        for (target of action.notifications) {
          if (current.id === target.id) {
            current.isRead = true;
            read += 1;
          }
        }
      }
      return {
        ...state,
        notificationsUnread: action.meta.unreadCount - read,
        notifications: currentNotifications,
      };
    case types.MARK_AS_READ_FAIL:
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
    case types.DISMISS_IN_APP_NOTIFICATION:
      return {
        ...state,
        inAppNotification: {
          visible: false,
          data: null,
        },
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
