import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Dimensions, RefreshControl, ScrollView } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { intersectionWith, isEqual } from 'lodash';
import { UserLibraryListCard, LibraryEmptyState } from 'kitsu/screens/Profiles/UserLibrary';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

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

interface UserLibraryListProps {
  componentId: any;
  currentUser: object;
  profile: object;
  libraryEntries: unknown[];
  libraryStatus: string;
  libraryType: string;
  onLibraryEntryUpdate(...args: unknown[]): unknown;
  onLibraryEntryDelete(...args: unknown[]): unknown;
  onRefresh?(...args: unknown[]): unknown;
  onEndReached?(...args: unknown[]): unknown;
  loading?: boolean;
  refreshing?: boolean;
}

export class UserLibraryList extends PureComponent<UserLibraryListProps> {
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

  UNSAFE_componentWillMount() {
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

  UNSAFE_componentWillReceiveProps(newProps) {
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


  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  };

  navigateToSearch = () => {
    const { libraryType, libraryStatus, componentId } = this.props;
    const { title, type } = SEARCH_MAP[libraryType][libraryStatus];
    Navigation.push(componentId, {
      component: {
        name: Screens.SEARCH_RESULTS,
        passProps: {
          label: title,
          default: type,
          active: libraryType,
        },
      },
    });
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
      componentId={this.props.componentId}
      profile={this.props.profile}
      updateUserLibraryEntry={this.props.onLibraryEntryUpdate}
      deleteUserLibraryEntry={this.props.onLibraryEntryDelete}
      onSwipingItem={this.onSwipingItem}
    />
  );

  render() {
    const { libraryType, libraryStatus, loading } = this.props;
    const { dataProvider, isSwiping } = this.state;

    const refreshControl = (
      <RefreshControl
        colors={['white']}
        tintColor={'white'}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
      />
    );

    // Don't mount RecyclerListView when data is empty
    // Otherwise it will throw an error which might make the app crash
    if (dataProvider.getSize() === 0) {
      if (loading) {
        return (
          <View style={styles.indicatorContainer}>
            <ActivityIndicator color="white" size="large" />
          </View>
        );
      }

      return (
        <ScrollView style={styles.flex} refreshControl={refreshControl}>
          <LibraryEmptyState
            type={libraryType}
            status={libraryStatus}
            onPress={this.navigateToSearch}
          />
        </ScrollView>
      );
    }

    return (
      <RecyclerListView
        refreshControl={refreshControl}
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
