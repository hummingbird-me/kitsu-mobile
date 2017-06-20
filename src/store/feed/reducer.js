import * as types from '../types';

const INITIAL_STATE = {
  notifications: [],
  notificationsUnseen: 0,
  loadingNotifications: false,
};

export default (state = INITIAL_STATE, action) => {
  let notifications = [];
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
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
