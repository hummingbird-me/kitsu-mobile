import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { PropTypes } from 'prop-types';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';
import { capitalize, isEmpty, camelCase } from 'lodash';
import { TabBar } from 'kitsu/screens/Profiles/components/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { styles } from './styles';
import { LibraryScreenHeader } from '../LibraryScreenHeader';
import { LibraryTabBar } from './tabbar';

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
    library: PropTypes.object,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    library: null,
  }

  state = {
    type: 'anime',
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

  onOptionPress = () => {
    const { navigation } = this.props;
    if (navigation) {
      navigation.navigate('LibrarySettings', {
        navigateBackOnSave: true,
      });
    }
  }

  onSearchPress = () => {
    const { navigation, currentUser } = this.props;
    if (navigation && currentUser) {
      navigation.navigate('LibrarySearch', {
        profile: currentUser,
      });
    }
  }

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

  onRefresh = (status) => {
    const { currentUser } = this.props;
    const currentLibrary = this.getLibrary(status);
    if (!currentUser || !currentLibrary) return;

    // Only refresh if we need to
    if (!currentLibrary.refreshing && currentLibrary.refresh) {
      currentLibrary.refresh();
    }
  }

  onEndReached = (status) => {
    const { currentUser } = this.props;
    const currentLibrary = this.getLibrary(status);
    if (!currentUser || !currentLibrary) return;

    if (!currentLibrary.loading && currentLibrary.fetchMore) {
      currentLibrary.fetchMore();
    }
  }

  getTabLabel(type, status) {
    const { library } = this.props;

    // The meta data
    const meta = library && library.meta && library.meta[type];

    const statusText = (TAB_TEXT_MAPPING[status] && TAB_TEXT_MAPPING[status][type]) ||
      capitalize(status);

    const count = meta && meta.statusCounts && meta.statusCounts[camelCase(status)];
    const countText = (count && count.toString()) || '0';

    return `${statusText} (${countText})`;
  }


  getLibrary(status) {
    const { type } = this.state;
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
    if (!this.state.typeSelectVisible) {
      this.setState({ typeSelectVisible: true });
      Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }).start();
    }
  }

  hideTypeSelect = () => {
    const { opacity } = this.state;
    if (this.state.typeSelectVisible) {
      Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
        this.setState({ typeSelectVisible: false });
      });
    }
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

  renderTabItem(name, page, active, goToPage) {
    return (
      <TouchableOpacity
        key={name}
        style={[styles.tabItem, active && styles.tabItem__selected]}
        onPress={() => goToPage(page)}
      >
        <Text style={[styles.statusText, active && styles.tabText__selected]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  renderLibraryLists(type) {
    const { currentUser, navigation } = this.props;
    const statuses = ['current', 'planned', 'completed', 'on_hold', 'dropped'];
    if (!currentUser) return null;

    return statuses.map((status) => {
      const currentLibrary = this.getLibrary(status);
      if (!currentLibrary) return null;
      return (
        <UserLibraryList
          key={`${type}-${status}`}
          tabLabel={this.getTabLabel(type, status)}
          currentUser={currentUser}
          profile={currentUser}
          navigation={navigation}
          libraryEntries={currentLibrary.data}
          libraryStatus={status}
          libraryType={type}
          loading={currentLibrary.loading}
          refreshing={currentLibrary.refreshing}
          onRefresh={() => this.onRefresh(status)}
          onEndReached={() => this.onEndReached(status)}
          onLibraryEntryUpdate={this.onEntryUpdate}
          onLibraryEntryDelete={this.onEntryDelete}
        />
      );
    });
  }

  renderTabBar = () => (
    <LibraryTabBar
      tabBarStyle={styles.tabBar}
      tabBarContainerStyle={styles.tabBarContainer}
      renderTab={this.renderTabItem}
    />
  );

  render() {
    const { type, typeSelectVisible } = this.state;

    return (
      <View style={styles.container}>
        <LibraryScreenHeader
          title={type}
          onTitlePress={() => {
            const toggle = typeSelectVisible ? this.hideTypeSelect : this.showTypeSelect;
            toggle();
          }}
          onOptionPress={this.onOptionPress}
          onSearchPress={this.onSearchPress}
        />
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            locked
            initialPage={0}
            renderTabBar={this.renderTabBar}
          >
            {this.renderLibraryLists(type)}
          </ScrollableTabView>
          {typeSelectVisible && this.renderTypeSelect()}
        </View>
      </View>
    );
  }
}
