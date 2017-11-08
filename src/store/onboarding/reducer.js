import * as types from 'kitsu/store/types';

const initialState = {
  lastScreenName: 'WelcomeScreen',
  conflicts: null,
  selectedAccount: '', // select acc screen
  alreadyRatedAnime: false, // library selection
  topMedia: [], // rate screen data
  favoriteCategories: [], // favorite categories data
  loading: false,
  error: '',
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ACCOUNT_CONFLICTS:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.GET_ACCOUNT_CONFLICTS_SUCCESS:
      return {
        ...state,
        loading: false,
        conflicts: action.payload,
      };
    case types.GET_ACCOUNT_CONFLICTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.RESOLVE_ACCOUNT_CONFLICTS:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.RESOLVE_ACCOUNT_CONFLICTS_SUCCESS:
      return {
        ...state,
        loading: false,
        conflicts: null,
      };
    case types.RESOLVE_ACCOUNT_CONFLICTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
