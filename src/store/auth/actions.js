import * as types from '../types';

export const loginUser = () => (dispatch) => {
  dispatch({ type: types.LOGIN_USER });
};
