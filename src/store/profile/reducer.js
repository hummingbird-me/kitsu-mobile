import { REHYDRATE } from 'redux-persist';
import * as types from 'kitsu/store/types';
import { KitsuLibrarySort } from 'kitsu/utils/kitsuLibrary';

function updateObjectInArray(array, entry) {
  return array.map((currentItem) => {
    if (currentItem.id !== entry.id) {
      return currentItem;
    }

    return {
      ...currentItem,
      ...entry,
    };
  });
}

function removeObjectFromArray(array, entry) {
  return array.filter(currentItem => currentItem.id !== entry.id);
}

const userLibraryInitial = {
  meta: {},
  anime: {
    completed: { data: [], loading: false, refreshing: false },
    current: { data: [], loading: false, refreshing: false },
    dropped: { data: [], loading: false, refreshing: false },
    on_hold: { data: [], loading: false, refreshing: false },
    planned: { data: [], loading: false, refreshing: false },
  },
  manga: {
    completed: { data: [], loading: false, refreshing: false },
    current: { data: [], loading: false, refreshing: false },
    dropped: { data: [], loading: false, refreshing: false },
    on_hold: { data: [], loading: false, refreshing: false },
    planned: { data: [], loading: false, refreshing: false },
  },
};

const INITIAL_STATE = {
  profile: {},
  favoritesLoading: {},
  networkLoading: {},
  character: {},
  manga: {},
  anime: {},
  library: {},
  librarySort: {
    by: KitsuLibrarySort.DATE_UPDATED,
    ascending: false,
  },
  userLibrary: {},
  followed: {},
  follower: {},
  errorFav: {},
  loading: false,
  error: '',
  signingUp: false,
  signupError: {},
};

export const profileReducer = (state = INITIAL_STATE, action) => {
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
    case types.FETCH_USER_FEED:
      return {
        ...state,
        loadingLibrary: true,
        library: {},
        error: '',
      };
    case types.FETCH_USER_FEED_SUCCESS:
      return {
        ...state,
        loadingLibrary: false,
        library: { [action.payload.userId]: action.payload.entries },
        error: '',
      };
    case types.FETCH_USER_FEED_FAIL:
      return {
        ...state,
        loadingLibrary: false,
        error: action.payload,
      };
    case types.FETCH_USER_LIBRARY:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            loading: true,
          },
        },
      };
    case types.FETCH_USER_LIBRARY_SUCCESS:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            loading: false,
          },
        },
      };
    case types.FETCH_USER_LIBRARY_FAIL:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            loading: false,
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            [action.library]: {
              ...state.userLibrary[action.userId][action.library],
              [action.status]: {
                ...state.userLibrary[action.userId][action.library][action.status],
                loading: true,
                refreshing: action.refresh || false,
              },
            },
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE_SUCCESS:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            meta: {
              ...state.userLibrary[action.userId].meta,
              [action.library]: {
                ...state.userLibrary[action.userId].meta[action.library],
                ...action.meta,
              },
            },
            [action.library]: {
              ...state.userLibrary[action.userId][action.library],
              [action.status]: {
                data: action.data,
                fetchMore: action.fetchMore,
                refresh: action.refresh,
                meta: action.data.meta,
                loading: false,
                refreshing: false,
              },
            },
          },
        },
      };
    case types.FETCH_USER_LIBRARY_TYPE_FAIL:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            [action.library]: {
              ...state.userLibrary[action.userId][action.library],
              [action.status]: {
                ...state.userLibrary[action.userId][action.library][action.status],
                loading: false,
                refreshing: false,
              },
            },
          },
        },
      };
    case types.UPDATE_USER_LIBRARY_ENTRY:
      if (action.previousLibraryStatus !== action.newLibraryStatus) {
        return {
          ...state,
          userLibrary: {
            ...state.userLibrary,
            [action.userId]: {
              ...userLibraryInitial,
              ...state.userLibrary[action.userId],
              [action.libraryType]: {
                ...state.userLibrary[action.userId][action.libraryType],

                // remove from previousLibraryEntry.status
                [action.previousLibraryStatus]: {
                  ...state.userLibrary[action.userId][action.libraryType][action.previousLibraryStatus],
                  data: removeObjectFromArray(
                    state.userLibrary[action.userId][action.libraryType][action.previousLibraryStatus].data,
                    action.newLibraryEntry,
                  ),
                },

                // add to newLibraryEntry.status
                [action.newLibraryStatus]: {
                  ...state.userLibrary[action.userId][action.libraryType][action.newLibraryStatus],
                  data: [
                    { ...action.previousLibraryEntry, ...action.newLibraryEntry },
                    ...state.userLibrary[action.userId][action.libraryType][action.newLibraryStatus].data,
                  ],
                },
              },
            },
          },
        };
      }

      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            [action.libraryType]: {
              ...state.userLibrary[action.userId][action.libraryType],
              [action.libraryStatus]: {
                ...state.userLibrary[action.userId][action.libraryType][action.libraryStatus],
                data: updateObjectInArray(
                  state.userLibrary[action.userId][action.libraryType][action.libraryStatus].data,
                  action.newLibraryEntry,
                ),
              },
            },
          },
        },
      };
    case types.CREATE_USER_LIBRARY_ENTRY:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...state.userLibrary[action.userId],
            [action.libraryType]: {
              ...state.userLibrary[action.userId][action.libraryType],
              [action.libraryStatus]: {
                ...state.userLibrary[action.userId][action.libraryType][action.libraryStatus],
                data: [
                  action.newLibraryEntry,
                  ...state.userLibrary[action.userId][action.libraryType][action.libraryStatus].data,
                ],
              },
            },
          },
        },
      };

    case types.DELETE_USER_LIBRARY_ENTRY:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.userId]: {
            ...userLibraryInitial,
            ...(state.userLibrary[action.userId] || {}),
            [action.libraryType]: {
              ...state.userLibrary[action.userId][action.libraryType],
              [action.libraryStatus]: {
                ...state.userLibrary[action.userId][action.libraryType][action.libraryStatus],
                data: state.userLibrary[action.userId][action.libraryType][action.libraryStatus]
                  .data.filter(entry => entry.id !== action.id),
              },
            },
          },
        },
      };
    case types.UPDATE_LIBRARY_SORT:
      return {
        ...state,
        librarySort: {
          by: action.by,
          ascending: action.ascending,
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
    case REHYDRATE: {
      const payload = action && action.payload;
      const user = (payload && payload.user) || {};
      const sort = (payload && payload.profile && payload.profile.librarySort) || {};

      return {
        ...state,
        ...user,
        librarySort: {
          ...state.librarySort,
          ...sort,
        },
        signingIn: false,
        signingUp: false,
        signupError: {},
        rehydratedAt: new Date(),
      };
    }
    default:
      return state;
  }
};
