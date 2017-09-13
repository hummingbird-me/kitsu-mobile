import { connect } from 'react-redux';
import { updateUserLibrarySearchEntry } from 'kitsu/store/profile/actions';
import { UserLibrarySearchScreenComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { userLibrarySearch } = profile;

  return {
    currentUser: user.currentUser,
    userLibrarySearch,
  };
};

export const UserLibrarySearchScreen = connect(mapStateToProps, {
  updateUserLibrarySearchEntry,
})(UserLibrarySearchScreenComponent);
