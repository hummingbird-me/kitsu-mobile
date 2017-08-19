import { connect } from 'react-redux';
import {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
  searchUserLibraryByType,
} from 'kitsu/store/profile/actions';
import { UserLibraryScreenComponent } from './component';

const mapStateToProps = ({ profile }) => {
  const { userLibrary } = profile;

  return {
    userLibrary,
  };
};

export const UserLibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
  searchUserLibraryByType,
})(UserLibraryScreenComponent);
