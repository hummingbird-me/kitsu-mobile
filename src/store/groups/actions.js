import * as types from 'app/store/types';
import { Kitsu } from 'app/config/api';

export const fetchGroupMemberships = () => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS });
  try {
    const groups = await Kitsu.findAll('groupMembers', {
      include: 'group',
      filter: { user: getState().user.currentUser.id },
    });
    dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS_SUCCESS, payload: groups });
  } catch (e) {
    dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS_FAIL, payload: 'Failed to load groups' });
  }
};
