import { connect } from 'react-redux';
import { fetchUserLibrary } from 'kitsu/store/profile/actions';
import { UserLibraryScreenComponent } from './component';

const mapStateToProps = ({ profile }) => {
  const { userLibrary } = profile;

  return {
    userLibrary,
  };
};

export const UserLibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
})(UserLibraryScreenComponent);
