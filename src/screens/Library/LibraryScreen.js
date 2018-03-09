import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';
import { capitalize, isEmpty } from 'lodash';
import { TabBar } from 'kitsu/screens/Profiles/components/TabBar';
import { styles } from './styles';

const TAB_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class LibraryScreenComponent extends PureComponent {
  static navigationOptions = () => ({
    title: 'Library',
    header: null,
  });

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    library: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.object.func.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
  };

  state = {
    type: 'anime',
    status: 'current',
  }

  componentWillMount() {
    this.fetchLibrary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps;

    // If we set the current user then fetch the library
    if (!this.props.currentUser && currentUser) {
      this.fetchLibrary(nextProps);
    }
  }

  onEntryUpdate = async (type, status, updates) => {
    await this.props.updateUserLibraryEntry(type, status, updates);
  }

  onEntryDelete = async (id, type, status) => {
    if (!id) return;
    await this.props.deleteUserLibraryEntry(id, type, status);
  }

  onRefresh = () => {
    const { currentUser } = this.props;
    const currentLibrary = this.getCurrentLibrary();
    if (!currentUser || !currentLibrary) return;

    // Only refresh if we need to
    if (!currentLibrary.refreshing && currentLibrary.refresh) {
      currentLibrary.refresh();
    }
  }

  onEndReached = () => {
    const { currentUser } = this.props;
    const currentLibrary = this.getCurrentLibrary();
    if (!currentUser || !currentLibrary) return;

    if (!currentLibrary.loading && currentLibrary.fetchMore) {
      currentLibrary.fetchMore();
    }
  }

  getCurrentLibrary() {
    const { type, status } = this.state;
    const { library } = this.props;
    if (!library) return null;

    return library[type] && library[type][status];
  }

  fetchLibrary(props) {
    const { currentUser, fetchUserLibrary } = props;
    if (currentUser && fetchUserLibrary) {
      fetchUserLibrary({ userId: currentUser.id, refresh: true });
    }
  }

  renderTabNav = () => {
    const { type, status: currentStatus } = this.state;
    const statuses = ['current', 'planned', 'completed', 'on_hold', 'dropped'];

    // The meta data
    const currentLibrary = this.getCurrentLibrary();
    const meta = currentLibrary && currentLibrary.data && currentLibrary.data.meta;

    return (
      <TabBar style={styles.tabBar}>
        {statuses.map((status) => {
          const isCurrent = currentStatus === status;
          const statusText = (TAB_TEXT_MAPPING[status] && TAB_TEXT_MAPPING[status][type]) ||
                              capitalize(status);
          const countText = (meta && media.statusCounts && meta.statusCounts[status].toString()) || '';

          return (
            <TouchableOpacity
              style={[styles.tabItem, isCurrent && syles.tabItem__selected]}
              onPress={() => this.setState({ status })}
            >
              <Text style={[styles.statusText, isCurrent && syles.tabText__selected]}>
                {statusText}
              </Text>
              { !isEmpty(countText) &&
                <Text style={[styles.countText, isCurrent && syles.tabText__selected]}>
                  ({countText})
                </Text>
              }
            </TouchableOpacity>
          );
        })}
      </TabBar>
    );
  }


  render() {
    const {
      currentUser,
      navigation,
    } = this.props;
    const { type, status } = this.state;

    const currentLibrary = this.getCurrentLibrary();

    return (
      <View style={styles.container}>
        {this.renderTabNav()}
        { currentUser && currentLibrary &&
          <UserLibraryList
            currentUser={currentUser}
            profile={currentUser}
            navigation={navigation}
            libraryEntries={currentLibrary.data}
            libraryStatus={status}
            libraryType={type}
            loading={currentLibrary.loading}
            refreshing={currentLibrary.refreshing}
            onRefresh={this.onRefresh}
            onEndReached={this.onEndReached}
            onLibraryEntryUpdate={this.onEntryUpdate}
            onLibraryEntryDelete={this.onEntryDelete}
          />
        }
      </View>
    );
  }
}
