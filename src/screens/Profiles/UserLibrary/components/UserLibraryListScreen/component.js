import * as React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { PropTypes } from 'prop-types';
import debounce from 'lodash/debounce';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { UserLibraryListCard, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { idExtractor, isIdForCurrentUser } from 'kitsu/common/utils';
import { styles } from './styles';

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class UserLibraryListScreenComponent extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetchUserLibraryByType: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
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
        />
      ),
    };
  };

  state = {
    movedEntries: [],
    isSwiping: false,
  }

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  }

  debouncedFetch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibraryByType({
      userId: profile.id,
      library: this.props.libraryType,
      status: this.props.libraryStatus,
    });
  }, 100);

  // wrap the dispatch with a function that checks for "moved" entries (ie: current -> completed)
  // when a library entry is moved, add it the the moved entries array in state. once we
  // re-render, we'll splice these back into the rendered data array so that we can show the user
  // that they were moved to a new section, we keep the list of moved entries in local state because
  // they've been completely removed from their respective arrays in redux and we only want to show
  // that something has been moved until the user navigates away
  updateUserLibraryEntry = async (type, status, updates) => {
    const { libraryEntries, libraryStatus } = this.props;
    const { movedEntries } = this.state;

    let movedEntry;
    let movedFromIndex;
    const movedEntryIndex = movedEntries.findIndex(m => m.entry.id === updates.id);
    // the first thing we want to check for is if the entry has already been moved. if it has,
    // we want to remove it from the movedEntries array since properties are changing on it
    if (movedEntryIndex > -1) {
      movedEntry = movedEntries.splice(movedEntryIndex, 1)[0].entry;
      movedFromIndex = movedEntry.index;
    }

    // if the library entry has been updated to have a status that is not for the list we're looking
    // at, it needs to get added to the moved entry list.
    if (updates.status !== libraryStatus) {
      // if we're not dealing with an entry that's already moved once, go find the entry in
      // the current library entry list
      if (!movedEntry) {
        movedFromIndex = libraryEntries.data.findIndex(
          libraryEntry => libraryEntry.id === updates.id,
        );
        movedEntry = libraryEntries.data[movedFromIndex];
      }

      // finally push the moved entry onto the movedEntries array in state and override it with
      // the updates
      movedEntries.push({
        entry: {
          ...movedEntry,
          ...updates,
        },
        index: movedFromIndex,
      });
    }

    await this.props.updateUserLibraryEntry(type, status, updates);

    this.setState({ movedEntries });
  }

  renderSearchBar = () => {
    const { profile } = this.props.navigation.state.params;

    return (
      <UserLibrarySearchBox
        navigation={this.props.navigation}
        profile={profile}
        style={styles.searchBox}
      />
    );
  }

  renderFooter = () => {
    const { loading } = this.props;
    if (!loading) return (<View />);

    return (
      <ActivityIndicator color="white" style={{ paddingVertical: 16 }} />
    );
  }

  renderItem = ({ item }) => (
    <UserLibraryListCard
      currentUser={this.props.currentUser}
      libraryEntry={item}
      libraryStatus={this.props.libraryStatus}
      libraryType={this.props.libraryType}
      navigate={this.props.navigation.navigate}
      profile={this.props.navigation.state.params.profile}
      updateUserLibraryEntry={this.updateUserLibraryEntry}
      onSwipingItem={this.onSwipingItem}
    />
  );

  render() {
    const { libraryEntries, loading } = this.props;
    const renderData = libraryEntries.data.slice();
    this.state.movedEntries.forEach(({ entry, index }) => {
      renderData.splice(index, 0, entry);
    });

    return (
      <View style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={this.renderSearchBar}
            ListFooterComponent={this.renderFooter}
            data={renderData}
            initialNumToRender={10}
            initialScrollIndex={0}
            keyExtractor={idExtractor}
            onEndReached={() => {
              if (!loading) libraryEntries.fetchMore();
            }}
            onEndReachedThreshold={0.75}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
            scrollEnabled={!this.state.isSwiping}
          />
        </View>
      </View>
    );
  }
}
