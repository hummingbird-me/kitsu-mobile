import * as types from 'kitsu/store/types';

export const captureUsersData = usersData => (dispatch) => {
  dispatch({ type: types.CAPTURE_USERS_DATA, payload: usersData });
};
