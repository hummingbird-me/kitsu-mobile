import * as types from '../types';

const INITIAL_STATE = {
  signingIn: false,
  user: {},
  token: '',
  loginError: '',
  isAuthenticated: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_USER:
      return {
        ...state,
        signingIn: true,
        loginError: '',
      };
    default:
      return state;
  }
};
