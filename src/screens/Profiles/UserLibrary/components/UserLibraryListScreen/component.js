import * as React from 'react';
import { FlatList, View } from 'react-native';
import { PropTypes } from 'prop-types';
import { debounce } from 'lodash';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { UserLibraryListCard } from 'kitsu/screens/Profiles/UserLibrary';
import { idExtractor } from 'kitsu/common/utils';
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
    updateUserLibraryEntry: PropTypes.func.isRequired,
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
    this.props.fetchUserLibrary({
      searchTerm,
      userId: profile.id,
    });
  }, 100);

  renderSearchBar = () => ((
    <SearchBox
      style={styles.searchBar}
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
      libraryStatus={this.props.libraryStatus}
      currentUser={this.props.currentUser}
      profile={this.props.navigation.state.params.profile}
      updateUserLibraryEntry={this.props.updateUserLibraryEntry}
    />
  );

  render() {
    const { libraryEntries } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={this.renderSearchBar}
            data={libraryEntries.data}
            initialNumToRender={10}
            initialScrollIndex={0}
            keyExtractor={idExtractor}
            onEndReached={libraryEntries.fetchMore}
            onEndReachedThreshold={0.75}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}
