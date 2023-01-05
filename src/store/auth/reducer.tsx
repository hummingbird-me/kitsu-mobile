import { AnyAction } from 'redux';
import { REHYDRATE } from 'redux-persist';

import * as types from 'kitsu/store/types';

export type AuthState = {
  signingIn: boolean;
  loadFBuser: boolean;
  user: never | Record<string, never>;
  fbuser: Record<string, never>;
  tokens:
    | Record<string, never>
    | {
        access_token: string;
        refresh_token: string;
        token_type: 'Bearer';
        created_at: number;
        expires_in: number;
      };
  loginError: string;
  fbError: string;
  isAuthenticated: boolean;
  rehydratedAt: string | null;
  isRefreshingTokens: boolean;
};

const INITIAL_STATE: AuthState = {
  signingIn: false,
  loadFBuser: false,
  user: {},
  fbuser: {},
  tokens: {},
  loginError: '',
  fbError: '',
  isAuthenticated: false,
  rehydratedAt: null,
  isRefreshingTokens: false,
};

export const authReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): AuthState => {
  switch (action.type) {
    case types.TOKEN_REFRESH:
      return {
        ...state,
        isRefreshingTokens: true,
      };
    case types.TOKEN_REFRESH_SUCCESS:
      return {
        ...state,
        isRefreshingTokens: false,
        tokens: action.payload,
      };
    case types.TOKEN_REFRESH_FAIL:
      return {
        ...state,
        isRefreshingTokens: false,
        isAuthenticated: false,
        tokens: {},
      };
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
        tokens: {},
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
    case REHYDRATE: {
      const auth = (action.payload && action.payload.auth) || {};
      return {
        ...state,
        ...auth,
        loginError: null,
        signingIn: false,
        fbError: '',
        isRefreshingTokens: false,
        rehydratedAt: new Date(),
      };
    }
    default:
      return state;
  }
};
