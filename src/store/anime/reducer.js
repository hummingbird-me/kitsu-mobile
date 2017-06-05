import * as types from '../types';

const INITIAL_STATE = {
  topAiring: [],
  topUpcoming: [],
  highest: [],
  popular: [],
  results: [],
  topAiringLoading: false,
  topUpcomingLoading: false,
  highestLoading: false,
  popularLoading: false,
  resultsLoading: false,
  error: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SEARCH:
      return {
        ...state,
        [`${action.field}Loading`]: true,
        [action.field]: [],
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
        [action.field]: action.payload,
        error: '',
      };
    case types.SEARCH_FAIL:
      return {
        ...state,
        searching: false,
        [`${action.field}Loading`]: false,
        error: action.payload,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
