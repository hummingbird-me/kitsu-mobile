import { connect } from 'react-redux';
import { fetchUserLibraryByType, updateUserLibraryEntry, deleteUserLibraryEntry } from 'kitsu/store/profile/actions';
import { UserLibraryListScreenComponent } from './component';

const mapStateToProps = ({ user, profile }, ownProps) => {
  const { userLibrary } = profile;
  const { libraryStatus, libraryType, profile: userProfile } = ownProps.navigation.state.params;

  const library = userLibrary && userLibrary[userProfile.id];
  const libraryEntries = library && library[libraryType] && library[libraryType][libraryStatus];

  return {
    currentUser: user.currentUser,
    libraryEntries,
    libraryStatus,
    libraryType,
    profile: userProfile,
    loading: (library && library.loading) || (libraryEntries && libraryEntries.loading),
    refreshing: libraryEntries && libraryEntries.refreshing,
  };
};

export const UserLibraryListScreen = connect(mapStateToProps, {
  fetchUserLibraryByType,
  updateUserLibraryEntry,
  deleteUserLibraryEntry,
})(UserLibraryListScreenComponent);
