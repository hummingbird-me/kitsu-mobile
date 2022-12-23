import { connect } from 'react-redux';

import {
  deleteUserLibraryEntry,
  updateUserLibraryEntry,
} from 'kitsu/store/profile/actions';

import { LibrarySearchComponent } from './component';

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return {
    currentUser,
  };
};

export const LibrarySearch = connect(mapStateToProps, {
  updateUserLibraryEntry,
  deleteUserLibraryEntry,
})(LibrarySearchComponent);
