import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { PropTypes } from 'prop-types';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';
import { StyledText } from 'kitsu/components/StyledText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class UserLibraryListScreenComponent extends PureComponent {
  static navigationOptions = (props) => {
    const { libraryStatus, libraryType, profile } = props.navigation.state.params;
    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title={HEADER_TEXT_MAPPING[libraryStatus][libraryType]}
          onClickBack={() => props.navigation.goBack(null)}
        />
      ),
    };
  };

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    refreshing: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
    refreshing: false,
  };

  onEntryUpdate = async (type, status, updates) => {
    try {
      await this.props.updateUserLibraryEntry(type, status, updates);
    } catch (e) {
      console.warn(e);
    }
  }

  onEntryDelete = async (id, type, status) => {
    if (!id) return;
    try {
      await this.props.deleteUserLibraryEntry(id, type, status);
    } catch (e) {
      console.warn(e);
    }
  }

  onRefresh = () => {
    const { refreshing, libraryEntries } = this.props;
    if (!refreshing && libraryEntries && libraryEntries.refresh) {
      libraryEntries.refresh();
    }
  }

  onEndReached = () => {
    const { loading, libraryEntries } = this.props;
    if (!loading && libraryEntries && libraryEntries.fetchMore) {
      libraryEntries.fetchMore();
    }
  }

  navigateToSearch = () => {
    const { profile } = this.props.navigation.state.params;
    const { navigation } = this.props;

    if (profile && navigation) {
      navigation.navigate('LibrarySearch', { profile });
    }
  };

  renderSearchBar = () => (
    <TouchableOpacity style={styles.searchBox} onPress={this.navigateToSearch}>
      <Icon
        name="search"
        style={styles.searchIcon}
      />
      <StyledText color="dark" textStyle={styles.searchText}>Search Library</StyledText>
    </TouchableOpacity>
  );

  render() {
    const {
      currentUser,
      profile,
      navigation,
      libraryEntries,
      libraryStatus,
      libraryType,
      loading,
      refreshing,
    } = this.props;

    return (
      <View style={styles.container}>
        {this.renderSearchBar()}
        <UserLibraryList
          currentUser={currentUser}
          profile={profile}
          navigation={navigation}
          libraryEntries={(libraryEntries && libraryEntries.data) || []}
          libraryStatus={libraryStatus}
          libraryType={libraryType}
          loading={loading}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onLibraryEntryUpdate={this.onEntryUpdate}
          onLibraryEntryDelete={this.onEntryDelete}
        />
      </View>
    );
  }
}
