import * as types from 'kitsu/store/types';
import favoriteCategories from './favoriteCategories';

const initialState = {
  completed: false,
  conflicts: null,
  screenName: null, // continue where user left off
  selectedAccount: '', // select acc screen
  hasRatedAnimes: false, // kitsu user library selection
  topMedia: [], // rate screen data
  favoriteCategories, // favorite categories data
  loading: false,
  error: '',
};

export const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.COMPLETE_ONBOARDING:
      return {
        ...initialState,
        completed: true,
      };
    case types.SET_SCREEN_NAME:
      return {
        ...state,
        screenName: action.payload,
      };
    case types.SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload,
      };
    case types.UPDATE_TOP_MEDIA:
      return {
        ...state,
        topMedia: action.payload,
      };
    case types.UPDATE_FAVORITES:
      return {
        ...state,
        favoriteCategories: action.payload,
      };
    case types.RATE_ANIMES:
      return {
        ...state,
        hasRatedAnimes: true,
      };
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
    case types.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};
