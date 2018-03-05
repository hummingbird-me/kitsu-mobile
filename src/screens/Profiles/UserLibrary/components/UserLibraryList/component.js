import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { PropTypes } from 'prop-types';
import { UserLibraryListCard } from 'kitsu/screens/Profiles/UserLibrary';

const LAYOUT_PROVIDER_TYPE = 'UserLibraryListCard';
const LAYOUT_WIDTH = Dimensions.get('window').width;
const LAYOUT_HEIGHT = 98;

export class UserLibraryList extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.array.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    onLibraryEntryUpdate: PropTypes.func.isRequired,
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
  }

  state = {
    dataProvider: null,
    isSwiping: false,
  };

  componentWillMount() {
    const dataProvider = new DataProvider((rowA, rowB) => {
      return rowA.id !== rowB.id;
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
    const lengthA = this.props.libraryEntries.length;
    const lengthB = newProps.libraryEntries.length;
    if (lengthA !== lengthB) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(newProps.libraryEntries),
      });
    }
  }

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  }

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
      onSwipingItem={this.onSwipingItem}
    />
  )

  render() {
    const { dataProvider, isSwiping } = this.state;
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
