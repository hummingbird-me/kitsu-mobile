import { REHYDRATE } from 'redux-persist/constants';
import * as types from 'kitsu/store/types';

const userLibraryInitial = {
  anime: {
    completed: { data: [], loading: false },
    current: { data: [], loading: false },
    dropped: { data: [], loading: false },
    onHold: { data: [], loading: false },
    planned: { data: [], loading: false },
  },
  manga: {
    completed: { data: [], loading: false },
    current: { data: [], loading: false },
    dropped: { data: [], loading: false },
    onHold: { data: [], loading: false },
    planned: { data: [], loading: false },
  },
  loading: false,
};

const INITIAL_STATE = {
  profile: {},
  favoritesLoading: {},
  networkLoading: {},
  character: {},
  manga: {},
  anime: {},
  library: {},
  userLibrary: {
    ...userLibraryInitial,
    loading: false,
  },
  userLibrarySearch: {
    ...userLibraryInitial,
    loading: false,
  },
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
    case types.FETCH_USER_LIBRARY:
      return {
        ...state,
        userLibrary: {
          ...userLibraryInitial,
          loading: true,
        },
      };
    case types.FETCH_USER_LIBRARY_SUCCESS:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          loading: false,
        },
      };
    case types.FETCH_USER_LIBRARY_FAIL:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          loading: false,
        },
      };
    case types.SEARCH_USER_LIBRARY:
      return {
        ...state,
        userLibrarySearch: {
          ...userLibraryInitial,
          loading: true,
        },
      };
    case types.SEARCH_USER_LIBRARY_SUCESS:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          loading: false,
        },
      };
    case types.SEARCH_USER_LIBRARY_FAIL:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          loading: false,
        },
      };
    case types.SEARCH_USER_LIBRARY_TYPE:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          [action.library]: {
            ...state.userLibrarySearch[action.library],
            [action.status]: {
              ...state.userLibrarySearch[action.library][action.status],
              loading: true,
            },
          },
        },
      };
    case types.SEARCH_USER_LIBRARY_TYPE_SUCCESS:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          [action.library]: {
            ...state.userLibrarySearch[action.library],
            [action.status]: {
              data: state.userLibrarySearch[action.library][action.status].data.concat(action.data),
              meta: action.data.meta,
              loading: false,
            },
          },
        },
      };
    case types.SEARCH_USER_LIBRARY_TYPE_FAIL:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          [action.library]: {
            ...state.userLibrarySearch[action.library],
            [action.status]: {
              ...state.userLibrarySearch[action.library][action.status],
              loading: false,
            },
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.library]: {
            ...state.userLibrary[action.library],
            [action.status]: {
              ...state.userLibrary[action.library][action.status],
              loading: true,
            },
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE_SUCCESS:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.library]: {
            ...state.userLibrary[action.library],
            [action.status]: {
              data: state.userLibrary[action.library][action.status].data.concat(action.data),
              meta: action.data.meta,
              loading: false,
            },
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE_FAIL:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.library]: {
            ...state.userLibrary[action.library],
            [action.status]: {
              ...state.userLibrary[action.library][action.status],
              loading: false,
            },
          },
        },
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
