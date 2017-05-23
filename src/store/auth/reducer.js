import {REHYDRATE} from 'redux-persist/constants';
import * as types from '../types';

const INITIAL_STATE = {
  signingIn: false,
  user: {},
  token: '',
  loginError: '',
  isAuthenticated: false,
  rehydratedAt: null,
};

export default (state = INITIAL_STATE, action) => {
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
        tokens: action.payload.data,
      };
    case types.LOGIN_USER_FAIL:
      return {
        ...state,
        signingIn: false,
        isAuthenticated: false,
        loginError: action.payload,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    case REHYDRATE:
      const incoming = action.payload.auth
      return {
        ...state,
        ...incoming,
        signingIn: false,
        rehydratedAt: new Date(),
      }
    default:
      return state;
  }
};
