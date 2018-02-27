import React, { Component } from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { PropTypes } from 'prop-types';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { UserLibraryListCard, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { styles } from './styles';

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};
const LAYOUT_PROVIDER_TYPE = 'UserLibraryListCard';
const LAYOUT_WIDTH = Dimensions.get('window').width;
const LAYOUT_HEIGHT = 98;

export class UserLibraryListScreenComponent extends Component {
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

  state = {
    dataProvider: null,
    isSwiping: false,
  };

  movedEntries = [];

  componentWillMount() {
    const dataProvider = new DataProvider((rowA, rowB) => {
      return rowA.id !== rowB.id
    }).cloneWithRows(this.props.libraryEntries.data.slice());
    this.setState({ dataProvider });

    // Only one type of row item
    this.layoutProvider = new LayoutProvider(() => LAYOUT_PROVIDER_TYPE, (type, dim, index) => {
      switch (type) {
        case LAYOUT_PROVIDER_TYPE:
          dim.width = LAYOUT_WIDTH;
          dim.height = LAYOUT_HEIGHT;
          // We need to increase the height if the card is showing the `Moved` text.
          const data = this.state.dataProvider.getDataForIndex(index);
          if (data.status !== this.props.libraryStatus) {
            dim.height = LAYOUT_HEIGHT + 27;
          }
          break;
        default:
          dim.width = 0;
          dim.height = 0;
          break;
      }
    });
  }

  componentWillReceiveProps(newProps) {
    // Length is different, this will happen from a pagination event,
    // a removal of an entry, or a status update.
    const lengthA = this.props.libraryEntries.data.length;
    const lengthB = newProps.libraryEntries.data.length;
    if (lengthA !== lengthB) {
      const data = newProps.libraryEntries.data.slice();
      this.movedEntries.forEach(({ entry, index }) => {
        data.splice(index, 0, entry);
      });
      this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(data) });
    }
  }

  // wrap the dispatch with a function that checks for "moved" entries (ie: current -> completed)
  // when a library entry is moved, add it the the moved entries array in state. once we
  // re-render, we'll splice these back into the rendered data array so that we can show the user
  // that they were moved to a new section, we keep the list of moved entries in local state because
  // they've been completely removed from their respective arrays in redux and we only want to show
  // that something has been moved until the user navigates away
  updateUserLibraryEntry = async (type, status, updates) => {
    const { libraryStatus } = this.props;
    const { dataProvider } = this.state;
    let movedEntry;
    let movedFromIndex;
    const movedEntryIndex = this.movedEntries.findIndex(m => m.entry.id === updates.id);

    // the first thing we want to check for is if the entry has already been moved. if it has,
    // we want to remove it from the movedEntries array since properties are changing on it
    if (movedEntryIndex > -1) {
      movedEntry = this.movedEntries.splice(movedEntryIndex, 1)[0].entry;
      movedFromIndex = movedEntry.index;
    }

    // if the library entry has been updated to have a status that is not for the list we're looking
    // at, it needs to get added to the moved entry list.
    if (updates.status !== libraryStatus) {
      // if we're not dealing with an entry that's already moved once, go find the entry in
      // the current library entry list
      if (!movedEntry) {
        movedFromIndex = dataProvider.getAllData().findIndex(
          libraryEntry => libraryEntry.id === updates.id,
        );
        movedEntry = dataProvider.getDataForIndex(movedFromIndex);
      }

      // finally push the moved entry onto the movedEntries array in state and override it with
      // the updates
      this.movedEntries.push({
        entry: {
          ...movedEntry,
          ...updates,
        },
        index: movedFromIndex,
      });
    }

    await this.props.updateUserLibraryEntry(type, status, updates);
  }

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  }

  onEndReached = () => {
    const { loading, libraryEntries } = this.props;
    if (!loading && libraryEntries.fetchMore) {
      libraryEntries.fetchMore();
    }
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
    if (!loading) return <View />;
    return (
      <ActivityIndicator color="white" style={{ paddingVertical: 16 }} />
    );
  }

  renderRow = (_type, data) => (
    <UserLibraryListCard
      currentUser={this.props.currentUser}
      libraryEntry={data}
      libraryStatus={this.props.libraryStatus}
      libraryType={this.props.libraryType}
      navigate={this.props.navigation.navigate}
      profile={this.props.navigation.state.params.profile}
      updateUserLibraryEntry={this.updateUserLibraryEntry}
      onSwipingItem={this.onSwipingItem}
    />
  )

  render() {
    const { dataProvider, isSwiping } = this.state;
    return (
      <View style={styles.container}>
        {this.renderSearchBar()}
        <RecyclerListView
          renderAheadOffset={LAYOUT_HEIGHT * 4}
          layoutProvider={this.layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={this.renderRow}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={LAYOUT_HEIGHT * 2}
          renderFooter={this.renderFooter}
          scrollEnabled={!isSwiping}
        />
      </View>
    );
  }
}
