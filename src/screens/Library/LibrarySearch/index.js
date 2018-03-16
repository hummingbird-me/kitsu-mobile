import { connect } from 'react-redux';
import { updateUserLibraryEntry, deleteUserLibraryEntry } from 'kitsu/store/profile/actions';
import { LibrarySearchComponent } from './component';

const mapStateToProps = ({ user }, ownProps) => {
  const { currentUser } = user;
  const profile = ownProps.navigation.state.params && ownProps.navigation.state.params.profile;

  return {
    currentUser,
    profile,
  };
};

export const LibrarySearch = connect(mapStateToProps, {
  updateUserLibraryEntry,
  deleteUserLibraryEntry,
})(LibrarySearchComponent);
