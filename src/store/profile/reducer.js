import { REHYDRATE } from 'redux-persist/constants';
import * as types from 'kitsu/store/types';

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
  anime: {
    completed: { data: [], loading: false },
    current: { data: [], loading: false },
    dropped: { data: [], loading: false },
    on_hold: { data: [], loading: false },
    planned: { data: [], loading: false },
  },
  manga: {
    completed: { data: [], loading: false },
    current: { data: [], loading: false },
    dropped: { data: [], loading: false },
    on_hold: { data: [], loading: false },
    planned: { data: [], loading: false },
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
  userLibrary: {
    ...userLibraryInitial,
    loading: false,
  },
  userLibrarySearch: {
    ...userLibraryInitial,
    loading: false,
    searchTerm: '',
  },
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
          ...userLibraryInitial,
          loading: true,
          userId: action.userId,
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
              data: action.data,
              fetchMore: action.fetchMore,
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
    case types.UPDATE_USER_LIBRARY_ENTRY:
      if (action.previousLibraryStatus !== action.newLibraryStatus) {
        return {
          ...state,
          userLibrary: {
            ...state.userLibrary,
            [action.libraryType]: {
              ...state.userLibrary[action.libraryType],

              // remove from previousLibraryEntry.status
              [action.previousLibraryStatus]: {
                ...state.userLibrary[action.libraryType][action.previousLibraryStatus],
                data: removeObjectFromArray(
                  state.userLibrary[action.libraryType][action.previousLibraryStatus].data,
                  action.newLibraryEntry,
                ),
              },

              // add to newLibraryEntry.status
              [action.newLibraryStatus]: {
                ...state.userLibrary[action.libraryType][action.newLibraryStatus],
                data: [
                  { ...action.previousLibraryEntry, ...action.newLibraryEntry },
                  ...state.userLibrary[action.libraryType][action.newLibraryStatus].data,
                ],
              },
            },
          },
        };
      }

      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.libraryType]: {
            ...state.userLibrary[action.libraryType],
            [action.libraryStatus]: {
              ...state.userLibrary[action.libraryType][action.libraryStatus],
              data: updateObjectInArray(
                state.userLibrary[action.libraryType][action.libraryStatus].data,
                action.newLibraryEntry,
              ),
            },
          },
        },
      };
    case types.SEARCH_USER_LIBRARY:
      return {
        ...state,
        userLibrarySearch: {
          ...userLibraryInitial,
          loading: true,
          searchTerm: action.searchTerm,
          userId: action.userId,
        },
      };
    case types.SEARCH_USER_LIBRARY_SUCCESS:
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
          searchTerm: action.searchTerm,
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
              data: action.data,
              fetchMore: action.fetchMore,
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
    case types.UPDATE_USER_LIBRARY_SEARCH_ENTRY:
      if (action.previousLibraryStatus !== action.newLibraryStatus) {
        return {
          ...state,
          userLibrarySearch: {
            ...state.userLibrarySearch,
            [action.libraryType]: {
              ...state.userLibrarySearch[action.libraryType],

              // remove from previousLibraryEntry.status
              [action.previousLibraryStatus]: {
                ...state.userLibrarySearch[action.libraryType][action.previousLibraryStatus],
                data: removeObjectFromArray(
                  state.userLibrarySearch[action.libraryType][action.previousLibraryStatus].data,
                  action.newLibraryEntry,
                ),
              },

              // add to newLibraryEntry.status (newLibraryStatus alias on_hold to on_hold for us)
              [action.newLibraryStatus]: {
                ...state.userLibrarySearch[action.libraryType][action.newLibraryStatus],
                data: [
                  { ...action.previousLibraryEntry, ...action.newLibraryEntry },
                  ...state.userLibrarySearch[action.libraryType][action.newLibraryStatus].data,
                ],
              },
            },
          },
        };
      }

      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          [action.libraryType]: {
            ...state.userLibrarySearch[action.libraryType],
            [action.libraryStatus]: {
              ...state.userLibrarySearch[action.libraryType][action.libraryStatus],
              data: updateObjectInArray(
                state.userLibrarySearch[action.libraryType][action.libraryStatus].data,
                action.newLibraryEntry,
              ),
            },
          },
        },
      };
    case types.DELETE_USER_LIBRARY_ENTRY:
      return {
        ...state,
        userLibrary: {
          ...state.userLibrary,
          [action.libraryType]: {
            ...state.userLibrary[action.libraryType],
            [action.libraryStatus]: {
              ...state.userLibrary[action.libraryType][action.libraryStatus],
              data: state.userLibrary[action.libraryType][action.libraryStatus].data
                .filter(entry => entry.id !== action.id),
            },
          },
        },
        userLibrarySearch: {
          ...state.userLibrarySearch,
          [action.libraryType]: {
            ...state.userLibrarySearch[action.libraryType],
            [action.libraryStatus]: {
              ...state.userLibrarySearch[action.libraryType][action.libraryStatus],
              data: state.userLibrarySearch[action.libraryType][action.libraryStatus].data
                .filter(entry => entry.id !== action.id),
            },
          },
        },
      };
    case types.UPDATE_USER_LIBRARY_SEARCH_TERM:
      return {
        ...state,
        userLibrarySearch: {
          ...state.userLibrarySearch,
          searchTerm: action.searchTerm,
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
