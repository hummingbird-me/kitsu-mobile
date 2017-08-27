import { connect } from 'react-redux';
import {
  fetchUserLibrary,
} from 'kitsu/store/profile/actions';
import { UserLibraryScreenComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { userLibrary } = profile;

  return {
    currentUser: user.currentUser,
    userLibrary,
  };
};

export const UserLibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
})(UserLibraryScreenComponent);
