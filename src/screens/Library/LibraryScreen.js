import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { PropTypes } from 'prop-types';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';
import { capitalize, isEmpty } from 'lodash';
import { TabBar } from 'kitsu/screens/Profiles/components/TabBar';
import { styles } from './styles';
import { LibraryScreenHeader } from './LibraryScreenHeader';

const TAB_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class LibraryScreenComponent extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    library: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
  };

  state = {
    type: 'anime',
    status: 'current',
    opacity: new Animated.Value(0),
    typeSelectVisible: false,
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

  showTypeSelect = () => {
    const { opacity } = this.state;
    this.setState({ typeSelectVisible: true });
    Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  }

  hideTypeSelect = () => {
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      this.setState({ typeSelectVisible: false });
    });
  }

  renderTabNav = () => {
    const { type, status: currentStatus } = this.state;
    const { library } = this.props;

    const statuses = ['current', 'planned', 'completed', 'on_hold', 'dropped'];

    // The meta data
    const meta = library && library.meta && library.meta[type];

    return (
      <TabBar style={styles.tabBar} containerStyle={styles.tabBarContainer}>
        {statuses.map((status) => {
          const isCurrent = currentStatus === status;
          const statusText = (TAB_TEXT_MAPPING[status] && TAB_TEXT_MAPPING[status][type]) ||
                              capitalize(status);

          const count = meta && meta.statusCounts && meta.statusCounts[status];
          const countText = (count && count.toString()) || '0';

          return (
            <TouchableOpacity
              style={[styles.tabItem, isCurrent && styles.tabItem__selected]}
              onPress={() => this.setState({ status })}
            >
              <Text style={[styles.statusText, isCurrent && styles.tabText__selected]}>
                {statusText}
              </Text>
              { !isEmpty(countText) &&
                <Text style={[styles.countText, isCurrent && styles.tabText__selected]}>
                  {` (${countText})`}
                </Text>
              }
            </TouchableOpacity>
          );
        })}
      </TabBar>
    );
  }

  renderTypeSelect() {
    const { type: currentType, opacity } = this.state;

    const touchableItem = (type, title) => (
      <TouchableOpacity
        onPress={() => {
          this.setState({ type });
          this.hideTypeSelect();
        }}
        style={styles.typeTextContainer}
      >
        <StyledText size="default" color="light" bold={currentType === type} textStyle={styles.typeText}>
          {title}
        </StyledText>
      </TouchableOpacity>
    );

    return (
      <View style={styles.typeContainer}>
        <TouchableWithoutFeedback onPress={this.hideTypeSelect}>
          <Animated.View style={[styles.opacityFill, { opacity }]}>
            <View style={styles.typeSelectContainer}>
              {touchableItem('anime', 'Anime')}
              {touchableItem('manga', 'Manga')}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const {
      currentUser,
      navigation,
    } = this.props;
    const { type, status, typeSelectVisible } = this.state;

    const currentLibrary = this.getCurrentLibrary();

    return (
      <View style={styles.container}>
        <LibraryScreenHeader
          title={type}
          onTitlePress={() => {
            const toggle = typeSelectVisible ? this.hideTypeSelect : this.showTypeSelect;
            toggle();
          }}
        />
        <View style={{ flex: 1 }}>
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
          {typeSelectVisible && this.renderTypeSelect()}
        </View>
      </View>
    );
  }
}
