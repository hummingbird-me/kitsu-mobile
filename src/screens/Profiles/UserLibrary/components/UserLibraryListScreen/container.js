import { connect } from 'react-redux';
import { fetchUserLibraryByType, updateUserLibraryEntry } from 'kitsu/store/profile/actions';
import { UserLibraryListScreenComponent } from './component';

const mapStateToProps = ({ user, profile }, ownProps) => {
  const { userLibrary } = profile;
  const { libraryStatus, libraryType } = ownProps.navigation.state.params;
  const libraryEntries = userLibrary[libraryType][libraryStatus];

  return {
    currentUser: user.currentUser,
    libraryEntries,
    libraryStatus,
    libraryType,
    loading: userLibrary.loading || libraryEntries.loading,
  };
};

export const UserLibraryListScreen = connect(mapStateToProps, {
  fetchUserLibraryByType,
  updateUserLibraryEntry,
})(UserLibraryListScreenComponent);
