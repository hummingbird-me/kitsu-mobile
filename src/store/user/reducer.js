import { REHYDRATE } from 'redux-persist';
import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  currentUser: {},
  loading: false,
  error: '',
  generalSettingError: '',
  signingUp: false,
  signupError: {},
  ifollow: {},
  playerId: '',
  playerCreated: false,
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_CURRENT_USER:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.FETCH_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        error: '',
      };
    case types.FETCH_CURRENT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.FETCH_NETWORK_FOLLOW:
      return {
        ...state,
        ifollow: { ...state.ifollow, [action.payload]: true },
      };
    case types.CREATE_USER:
      return {
        ...state,
        signingUp: true,
        signupError: {},
      };
    case types.CREATE_USER_SUCCESS:
      return {
        ...state,
        signingUp: false,
        currentUser: action.payload,
        signupError: {},
      };
    case types.CREATE_USER_FAIL:
      return {
        ...state,
        signingUp: false,
        signupError: action.payload,
      };
    case types.CONNECT_FBUSER:
      return {
        ...state,
        loading: true,
      };
    case types.CONNECT_FBUSER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: {
          ...state.currentUser,
          facebookId: action.payload,
        },
      };
    case types.CONNECT_FBUSER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.DISCONNECT_FBUSER:
      return {
        ...state,
        loading: true,
      };
    case types.DISCONNECT_FBUSER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: {
          ...state.currentUser,
          facebookId: null,
        },
      };
    case types.DISCONNECT_FBUSER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.UPDATE_GENERAL_SETTINGS:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_GENERAL_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        generalSettingError: '',
        currentUser: {
          ...state.currentUser,
          ...action.payload,
        },
      };
    case types.UPDATE_GENERAL_SETTINGS_FAIL:
      return {
        ...state,
        loading: false,
        generalSettingError: action.payload, // TODO: handle the error ~ Toast?
      };
    case types.UPDATE_LIBRARY_SETTINGS:
      return {
        ...state,
        loading: true,
      };
    case types.UPDATE_LIBRARY_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: {
          ...state.currentUser,
          ratingSystem: action.payload.ratingSystem,
          titleLanguagePreference:
            action.payload.titleLanguagePreference || state.currentUser.titleLanguagePreference,
        },
      };
    case types.UPDATE_LIBRARY_SETTINGS_FAIL:
      return {
        ...state,
        loading: false,
        error: '', // TODO: handle the error ~ Toast?
      };
    case types.ONESIGNAL_ID_RECEIVED:
      return {
        ...state,
        playerId: action.payload,
      };
    case types.CREATE_PLAYER_SUCCESS:
      return {
        ...state,
        playerCreated: true,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    case REHYDRATE:
      const user = (action.payload && action.payload.user) || {};
      return {
        ...state,
        ...user,
        signingIn: false,
        signingUp: false,
        signupError: {},
        error: '',
        generalSettingError: '',
        rehydratedAt: new Date(),
      };
    default:
      return state;
  }
};
