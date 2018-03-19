import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { intersectionWith, isEqual } from 'lodash';
import { PropTypes } from 'prop-types';
import { UserLibraryListCard, LibraryEmptyState } from 'kitsu/screens/Profiles/UserLibrary';

const LAYOUT_PROVIDER_TYPE = 'UserLibraryListCard';
const LAYOUT_WIDTH = Dimensions.get('window').width;
const LAYOUT_HEIGHT = 98;
const SEARCH_MAP = {
  anime: {
    current: { title: 'Top Airing Anime', type: 'topAiring' },
    planned: { title: 'Top Upcoming Anime', type: 'topUpcoming' },
    completed: { title: 'Most Popular Anime', type: 'popular' },
    on_hold: { title: 'Most Popular Anime', type: 'popular' },
    dropped: { title: 'Most Popular Anime', type: 'popular' },
  },
  manga: {
    current: { title: 'Top Publishing Manga', type: 'topAiring' },
    planned: { title: 'Highest Rated Manga', type: 'highest' },
    completed: { title: 'Most Popular Manga', type: 'popular' },
    on_hold: { title: 'Most Popular Manga', type: 'popular' },
    dropped: { title: 'Most Popular Manga', type: 'popular' },
  },
};

export class UserLibraryList extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.array.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    onLibraryEntryUpdate: PropTypes.func.isRequired,
    onLibraryEntryDelete: PropTypes.func.isRequired,
    onRefresh: PropTypes.func,
    onEndReached: PropTypes.func,
    loading: PropTypes.bool,
    refreshing: PropTypes.bool,
  };

  static defaultProps = {
    onRefresh: () => {},
    onEndReached: () => {},
    loading: false,
    refreshing: false,
  };

  state = {
    dataProvider: null,
    isSwiping: false,
  };

  componentWillMount() {
    const dataProvider = new DataProvider((rowA, rowB) => {
      // If the rows are the same
      // Then we check if the data within them is different
      if (rowA.id === rowB.id) {
        return !isEqual(rowA, rowB);
      }

      // Rows are different
      return true;
    }).cloneWithRows(this.props.libraryEntries.slice());
    this.setState({ dataProvider });

    // Only one type of row item
    this.layoutProvider = new LayoutProvider(() => LAYOUT_PROVIDER_TYPE, (type, dim, index) => {
      switch (type) {
        case LAYOUT_PROVIDER_TYPE: {
          dim.width = LAYOUT_WIDTH;
          dim.height = LAYOUT_HEIGHT;
          // We need to increase the height if the card is showing the `Moved` text.
          const data = this.state.dataProvider.getDataForIndex(index);
          if (data.status !== this.props.libraryStatus) {
            dim.height = LAYOUT_HEIGHT + 27;
          }
          break;
        }
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
    const oldEntries = this.props.libraryEntries;
    const newEntries = newProps.libraryEntries;
    const differentLength = (oldEntries && oldEntries.length) !== (newEntries && newEntries.length);

    // We need to check if there are any updated entries
    const intersection = intersectionWith(oldEntries, newEntries, isEqual);
    const hasUpdatedEntries = oldEntries.length !== intersection.length;

    // Only update if we really need to
    if (differentLength || hasUpdatedEntries) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(newEntries),
      });
    }
  }

  navigateToSearch = () => {
    const { libraryType, libraryStatus, navigation } = this.props;
    const { title, type } = SEARCH_MAP[libraryType][libraryStatus];
    navigation.navigate('SearchResults', {
      label: title,
      default: type,
      active: libraryType,
    });
  };

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  };

  renderFooter = () => {
    const { loading, refreshing } = this.props;
    if (!loading || refreshing) return <View />;
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
      profile={this.props.profile}
      updateUserLibraryEntry={this.props.onLibraryEntryUpdate}
      deleteUserLibraryEntry={this.props.onLibraryEntryDelete}
      onSwipingItem={this.onSwipingItem}
    />
  );

  render() {
    const { libraryType, libraryStatus, loading } = this.props;
    const { dataProvider, isSwiping } = this.state;
    if (dataProvider.getSize() === 0 && !loading) {
      return <LibraryEmptyState
        type={libraryType}
        status={libraryStatus}
        onPress={this.navigateToSearch}
      />;
    }
    return (
      <RecyclerListView
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
        renderAheadOffset={LAYOUT_HEIGHT * 4}
        layoutProvider={this.layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={this.renderRow}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={LAYOUT_HEIGHT * 2}
        renderFooter={this.renderFooter}
        scrollEnabled={!isSwiping}
      />
    );
  }
}
