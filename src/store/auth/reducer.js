import { REHYDRATE } from 'redux-persist/constants';
import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  signingIn: false,
  loadFBuser: false,
  user: {},
  fbuser: {},
  tokens: {},
  loginError: '',
  fbError: '',
  isAuthenticated: false,
  rehydratedAt: null,
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_USER:
      return {
        ...state,
        signingIn: true,
        loginError: '',
      };
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        signingIn: false,
        isAuthenticated: true,
        tokens: action.payload,
      };
    case types.LOGIN_USER_FAIL:
      return {
        ...state,
        signingIn: false,
        isAuthenticated: false,
        loginError: action.payload,
      };
    case types.GET_FBUSER:
      return {
        ...state,
        loadFBuser: true,
        fbError: '',
      };
    case types.GET_FBUSER_SUCCESS:
      return {
        ...state,
        loadFBuser: false,
        fbuser: action.payload,
        fbError: '',
      };
    case types.GET_FBUSER_FAIL:
      return {
        ...state,
        loadFBuser: false,
        fbError: action.payload,
        fbuser: {},
      };
    case types.CLEAR_FBUSER:
      return {
        ...state,
        loadFBuser: false,
        fbError: '',
        fbuser: {},
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.auth,
        loginError: null,
        signingIn: false,
        fbError: '',
        rehydratedAt: new Date(),
      };
    default:
      return state;
  }
};
