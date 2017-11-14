import * as types from 'kitsu/store/types';
import favoriteCategories from './favoriteCategories';

const initialState = {
  completed: false,
  conflicts: null,
  screenName: null, // continue where user left off
  selectedAccount: 'kitsu', // set kitsu for sign up
  favoriteCategories, // favorite categories data
  loading: false,
  error: '',
};

export const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ONBOARDING_COMPLETE: // used to invoke right after login
      return {
        ...state,
        favoriteCategories: [],
        completed: true,
      };
    case types.COMPLETE_ONBOARDING:
      return {
        ...state,
        loading: true,
      };
    case types.COMPLETE_ONBOARDING_SUCCESS:
      return {
        ...initialState,
        favoriteCategories: [],
        completed: true,
        loading: false,
      };
    case types.COMPLETE_ONBOARDING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
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
    case types.UPDATE_FAVORITES:
      return {
        ...state,
        favoriteCategories: action.payload,
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
