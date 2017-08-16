import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../types';

const INITIAL_STATE = {
  profile: {},
  favoritesLoading: {},
  networkLoading: {},
  character: {},
  manga: {},
  anime: {},
  library: {},
  followed: {},
  follower: {},
  errorFav: {},
  loading: false,
  error: '',
  signingUp: false,
  signupError: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_USER:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          [action.payload.id]: action.payload,
        },
        error: '',
      };
    case types.FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.FETCH_USER_LIB_ENTRIES:
      return {
        ...state,
        loadingLibrary: true,
        library: {},
        error: '',
      };
    case types.FETCH_USER_LIB_ENTRIES_SUCCESS:
      return {
        ...state,
        loadingLibrary: false,
        library: { [action.payload.userId]: action.payload.entries },
        error: '',
      };
    case types.FETCH_USER_LIB_ENTRIES_FAIL:
      return {
        ...state,
        loadingLibrary: false,
        error: action.payload,
      };
    case types.FETCH_USER_FAVORITES:
      return {
        ...state,
        favoritesLoading: {
          ...state.favoritesLoading,
          [action.payload.type]: true,
        },
        errorFav: {
          ...state.errorFav,
          [action.payload.type]: '',
        },
      };
    case types.FETCH_USER_FAVORITES_SUCCESS:
      return {
        ...state,
        favoritesLoading: {
          ...state.favoritesLoading,
          [action.payload.type]: false,
        },
        [action.payload.type]: {
          [action.payload.userId]: action.payload.favorites,
        },
        errorFav: {
          ...state.errorFav,
          [action.payload.type]: '',
        },
      };
    case types.FETCH_USER_NETWORK:
      return {
        ...state,
        networkLoading: {
          ...state.networkLoading,
          [action.payload.type]: true,
        },
        errorNetwork: {
          ...state.errorNetwork,
          [action.payload.type]: '',
        },
      };
    case types.FETCH_USER_NETWORK_SUCCESS:
      return {
        ...state,
        networkLoading: {
          ...state.networkLoading,
          [action.payload.type]: false,
        },
        [action.payload.type]: {
          [action.payload.userId]: action.payload.network,
        },
        errorNetwork: {
          ...state.errorNetwork,
          [action.payload.type]: '',
        },
      };
    case types.FETCH_USER_NETWORK_FAIL:
      return {
        ...state,
        networkLoading: {
          ...state.networkLoading,
          [action.payload.type]: false,
        },
        errorNetwork: {
          ...state.errorNetwork,
          [action.payload.type]: action.payload.error,
        },
      };
    case types.FETCH_USER_FAVORITES_FAIL:
      return {
        ...state,
        favoritesLoading: {
          ...state.favoritesLoading,
          [action.payload.type]: false,
        },
        errorFav: {
          ...state.errorFav,
          [action.payload.type]: action.payload.error,
        },
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
        profile: action.payload,
        signupError: {},
      };
    case types.CREATE_USER_FAIL:
      return {
        ...state,
        signingUp: false,
        signupError: action.payload,
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
