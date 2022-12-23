import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  topAiringanime: [],
  topAiringmanga: [],
  topUpcominganime: [],
  topUpcomingmanga: [],
  highestanime: [],
  highestmanga: [],
  popularanime: [],
  popularmanga: [],
  resultsanime: [],
  resultsmanga: [],
  topAiringLoading: false,
  topUpcomingLoading: false,
  highestLoading: false,
  popularLoading: false,
  resultsLoading: false,
  categories: {},
  streamers: [],
  error: '',
};

export const animeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SEARCH:
      return {
        ...state,
        [`${action.field}Loading`]: true,
        [`${action.field}${action.selected}`]: [],
        resultsanime: [],
        resultsmanga: [],
        error: '',
      };
    case types.SEARCH_MORE:
      return {
        ...state,
        [`${action.field}Loading`]: true,
        error: '',
      };
    case types.SEARCH_SUCCESS:
      return {
        ...state,
        [`${action.field}Loading`]: false,
        [`${action.field}${action.selected}`]: action.payload,
        error: '',
      };
    case types.SEARCH_FAIL:
      return {
        ...state,
        searching: false,
        [`${action.field}Loading`]: false,
        error: action.payload,
      };
    case types.GET_CATEGORIES:
      return {
        ...state,
        categoriesLoading: true,
        error: action.payload,
      };
    case types.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        categoriesLoading: false,
      };
    case types.GET_STREAMERS:
      return {
        ...state,
        streamersLoading: true,
        error: action.payload,
      };
    case types.GET_STREAMERS_SUCCESS:
      return {
        ...state,
        streamers: action.payload,
        streamersLoading: false,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
