import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../types';

const INITIAL_STATE = {
  currentUser: {},
  loading: false,
  error: '',
  signingUp: false,
  signupError: {},
  ifollow: {},
  playerId: '',
  playerCreated: false,
};

export default (state = INITIAL_STATE, action) => {
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
      return {
        ...state,
        ...action.payload.user,
        signingIn: false,
        signingUp: false,
        signupError: {},
        rehydratedAt: new Date(),
      };
    default:
      return state;
  }
};
