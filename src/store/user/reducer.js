import {REHYDRATE} from 'redux-persist/constants';
import * as types from '../types';

const INITIAL_STATE = {
  profile: {},
  loading: false,
  error: ''
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
        profile: action.payload,
        error: '',
      };
    case types.FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
