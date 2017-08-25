import * as React from 'react';
import { Icon } from 'native-base';
import { FlatList, View } from 'react-native';
import { PropTypes } from 'prop-types';
import { debounce } from 'lodash';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { SearchBar } from 'kitsu/components/SearchBar';
import { UserLibraryListCard } from 'kitsu/screens/Profiles/UserLibrary';
import { styles } from './styles';

const MINIMUM_SEARCH_TERM_LENGTH = 3;
const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  onHold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class UserLibraryListScreenComponent extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired,
    fetchUserLibraryByType: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
  };

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
          onClickBack={props.navigation.goBack}
          showFollowButton={false}
          showCoverImage={false}
        />
      ),
      tabBarIcon: ({ tintColor }) => (
        <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
      ),
    };
  };

  state = {
    searchTerm: this.props.searchTerm,
  };

  onSearchTermChanged = (searchTerm) => {
    this.setState({ searchTerm });
    if (searchTerm.length >= MINIMUM_SEARCH_TERM_LENGTH) {
      this.debouncedSearch();
    } else if (searchTerm.length === 0) {
      this.debouncedFetch();
    }
  }

  debouncedFetch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibraryByType({
      userId: profile.id,
      library: this.props.libraryType,
      status: this.props.libraryStatus,
    });
  }, 100);

  debouncedSearch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    const { searchTerm } = this.state;
    this.props.fetchUserLibrary(profile.id, searchTerm);
  }, 100);

  fetchMore = () => {
    const { libraryEntries, libraryStatus, libraryType, navigation } = this.props;
    const { profile } = navigation.state.params;

    if (libraryEntries.data.length < libraryEntries.meta.count) {
      this.props.fetchUserLibraryByType({
        userId: profile.id,
        library: libraryType,
        status: libraryStatus,
      });
    }
  }

  renderSearchBar = () => ((
    <SearchBar
      containerStyle={styles.searchBar}
      onChangeText={this.onSearchTermChanged}
      placeholder="Search Library"
      searchIconOffset={120}
      value={this.state.searchTerm}
    />
  ))

  renderItem = ({ item }) => (
    <UserLibraryListCard
      data={item}
      libraryType={this.props.libraryType}
      currentUser={this.props.currentUser}
      profile={this.props.navigation.state.params.profile}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={this.renderSearchBar}
            data={this.props.libraryEntries.data}
            initialNumToRender={10}
            initialScrollIndex={0}
            keyExtractor={item => item.id}
            onEndReached={this.fetchMore}
            onEndReachedThreshold={0.75}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}
