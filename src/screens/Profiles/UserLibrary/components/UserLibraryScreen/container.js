import { connect } from 'react-redux';
import {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
} from 'kitsu/store/profile/actions';
import { UserLibraryScreenComponent } from './component';

const mapStateToProps = ({ profile }) => {
  const { userLibrary, userLibrarySearch } = profile;

  return {
    userLibrary,
    userLibrarySearch,
  };
};

export const UserLibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
})(UserLibraryScreenComponent);
